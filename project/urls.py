from django.contrib import admin
from django.urls import path

from .views import (
    ping,
    heartbeat,
    io,
    wfc,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('ping', ping),
    path('heartbeat', heartbeat),
    path('io', io),
    path('wfc', wfc),
]
