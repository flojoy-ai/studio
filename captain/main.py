import sentry_sdk
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from captain.internal.manager import WatchManager
from captain.routes import blocks, devices, flowchart, key, log, pymgr, update, ws
from captain.utils.config import origins
from captain.utils.logger import logger

sentry_sdk.init(
    dsn="https://67b273eca552a3b13dc5f4d151c17148@o4504914175131648.ingest.sentry.io/4506397015015424",
    # Set traces_sample_rate to 1.0 to capture 100%
    # of transactions for performance monitoring.
    traces_sample_rate=1.0,
    # Set profiles_sample_rate to 1.0 to profile 100%
    # of sampled transactions.
    # We recommend adjusting this value in production.
    profiles_sample_rate=1.0,
)
app = FastAPI()

# cors middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# routes
app.include_router(ws.router)
app.include_router(flowchart.router)
app.include_router(log.router)
app.include_router(key.router)
app.include_router(update.router)
app.include_router(blocks.router)
app.include_router(devices.router)
app.include_router(pymgr.router)


@app.on_event("startup")
async def startup_event():
    logger.info("Running startup event")
    watch_manager = WatchManager.get_instance()
    watch_manager.start_thread()
