from django.shortcuts import render

def loadmain(request):
	return render(request, 'stockprice.html')
