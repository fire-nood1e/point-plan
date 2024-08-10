# pylint: disable=missing-module-docstring, missing-function-docstring, missing-class-docstring

from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy import select

from server.server.v1.database import (
    Chat,
    ChatForm,
    ChatResponse,
    Database,
    MessageForm,
    MessageResponse,
    User,
)

from ..env import get_env
from .user import manager

router = APIRouter(prefix="/chat")


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

        stmt = select(Chat).where(Chat.chat_id == chat_id)
        res = (await session.execute(stmt)).scalars().all()
        return [chat.to_response() for chat in res]


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

        session.add(message.to_message(chat_id))
        await session.commit()

    ## AI response
    response = "I am a bot"

    message = MessageForm(message=response, message_time="2021-01-01 00:00:00")
    message = message.to_message(chat_id)

    async with Database.async_session() as session:
        session.add(message)
        await session.commit()
        return message.to_response()
