# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-06-02 14:59
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('my_app', '0004_user_number_of_followers'),
    ]

    operations = [
        migrations.RenameField(
            model_name='user',
            old_name='number_of_followers',
            new_name='users_followed',
        ),
    ]
