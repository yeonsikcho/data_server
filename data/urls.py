from django.urls import path

import data.views.stockprice as spv 

app_name = 'data'

urlpatterns = [
	path('', spv.loadmain),
	path('stockprice/', spv.loadmain, name='stockprice'),
]