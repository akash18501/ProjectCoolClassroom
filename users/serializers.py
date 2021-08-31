from datetime import date
from os import set_inheritable
from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError, server_error
User = get_user_model()


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    regno = serializers.IntegerField()
    username = serializers.CharField(max_length=200)
    password = serializers.CharField(max_length=20)
    first_name = serializers.CharField(max_length=255)
    student = serializers.BooleanField()
    teacher = serializers.BooleanField()
    last_name = serializers.CharField(max_length=255)

    def validate(self, data):
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError(
                {"msg": "Email already in use"}
            )

        if User.objects.filter(regno=data['regno']).exists():
            raise serializers.ValidationError(
                {"msg": "Registration number already in use"}
            )

        if User.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError(
                {"msg": "Username already in use"}
            )

        return data


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=200)
    password = serializers.CharField(max_length=200)
    is_teacher = serializers.BooleanField()
    is_student = serializers.BooleanField()


class LogoutSerializer(serializers.Serializer):
    token = serializers.CharField(max_length=255)


class SubjectSerializer(serializers.Serializer):
    subject_name = serializers.CharField(max_length=200)


class EnrollmentSerializer(serializers.Serializer):
    subject = serializers.CharField(max_length=200)
    student_username = serializers.CharField()


class AssignmentSerializer(serializers.Serializer):
    assg_name = serializers.CharField(max_length=200)
    description = serializers.CharField(max_length=1000)
    end_date = serializers.DateField()
    subject = serializers.CharField(max_length=200)

    def validate(self, data):
        datet = date.today()
        print(datet)
        if data['end_date'] < datet:
            raise serializers.ValidationError(
                {"msg": "End Date is already passed"}
            )

        return data


class SubmissionSerializer(serializers.Serializer):
    assg_file = serializers.FileField()
    assg_id = serializers.IntegerField()


class SeeSubmissionSerializer(serializers.Serializer):
    assg_id = serializers.IntegerField()


class AssignMarksSerializer(serializers.Serializer):
    sub_id = serializers.IntegerField()
    marks = serializers.IntegerField()


class ScheduleSerializer(serializers.Serializer):
    subject = serializers.CharField(max_length=200)
    desc = serializers.CharField(max_length=2000)
    link = serializers.CharField(max_length=2000)
    schedule_date = serializers.DateField()
    start_time = serializers.TimeField()
    end_time = serializers.TimeField()

    def validate(self, data):
        todays_date = date.today()
        if data['schedule_date'] < todays_date:
            raise serializers.ValidationError(
                {"msg": "Date is passed already."}
            )

        return data


class CreateTestSerializer(serializers.Serializer):
    test_name = serializers.CharField(max_length=200)
    instructions = serializers.CharField()
    duration = serializers.IntegerField()
    marks = serializers.IntegerField()
    test_date = serializers.DateField()
    questions = serializers.FileField()
    subject = serializers.CharField()
