import MySQLdb as sql

def get_con():
	con = sql.connect(host="eric-cho.com", port=3308, database="echo_blog", user="user_id", password="user_pw", charset="utf8")
	cursor = con.cursor()
	return con, cursor