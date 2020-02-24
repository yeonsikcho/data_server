from django.urls import path

import data.views.stockprice as spv 


app_name = 'data'

urlpatterns = [
	path('', spv.loadmain),
	#Stockprice Related Links
	path('stockprice/', spv.loadmain, name='stockprice'),
	path('spvget_companylist/', spv.get_companylist, name='spvget_companylist'),
	path('spvget_prices/', spv.get_prices, name='spvget_prices'),
	path('spvcreate_data/', spv.create_data, name='spvcreate_data'),
	path('spvdownload_data/', spv.download_data, name='spvdownload_data'),

]