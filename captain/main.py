import asyncio
import sys, os
from fastapi import FastAPI, Request
from captain.routes import flowchart, key, ws
from captain.utils.config import REDIS_HOST, REDIS_PORT
from fastapi.middleware.cors import CORSMiddleware
from captain.utils.config import origins
from PYTHON.utils.dynamic_module_import import create_map

# sys.path.append(os.path.join(os.path.dirname(sys.path[0]), "PYTHON"))
# print("DIR NAME IS : " + os.path.join(sys.path[0], "PYTHON"))
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

# @app.middleware("http")
# async def print_body(request: Request, call_next):
#     if "worker_response" in request.url.path:
#         print(await request.json())
        
#     response = await call_next(request)
#     return response


app.include_router(ws.router)
app.include_router(flowchart.router)
app.include_router(key.router)

