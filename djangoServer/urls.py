from django.contrib import admin
from django.urls import path

from .views import (
    wfc, worker_response
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('wfc', wfc),
    path('worker_response', worker_response)
]
