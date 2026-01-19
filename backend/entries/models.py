from django.db import models
from django.contrib.auth.models import User

class Entry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='entries')
    date = models.DateField()
    question = models.TextField()
    response = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['user', 'date']
        ordering = ['-date']

    def __str__(self):
        return f"{self.user.username} - {self.date}"
