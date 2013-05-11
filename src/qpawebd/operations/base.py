import qpawebd

import jsonschema
import re


class Quiver(qpawebd.gap.data):
    schema = {
        "type": "object",
        "properties": {
            "arrows": {
                "type": "object",
                "additionalProperties": {
                    "type": "object",
                    "properties": {
                        "from": {"type": "string"},
                        "to": {"type": "string"},
                    },
                    "additionalProperties": False,
                },
                "vertices": {
                    "type": "array",
                    "items": { "type": "string"}
                },
            }
        },
        "required": ["arrows", "vertices"],
        "additionalProperties": False
    }
    nvertices = 0
    narrows = 0
    def __init__(self, name, quiver):
        self.name = name
        self.quiver = quiver
        if not self.validate(quiver):
            raise CommandValidationError()

    def toGAP(self):
        name = self.name
        qlist = [name, " := Quiver(["]
        for vertex in self.quiver["vertices"]:
            qlist.extend(["\"", vertex, "\""])
            self.nvertices += 1
        qlist.append("],[")
        for arrowname, arrow in self.quiver["arrows"].items():
            qlist.extend(["[\"", arrow["from"], "\",\"", arrow["to"], "\",\"", arrowname, "\"],"])
            self.narrows += 1
        qlist.append("]);")
        qapstr = "".join(qlist)
        return gapstr
        
    def fromGap(self, data):
        m = re.match(r"<quiver width (\d+) vertices and (\d+) arrows>", data)
        if m == None:
            return False
        if m.groups(1) != self.nvertices || m.groups(2) != self.narrows:
            return False
        else:
            return True
    def validate(self, quiver):
        try:
            jsonschema.validate(quiver, self.schema)
            for key, val in quiver.arrows.items():
                if val.from not in quiver.vertices or val.to not in quiver.vertices:
                    return False
            return True
        except jsonschema.ValidationError:
            return False


class PathAlgebra(qpawebd.gap.data):
    def __init__(self, name, field, quiver):
        self.name = name
        self.field = field

    def toGap(self):
        name = self.name
        gapstr = "".join([name, " := PathAlgebra(", self.field, ", ", quiver, ");"])
        return gapstr
        

class QuotAlgebra(qpawebd.gap.data):
    
    def __init__(self, name, quiver, field, relations):
        
