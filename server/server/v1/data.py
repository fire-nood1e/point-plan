import asyncio
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


if __name__ == '__main__':
    async def process_data(type: str, month: int):
        filename = f"pohang_geohash_{type}_20240{month}.csv"
        path_ = Path(__file__).parent.parent / "data" / filename

        data = {}

        async with async_open(path_) as f:
            cnt = 0
            is_first = True
            async for line in f:
                if is_first:
                    is_first = False
                    continue
                line: str
                arr = line.replace('"', "").strip().split(",")
                date = arr[0]
                value = float(arr[2])
                lat = float(arr[3])
                lon = float(arr[4])

                if date not in data:
                    data[date] = []
                data[date].append((lat, lon, value))

                cnt += 1
                if cnt % 1000 == 0:
                    print(f"{type}-{month}: {cnt} is done")

        for date, arr in data.items():
            filename = f"{type}-{date}.csv"
            path_ = Path(__file__).parent / "data" / filename
            async with async_open(path_, "w") as f:
                for lat, lon, value in arr:
                    await f.write(f"{lat},{lon},{value}\n")


    async def main():
        type = ["decibel", "lightlux", "pm10", "pm25", "population"]
        month = [6, 7]

        for t in type:
            for m in month:
                await process_data(t, m)
                print(f"{t}-{m} is done")


    asyncio.run(main())
