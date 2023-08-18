import os
from fastapi import FastAPI
from captain.routes import flowchart, key, ws, update
from fastapi.middleware.cors import CORSMiddleware
from captain.utils.config import origins
from PYTHON.utils.dynamic_module_import import create_map
from captain.utils.logger import logger, logger_setup
from flojoy import set_debug_on, set_debug_off

# init node mapping
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
app.include_router(update.router)


@app.on_event("startup")
async def startup_event():
    logger_setup(logger)
    if os.environ.get("DEBUG", "false").lower() == "true":
        set_debug_on()
    else:
        set_debug_off()
