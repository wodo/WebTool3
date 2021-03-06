# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2017-12-12 15:23
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
import server.models.fields


class Migration(migrations.Migration):

    dependencies = [
        ('server', '0019_collective_managers'),
    ]

    operations = [
        migrations.CreateModel(
            name='CategoryGroup',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('updated', models.DateTimeField(auto_now=True)),
                ('deprecated', models.BooleanField(default=False, verbose_name='Element gilt als gelöscht')),
                ('name', server.models.fields.NameField(help_text='Bezeichnung der Gruppe', max_length=125, unique=True, verbose_name='Bezeichnung')),
                ('description', server.models.fields.DescriptionField(blank=True, default='', help_text='Beschreibung der Gruppe', verbose_name='Beschreibung')),
                ('order', server.models.fields.OrderField(blank=True, db_index=True, default=0, help_text='Reihenfolge in der Druckausgabe', verbose_name='Reihenfolge')),
                ('categories', models.ManyToManyField(db_index=True, related_name='category_list', to='server.Category', verbose_name='Gruppe')),
                ('seasons', models.ManyToManyField(db_index=True, related_name='categorygroup_list', to='server.Season', verbose_name='Saison')),
            ],
            options={
                'verbose_name': 'Kategoriegruppe',
                'verbose_name_plural': 'Kategoriegruppen',
                'ordering': ('order', 'name'),
            },
        ),
        migrations.AlterField(
            model_name='role',
            name='collective',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='role_list', to='server.Collective', verbose_name='Gruppe'),
        ),
        migrations.AlterField(
            model_name='role',
            name='manager',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='role_list', to='server.Guide', verbose_name='Manager'),
        ),
    ]
