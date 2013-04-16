#!/usr/bin/env python
import os
import tornado.httpserver
import tornado.ioloop
import tornado.web
import subprocess
import sys


class MainHandler(tornado.web.RequestHandler):
    @tornado.web.asynchronous
    def get(self):
        self.ioloop = tornado.ioloop.IOLoop.instance()
        self.pipe = p = subprocess.Popen(["C:\\gap4r6\\bin\gapw95.exe l- /cygdrive/c/gap4r6"],
                                         stdout=subprocess.PIPE)
        self.output = p.communicate()[0]
        self.ioloop.add_handler(0, self.async_callback(self.on_response), self.ioloop.READ)
        p.wait()
        p.stdout.read()


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