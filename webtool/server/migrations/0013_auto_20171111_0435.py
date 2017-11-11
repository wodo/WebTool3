# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2017-11-11 03:35
from __future__ import unicode_literals

import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('server', '0012_auto_20171109_0556'),
    ]

    operations = [
        migrations.AddField(
            model_name='reference',
            name='prefix',
            field=models.PositiveSmallIntegerField(default=8, validators=[django.core.validators.MaxValueValidator(9, 'Bitte keine Zahlen größer 9 eingeben')], verbose_name='Jahreszahl'),
            preserve_default=False,
        )
    ]
