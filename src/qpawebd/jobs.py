import tornado.web
import json
from jsonschema import validate
import gap

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

class JobHandler(tornado.web.RequestHandler):
    jobs = {}
    nextid = 0

    def initialize(self, jobserver):
        self.server = jobserver
    def get(self, jobid):
        self.write("no jobs yet")
    
    def post(self):
        jobstring = self.get_argument("job")
        job = json.loads(jobstring)
        validate(job, schema)
        
        
class JobServer():
    job = None
    def __init__(self):
        self.process = gap.process()

    def ready(self):
        return self.process.poll()
        
    def addJob(self, job):
        if self.job == None:
            self.job = job
            return True
        else:
            return False


