from django.contrib import admin
from django.urls import path

from .views import (
    wfc
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('wfc', wfc),
]
