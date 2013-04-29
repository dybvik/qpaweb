import tornado.ioloop
import tornado.web
import urllib
from src.lib import JSONGAPTranslate as JT

class PostDemo(tornado.web.RequestHandler):
    def post(self):
        self.JT = JT.JSONGAPTranslate()
        name = self.JT.ToGAP(self.get_argument('debug'))
        self.write("JobbID: " + self.get_argument('jobID'))
        self.write(name)

class Expose(tornado.web.RequestHandler):
    def get(self):
        self.write("placeholder for JSON")

application = tornado.web.Application([
    (r"/", PostDemo),
    (r"/expose/", Expose),
    ])

if __name__ == "__main__":
    application.listen(8888)
    tornado.ioloop.IOLoop.instance().start()