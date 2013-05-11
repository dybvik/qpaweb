import qpawebd

class FindDimension(qpawebd.gap.Command):
    
    def __init__(self, job, name=None):
        field = job["field"]
        quiver = job["quiver"]
        relations = job["relations"]
        self.quotalg = QuotAlgebra(PathAlgebra(quiver, field, name="KQ", name="A"), relations)

    def toGap(self, gap):
        self.quotalg.toGap(gap)
        gapstr = []
        
        gap.write("")

    def fromGap(self):
