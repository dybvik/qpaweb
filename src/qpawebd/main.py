import tornado.ioloop
import tornado.web
import platform
_p = platform.system()
if (_p!='Windows'):
  import qpawebd.gap
else:
  import gapwebd.gapWindows

import qpawebd.jobs
#import qpawebd.tornadoJSON

application = tornado.web.Application([
    (r"^/jobs(?:/(\d+))?$", qpawebd.jobs.JobWebHandler, dict(jobserver=qpawebd.jobs.JobServer(1))),
    ##(r"/exposeJSONP/", qpawebd.tornadoJSON.ExposeJSONP), # Denne må integreres på en annen plass/måte!
])

def main():
    qpawebd.gap.loadgapcom()
    application.listen(1882)
    tornado.ioloop.IOLoop.instance().start()


if __name__ == "__main__":
    main()
