import tornado.ioloop
import tornado.web
import urllib
from lib import JSONGAPTranslate as JT

class MainHandler(tornado.web.RequestHandler):
    def post(self):
        self.JT = JT.JSONGAPTranslate()
        name = self.JT.ToGAP(self.get_argument('debug'))
        self.write("JobbID: " + self.get_argument('jobID'))
        self.write(name)


application = tornado.web.Application([
    (r"/", MainHandler),
    ])

if __name__ == "__main__":
    application.listen(8888)
    tornado.ioloop.IOLoop.instance().start()