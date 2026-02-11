"""Tests for Todos API endpoints."""
from __future__ import annotations

import pytest
from rest_framework import status
from rest_framework.test import APIClient

from accounts.models import User
from accounts.tests.helpers import create_user
from todos.models import Todo


@pytest.fixture
def user() -> User:
    """Create a test user."""
    return create_user(email="test@example.com")


@pytest.fixture
def other_user() -> User:
    """Create another test user for isolation tests."""
    return create_user(email="other@example.com")


@pytest.fixture
def todo(user: User) -> Todo:
    """Create a test todo."""
    return Todo.objects.create(title="Test Todo", user=user)


@pytest.mark.django_db
class TestTodoList:
    """Tests for GET /api/todos/"""

    def test_list_todos_returns_empty_list(
        self, authenticated_client: tuple[APIClient, User]
    ) -> None:
        """List returns empty when no todos exist."""
        client, _ = authenticated_client
        response = client.get("/api/todos/")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["results"] == []

    def test_list_todos_returns_user_todos(
        self, authenticated_client: tuple[APIClient, User]
    ) -> None:
        """List returns todos belonging to authenticated user."""
        client, user = authenticated_client
        todo1 = Todo.objects.create(title="Todo 1", user=user)
        todo2 = Todo.objects.create(title="Todo 2", user=user)

        response = client.get("/api/todos/")
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 2
        titles = [t["title"] for t in response.data["results"]]
        assert "Todo 1" in titles
        assert "Todo 2" in titles

    def test_list_todos_excludes_other_users_todos(
        self, authenticated_client: tuple[APIClient, User], other_user: User
    ) -> None:
        """List only returns todos for the authenticated user."""
        client, user = authenticated_client
        Todo.objects.create(title="My Todo", user=user)
        Todo.objects.create(title="Other Todo", user=other_user)

        response = client.get("/api/todos/")
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 1
        assert response.data["results"][0]["title"] == "My Todo"


@pytest.mark.django_db
class TestTodoCreate:
    """Tests for POST /api/todos/"""

    def test_create_todo_success(
        self, authenticated_client: tuple[APIClient, User]
    ) -> None:
        """Create a new todo successfully."""
        client, user = authenticated_client
        response = client.post("/api/todos/", {"title": "New Todo"})
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["title"] == "New Todo"
        assert response.data["completed"] is False
        assert Todo.objects.filter(user=user, title="New Todo").exists()

    def test_create_todo_requires_title(
        self, authenticated_client: tuple[APIClient, User]
    ) -> None:
        """Create requires a title field."""
        client, _ = authenticated_client
        response = client.post("/api/todos/", {})
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "title" in response.data

    def test_create_todo_assigns_to_authenticated_user(
        self, authenticated_client: tuple[APIClient, User]
    ) -> None:
        """Created todo is assigned to the authenticated user."""
        client, user = authenticated_client
        response = client.post("/api/todos/", {"title": "My Todo"})
        assert response.status_code == status.HTTP_201_CREATED
        todo = Todo.objects.get(id=response.data["id"])
        assert todo.user == user


@pytest.mark.django_db
class TestTodoUpdate:
    """Tests for PUT/PATCH /api/todos/<id>/"""

    def test_update_todo_title(
        self, authenticated_client: tuple[APIClient, User]
    ) -> None:
        """Update todo title successfully."""
        client, user = authenticated_client
        todo = Todo.objects.create(title="Original", user=user)

        response = client.patch(f"/api/todos/{todo.id}/", {"title": "Updated"})
        assert response.status_code == status.HTTP_200_OK
        assert response.data["title"] == "Updated"
        todo.refresh_from_db()
        assert todo.title == "Updated"

    def test_update_todo_completed(
        self, authenticated_client: tuple[APIClient, User]
    ) -> None:
        """Update todo completed status successfully."""
        client, user = authenticated_client
        todo = Todo.objects.create(title="Test", user=user)

        response = client.patch(f"/api/todos/{todo.id}/", {"completed": True})
        assert response.status_code == status.HTTP_200_OK
        assert response.data["completed"] is True
        todo.refresh_from_db()
        assert todo.completed is True

    def test_cannot_update_other_users_todo(
        self, authenticated_client: tuple[APIClient, User], other_user: User
    ) -> None:
        """Cannot update a todo belonging to another user."""
        client, _ = authenticated_client
        todo = Todo.objects.create(title="Other Todo", user=other_user)

        response = client.patch(f"/api/todos/{todo.id}/", {"title": "Hacked"})
        assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.django_db
class TestTodoDelete:
    """Tests for DELETE /api/todos/<id>/"""

    def test_delete_todo_success(
        self, authenticated_client: tuple[APIClient, User]
    ) -> None:
        """Delete a todo successfully."""
        client, user = authenticated_client
        todo = Todo.objects.create(title="To Delete", user=user)

        response = client.delete(f"/api/todos/{todo.id}/")
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not Todo.objects.filter(id=todo.id).exists()

    def test_cannot_delete_other_users_todo(
        self, authenticated_client: tuple[APIClient, User], other_user: User
    ) -> None:
        """Cannot delete a todo belonging to another user."""
        client, _ = authenticated_client
        todo = Todo.objects.create(title="Other Todo", user=other_user)

        response = client.delete(f"/api/todos/{todo.id}/")
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert Todo.objects.filter(id=todo.id).exists()


@pytest.mark.django_db
class TestTodoToggle:
    """Tests for POST /api/todos/<id>/toggle/"""

    def test_toggle_incomplete_to_complete(
        self, authenticated_client: tuple[APIClient, User]
    ) -> None:
        """Toggle changes incomplete to complete."""
        client, user = authenticated_client
        todo = Todo.objects.create(title="Test", completed=False, user=user)

        response = client.post(f"/api/todos/{todo.id}/toggle/")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["completed"] is True
        todo.refresh_from_db()
        assert todo.completed is True

    def test_toggle_complete_to_incomplete(
        self, authenticated_client: tuple[APIClient, User]
    ) -> None:
        """Toggle changes complete to incomplete."""
        client, user = authenticated_client
        todo = Todo.objects.create(title="Test", completed=True, user=user)

        response = client.post(f"/api/todos/{todo.id}/toggle/")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["completed"] is False
        todo.refresh_from_db()
        assert todo.completed is False

    def test_cannot_toggle_other_users_todo(
        self, authenticated_client: tuple[APIClient, User], other_user: User
    ) -> None:
        """Cannot toggle a todo belonging to another user."""
        client, _ = authenticated_client
        todo = Todo.objects.create(title="Other Todo", user=other_user)

        response = client.post(f"/api/todos/{todo.id}/toggle/")
        assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.django_db
class TestTodoUserIsolation:
    """Tests for user isolation."""

    def test_user_can_only_see_own_todos(
        self, authenticated_client: tuple[APIClient, User], other_user: User
    ) -> None:
        """Users can only see their own todos."""
        client, user = authenticated_client
        my_todo = Todo.objects.create(title="My Todo", user=user)
        other_todo = Todo.objects.create(title="Other Todo", user=other_user)

        # List should only show my_todo
        response = client.get("/api/todos/")
        assert len(response.data["results"]) == 1
        assert response.data["results"][0]["id"] == str(my_todo.id)

        # Direct access to my_todo should work
        response = client.get(f"/api/todos/{my_todo.id}/")
        assert response.status_code == status.HTTP_200_OK

        # Direct access to other_todo should fail
        response = client.get(f"/api/todos/{other_todo.id}/")
        assert response.status_code == status.HTTP_404_NOT_FOUND
