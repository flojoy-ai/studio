from fastapi import FastAPI
from captain.routes import flowchart, key, ws
from fastapi.middleware.cors import CORSMiddleware
from captain.utils.config import origins
from captain.utils.logger import logger, logger_setup
from flojoy_nodes.utils import create_map

# create nodes mapping
create_map()

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


@app.on_event("startup")
async def startup_event():
    logger_setup(logger)
