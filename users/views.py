from datetime import datetime
from datetime import date
from os import truncate
from django.shortcuts import render
from rest_framework import serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import *
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import *
from django.http import HttpResponse, response
from django.contrib import auth
import json
import jwt
from django.contrib.auth import get_user_model
User = get_user_model()


@api_view(['POST'])
def register(request):
    try:
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            first_name = serializer.validated_data['first_name']
            last_name = serializer.validated_data['last_name']
            student = serializer.validated_data['student']
            teacher = serializer.validated_data['teacher']
            regno = serializer.validated_data['regno']
            print(username, password, first_name,
                  last_name, student, teacher, regno)

            User.objects.create_user(username=username, password=password,
                                     first_name=first_name, last_name=last_name, is_student=student,
                                     is_teacher=teacher, regno=regno, email=email)
            return Response(status=201, data={'msg': 'Registration Successful'})
        else:
            return Response(status=400, data=serializer.errors)
    except Exception as ex:
        print("Internal Server Error ->", ex)
        return Response(status=500, data={"msg": "Internal Server Error"})


@api_view(['POST'])
def login(request):
    try:
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            teacher = serializer.validated_data['is_teacher']
            student = serializer.validated_data['is_student']
            user = auth.authenticate(username=username, password=password)

            if user and user.is_teacher == teacher and teacher == True:
                refresh_token = RefreshToken.for_user(user)

                res = {"tokens": {"refresh_token": str(refresh_token),
                                  "access_token": str(refresh_token.access_token)}}
                res["user"] = {"username": user.username, "email": user.email, "id_type": "teacher",
                               "first_name": user.first_name, "last_name": user.last_name}
                return Response(data=res, status=200)

            elif user and user.is_student == student and student == True:
                print("inside student")
                refresh_token = RefreshToken.for_user(user)

                res = {"tokens": {"refresh_token": str(refresh_token),
                                  "access_token": str(refresh_token.access_token)}}
                res["user"] = {"username": user.username, "email": user.email, "id_type": "student",
                               "first_name": user.first_name, "last_name": user.last_name}
                return Response(data=res, status=200)

            else:
                return Response(status=400, data={"msg": "Invalid Credentials"})

        else:
            return Response(status=400, data=serializer.errors)
    except Exception as ex:
        print("Internal Server Error ->", ex)
        return Response(status=500, data={"msg": "Internal Server Error"})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        serializer = LogoutSerializer(data=request.data)
        if serializer.is_valid():
            print(request.META['HTTP_AUTHORIZATION'])
            Refresh_token = serializer.validated_data['token']
            token = RefreshToken(Refresh_token)
            token.blacklist()
            return Response(status=200, data={"msg": "Logout Successful. Do visit again"})
        else:
            return Response(status=400, data=serializer.errors)
    except Exception as ex:
        print("Internal Server Error ->", ex)
        return Response(status=500, data={"msg": "Internal Server"})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def subject(request):
    try:

        serializer = SubjectSerializer(data=request.data)

        if serializer.is_valid():
            subject_name = serializer.validated_data['subject_name']
            subject_name.lower()
            if len(Subject.objects.filter(subject_name=subject_name)) >= 1:
                return Response(status=400, data={'msg': 'Subject already exists'})
            Subject.objects.create(subject_name=subject_name,
                                   teacher_id=request.user, teacher_username=request.user.username)
            return Response(status=201, data={'msg': 'Subject query Successful'})
        else:
            return Response(status=400, data=serializer.errors)
    except Exception as ex:
        print("Internal Server Error ->", ex)
        return Response(status=500, data={"msg": "Internal Server Error"})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def enrollment(request):
    try:
        serializer = EnrollmentSerializer(data=request.data)
        if serializer.is_valid():
            print(request.data)
            subject = serializer.validated_data['subject']
            student_username = serializer.validated_data['student_username']
            queryUser = User.objects.filter(username=student_username)
            querySubject = Subject.objects.filter(subject_name=subject)
            Enrollment.objects.create(subject=querySubject[0], student_username=queryUser[0]
                                      )
            return Response(status=201, data={'msg': 'Successfully enrolled in course'})
        else:
            return Response(status=400, data=serializer.errors)
    except Exception as ex:
        print("Internal Server Error ->", ex)
        return Response(status=500, data={"msg": "Internal Server Error"})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def allclasses(request):
    objects = Subject.objects.all()
    list1 = []
    for i in range(len(objects)):
        list1.append(objects[i].subject_name)
    list2 = set(list1)
    subjects = (list(list2))
    return Response(status=200, data={"subjects": subjects})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def studentsubject(request):
    user_id = request.user
    objects1 = Enrollment.objects.filter(student_username=user_id)
    list = []
    for i in range(len(objects1)):
        list.append(objects1[i].subject.subject_name)
    return Response(status=200, data={"subjects": list})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def selectsubject(request):
    objects = Subject.objects.all()
    list1 = []
    for i in range(len(objects)):
        list1.append(objects[i].subject_name)
    list2 = set(list1)
    subjects = (list(list2))

    user_id = request.user
    objects1 = Enrollment.objects.filter(student_username=user_id)
    listx = []
    for i in range(len(objects1)):
        listx.append(objects1[i].subject.subject_name)
    selects = []
    for i in range(len(subjects)):
        if subjects[i] not in listx:
            selects.append(subjects[i])

    return Response(status=200, data={"for_selection_subjects": selects})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def myclasses(request):
    classes = Subject.objects.filter(teacher_id=request.user)
    myclasses = []
    for i in range(len(classes)):
        myclasses.append(classes[i].subject_name)
    print(myclasses)

    return Response(status=200, data={"myclasses": myclasses})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createassignment(request):
    try:
        serializer = AssignmentSerializer(data=request.data)

        if serializer.is_valid():
            name = serializer.validated_data['assg_name']
            desc = serializer.validated_data['description']
            curr_date = date.today()
            end_date = serializer.validated_data['end_date']
            subject = serializer.validated_data['subject']

            Assignments.objects.create(creator=request.user, assg_name=name,
                                       description=desc, creation_date=curr_date, end_date=end_date,
                                       subject=subject)

            return Response(status=201, data={"msg": "Assignment created successfully"})
        else:
            return Response(status=400, data=serializer.errors)
    except Exception as ex:
        print("Internal Server Error ->", ex)
        return Response(status=500, data={"msg": "Internal Server Error"})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def studentassignment(request):
    user_id = request.user
    subjects = Enrollment.objects.filter(student_username=user_id)
    sub = []
    for i in range(len(subjects)):
        sub.append(subjects[i].subject.subject_name)
    # creator, assg_name, description, creationdt ,end_dt, subject

    # assgname, subject, description, creationdt, end_dt, creator
    result = []
    for i in range(len(sub)):
        x = Assignments.objects.filter(subject=sub[i])
        for j in range(len(x)):
            temp = []
            temp.append(x[j].assg_name)
            temp.append(x[j].subject)
            temp.append(x[j].description)
            temp.append(x[j].creation_date)
            temp.append(x[j].end_date)
            temp.append(x[j].creator.first_name)
            temp.append(x[j].id)

            stat = Submission.objects.filter(
                student_name=request.user, assg_id=x[j].id)
            print(stat)
            status = False
            marks = ""
            if len(stat) > 0:
                status = True
                print(stat[0].marks)
                if stat[0].marks >= 0:
                    marks = stat[0].marks
            temp.append(status)
            temp.append(marks)
            result.append(temp)
    return Response(status=200, data=result)

# api for teacher to see his assignments
# a


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def teacherassignment(request):
    user = request.user
    result = []
    allassg = Assignments.objects.filter(creator=user)
    for i in range(len(allassg)):
        temp = []
        temp.append(allassg[i].assg_name)
        temp.append(allassg[i].subject)
        temp.append(allassg[i].description)
        temp.append(allassg[i].creation_date)
        temp.append(allassg[i].end_date)
        temp.append(allassg[i].id)
        result.append(temp)
    return Response(status=200, data=result)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def makesubmission(request):
    try:
        serializer = SubmissionSerializer(data=request.data)

        if serializer.is_valid():
            assg_id = serializer.validated_data['assg_id']
            file = serializer.validated_data['assg_file']

            Submission.objects.create(assg_id=assg_id, student_name=request.user,
                                      assg_file=file)
            return Response(status=201, data={"msg": "Assignment uploaded successfully"})
        else:
            return Response(status=400, data=serializer.errors)
    except Exception as ex:
        print("Internal Server Error ->", ex)
        return Response(status=500, data={"msg": "Internal Server Error"})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def schedule(request):
    try:
        serializer = ScheduleSerializer(data=request.data)

        if serializer.is_valid():
            subject = serializer.validated_data['subject']
            schedule_date = serializer.validated_data['schedule_date']
            start_time = serializer.validated_data['start_time']
            end_time = serializer.validated_data['end_time']
            desc = serializer.validated_data['desc']
            link = serializer.validated_data['link']

            Schedule.objects.create(creator=request.user,
                                    subject=subject,
                                    schedule_date=schedule_date,
                                    start_time=start_time,
                                    end_time=end_time,
                                    desc=desc,
                                    link=link
                                    )

            return Response(status=201, data={"msg": "Class scheduled successfully"})
        else:
            return Response(status=400, data=serializer.errors)
    except Exception as ex:
        print("Internal Server Error ->", ex)
        return Response(status=500, data={"msg": "Internal Server Error"})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def seesubmissions(request):
    try:
        serializer = SeeSubmissionSerializer(data=request.data)

        if serializer.is_valid():
            assg_id = serializer.validated_data['assg_id']
            submissions = Submission.objects.filter(assg_id=assg_id)
            url = 'https://classroom-project.s3.us-west-2.amazonaws.com/'
            result = []

            for i in range(len(submissions)):
                temp = []
                fname = submissions[i].student_name.first_name
                lname = submissions[i].student_name.last_name
                temp.append(fname + " " + lname)
                web = url + str(submissions[i].assg_file)
                temp.append(web)
                temp.append(submissions[i].id)
                marks = ""
                if submissions[i].marks >= 0:
                    marks = submissions[i].marks
                temp.append(marks)
                result.append(temp)
            return Response(status=200, data=result)
        else:
            return Response(status=400, data=serializer.errors)

    except Exception as ex:
        print("Internal Server Error ->", ex)
        return Response(status=500, data={"msg": "Internal Server Error"})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def assignmarks(request):
    try:
        serializer = AssignMarksSerializer(data=request.data)
        if serializer.is_valid():
            sub_id = serializer.validated_data['sub_id']
            marks = serializer.validated_data['marks']

            Submission.objects.filter(id=sub_id).update(marks=marks)
            return Response(status=200, data={"msg": "Marks assigned successfully"})
        else:
            return Response(status=400, data=serializer.errors)
    except Exception as ex:
        print("Internal Server Error ->", ex)
        return Response(status=500, data={"msg": "Internal Server Error"})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def studentschedule(request):
    user_id = request.user
    subjects = Enrollment.objects.filter(student_username=user_id)
    # print(subjects)
    sub = []
    for i in range(len(subjects)):
        # print(subjects[i].subject.subject_name)
        sub.append(subjects[i].subject.subject_name)
    # print(sub)
    result = []
    for i in range(len(sub)):
        x = Schedule.objects.filter(subject=sub[i])
        for j in range(len(x)):
            temp = []
            temp.append(x[j].creater.username)
            temp.append(x[j].subject)
            temp.append(x[j].schedule_date)
            temp.append(x[j].desc)
            temp.append(x[j].start_time)
            temp.append(x[j].end_time)
            temp.append(x[j].link)
            result.append(temp)
    return Response(status=200, data=result)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createtest(request):
    try:

        serializer = CreateTestSerializer(data=request.data)
        if serializer.is_valid():
            print("inside")
            name = serializer.validated_data['test_name']

            marks = serializer.validated_data['marks']
            date = serializer.validated_data['test_date']
            questions = serializer.validated_data['questions']
            duration = serializer.validated_data['duration']
            subject = serializer.validated_data['subject']
            detail = serializer.validated_data['instructions']

            Tests.objects.create(teacher_name=request.user, test_name=name, instructions=detail,
                                 test_duration=duration, max_marks=marks, test_date=date, subject=subject,
                                 questions=questions)
            return Response(status=200, data={"msg": "Test created successfully"})
        else:
            return Response(status=400, data=serializer.errors)
    except Exception as ex:
        print("Internal Server Error ->", ex)
        return Response(status=500, data={"msg": "Internal Server Error"})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def studenttest(request):
    user_id = request.user
    subjects = Enrollment.objects.filter(student_username=user_id)
    sub = []
    for i in range(len(subjects)):
        sub.append(subjects[i].subject.subject_name)

    result = []
    url = 'https://classroom-project.s3.us-west-2.amazonaws.com/'
    for j in range(len(sub)):
        tests = Tests.objects.filter(subject=sub[j])
        for i in range(len(tests)):
            temp = []
            temp.append(tests[i].test_name)
            temp.append(tests[i].subject)
            temp.append(tests[i].test_date)
            temp.append(tests[i].test_duration)
            temp.append(tests[i].max_marks)
            web = url + str(tests[i].questions)
            temp.append(web)
            temp.append(tests[i].id)
            marks = ""
            status = False
            temp2 = TestSubmission.objects.filter(
                test_id=tests[i].id, student_name=request.user)
            if len(temp2) > 0:
                status = True
                if temp2[0].marks > 0:
                    marks = temp2[0].marks
            temp.append(status)
            temp.append(marks)
            result.append(temp)
    return Response(status=200, data=result)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def testsubmission(request):
    try:
        serializer = SubmissionSerializer(data=request.data)

        if serializer.is_valid():
            test_id = serializer.validated_data['assg_id']
            file = serializer.validated_data['assg_file']

            TestSubmission.objects.create(test_id=test_id, student_name=request.user,
                                          answers_file=file)
            return Response(status=201, data={"msg": "Answers uploaded successfully"})
        else:
            return Response(status=400, data=serializer.errors)
    except Exception as ex:
        print("Internal Server Error ->", ex)
        return Response(status=500, data={"msg": "Internal Server Error"})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def testmarks(request):
    try:
        serializer = AssignMarksSerializer(data=request.data)
        if serializer.is_valid():
            test_id = serializer.validated_data['sub_id']
            marks = serializer.validated_data['marks']

            TestSubmission.objects.filter(id=test_id).update(marks=marks)
            return Response(status=200, data={"msg": "Marks assigned successfully"})
        else:
            return Response(status=400, data=serializer.errors)
    except Exception as ex:
        print("Internal Server Error ->", ex)
        return Response(status=500, data={"msg": "Internal Server Error"})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def seeanswers(request):
    try:
        serializer = SeeSubmissionSerializer(data=request.data)

        if serializer.is_valid():
            test_id = serializer.validated_data['assg_id']
            submissions = TestSubmission.objects.filter(test_id=test_id)
            url = 'https://classroom-project.s3.us-west-2.amazonaws.com/'
            result = []

            for i in range(len(submissions)):
                temp = []
                fname = submissions[i].student_name.first_name
                lname = submissions[i].student_name.last_name
                temp.append(fname + " " + lname)
                web = url + str(submissions[i].answers_file)
                temp.append(web)
                temp.append(submissions[i].id)
                marks = ""
                if submissions[i].marks >= 0:
                    marks = submissions[i].marks
                temp.append(marks)
                result.append(temp)
            return Response(status=200, data=result)
        else:
            return Response(status=400, data=serializer.errors)

    except Exception as ex:
        print("Internal Server Error ->", ex)
        return Response(status=500, data={"msg": "Internal Server Error"})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def mytests(request):
    user = request.user
    result = []
    allassg = Tests.objects.filter(teacher_name=user)
    url = 'https://classroom-project.s3.us-west-2.amazonaws.com/'
    for i in range(len(allassg)):
        temp = []
        temp.append(allassg[i].test_name)
        temp.append(allassg[i].subject)
        web = url + str(allassg[i].questions)
        temp.append(web)
        temp.append(allassg[i].test_date)
        temp.append(allassg[i].test_duration)
        temp.append(allassg[i].id)
        result.append(temp)
    return Response(status=200, data=result)


# Api to show teacher schedule
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def teacherschedule(request):
    user = request.user
    result = []
    schedule_list = Schedule.objects.filter(creator=user)
    for i in range(len(schedule_list)):
        temp = []
        temp.append(schedule_list[i].subject)
        temp.append(schedule_list[i].schedule_date)
        temp.append(schedule_list[i].start_time)
        temp.append(schedule_list[i].end_time)
        temp.append(schedule_list[i].desc)
        temp.append(schedule_list[i].link)
        result.append(temp)
    return Response(status=200, data=result)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def getschedule(request):
    user_id = request.user
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    req_subject = body['req_subject']
    if user_id.is_student:
        subjects = Enrollment.objects.filter(student_username=user_id)
        # print(subjects)
        sub = []
        for i in range(len(subjects)):
            # print(subjects[i].subject.subject_name)
            sub.append(subjects[i].subject.subject_name)
        # print(sub)
        result = []
        for i in range(len(sub)):
            x = Schedule.objects.filter(subject=sub[i])
            for j in range(len(x)):
                temp = []
                temp.append(x[j].subject)
                # temp.append(x[j].creator.username)
                temp.append(x[j].schedule_date)
                temp.append(x[j].start_time)
                temp.append(x[j].end_time)
                temp.append(x[j].desc)
                temp.append(x[j].link)
                if x[j].subject == req_subject:
                    result.append(temp)
        return Response(status=200, data=result)
    else:
        result = []
        schedule_list = Schedule.objects.filter(creator=user_id)
        for i in range(len(schedule_list)):
            temp = []
            temp.append(schedule_list[i].subject)
            temp.append(schedule_list[i].schedule_date)
            temp.append(schedule_list[i].start_time)
            temp.append(schedule_list[i].end_time)
            temp.append(schedule_list[i].desc)
            temp.append(schedule_list[i].link)
            if schedule_list[i].subject == req_subject:
                result.append(temp)
        return Response(status=200, data=result)
