import sqlite3
import sys

class QPADatabase:
  def __init__(self, con=None):
    self.con = con

  def FirstMethod(self):
    try:
      self.con = sqlite3.connect('database.sqlite')
      cur = self.con.cursor()
      cur.execute('SELECT SQLITE_VERSION()')
      data = cur.fetchone()
      print("SQLite version: %s" % data)
    except sqlite3.Error as e:
      print("Error %s:" % e.args[0])
      sys.exit(1)
    finally:
      if self.con:
        self.con.close()
