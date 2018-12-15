# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2018-12-10 19:22
from __future__ import unicode_literals

from django.db import migrations, models
import server.models.fields


class Migration(migrations.Migration):

    dependencies = [
        ('server', '0023_auto_20181201_1912'),
    ]

    operations = [
        migrations.AddField(
            model_name='instruction',
            name='equipments',
            field=models.ManyToManyField(blank=True, db_index=True, related_name='instruction_list', to='server.Equipment', verbose_name='Ausrüstung'),
        ),
        migrations.AddField(
            model_name='instruction',
            name='misc_equipment',
            field=server.models.fields.MiscField(blank=True, default='', help_text='Zusätzliche Ausrüstung, wenn unter Ausrüstung „Sonstiges“ gewählt wurde', max_length=75, verbose_name='Sonstiges'),
        ),
        migrations.AddField(
            model_name='instruction',
            name='preconditions',
            field=models.TextField(blank=True, default='', help_text='Sonstige, spezielle Vorraussetzungen für eine Teilnahme an diesem Kurs', verbose_name='Voraussetzung'),
        ),
        migrations.AddField(
            model_name='instruction',
            name='qualifications',
            field=models.ManyToManyField(blank=True, db_index=True, help_text='Welche Kurseinhalte müssen von den Teilnahmern für den Kurs beherrscht werden', related_name='instruction_list', to='server.Topic', verbose_name='Voraussetzungen (Kurse)'),
        ),
    ]