from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from captain.routes import blocks, devices, flowchart, key, pymgr, update, ws
from captain.utils.config import origins
from captain.utils.logger import logger, logger_setup
import threading
from captain.services.consumer.log_consumer import LogConsumer
import asyncio

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
app.include_router(key.router)
app.include_router(update.router)
app.include_router(blocks.router)
app.include_router(devices.router)
app.include_router(pymgr.router)


@app.on_event("startup")
async def startup_event():
    logger_setup(logger)
    log_consumer = LogConsumer()

    def run_log_consumer():
        asyncio.run(log_consumer.run())

    thread = threading.Thread(target=run_log_consumer)
    thread.daemon = True
    thread.start()
