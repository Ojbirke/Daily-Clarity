from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(['GET'])
def get_summary(request):
    return Response({'message': 'Stats endpoint - premium feature'}, status=status.HTTP_501_NOT_IMPLEMENTED)
