from __future__ import annotations

from rest_framework import serializers

from todos.models import Todo


class TodoSerializer(serializers.ModelSerializer):
    """Serializer for Todo model."""

    class Meta:
        model = Todo
        fields = [
            "id",
            "title",
            "completed",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
