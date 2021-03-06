# -*- coding: utf-8 -*-
from django.db import models

from .mixins import SeasonsMixin
from . import fields
from .time_base import TimeMixin


class CategoryManager(models.Manager):

    def get_by_natural_key(self, code):
        return self.get(code=code)


class Category(SeasonsMixin, TimeMixin, models.Model):

    objects = CategoryManager()

    code = models.CharField(
        'Kurzzeichen',
        max_length=3,
        unique=True,
        help_text="Kurzzeichen der Kategorie",
    )

    name = fields.NameField(
        help_text="Bezeichnung der Kategorie",
    )

    order = fields.OrderField()

    tour = models.BooleanField(
        'Touren',
        db_index=True,
        blank=True, default=False,
        help_text = 'Kategorie für Touren'
    )

    deadline = models.BooleanField(
        'Anmeldeschluss',
        db_index=True,
        blank=True, default=False,
        help_text = 'Kategorie für den Anmeldeschluss'
    )

    preliminary = models.BooleanField(
        'Vorbesprechung',
        db_index=True,
        blank=True, default=False,
        help_text = 'Kategorie für die Vorbesprechung'
    )

    meeting = models.BooleanField(
        'Kurstermin',
        db_index=True,
        blank=True, default=False,
        help_text = 'Kategorie für Kurstreffen Theorie/Praxis'
    )

    talk = models.BooleanField(
        'Vorträge',
        db_index=True,
        blank=True, default=False,
        help_text = 'Kategorie für Vorträge'
    )

    topic = models.BooleanField(
        'Kurse',
        db_index=True,
        blank=True, default=False,
        help_text = 'Kategorie für Kurse'
    )

    # Check: A collective will define its own set of categories

    collective = models.BooleanField(
        'Gruppentermine',
        db_index=True,
        blank=True, default=False,
        help_text = 'Kategorie für Gruppentermine'
    )

    winter = models.BooleanField(
        'Wintersportart',
        db_index=True,
        blank=True, default=False
    )

    summer = models.BooleanField(
        'Sommersportart',
        db_index=True,
        blank=True, default=False
    )

    climbing = models.BooleanField(
        'Klettersportart',
        blank=True, default=False
    )

    def natural_key(self):
        return self.code,

    natural_key.dependencies = ['server.season']

    def __str__(self):
        return "{} ({})".format(self.name, self.code)

    class Meta:
        get_latest_by = "updated"
        verbose_name = "Kategorie"
        verbose_name_plural = "Kategorien"
        unique_together = ('code', 'name')
        ordering = ('order', 'code', 'name')


class CategoryGroupManager(models.Manager):

    def get_by_natural_key(self, name):
        return self.get(name=name)


class CategoryGroup(SeasonsMixin, TimeMixin, models.Model):

    objects = CategoryGroupManager()

    categories = models.ManyToManyField(
        Category,
        db_index=True,
        verbose_name='Gruppe',
        related_name='category_list',
    )

    name = fields.NameField(
        'Bezeichnung',
        help_text="Bezeichnung der Gruppe",
        unique=True
    )

    description = fields.DescriptionField(
        'Beschreibung',
        help_text="Beschreibung der Gruppe",
        blank=True, default=''
    )

    order = fields.OrderField()

    def natural_key(self):
        return self.name

    natural_key.dependencies = ['server.season', 'server.category']

    def __str__(self):
        return "{}".format(self.name)

    class Meta:
        verbose_name = "Kategoriegruppe"
        verbose_name_plural = "Kategoriegruppen"
        ordering = ('order', 'name')
