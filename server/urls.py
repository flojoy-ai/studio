from django.contrib import admin
from django.urls import path

from .views import (
    run_flow_chart,
    worker_response,
    cancel_flow_chart,
    set_cloud_api_key,
    set_openai_api_key,
    set_s3_key,
)


urlpatterns = [
    path("admin/", admin.site.urls),
    path("wfc", run_flow_chart),
    path("worker_response", worker_response),
    path("cancel_fc", cancel_flow_chart),
    path("api/set-cloud-api", set_cloud_api_key),
    path("api/set-openai-api", set_openai_api_key),
    path("api/set-s3-key", set_s3_key),
]
