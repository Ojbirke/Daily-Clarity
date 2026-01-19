from django.urls import path
from . import views

urlpatterns = [
    path('entries', views.sync_entries, name='sync_entries'),
]
