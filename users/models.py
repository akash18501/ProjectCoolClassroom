from django.db import models
from django.contrib.auth.models import User, AbstractUser, AbstractBaseUser
import datetime


class User(AbstractUser):
    is_student = models.BooleanField('student status', default=False)
    is_teacher = models.BooleanField('teacher status', default=False)
    regno = models.IntegerField()
    REQUIRED_FIELDS = ['regno', 'email']


class Subject(models.Model):
    teacher_id = models.ForeignKey(to=User, on_delete=models.CASCADE)
    teacher_username = models.CharField(max_length=200)
    subject_name = models.CharField(max_length=100)


class Enrollment(models.Model):
    student_username = models.ForeignKey(User, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)


class Assignments(models.Model):
    creator = models.ForeignKey(to=User, on_delete=models.CASCADE)
    assg_name = models.CharField(max_length=200)
    description = models.CharField(max_length=1000)
    creation_date = models.DateField(null=True)
    end_date = models.DateField(null=True)
    subject = models.CharField(max_length=200)


class Submission(models.Model):
    student_name = models.ForeignKey(to=User, on_delete=models.CASCADE)
    assg_id = models.IntegerField()
    assg_file = models.FileField(upload_to='media/')
    marks = models.IntegerField(default=-5)


# Model for scheduling classes
class Schedule(models.Model):
    creator = models.ForeignKey(to=User, on_delete=models.CASCADE)
    subject = models.CharField(max_length=200)
    schedule_date = models.DateField(null=True)
    start_time = models.TimeField()
    end_time = models.TimeField()
    desc = models.CharField(max_length=2000)
    link = models.CharField(max_length=2000)


class Tests(models.Model):
    teacher_name = models.ForeignKey(to=User, on_delete=models.CASCADE)
    test_name = models.CharField(max_length=200)
    instructions = models.CharField(max_length=255)
    test_duration = models.IntegerField()
    max_marks = models.IntegerField()
    test_date = models.DateField()
    subject = models.CharField(max_length=255)
    questions = models.FileField(upload_to='questions/')


class TestSubmission(models.Model):
    student_name = models.ForeignKey(to=User, on_delete=models.CASCADE)
    answers_file = models.FileField(upload_to='answers/')
    test_id = models.IntegerField()
    marks = models.IntegerField(default=-5)
