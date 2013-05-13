#!/usr/bin/env python
# *-* coding: utf-8 -*-

import sqlite3

class SettingsManager:
    def __init__(self, dbname):
        self.con = None
        self.cur = None

        try:
            self.con = sqlite3.connect(dbname)
            self.cur = self.con.cursor()

            self._init_tables()
        except (sqlite3.Error) as e:
            if self.con:
                self.con.rollback()

            self.close()

            raise sqlite3.Error(e)

    def __del__(self):
        self.close()

    def _init_tables(self):
        self.cur.execute("CREATE TABLE IF NOT EXISTS QuizSettings ( \
                            ID INTEGER PRIMARY KEY, \
                            Key TEXT, \
                            Value TEXT \
                          )")

        self.con.commit()

    def _write(self, sql, *args):
        try:
            self.cur.execute(sql, *args)
            self.con.commit()
        except (sqlite3.Error) as e:
            if self.con:
                self.con.rollback()

            self.close()

            raise sqlite3.Error(e)

    def _read(self, sql, *args):
        try:
            self.cur.execute(sql, *args)
            self._result = self.cur.fetchall()
        except (sqlite3.Error) as e:
            if self.con:
                self.con.rollback()

            self.close()

            raise sqlite3.Error(e)

        return self._result

    def close(self):
        if self.con:
            self.con.close()

    def setSetting(self, key, value):
        if self.getSetting(key):
            self._write("UPDATE QuizSettings SET Value=? WHERE Key=?", [value, key])
        else:
            self._write("INSERT INTO QuizSettings VALUES (NULL, ?, ?)", [key, value])

    def getSetting(self, key):
        result = self._read("SELECT Value FROM QuizSettings WHERE Key=?", [key])
        if result:
            return result[0][0]
        else:
            return ""

    def remSetting(self, key):
        if self.getSetting(key):
            self._write("DELETE FROM QuizSettings WHERE Key=?", [key])

def main():
    dbname = 'settings.db'

    settingsManager = SettingsManager(dbname)
    #settingsManager.setSetting(u'path', u'Nice try')
    path = settingsManager.getSetting('working_dir')
    if path:
        print("Jadda")
        print(path.encode('utf_8'))
    else:
        print("Neida")

        #settingsManager.remSetting(u"path")

if __name__ == "__main__":
    main()