from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from djmoney.models.fields import MoneyField

class Product(models.Model):
    product_name = models.CharField(max_length=100)
    price = MoneyField(max_digits=14, decimal_places=2, default=0.00, default_currency='PHP')
    description = models.CharField(max_length=200, null=True)

    def __str__(self):
        return self.product_name

    @property
    def quantity(self):
        return self.inventory_numbers.count()

class InventoryNumber(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='inventory_numbers')
    inventory_number = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.inventory_number} ({self.product.product_name})"

    class Meta:
        verbose_name = "Inventory Number"
        verbose_name_plural = "Inventory Numbers"