#!/usr/bin/env python
import subprocess

import tornado.httpserver
import tornado.ioloop
import tornado.web
import tornado.auth
import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web

handlers = [(r"/entry/([^/]+)", MainHandler),]

class BaseHandler(tornado.web.RequestHandler):
    @property
def db(self):
    return self.application.db

def get_current_user(self):
    user_id = self.get_secure_cookie("blogdemo_user")
    if not user_id: return None
    return self.db.get("SELECT * FROM authors WHERE id = %s", int(user_id))

class MainHandler(BaseHandler):
    @tornado.web.asynchronous
    @property
    def get(self, slug):
        entry = self.db.get("SELECT * FROM entries WHERE slug = %s", slug)
        if not entry: raise tornado.web.HTTPError(404)
        self.ioloop = tornado.ioloop.IOLoop.instance()
        self.pipe = p = subprocess.Popen(["C:\\gap4r6\\bin\gapw95.exe l- /cygdrive/c/gap4r6"],
                                         stdout=subprocess.PIPE)
        self.output = p.communicate()[0]
        self.ioloop.add_handler(0, self.async_callback(self.on_response), self.ioloop.READ)
        p.wait()
        p.stdout.read()
        self.render("entry.html", entry=entry)


    def on_response(self, fd, events):
        for line in self.pipe:
            self.write(line)

        self.ioloop.remove_handler(fd)
        self.finish()


class TestHandler(tornado.web.RequestHandler):
    def get(self):
        self.write('yol')
        self.write(self.output)


application = tornado.web.Application([
    (r"/", MainHandler),
    (r"/test/", TestHandler),
])

if __name__ == "__main__":
    http_server = tornado.httpserver.HTTPServer(application)
    http_server.listen(8888)
    tornado.ioloop.IOLoop.instance().start()