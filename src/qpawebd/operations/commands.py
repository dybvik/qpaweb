import qpawebd
import jsonschema
from qpawebd.operations import base
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
        self.field = qpawebd.gap.getField(self.job.data["field"])("K")
        self.quiver = base.Quiver("Q", self.job.data["quiver"])
        self.pathalg = base.PathAlgebra("KQ", "K", "Q")
        self.relations = base.Relations("rels", "KQ", self.job.data["relations"])
        self.quotalg = base.QuotAlgebra("A", "KQ", "rels")
        self.dimension = base.Dimension("D", "A")

    def fromGap(self):
        self.jobHandler.reportResult(self.job.id, self.dimension.value)
    
    def toGap(self, gap):
        print("FINDDIM toGap")
        self.dimension.onResult = self.fromGap
        self.quiver.toGap(gap)
        self.field.toGap(gap)
        self.pathalg.toGap(gap)
        self.relations.toGap(gap)
        self.quotalg.toGap(gap)
        self.dimension.toGap(gap)


    def validate(self, job):
        jsonschema.validate(schema, job)
