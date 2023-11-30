import logging

from fastapi import APIRouter, Response

from captain.types.log import LogLevel

router = APIRouter(tags=["log_level"])


@router.get("/log_level")
async def get_log_level() -> LogLevel:
    return LogLevel(level=logging.getLevelName(logging.getLogger().level))


@router.post("/log_level")
async def set_log_level(log_level: LogLevel):
    logging.getLogger().setLevel(log_level.level)
    logging.getLogger("uvicorn").setLevel(log_level.level)
    return Response(status_code=200)
