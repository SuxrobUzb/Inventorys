from django.urls import path
from . import views

app_name = 'inventory'

urlpatterns = [
    path('', views.ProductList.as_view(), name='product_list'),
    path('product/<int:pk>/', views.ProductDetail.as_view(), name='product_detail'),
    path('inventory-numbers/', views.InventoryNumberList.as_view(), name='inventory_number_list'),
    path('inventory-numbers/<int:pk>/', views.InventoryNumberDetail.as_view(), name='inventory_number_detail'),
    path('logout/blacklist/', views.BlackListTokenUpdateView.as_view(), name='blacklist'),
]