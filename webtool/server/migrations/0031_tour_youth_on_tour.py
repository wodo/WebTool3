# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2018-12-22 13:23
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('server', '0030_instruction_category'),
    ]

    operations = [
        migrations.AddField(
            model_name='tour',
            name='youth_on_tour',
            field=models.BooleanField(default=False, verbose_name='Jugend on Tour'),
        ),
    ]
