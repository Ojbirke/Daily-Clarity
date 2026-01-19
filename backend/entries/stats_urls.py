from django.urls import path
from . import stats_views

urlpatterns = [
    path('summary', stats_views.get_summary, name='stats_summary'),
]
