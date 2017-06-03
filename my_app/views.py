# -*- coding: utf-8 -*-
from __future__ import unicode_literals

# from django.shortcuts import render
from rest_framework import serializers, viewsets
from my_app.models import User, Group

# Create your views here.

# Serializers define the API representation.
class UserSerializer(serializers.HyperlinkedModelSerializer):
    group_id = serializers.PrimaryKeyRelatedField(read_only=True)
    group_name = serializers.PrimaryKeyRelatedField(read_only=True, source='group_id.name')

    class Meta:
        model = User
        fields = ('id', 'name', 'group_id', 'group_name', 'followers', 'users_followed')


# ViewSets define the view behavior.
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


# Serializers define the API representation.
class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('id', 'name')


# ViewSets define the view behavior.
class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
