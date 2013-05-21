import tornado.web
import json
from jsonschema import validate
import qpawebd.gap

schema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "properties": {
        "job": {
            "type": "object",
            "properties": {
                "command": {type: "string"},
                "quiver":  {
                    "type": "object",
                    "properties": {
                        "vertices": {},
                        "arrows": {},
                    }},
                "relations": {},
                "field": {"enum": ["Rationals"]},
            },
            "required": ["command"]}},
}


class Job():
    data = None
    valid = False
    id = None
    timeout = 0
    done = False
    command = None

    def __init__(self, data, id = None):
        self.data = data
        self.id = id

class JobWebHandler(tornado.web.RequestHandler):
    def initialize(self, jobserver):
        self.server = jobserver
        
    def get(self, jobid):
        print("GET")
        self.set_header("Access-Control-Allow-Origin", "*")
        if not jobid:
            jobs_done = []
            jobs = []
            for job in self.server.jobs.items():
                jobs.append(job[1].id)
                if job[1].done:
                    jobs_done.append(job[1].id)
            output = {
                "jobs": jobs,
                "jobs_done": jobs_done
            }
            self.write(json.dumps(output))
        else:
            jobdata = {}
            print(str(self.server.jobs))
            if not self.server.jobs.get(int(jobid)):
                self.set_status(404)
                self.write("")
                return
            else:
                jobdata["job"] = self.server.jobs[int(jobid)].data
                if self.server.jobs[int(jobid)].done:
                    jobdata["result"] = self.server.jobs[int(jobid)].result
                self.write(json.dumps(jobdata))
    
    def post(self, d):
#        if qpawebd.settings.mode != "master":
#            self.set_status(http.client.METHOD_NOT_ALLOWED)
#            return
        jobstring = self.request.body# = self.get_argument("job")
        print(jobstring)
        jobdata = json.loads(str(jobstring, "utf-8"))

        job = self.server.addJob(jobdata)
        if job:
            output = {}
            output["job"] =  job.data;
            self.write(output)
        self.set_header("Content-Type", "text/json");
        self.set_header("Access-Control-Allow-Origin", "*")

    def put(self):
        job = Job()
        
    def options(self, d):
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        self.set_header("Access-Control-Allow-Headers", "origin, x-csrftoken, content-type, accept")
        self.write("")


class JobServer():
    jobs = {}
    processes = []
    processes_ready = []
    num_proc_ready = 0
    nextid = 0
    def __init__(self, num_proc, callback = None):
        for i in range(0, num_proc):
            process = qpawebd.gap.Process()
            process.start()
            self.processes.append(process)
        self.num_proc_ready = num_proc
        self.processes_ready = list(self.processes)
        self.callback = callback


    def ready(self):
        return num_proc_ready > 0
        
    def addJob(self, jobdata):
        if self.num_proc_ready > 0:
            cmd = qpawebd.gap.getCommand(jobdata["job"]["command"])
            proc = None
            for p in self.processes:
                if p.ready():
                    proc = p
            if proc == None:
                print("NONE READY")
                return False
            jobdata["job"]["id"] = self.nextid
            job = Job(jobdata["job"], self.nextid)

            self.nextid+=1
            self.jobs[job.id] = job

            job.command = cmd(job, self)
            job.command.toGap(proc)
            return job
        else:
            return False

    def reportResult(self, jobid, data):
        #del self.jobs[jobid]
        self.jobs[jobid].done = True
        self.jobs[jobid].result = data
        del self.jobs[jobid].command
        self.num_proc_ready += 1
        
        

class SlaveJobServer(JobServer):
    def __init__(self, num_proc):
        super().__init__(num_proc, self.postResult)
        

    def reportResult(self, jobid, data):
        job = self.jobs[jobid]
        super().reportResult(jobid, data)
        httpclient = tornado.httpclient.AsyncHTTPClient()
        rbody = {
            "job": { "id": jobid},
            "result": {
                "value": data
            }
        }
        req = tornado.httpclient.HTTPRequest(qpawebd.settings.master+"/jobs/"+str(jobid), method="PUT", body=rbody) 
        #TODO: add callback to fetch for error handling
        httpclient.fetch(req)
        
