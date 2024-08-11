# pylint: disable=missing-module-docstring, missing-function-docstring, missing-class-docstring
import asyncio
import concurrent.futures
from datetime import datetime
from pathlib import Path

import chardet
import pandas as pd
from fastapi import APIRouter, Depends, HTTPException
from langchain_community.agent_toolkits import create_sql_agent
from langchain_community.utilities import SQLDatabase
from langchain_core.messages import HumanMessage, AIMessage
from langchain_openai import ChatOpenAI
from sqlalchemy import select, create_engine

from .database import (
    Chat,
    ChatForm,
    ChatResponse,
    Database,
    MessageForm,
    MessageResponse,
    User, Message,
)
from .user import manager

router = APIRouter(prefix="/chat")


class ChatContext:
    @classmethod
    def init(cls):
        cls.engine = create_engine("sqlite:///titanic.db")
        cls.file_table_mapping = [
            (Path(__file__).parent / 'chat' / 'location_hourly_counts.csv', 'population_interval'),
            (Path(__file__).parent / 'chat' / 'decibel_data.csv', 'decibel'),
            (Path(__file__).parent / 'chat' / 'foodDB.csv', 'foodDB')
        ]

        for file_path, table_name in cls.file_table_mapping:
            with open(file_path, 'rb') as f:
                result = chardet.detect(f.read())
            file_encoding = result['encoding']
            df = pd.read_csv(file_path, encoding=file_encoding)
            print(f"Loading {file_path} into table {table_name} with shape {df.shape}")
            df.to_sql(table_name, cls.engine, index=False, if_exists='replace')

        cls.db = SQLDatabase(engine=cls.engine)
        cls.llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
        cls.agent_executor = create_sql_agent(cls.llm, db=cls.db, agent_type="openai-tools", verbose=True)


@router.get("/")
async def list_chat(user: User = Depends(manager)) -> list[ChatResponse]:
    async with Database.async_session() as session:
        stmt = select(Chat).where(Chat.user_id == user.user_id)
        res = (await session.execute(stmt)).scalars().all()
        return [chat.to_response() for chat in res]


@router.get("/{chat_id}")
async def list_messages(
        chat_id: int, user: User = Depends(manager)
) -> list[MessageResponse]:
    async with Database.async_session() as session:
        stmt = select(Chat).where(Chat.chat_id == chat_id)
        chat = (await session.execute(stmt)).scalar()
        if not chat or chat.user_id != user.user_id:
            raise HTTPException(status_code=404, detail="Chat not found")

        stmt = select(Message).where(Message.chat_id == chat_id)
        res = (await session.execute(stmt)).scalars().all()
        return [msg.to_response() for msg in res]


@router.post("/")
async def create_chat(
        chat_name: ChatForm, user: User = Depends(manager)
) -> ChatResponse:
    async with Database.async_session() as session:
        chat = chat_name.to_chat()
        chat.user_id = user.user_id
        session.add(chat)
        await session.commit()
        return chat.to_response()


@router.post("/{chat_id}")
async def create_message(
        chat_id: int, message: MessageForm, user: User = Depends(manager)
) -> MessageResponse:
    async with Database.async_session() as session:
        stmt = select(Chat).where(Chat.chat_id == chat_id)
        chat = (await session.execute(stmt)).scalar()
        if not chat or chat.user_id != user.user_id:
            raise HTTPException(status_code=404, detail="Chat not found")

        session.add(message.to_message(chat_id, 1))
        await session.commit()

        stmt = select(Message).where(Message.chat_id == chat_id)
        res = (await session.execute(stmt)).scalars().all()
        messages = [message.to_conversation() for message in res]

    ## AI response
    conversation_history = messages

    def construct_prompt(user_query):
        prompt = (
            f"You are an expert data analyst specializing in small business location recommendations. "
            f"Your goal is to help users find the most suitable area for starting their business based on various factors "
            f"There are 2 factors you can use: mood and business budget.\n\n"
            f"Here is the data available:\n"
            f"- Population by time intervals in different regions\n"
            f"- Noise levels (decibels) in different regions\n"
            f"- foodDB which include various food markets in 포항\n"
            f"- based on foodDB you can prevent problems with overlapping restaurants or provide information to avoid working during the restaurant's working hours. Alternatively, the size of the restaurant can be predicted through the number of seats and prevent similar businesses from opening near restaurants that are too large. And these details need to be explained well.\n"
            f"Based on the user's preferences and the data provided, your task is to analyze and recommend the top regions for starting a new business.\n\n"
            f"### User's Input:\n{user_query}\n\n"
            f"### Analysis and Recommendation:\n"
            f"- Analyze the provided data, considering the user's preferences.\n"
            f"- Recommend 3-5 regions that best fit the user's business type and preferences.\n"
            f"- After informing the places, ask users about other useful data that you can consider(e.g. You only asked about noise mood. What about the competition style or timeslot you want to work?\n"
            f"- It is important to ask then again at last\n"
            f"- Provide a brief explanation for each recommended region, detailing why it is a good fit."
        )
        return prompt

    def answer_user_query(query):
        # Construct the prompt with prompt engineering
        prompt = construct_prompt(query)

        # Add the user's query (after prompt engineering) to the conversation history
        conversation_history.append(HumanMessage(content=prompt))

        # Pass the entire conversation history to the agent
        response = ChatContext.agent_executor.invoke({"input": prompt, "history": conversation_history})['output']

        # Ensure the response is a string
        response_text = str(response) if not isinstance(response, str) else response

        # Add the AI's response to the conversation history
        conversation_history.append(AIMessage(content=response_text))

        return response_text

    loop = asyncio.get_running_loop()
    with concurrent.futures.ThreadPoolExecutor() as pool:
        response = await loop.run_in_executor(pool, lambda: answer_user_query(message.message))

    message = MessageForm(message=response, message_time=datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    message = message.to_message(chat_id, 0)

    async with Database.async_session() as session:
        session.add(message)
        await session.commit()
        return message.to_response()
