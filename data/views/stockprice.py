from django.shortcuts import render
from django.http import JsonResponse, HttpResponse, Http404
from data.static.dbcon import get_con
import json
import pandas as pd
import os
import uuid

def loadmain(request):
	return render(request, 'stockprice.html')

def get_companylist(request):
	con, cursor = get_con()
	cursor.execute("select * from eric.companylist")
	result = cursor.fetchall()
	companylist = [f"{r[0]}: {r[1]}" for r in result]
	con.close()
	return JsonResponse({'companylist':companylist})

def get_prices(request):
	stock_list = json.loads(request.GET.get('stock_list',None))
	start_dt, end_dt = json.loads(request.GET.get('dates',None))
	con, cursor = get_con()
	for i,stockid in enumerate(stock_list[1:]):
		cursor.execute("select tradedate, cls_prc from valuation.stockprices where isu_cd = %s and tradedate>=%s and tradedate<=%s", [stockid, start_dt, end_dt])
		if i == 0:
			df = pd.DataFrame(list(cursor.fetchall()), columns = ['tradedate', stockid])
		else:
			df = pd.merge(df, pd.DataFrame(list(cursor.fetchall()), columns = ['tradedate', stockid]), how = "outer", on = "tradedate")
	prices = [stock_list]+df.values.tolist()
	con.close()
	return JsonResponse({'prices':prices})
	

def create_data(request):
	scope, frequency, format = json.loads(request.GET.get('parameters',None))[0]
	start_dt, end_dt = json.loads(request.GET.get('download_dates',None))[0]
	column_map = {'Opening Price':'open_prc','Low Price':'low_prc','High Price':'high_prc','Closing Price':'cls_prc','Adjusted Closing Price':'adj_prc','Shares Outstanding':'list_stock_vol'}
	columns = ['isu_cd','tradedate']
	for select, item in json.loads(request.GET.get('parameters2',None)):
		if select:
			columns.append(column_map[item])
	conditions = []
	if start_dt:
		conditions.append(f"tradedate >= '{start_dt}'")
	if end_dt:
		conditions.append(f"tradedate <= '{end_dt}'")
	if scope == 'KOSPI':
		conditions.append(f"exchange = 'STK'")
	if scope == 'KOSDAQ':
		conditions.append(f"exchange = 'KSQ'")
	if frequency == "monthly":
		conditions.append(f"month_end = 1")
	if frequency == "yearly":
		conditions.append(f"year_end = 1")
	con, cursor = get_con()
	cursor.execute(f"select {', '.join(columns)} from valuation.stockprices where {' and '.join(conditions)}")
	df = pd.DataFrame(list(cursor.fetchall()), columns = columns)
	if format == "csv":
		filename = str(uuid.uuid1())+".csv"
		df.to_csv(f"files/{filename}", index = False)
	if format == "excel":
		filename = str(uuid.uuid1())+".xlsx"
		df.to_excel(f"files/{filename}", index = False)
	con.close()
	return JsonResponse({'filename':filename})
	
def download_data(request):
	file_path = "files/"+request.GET.get('path',None)
	ext = file_path.split(".")[1]
	print(file_path)
	if os.path.exists(file_path):
		with open(file_path, 'rb') as fh:
			response = HttpResponse(fh.read(), content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
			response['Content-Disposition'] = f'attachment; filename="Stock_Prices.{ext}"'
			return response
	raise Http404