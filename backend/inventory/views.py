from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Product, InventoryNumber
from .serializers import ProductSerializer, InventoryNumberSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        return token

class ProductList(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def list(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        total_count = queryset.count()
        response_data = {
            'total_items': total_count,
            'products': serializer.data,
        }
        return Response(response_data)

    def perform_create(self, serializer):
        product = serializer.save()
        inventory_numbers = self.request.data.get('inventory_numbers', [])
        for number in inventory_numbers:
            InventoryNumber.objects.create(
                product=product,
                inventory_number=number
            )

class ProductDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def perform_update(self, serializer):
        product = serializer.save()
        inventory_numbers = self.request.data.get('inventory_numbers', [])
        # Delete existing inventory numbers and replace with new ones
        product.inventory_numbers.all().delete()
        for number in inventory_numbers:
            InventoryNumber.objects.create(
                product=product,
                inventory_number=number
            )

class InventoryNumberList(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = InventoryNumber.objects.all()
    serializer_class = InventoryNumberSerializer

class InventoryNumberDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = InventoryNumber.objects.all()
    serializer_class = InventoryNumberSerializer

class BlackListTokenUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data['refresh_token']
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)

def get_total_item():
    return Product.objects.count()