import asyncio
from pathlib import Path

from aiofile import async_open
from fastapi import APIRouter

router = APIRouter(prefix="/auth")


@router.get("/data")
async def get_data(type: str, time: str):
    filename = f"{type}-{time}.csv"
    path_ = Path(__file__).parent / "data" / filename

    async with async_open(path_) as f:
        return await f.read()


if __name__ == '__main__':
    async def process_data(type: str, month: int):
        filename = f"pohang_geohash_{type}_20240{month}.csv"
        path_ = Path(__file__).parent.parent / "data" / filename

        async with async_open(path_) as f:
            is_first = True
            async for line in f:
                if is_first:
                    is_first = False
                    continue
                line: str
                arr = line.replace('"', "").strip().split(",")
                date = arr[0]
                value = arr[2]
                lat = arr[3]
                lon = arr[4]

                async with async_open(f"data/{type}-{date}.csv", "a") as files:
                    await files.write(f"{lat},{lon},{value}\n")


    async def main():
        type = ["decibel", "lightlux", "pm10", "pm25", "population"]
        month = [6, 7]

        for t in type:
            for m in month:
                await process_data(t, m)
                print(f"{t}-{m} is done")


    asyncio.run(main())
