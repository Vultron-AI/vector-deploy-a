from __future__ import annotations

from django.conf import settings
from django.db import models

from shared.models import BaseModel


class Todo(BaseModel):
    """
    Todo model for storing user tasks.
    Inherits UUID primary key and timestamps from BaseModel.
    """

    title = models.CharField(max_length=255)
    completed = models.BooleanField(default=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="todos",
    )

    class Meta:
        db_table = "todos"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.title
