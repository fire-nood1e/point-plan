# pylint: disable=invalid-name, broad-exception-raised, broad-exception-caught, missing-function-docstring
# pylint: disable=missing-module-docstring, missing-class-docstring, too-few-public-methods

import asyncio
from datetime import datetime

from langchain_core.messages import HumanMessage, AIMessage
from sqlalchemy.ext.asyncio import (
    AsyncAttrs,
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from pydantic import BaseModel

from ..env import get_env


class Base(AsyncAttrs, DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"
    user_id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(unique=True, index=True)
    password: Mapped[str]
    nickname: Mapped[str | None]
    profile_img: Mapped[str | None]

    def to_response(self) -> "UserResponse":
        return UserResponse(
            user_id=self.user_id,
            username=self.username,
            nickname=self.nickname,
            profile_img=self.profile_img,
        )


class UserForm(BaseModel):
    username: str
    password: str

    def to_user(self) -> User:
        return User(
            username=self.username,
            password=self.password,
        )


class UserEditForm(BaseModel):
    nickname: str | None
    profile_img: str | None


class UserResponse(BaseModel):
    user_id: int
    username: str
    nickname: str | None
    profile_img: str | None


class Chat(Base):
    __tablename__ = "chats"
    chat_id: Mapped[int] = mapped_column(primary_key=True)
    chat_name: Mapped[str]
    user_id: Mapped[int]

    def to_response(self) -> "ChatResponse":
        return ChatResponse(
            chat_id=self.chat_id,
            chat_name=self.chat_name,
        )


class ChatForm(BaseModel):
    chat_name: str

    def to_chat(self) -> Chat:
        return Chat(
            chat_name=self.chat_name,
        )


class ChatResponse(BaseModel):
    chat_id: int
    chat_name: str


class Message(Base):
    __tablename__ = "messages"
    message_id: Mapped[int] = mapped_column(primary_key=True)
    chat_id: Mapped[int]
    message: Mapped[str]
    message_time: Mapped[str]
    # 1 for user, 0 for bot
    message_from: Mapped[int]

    def to_response(self) -> "MessageResponse":
        return MessageResponse(
            message_id=self.message_id,
            chat_id=self.chat_id,
            message=self.message,
            message_time=self.message_time,
            message_from=self.message_from,
        )

    def to_conversation(self) -> HumanMessage | AIMessage:
        if self.message_from == 1:
            return HumanMessage(content=self.message)
        return AIMessage(content=self.message)


class MessageForm(BaseModel):
    message: str

    def to_message(self, chat_id: int, message_from: int) -> Message:
        return Message(
            chat_id=chat_id,
            message=self.message,
            message_time=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            message_from=message_from,
        )


class MessageResponse(BaseModel):
    message_id: int
    chat_id: int
    message: str
    message_time: str
    message_from: int


class Database:
    """
    Database class
    """

    engine: AsyncEngine | None
    async_session: async_sessionmaker[AsyncSession]

    @classmethod
    async def init(cls) -> None:
        """
        This initializes the database

        This should be called before using the database
        """
        if hasattr(cls, "engine") and cls.engine is not None:
            return

        username = get_env("SQL_USER")
        password = get_env("SQL_PASSWORD")
        url = get_env("SQL_HOST")
        db = get_env("SQL_DB")

        for _ in range(int(get_env("SQL_RETRY"))):
            try:
                print("Connecting to database...")
                engine = create_async_engine(
                    f"postgresql+asyncpg://{username}:{password}@{url}/{db}", echo=True
                )
                async with engine.begin() as conn:
                    await conn.run_sync(Base.metadata.create_all)
                break
            except KeyboardInterrupt as err:
                raise KeyboardInterrupt from err
            except Exception:
                print("Failed to connect to database, retrying...")
                await asyncio.sleep(5)
        else:
            raise Exception("Unable to connect to database")
        cls.engine = engine
        cls.async_session = async_sessionmaker(cls.engine, expire_on_commit=False)

    @classmethod
    async def close(cls) -> None:
        """
        This closes the connection to the database
        """
        if hasattr(cls, "engine") and cls.engine is not None:
            await cls.engine.dispose()
