# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2018-12-11 04:11
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('server', '0024_auto_20181210_2022'),
    ]

    operations = [
        migrations.AddField(
            model_name='instruction',
            name='special',
            field=models.BooleanField(default=False, help_text='Kreative Kursinhalte', verbose_name='Spezialkurs'),
        ),
    ]
