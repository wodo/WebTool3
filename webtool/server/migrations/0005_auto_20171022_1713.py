# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2017-10-22 15:13
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('server', '0004_auto_20171021_0601'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='session',
            options={'get_latest_by': 'updated', 'ordering': ('session__season__name', 'collective__name', 'session__start_date'), 'verbose_name': 'Gruppentermin', 'verbose_name_plural': 'Gruppentermine'},
        ),
        migrations.AlterModelOptions(
            name='topic',
            options={'get_latest_by': 'updated', 'ordering': ('seasons__name', 'order', 'name'), 'verbose_name': 'Kursinhalt', 'verbose_name_plural': 'Kursinhalte'},
        ),
    ]
