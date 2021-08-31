from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from .views import *
from django.urls import path
from django.conf import settings

urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('register/', register, name='register'),
    path('login/', login, name="student_teacher_login"),
    path('logout/', logout, name="logout"),
    path('createsubjects/', subject, name="subject selection"),
    path('enrollment/', enrollment, name="enrollment"),
    path('allsubjects/', allclasses, name="allsubjects"),
    path('studentsubjects/', studentsubject, name="student_subjects"),
    path('selectsubject/', selectsubject, name="select_subjects"),
    path('myclasses/', myclasses, name="teacher_classes"),
    path('createassg/', createassignment, name="createassignment"),
    path('assignments/', studentassignment, name="students_assignments"),
    path('myassignments/', teacherassignment, name="teacher_assignment"),
    path('makesubmission/', makesubmission, name="student_submission"),
    path('seesubmissions/', seesubmissions, name="see_submissions"),
    path('assignmarks/', assignmarks, name="assignmarks"),
    path('createschedule/', schedule, name="create_schedule"),
    path('getschedule/', getschedule, name="get_schedule"),
    path('createtest/', createtest, name="tocreatetest"),
    path('tests/', studenttest, name="studentstest"),
    path('testsubmission/', testsubmission, name="testsubmission"),
    path('testmarks/', testmarks, name="assigntestmarks"),
    path('seeanswers/', seeanswers, name="seeanswers"),
    path('mytests/', mytests, name="mytests"),
]
