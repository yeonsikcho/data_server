from django.urls import path

import data.views.stockprice as spv 

urlpatterns = [
    path('stockprice/', spv.loadmain, name='index'),
]