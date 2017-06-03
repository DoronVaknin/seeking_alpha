# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin
from my_app.models import User, Group

# Register your models here.


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'group_id')


@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')

