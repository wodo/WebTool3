# -*- coding: utf-8 -*-
from django.db import models

from .event import Event
from .guide import Guide
from .mixins import (
    SectionMixin, DescriptionMixin, GuidedEventMixin,
    RequirementMixin, EquipmentMixin, StateMixin, ChapterMixin, SeasonsMixin)
from .time_base import TimeMixin
from . import fields


class CollectiveManager(models.Manager):

    def get_by_natural_key(self, category):
        return self.get(category_code=category)


class Collective(SeasonsMixin, SectionMixin, TimeMixin, DescriptionMixin, models.Model):

    objects = CollectiveManager()

    # noinspection PyUnresolvedReferences
    category = models.OneToOneField(
        'Category',
        primary_key=True,
        verbose_name='Kategorie',
        related_name='category_collective',
    )

    managers = models.ManyToManyField(
        Guide, through="Role",
        db_index=True,
        verbose_name='Manager',
        related_name='collectives',
        blank=True,
        help_text="Ansprechpartner für die Gruppe",
    )

    order = fields.OrderField()

    def natural_key(self):
        return self.category.code,

    natural_key.dependencies = ['server.season']

    def __str__(self):
        return "{} ({}){}".format(self.title, self.category.code, "- internal" if self.internal else "")

    class Meta:
        get_latest_by = "updated"
        verbose_name = "Gruppe"
        verbose_name_plural = "Gruppen"
        unique_together = ('title', 'internal')
        ordering = ('order', 'name')


class SessionManager(models.Manager):

    def get_by_natural_key(self, season, reference):
        session = Event.objects.get_by_natural_key(season, reference)
        return session.session


class Session(TimeMixin, GuidedEventMixin, RequirementMixin, EquipmentMixin, StateMixin, ChapterMixin, models.Model):

    objects = SessionManager()

    collective = models.ForeignKey(
        Collective,
        db_index=True,
        verbose_name='Gruppe',
        related_name='session_list',
        on_delete=models.PROTECT,
    )

    session = models.OneToOneField(
        Event,
        primary_key=True,
        verbose_name='Veranstaltung',
        related_name='session',
        on_delete=models.PROTECT,
    )

    speaker = models.CharField(
        verbose_name='Referent',
        max_length=125,
        blank=True, default='',
        help_text="Name des Referenten",

    )

    portal = models.URLField(
        'Tourenportal',
        blank=True, default='',
        help_text="Eine URL zum Tourenportal der Alpenvereine",
    )

    @property
    def season(self):
        return self.session.season

    def natural_key(self):
        return self.season.name, str(self.session.reference)

    natural_key.dependencies = ['server.season', 'server.event', 'server.collective']

    def __str__(self):
        return '{} - {}, {} [{}]'.format(
            self.session.title, self.collective.title, self.session.long_date(with_year=True), self.season
        )

    def subject(self):
        return ""

    def details(self):
        return ""

    class Meta:
        get_latest_by = "updated"
        verbose_name = "Gruppentermin"
        verbose_name_plural = "Gruppentermine"
        ordering = ('session__season__name', 'collective__name', 'session__start_date', )


class Role(TimeMixin, models.Model):

    collective = models.ForeignKey(
        Collective,
        db_index=True,
        verbose_name='Gruppe',
        related_name='role_list',
        on_delete=models.CASCADE,
    )

    manager = models.ForeignKey(
        Guide,
        db_index=True,
        verbose_name='Manager',
        related_name='role_list',
        on_delete=models.CASCADE,
    )

    def __str__(self):
        return "{} - {}".format(self.manager.user.get_full_name(), self.collective.name)

    order = fields.OrderField()
    description = fields.DescriptionField(blank=True, default='')

    class Meta:
        get_latest_by = "updated"
        verbose_name = "Aufgabe"
        verbose_name_plural = "Aufgaben"
        ordering = ('order', 'manager__user__last_name', 'manager__user__first_name')
