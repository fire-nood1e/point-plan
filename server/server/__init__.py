# pylint: disable=missing-module-docstring, missing-function-docstring, missing-class-docstring, too-few-public-methods

import logging
from contextlib import asynccontextmanager

import dotenv
from fastapi import FastAPI

from . import v1
from .v1 import Database


@asynccontextmanager
async def lifespan(_: FastAPI):
    await Database.init()
    yield
    await Database.close()


app = FastAPI(lifespan=lifespan)
app.include_router(v1.router, prefix="/api/v1")
app.include_router(v1.router, prefix="/api")
dotenv.load_dotenv()


class EndpointFilter(logging.Filter):
    def filter(self, record: logging.LogRecord) -> bool:
        return record.getMessage().find("/healthy") == -1


# Filter out /endpoint
logging.getLogger("uvicorn.access").addFilter(EndpointFilter())


@app.get("/healthy")
async def healthy() -> dict:
    return {"status": "ok"}