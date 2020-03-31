from django.contrib.auth.models import Group, Permission, User
from rest_framework import serializers

from server.models import Profile


def update_user(instance, validated_data, context):
    instance.first_name = validated_data.get('first_name', instance.first_name)
    instance.last_name = validated_data.get('last_name', instance.last_name)
    instance.email = validated_data.get('email', instance.email)
    instance.groups = validated_data.get('groups', instance.groups)
    instance.user_permissions = validated_data.get('user_permissions', instance.user_permissions)
    instance.is_staff = validated_data.get('is_staff', instance.is_staff)
    instance.is_active = validated_data.get('is_active', instance.is_active)
    instance.date_joined = validated_data.get('date_joined', instance.date_joined)
    instance.save()

    return instance

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ('name',)

class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ('name',)

class ProfileSerializer(serializers.ModelSerializer):
    memberId = serializers.CharField(source='member_id', read_only=True)
    sex = serializers.IntegerField(read_only=True)
    birthDate = serializers.DateField(source='birth_date', read_only=True)
    note = serializers.CharField(read_only=True)
    memberYear = serializers.IntegerField(source='member_year', read_only=True)
    integralMember = serializers.BooleanField(source='integral_member', read_only=True)
    memberHome = serializers.CharField(source='member_home', read_only=True)

    class Meta:
        model = Profile
        fields = ('memberId', 'sex',
                  'birthDate',
                  'note',
                  'memberYear',
                  'integralMember',
                  'memberHome',)

    # def update(self, instance, validated_data):



class UserSerializer(serializers.ModelSerializer):
    id = serializers.PrimaryKeyRelatedField(
        source='pk', queryset=User.objects.all(), default=None, allow_null=True
    )
    username = serializers.CharField(read_only=True)
    firstName = serializers.CharField(source='first_name')
    lastName = serializers.CharField(source='last_name')
    email = serializers.EmailField()
    groups = GroupSerializer(many=True, allow_null=True)
    # groups = serializers.PrimaryKeyRelatedField(many=True, queryset=Group.objects.all()) # Quelle https://www.django-rest-framework.org/api-guide/serializers/
    permissions = PermissionSerializer(source='user_permissions', many=True, allow_null=True)
    isStaff = serializers.BooleanField(source='is_staff')
    isActive = serializers.BooleanField(source='is_active')
    dateJoined = serializers.DateTimeField(source='date_joined')
    profile = ProfileSerializer()

    class Meta:
        model = User
        fields = ('id',
                  'username',
                  'firstName',
                  'lastName',
                  'email',
                  'groups',
                  'permissions',
                  'isStaff',
                  'isActive',
                  'dateJoined',
                  'profile')

    def validate(self, data):
        instance_data = data.get('pk')
        if (instance_data is not None) or (self.instance is not None):
            # This is the Update case
            print('doof1')
            if instance_data is None:
                raise serializers.ValidationError("instance Id is missing")

            if self.instance is not None:
                if instance_data.pk != self.instance.pk:
                    raise serializers.ValidationError("Wrong instance Id")

        return data

    # def create(self, validated_data):
    def update(self, instance, validated_data):
        return update_user(instance, validated_data, self.context)
