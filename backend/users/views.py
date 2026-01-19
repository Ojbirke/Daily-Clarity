from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(['POST'])
def login_view(request):
    return Response({'message': 'Login endpoint - premium feature'}, status=status.HTTP_501_NOT_IMPLEMENTED)

@api_view(['POST'])
def register_view(request):
    return Response({'message': 'Register endpoint - premium feature'}, status=status.HTTP_501_NOT_IMPLEMENTED)
