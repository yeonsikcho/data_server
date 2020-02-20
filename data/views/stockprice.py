from django.shortcuts import render
from django.http import JsonResponse
from data.static.dbcon import get_con
import json
import pandas as pd

def loadmain(request):
	return render(request, 'stockprice.html')

def get_companylist(request):
	con, cursor = get_con()
	cursor.execute("select * from companylist")
	result = cursor.fetchall()
	companylist = [f"{r[0]}: {r[1]}" for r in result]
	con.close()
	return JsonResponse({'companylist':companylist})

def get_prices(request):
	stock_list = json.loads(request.GET.get('stock_list',None))
	start_dt, end_dt = json.loads(request.GET.get('dates',None))
	con, cursor = get_con()
	for i,stockid in enumerate(stock_list[1:]):
		cursor.execute("select tradedate, cls_prc from stockprices where isu_cd = %s and tradedate>=%s and tradedate<=%s", [stockid, start_dt, end_dt])
		if i == 0:
			df = pd.DataFrame(list(cursor.fetchall()), columns = ['tradedate', stockid])
		else:
			df = pd.merge(df, pd.DataFrame(list(cursor.fetchall()), columns = ['tradedate', stockid]), how = "outer", on = "tradedate")
	prices = [stock_list]+df.values.tolist()
	return JsonResponse({'prices':prices})