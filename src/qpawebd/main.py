import tornado.ioloop
import tornado.web
import jobs
import qpawebd.gap
import qpawebd.jobs

application = tornado.web.Application([
    (r"^/jobs(?:/(\d+))?$", qpawebd.jobs.JobWebHandler, dict(jobserver=qpawebd.jobs.JobServer(1))),
])

def main():
    qpawebd.gap.loadgapcom()
    application.listen(1882)
    tornado.ioloop.IOLoop.instance().start()


if __name__ == "__main__":
    main()
