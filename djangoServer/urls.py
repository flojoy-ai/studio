from django.contrib import admin
from django.urls import path

from .views import run_flow_chart, worker_response, cancel_flow_chart, set_user_api_key

urlpatterns = [
    path("admin/", admin.site.urls),
    path("wfc", run_flow_chart),
    path("worker_response", worker_response),
    path("cancel_fc", cancel_flow_chart),
    path("api/set-api", set_user_api_key),
]
