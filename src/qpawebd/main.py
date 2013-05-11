import tornado.ioloop
import tornado.web
import jobs



application = tornado.web.Application([
    (r"^/jobs(?:/(\d+))?$", jobs.JobHandler),
])

def main():
    application.listen(1882)
    tornado.ioloop.IOLoop.instance().start()


if __name__ == "__main__":
    main()
