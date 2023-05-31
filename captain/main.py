from fastapi import FastAPI
from captain.routes import flowchart, key, ws

app = FastAPI()

app.include_router(ws.router)
app.include_router(flowchart.router)
app.include_router(key.router)
