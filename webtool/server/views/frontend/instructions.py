# -*- coding: utf-8 -*-
from django.http import Http404
from django.template.defaultfilters import date
from rest_framework import viewsets, permissions, status, mixins
from rest_framework.response import Response

from server.models import Instruction
from server.serializers.frontend.instructions import InstructionListSerializer, InstructionSerializer


class IsStaffOrReadOnly(permissions.BasePermission):
    """
    The request is authenticated for a staff user, or is a read-only request.
    """

    def has_permission(self, request, view):
        return (
            request.method in permissions.SAFE_METHODS or
            request.user and request.user.is_staff or
            # Instruction owner is only allowed to perform actions under certain circumstances
            (request.method == 'PUT' or request.method == 'POST') and request.user and (
                (request.data['guideId'] == request.user.id)
                and (request.data['stateId'] == 1 or request.data['stateId'] == 2)
            )
        )


class InstructionViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):

    permission_classes = (IsStaffOrReadOnly, )

    queryset = (
        Instruction.objects
        .filter(deprecated=False, instruction__season__current=True)
        # .exclude(state__done=True)
        # .exclude(state__canceled=True)
    )

    def get_serializer_class(self):
        if self.action == 'list':
            return InstructionListSerializer
        return InstructionSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True, context=dict(request=request))

        response = Response(serializer.data)
        response['Cache-Control'] = "public, max-age=86400"
        if queryset.exists():
            latest = queryset.latest()
            response['ETag'] = '"{}"'.format(latest.get_etag())
            response['Last-Modified'] = "{} GMT".format(date(latest.updated, "D, d M Y H:i:s"))
        return response

    def retrieve(self, request, pk=None, *args, **kwargs):

        try:
            pk = int(pk)
        except ValueError:
            raise Http404

        queryset = self.get_queryset()
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        response = Response(serializer.data)
        response['Cache-Control'] = "public, max-age=86400"
        if queryset.exists():
            response['ETag'] = '"{}"'.format(instance.get_etag())
            response['Last-Modified'] = "{} GMT".format(date(instance.updated, "D, d M Y H:i:s"))
        return response

    def update(self, request, pk=None, *args, **kwargs):

        try:
            pk = int(pk)
        except ValueError:
            raise Http404

        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

    def destroy(self, request, pk=None, *args, **kwargs):

        try:
            pk = int(pk)
        except ValueError:
            raise Http404

        instance = self.get_object()

        instruction = instance.instruction
        if instruction:
            reference = instruction.reference
            if reference:
                reference.deprecated = True
                reference.save()

            instruction.deprecated = True
            instruction.save()

        meetings = instance.meeting_list.all()
        for meeting in meetings:
            reference = meeting.reference
            if reference:
                reference.deprecated = True
                reference.save()
            meeting.deprecated = True
            meeting.save()

        instance.deprecated = True
        instance.save()

        return Response(status=status.HTTP_204_NO_CONTENT)
