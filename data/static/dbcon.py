import MySQLdb as sql

def get_con():
	con = sql.connect(host="eric-cho.com", port=3308, database="echo_blog", user="eric", password="1127ychL!", charset="utf8")
	cursor = con.cursor()
	return con, cursor