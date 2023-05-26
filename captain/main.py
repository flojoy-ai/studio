from fastapi import FastAPI
from captain.routes import flow, key, ws

app = FastAPI()

app.include_router(ws.router)
app.include_router(flow.router)
app.include_router(key.router)
