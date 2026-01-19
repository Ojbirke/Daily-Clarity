from django.urls import path, include

urlpatterns = [
    path('auth/', include('users.urls')),
    path('sync/', include('entries.urls')),
    path('stats/', include('entries.stats_urls')),
]
