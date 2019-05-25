# -*- coding: utf-8 -*-
# Generated by Django 1.11.20 on 2019-05-25 05:11
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('server', '0032_auto_20190525_0702'),
    ]

    operations = [
        migrations.AddField(
            model_name='instruction',
            name='equipment_service',
            field=models.BooleanField(db_index=True, default=False, verbose_name='Reservierungswunsch für Ausrüstungsservice'),
        ),
        migrations.AddField(
            model_name='session',
            name='equipment_service',
            field=models.BooleanField(db_index=True, default=False, verbose_name='Reservierungswunsch für Ausrüstungsservice'),
        ),
        migrations.AddField(
            model_name='topic',
            name='equipment_service',
            field=models.BooleanField(db_index=True, default=False, verbose_name='Reservierungswunsch für Ausrüstungsservice'),
        ),
        migrations.AddField(
            model_name='tour',
            name='equipment_service',
            field=models.BooleanField(db_index=True, default=False, verbose_name='Reservierungswunsch für Ausrüstungsservice'),
        ),
    ]
