from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from captain.routes import blocks, devices, flowchart, key, pymgr, update, ws
from captain.utils.config import origins

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
