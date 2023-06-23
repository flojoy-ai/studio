from fastapi import FastAPI
from captain.routes import flowchart, key, ws
from captain.utils.config import REDIS_HOST, REDIS_PORT
from fastapi.middleware.cors import CORSMiddleware
from captain.utils.config import origins
from PYTHON.utils.dynamic_module_import import create_map

# init node mapping 
create_map()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ws.router)
app.include_router(flowchart.router)
app.include_router(key.router)

