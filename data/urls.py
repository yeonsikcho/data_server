from django.urls import path

import data.views.stockprice as spv 
import data.views.tdi12 as tdi12v 

app_name = 'data'

urlpatterns = [
	path('', spv.loadmain),
	#Stockprice Related Links
	path('stockprice/', spv.loadmain, name='stockprice'),
	path('spvget_companylist/', spv.get_companylist, name='spvget_companylist'),
	path('spvget_prices/', spv.get_prices, name='spvget_prices'),
	path('spvcreate_data/', spv.create_data, name='spvcreate_data'),
	path('spvdownload_data/', spv.download_data, name='spvdownload_data'),

	#The data incabuator 12 day related links
	path('tdi12/', tdi12v.loadmain, name='tdi12'),
	path('tdi12vkeyword_search/', tdi12v.keyword_search, name='tdi12vkeyword_search'),
	path('tdi12vshow_plot/', tdi12v.show_plot, name='tdi12vshow_plot'),
]