from __future__ import annotations

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from todos.models import Todo
from todos.serializers import TodoSerializer


class TodoViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Todo CRUD operations.

    Endpoints:
    - GET    /api/todos/          - List todos for current user
    - POST   /api/todos/          - Create a new todo
    - GET    /api/todos/<id>/     - Retrieve a specific todo
    - PUT    /api/todos/<id>/     - Update a todo
    - PATCH  /api/todos/<id>/     - Partial update a todo
    - DELETE /api/todos/<id>/     - Delete a todo
    - POST   /api/todos/<id>/toggle/ - Toggle completion status
    """

    serializer_class = TodoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Filter todos to only show those belonging to the authenticated user."""
        return Todo.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Associate the new todo with the current user."""
        serializer.save(user=self.request.user)

    @action(detail=True, methods=["post"])
    def toggle(self, request: Request, pk=None) -> Response:
        """Toggle the completion status of a todo."""
        todo = self.get_object()
        todo.completed = not todo.completed
        todo.save()
        serializer = self.get_serializer(todo)
        return Response(serializer.data, status=status.HTTP_200_OK)
