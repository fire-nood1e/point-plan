from pathlib import Path

from aiofile import async_open
from fastapi import APIRouter

router = APIRouter(prefix="/data")


@router.get("/")
async def get_data(type: str, time: str):
    filename = f"{type}-{time}.csv"
    path_ = Path(__file__).parent / "data" / filename

    async with async_open(path_) as f:
        return await f.read()

