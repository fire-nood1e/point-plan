# pylint: disable=missing-module-docstring, missing-function-docstring, missing-class-docstring

from fastapi import APIRouter

from . import chat, data
from . import user

router = APIRouter()
router.include_router(user.router)
router.include_router(chat.router)
router.include_router(data.router)
