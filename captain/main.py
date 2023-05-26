from fastapi import FastAPI, Response, APIRouter
from flojoy.utils import set_frontier_api_key
import yaml
from .routers import websocket

app = FastAPI()
app.include_router(websocket.router)

STATUS_CODES = yaml.load(
    open("STATUS_CODES.yml", "r", encoding="utf-8"), Loader=yaml.Loader
)

# django routes for references
# urlpatterns = [
#     path("admin/", admin.site.urls),
#     path("wfc", run_flow_chart),
#     path("worker_response", worker_response),
#     path("cancel_fc", cancel_flow_chart),
#     path("api/set-api", set_user_api_key),
# ]

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/wfc")
async def run_flow_chart():
    return {"message": "wfc"}

@app.get("/worker_response")
async def worker_response():
    return {"message": "worker reponse"}

@app.get("/cancel_fc")
async def cancel_flow_chart(request):
    return {"message": "cancel fc"}

@app.get("/api/set-api")
async def set_user_api_key(request):
    key = request.data
    api_key = key["key"]
    set_frontier_api_key(api_key)

    response = {
        "success": True,
        "data": api_key,
    }
    return Response(response, status=200)



