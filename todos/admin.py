from django.contrib import admin

from todos.models import Todo


@admin.register(Todo)
class TodoAdmin(admin.ModelAdmin):
    list_display = ["title", "completed", "user", "created_at", "updated_at"]
    list_filter = ["completed", "created_at"]
    search_fields = ["title", "user__email"]
    readonly_fields = ["id", "created_at", "updated_at"]
    ordering = ["-created_at"]
