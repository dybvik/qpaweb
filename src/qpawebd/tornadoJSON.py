import pprint
import tornado.ioloop
import tornado.web
import tornado.escape
import urllib
import json

from src.lib import JSONGAPTranslate as JT

class PostDemo(tornado.web.RequestHandler):
    def post(self):
        self.JT = JT.JSONGAPTranslate()
        name = self.JT.ToGAP(self.get_argument('debug'))
        self.write("JobbID: " + self.get_argument('jobID'))
        self.write(name)

## Slå hovedgreiene i Expose og ExposeJS sammen
class Expose(tornado.web.RequestHandler):
    def get(self):
        self.JT = JT.JSONGAPTranslate()
        self.write(json.dumps(self.JT.Expose(),
                              sort_keys=True,
                              indent=4,
                              separators=(',', ': ')))
        self.set_header("Content-Type", "application/JSON")

class ExposeJS(tornado.web.RequestHandler):
    def get(self):
        self.JT = JT.JSONGAPTranslate()
        self.write("var expose = " + json.dumps(self.JT.Expose(),
                                                sort_keys=True,
                                                indent=4,
                                                separators=(',', ': ')) + ";")
        self.set_header("Content-Type", "application/javascript")


class ExposeJSONP(tornado.web.RequestHandler):
    def get(self):
        self.JT = JT.JSONGAPTranslate()
        self.write('capabilities(' +json.dumps(self.JT.Expose(),
                                           sort_keys=True,
                                           indent=4,
                                           separators=(',', ': ')) + ')')
        self.set_header("Content-Type", "application/javascript; charset=utf-8")

class DumpPost(tornado.web.RequestHandler):
    def post(self):
        self.write("<pre>"+tornado.escape.url_unescape(self.request.body,'utf-8')+"</pre>")

application = tornado.web.Application([
    (r"/", PostDemo),
    (r"/exposeJSON/", Expose),
    (r"/exposeJS/", ExposeJS),
    (r"/exposeJSONP/", ExposeJSONP),
    (r"/dump/",DumpPost),
    ])

if __name__ == "__main__":
    application.listen(8888)
    tornado.ioloop.IOLoop.instance().start()