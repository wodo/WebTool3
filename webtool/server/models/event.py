# -*- coding: utf-8 -*-
from django.db import models
from django.template.defaultfilters import date, time

from .approximate import Approximate
from .mixins import SeasonMixin, DescriptionMixin
from .time_base import TimeMixin
from . import fields


class EventManager(models.Manager):

    def get_by_natural_key(self, season, reference):
        category, code = reference.split('-')
        return self.get(season__name=season, reference__category__code=category, reference__reference=int(code[1:]))


class Event(SeasonMixin, TimeMixin, DescriptionMixin, models.Model):
    """
    The option (blank=True, default='') for CharField describes an optional element
    field == '' => data is not available
    field != '' => data is Valid

    The option (blank=True, null=True) for the other fields describes an optional element
    field is None => data is not available
    field is not None => data is Valid
    """

    objects = EventManager()

    # noinspection PyUnresolvedReferences
    reference = models.OneToOneField(
        'Reference',
        primary_key=True,
        verbose_name='Buchungscode',
        related_name='event_list',
        on_delete=models.PROTECT,
    )

    location = fields.LocationField()

    start_date = models.DateField(
        'Abreisetag',
        db_index=True
    )

    start_time = models.TimeField(
        'Abreisezeit (Genau)',
        blank=True, null=True,
        help_text="Je nach Abreisezeit wird eventuell Urlaub benötgit",
    )

    # approximate is valid only if start_time is None

    approximate = models.ForeignKey(
        Approximate,
        db_index=True,
        verbose_name='Abreisezeit (Ungefähr)',
        related_name='event_list',
        blank=True, null=True,
        help_text="Je nach Abreisezeit wird eventuell Urlaub benötigt",
        on_delete=models.PROTECT,
    )

    end_date = models.DateField(
        'Rückkehr',
        blank=True, null=True,
        help_text="Nur wenn die Veranstaltung mehr als einen Tag dauert",
    )

    end_time = models.TimeField(
        'Rückkehrzeit',
        blank=True, null=True,
        help_text="z.B. Ungefähr bei Touren/Kursen - Genau bei Vorträgen",
    )

    link = models.URLField(
        'Beschreibung',
        blank=True, default='',
        help_text="Eine URL zur Veranstaltungsbeschreibung auf der Homepage",
    )

    map = models.FileField(
        'Kartenausschnitt',
        blank=True, default='',
        help_text="Eine URL zu einem Kartenausschnitt des Veranstaltungsgebietes",
    )

    distal = models.BooleanField(
        'Mit gemeinsamer Anreise',
        db_index=True,
        blank=True, default=False,
    )

    # rendezvous, source and distance valid only, if distal_event == True

    rendezvous = fields.LocationField(
        'Treffpunkt',
        help_text="Treffpunkt für die Abfahrt z.B. Edelweissparkplatz",
    )

    source = fields.LocationField(
        'Ausgangsort',
        help_text="Treffpunkt vor Ort",
    )

    public_transport = models.BooleanField(
        'Öffentliche Verkehrsmittel',
        db_index=True,
        blank=True, default=False
    )

    # distance valid only, if public_transport == False

    distance = fields.DistanceField()

    # lea valid only, if public_transport == True

    lea = models.BooleanField(
        'Low Emission Adventure',
        db_index=True,
        blank=True, default=False
    )

    # check event.season == instruction.topic.season

    # noinspection PyUnresolvedReferences
    instruction = models.ForeignKey(
        'Instruction',
        db_index=True,
        blank=True, null=True,
        verbose_name='Kurs',
        related_name='meeting_list',
        on_delete=models.PROTECT,
    )

    def natural_key(self):
        return self.season.name, "{}".format(self.reference)

    natural_key.dependencies = ['server.season', 'server.reference']

    def __str__(self):
        return "{}, {} [{}]".format(self.title, self.long_date(with_year=True), self.season.name)

    def long_date(self, with_year=False, with_time=False):
        """
        :param with_year: False

        5. September
        22. bis 25. Januar
        28. Mai bis 3. Juni
        30. Dezember 2016 bis 6. Januar 2017

        :param with_year: True

        5. September 2016
        22. bis 25. Januar 2016
        28. Mai bis 3. Juni 2016
        30. Dezember 2016 bis 6. Januar 2017

        :return: long formatted date
        """

        y = ' Y' if with_year else ''
        if self.end_date is None or self.start_date == self.end_date:
            value = date(self.start_date, "j. F" + y)
            if with_time and self.start_time:
                if self.end_time is None or self.start_time == self.end_time:
                    if self.start_time.minute:
                        if self.start_time.minute < 10:
                            minute = time(self.start_time, "i")[1:]
                        else:
                            minute = time(self.start_time, "i")
                        value = "{}, {}.{}".format(value, time(self.start_time, "G"), minute)
                    else:
                        value = "{}, {}".format(value, time(self.start_time, "G"))
                else:
                    if self.end_time.minute:
                        if self.start_time.minute < 10:
                            minute = time(self.start_time, "i")[1:]
                        else:
                            minute = time(self.start_time, "i")
                        value = "{}, {}.{}".format(value, time(self.start_time, "G"), minute)
                    else:
                        value = "{} bis {}".format(value, time(self.start_time, "G"))
                value = "{} Uhr".format(value)
            return value
        elif self.start_date.month == self.end_date.month and self.start_date.year == self.end_date.year:
            return "{0} bis {1}".format(date(self.start_date, "j."), date(self.end_date, "j. F" + y))
        elif self.start_date.month != self.end_date.month:
            y0 = ''
            if self.start_date.year != self.end_date.year:
                y0 = y = ' Y'
            return "{0} bis {1}".format(date(self.start_date, "j. F" + y0), date(self.end_date, "j. F" + y))

    def short_date(self, with_year=False):
        """
        :param with_year: False

        05.09.
        22.01 - 25.01.
        28.05. - 03.06.

        :param with_year: True

        05.09.2016
        22.01.2016 - 25.01.2016
        28.05.2016 - 03.06.2016

        :return: short formatted date
        """

        y = 'Y' if with_year else ''
        if self.end_date is None or self.start_date == self.end_date:
            return date(self.start_date, "d.m." + y)
        return "{0} - {1}".format(date(self.start_date, "d.m." + y), date(self.end_date, "d.m." + y))

    def departure(self):
        """
            {start_date}, {start_time}, {rendezvous}, Heimkehr am {end_date} gegen {end_time} Uhr
        """
        season_year = int(self.season.name)
        with_year = season_year != self.start_date.year or (self.end_date and season_year != self.end_date.year)
        y = 'Y' if with_year else ''
        start_date = date(self.start_date, "j.n." + y)

        if self.start_time:
            if self.start_time.minute:
                start_time = time(self.start_time, "G.i")
            else:
                start_time = time(self.start_time, "G")
            start_time = "{} Uhr".format(start_time)
        else:
            start_time = self.approximate.name if self.approximate else ''

        if self.end_date and self.end_date != self.start_date:
            end_date = date(self.end_date, "j.n." + y)
        else:
            end_date = ''

        if self.end_time:
            if self.end_time.minute:
                end_time = time(self.end_time, "G.i")
            else:
                end_time = time(self.end_time, "G")
        else:
            end_time = ''

        departure = "{}, {}r".format(start_date, start_time)
        if self.rendezvous:
            departure = "{}, {}".format(departure, self.rendezvous)
        if end_time:
            departure = "{}, Heimkehr".format(departure)
            if end_date:
                departure = "{} am {}".format(departure, end_date)
            departure = "{} gegen {} Uhr".format(departure, end_time)
        return departure

    def prefixed_date(self, prefix, formatter, with_year=False):
        """
        Beispiel: "Anmeldung bis 10.03."

        :param prefix:
        :param formatter: a unbound methode like short_date or long_date
        :param with_year:
        :return:
        """
        return "{} {}".format(prefix, formatter(self, with_year))

    @property
    def activity(self):
        if self.tour:
            return "tour"
        if self.talk:
            return "talk"
        if self.instruction:
            return "instruction"
        if self.session:
            return "session"

    @property
    def division(self):
        winter = self.reference.category.winter
        summer = self.reference.category.summer
        climbing = self.reference.category.climbing

        if winter and not summer and not climbing:
            return "winter"
        elif not winter and summer and not climbing:
            return "summer"
        elif not winter and not summer and climbing:
            return "indoor"
        else:
            return "misc"

    @property
    def state(self):
        state = None

        if self.tour:
            state = self.tour.state
        elif self.talk:
            state = self.talk.state
        elif self.instruction:
            state = self.instruction.state
        if self.session:
            state = self.session.state

        if state:
            if state.done:
                return "done"
            if state.moved:
                return "moved"
            if state.canceled:
                return "canceled"
            if state.unfeasible:
                return "unfeasible"
            if state.public:
                return "public"
        else:
            return "private"

    @property
    def quantity(self):
        min_quantity = 0
        max_quantity = 0
        cur_quantity = 0

        if self.tour:
            min_quantity = self.tour.min_quantity
            max_quantity = self.tour.max_quantity
            cur_quantity = self.tour.cur_quantity
        elif self.instruction:
            min_quantity = self.instruction.min_quantity
            max_quantity = self.instruction.max_quantity
            cur_quantity = self.instruction.cur_quantity
        elif self.talk:
            min_quantity = self.talk.min_quantity
            max_quantity = self.talk.max_quantity
            cur_quantity = self.talk.cur_quantity

        return {
            "min": min_quantity,
            "max": max_quantity,
            "current": cur_quantity
        }

    @property
    def speaker(self):
        if self.talk:
            return self.talk.speaker
        if self.session:
            return self.session.speaker
        return None

    @property
    def guide(self):
        if self.tour:
            return self.tour.guide
        if self.instruction:
            return self.instruction.guide
        if self.session:
            return self.session.guide
        return None

    @property
    def skill(self):
        if self.tour:
            return self.tour.skill
        if self.session:
            return self.session.skill
        return None

    @property
    def fitness(self):
        if self.tour:
            return self.tour.fitness
        if self.session:
            return self.session.fitness
        return None

    @property
    def ladies_only(self):
        if self.tour:
            return self.tour.ladies_only
        if self.instruction:
            return self.instruction.ladies_only
        return None

    class Meta:
        get_latest_by = "updated"
        verbose_name = "Veranstaltungstermin"
        verbose_name_plural = "Veranstaltungstermine"
        ordering = ('start_date', )