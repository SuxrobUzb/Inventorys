from django.contrib import admin
from . import models

@admin.register(models.Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'product_name', 'price', 'quantity', 'description')

@admin.register(models.InventoryNumber)
class InventoryNumberAdmin(admin.ModelAdmin):
    list_display = ('inventory_number', 'product', 'created_at')
    list_filter = ('product',)
    search_fields = ('inventory_number', 'product__product_name')