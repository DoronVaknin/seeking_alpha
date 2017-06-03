# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

# Create your models here.


class User(models.Model):
    name = models.CharField(max_length=30, blank=False, null=False)
    group_id = models.ForeignKey('Group')
    users_followed = models.ManyToManyField('User', blank=True)

    def __str__(self):
        return self.name

    @property
    def followers(self):
        return User.objects.filter(users_followed=self.id).count()


class Group(models.Model):
    name = models.CharField(max_length=30, blank=False, null=False)

    def __str__(self):
        return self.name
