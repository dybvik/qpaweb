import qpawebd
import jsonschema

class FindDimension(qpawebd.gap.Command):
    
    schema = {
        "type": "object",
        "additionalProperties": False,
        "properties": {
            "field": {},
            "quiver": {},
            "relations": {}
        }
        
    }

    def __init__(self, job, jobHandler):
        self.job = job
        self.jobHandler = jobHandler
        self.field = qpawebd.gap.getField("K", job["field"])
        self.quiver = qpawebd.operations.Quiver("Q", job["quiver"])
        self.pathalg = qpawebd.operations.PathAlgebra("KQ", "K", "Q")
        self.relations = qpawebd.operations.Relations("rels", job["relations"])
        self.quotalg = qpawebd.operations.QuotAlgebra("A", "KQ", "rels")
        self.dimension = qpawebd.operations.Dimension("D", "A")

    def execute(self, gap):
        
        self.dimension.onResult = self.fromGap
        self.dimension.toGap(gap)

    def fromGap(self):
        self.jobHandler.reportResult(job.id, self.dimension.value)
    
    def validate(self, job):
        jsonschema.validate(schema, job)
