from rest_framework import serializers
from .models import Product, InventoryNumber

class InventoryNumberSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryNumber
        fields = ('id', 'inventory_number', 'created_at')

class ProductSerializer(serializers.ModelSerializer):
    quantity = serializers.IntegerField(source='inventory_numbers.count', read_only=True)
    inventory_numbers = InventoryNumberSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = ('id', 'product_name', 'price', 'quantity', 'description', 'inventory_numbers')