# pylint: disable=missing-module-docstring, missing-function-docstring, missing-class-docstring

from fastapi import APIRouter

from . import user
from .database import Database

router = APIRouter()
router.include_router(user.router)
