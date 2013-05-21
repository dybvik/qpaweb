import qpawebd
import qpawebd.gap
import jsonschema
import re

class Quiver(qpawebd.gap.data):
    schema = {
        "type": "object",
        "properties": {
            "arrows": {
                "type": "object",
                "properties": {},
                "additionalProperties": {
                    "type": "object",
                    "properties": {
                        "from": {"type": "string"},
                        "to": {"type": "string"},
                    },
                    "additionalProperties": False,
                },
                
            },
            "vertices": {
                "type": "array",
                "additionalItems": { "type": "string"}
            }
        },
        "required": ["arrows", "vertices"],
        "additionalProperties": False,
    }
    nvertices = 0
    narrows = 0
    def __init__(self, name, quiver):
        self.name = name
        self.quiver = quiver
        if not self.validate(quiver):
            print(str(quiver))
            raise qpawebd.gap.CommandValidationError()

    def toGap(self, gap):
        name = self.name
        qlist = [name, " := Quiver(["]
        for vertex in self.quiver["vertices"]:
            qlist.extend(["\"", vertex, "\","])
            self.nvertices += 1
        qlist.append("],[")
        for arrowname, arrow in self.quiver["arrows"].items():
            qlist.extend(["[\"", arrow["from"], "\",\"", arrow["to"], "\",\"", arrowname, "\"],"])
            self.narrows += 1
        qlist.append("]);")
        gapstr = "".join(qlist)
        print("QUIVER WRITE")
        gap.write(gapstr)
        
    def fromGap(self, data):
        m = re.match(r"<quiver width (\d+) vertices and (\d+) arrows>", data)
        if m == None:
            return False
        if m.groups(1) != self.nvertices or m.groups(2) != self.narrows:
            return False
        else:
            return True
    def validate(self, quiver):
        #try:
            jsonschema.validate(quiver, self.schema)
            for key, val in quiver["arrows"].items():
                if val["from"] not in quiver["vertices"] or val["to"] not in quiver["vertices"]:
                    return False
            return True
        #except jsonschema.ValidationError:
            return False

    def hasVertex(self, vertexName):
        return vertexName in self.quiver["vertices"]

class SimpleModule(qpawebd.gap.data):
    schema = {
        "type": "object",
        "properties": {
            "arrows": {
                "type": "object",
                "properties": {},
                "additionalProperties": {
                    "type": "object",
                    "properties": {
                        "from": {"type": "string"},
                        "to": {"type": "string"},
                        },
                    "additionalProperties": False,
                    },

                },
            "vertices": {
                "type": "array",
                "additionalItems": { "type": "string"}
            }
        },
        "required": ["arrows", "vertices"],
        "additionalProperties": False,
        }
    nvertices = 0
    narrows = 0
    def __init__(self, name, module):
        self.name = name
        self.module = module
        if not self.validate(module):
            print(str(module))
            raise qpawebd.gap.CommandValidationError()

    def toGap(self, gap):
        name = self.name
        qlist = [name, " := Quiver(["]
        for vertex in self.quiver["vertices"]:
            qlist.extend(["\"", vertex, "\","])
            self.nvertices += 1
        qlist.append("],[")
        for arrowname, arrow in self.quiver["arrows"].items():
            qlist.extend(["[\"", arrow["from"], "\",\"", arrow["to"], "\",\"", arrowname, "\"],"])
            self.narrows += 1
        qlist.append("]);")
        gapstr = "".join(qlist)
        print("QUIVER WRITE")
        gap.write(gapstr)

    def fromGap(self, data):
        m = re.match(r"<quiver width (\d+) vertices and (\d+) arrows>", data)
        if m == None:
            return False
        if m.groups(1) != self.nvertices or m.groups(2) != self.narrows:
            return False
        else:
            return True
    def validate(self, quiver):
    #try:
        jsonschema.validate(quiver, self.schema)
        for key, val in quiver["arrows"].items():
            if val["from"] not in quiver["vertices"] or val["to"] not in quiver["vertices"]:
                return False
        return True
        #except jsonschema.ValidationError:
        return False

class RightModule(qpawebd.gap.data):
    schema = {
        "type": "object",
        "properties": {
            "arrows": {
                "type": "object",
                "properties": {},
                "additionalProperties": {
                    "type": "object",
                    "properties": {
                        "from": {"type": "string"},
                        "to": {"type": "string"},
                        },
                    "additionalProperties": False,
                    },

                },
            "vertices": {
                "type": "array",
                "additionalItems": { "type": "string"}
            }
        },
        "required": ["arrows", "vertices"],
        "additionalProperties": False,
        }
    nvertices = 0
    narrows = 0
    def __init__(self, name, module):
        self.name = name
        self.module = module
        if not self.validate(module):
            print(str(module))
            raise qpawebd.gap.CommandValidationError()

    def toGap(self, gap):
        name = self.name
        qlist = [name, " := Quiver(["]
        for vertex in self.quiver["vertices"]:
            qlist.extend(["\"", vertex, "\","])
            self.nvertices += 1
        qlist.append("],[")
        for arrowname, arrow in self.quiver["arrows"].items():
            qlist.extend(["[\"", arrow["from"], "\",\"", arrow["to"], "\",\"", arrowname, "\"],"])
            self.narrows += 1
        qlist.append("]);")
        gapstr = "".join(qlist)
        print("QUIVER WRITE")
        gap.write(gapstr)

    def fromGap(self, data):
        m = re.match(r"<quiver width (\d+) vertices and (\d+) arrows>", data)
        if m == None:
            return False
        if m.groups(1) != self.nvertices or m.groups(2) != self.narrows:
            return False
        else:
            return True
    def validate(self, quiver):
    #try:
        jsonschema.validate(quiver, self.schema)
        for key, val in quiver["arrows"].items():
            if val["from"] not in quiver["vertices"] or val["to"] not in quiver["vertices"]:
                return False
        return True
        #except jsonschema.ValidationError:
        return False


class Rationals(qpawebd.gap.Field):
    schema = {
        "type": "object",
        "properties": {
            "type": {
                "type": "string",
                "oneOf": ["rationals"]
            }
        }
    }

    def __init__(self, field):
        self.field = field
        
    def toGap(self, gap):
        gap.write("K := Rationals;")

    def fromGap(self, data):
        if data != "Rationals":
            return False
        else:
            return True
    
    def validate(self, field):
        jsonschema.validate(field, self.schema)
        return True

class GaloisField(qpawebd.gap.Field):
    schema = {
        "type": "object",
        "properties": {
            "type": {
                "type": "string",
                "oneOf": ["galois"]
            }
        }
    }

    def __init__(self, field):
        self.field = field

    def toGap(self, gap):
        gap.write("K := Rationals;")

    def fromGap(self, data):
        if data != "Rationals":
            return False
        else:
            return True

    def validate(self, field):
        jsonschema.validate(field, self.schema)
        return True

class PathAlgebra(qpawebd.gap.data):
    def __init__(self, name, field, quiver):
        self.name = name
        self.field = field
        self.quiver = quiver

    def toGap(self, gap):
        name = self.name
        gapstr = "".join([name, " := PathAlgebra(", self.field, ", ", self.quiver, ");"])
        gap.write(gapstr)
        

class QuotAlgebra(qpawebd.gap.data):
    
    def __init__(self, name, pathAlg, relations):
        self.name = name
        self.pathAlg = pathAlg
        self.relations = relations

    def toGap(self, gap):
        gapstr = "".join([self.name, " := ", self.pathAlg, "/", self.relations, ";"])
        gap.write(gapstr, self.fromGap)

    def fromGap(self, data):
        pass


class Relations(qpawebd.gap.data):
    def __init__(self, name, pathAlg, relations):
        self.name = name
        self.pathAlg = pathAlg
        self.relations = relations

    def toGap(self, gap):
        gaplist = [self.name, ":=", "["]
        for rel in self.relations:
            print("REL: " + rel)
            for r in  re.finditer(r"[0-9]+((\.\d+)|(/\d+))?|\*|\+|\-|\^|[a-zA-Z]([a-zA-Z0-9]+)?", rel):
                print("R: "+r.group(0))
                if re.match(r"[a-zA-Z]([a-zA-Z0-9]+)?$", r.group(0)):
                    gaplist.extend([self.pathAlg, "."])
                gaplist.append(r.group(0))
            gaplist.append(", ")
        gaplist.append("];")
        gap.write("".join(gaplist))


class Dimension(qpawebd.gap.data):
    
    def __init__(self, name, quotalg):
        self.name = name
        self.quotalg = quotalg

    def toGap(self, gap):
        gap.write("".join([self.name, ":=Dimension(", self.quotalg, ");"]), self.fromGap)

    def fromGap(self, data):
        # String, because this function could return infinity
        self.value = str(data, "utf-8")
        self.onResult()

class IndecProjectiveModules(qpawebd.gap.data):

    def __init__(self, name, quotalg):
        self.name = name
        self.quotalg = quotalg

    def toGap(self, gap):
        gap.write("".join([self.name, ":=IndecProjectiveModules(", self.quotalg, ");"]), self.fromGap)

    def fromGap(self, data):
        self.value = str(data)
        self.onResult()

class RadicalSeries(qpawebd.gap.data):

        def __init__(self, name, indproj, vertexIndex):
            self.name = name
            self.indproj = indproj
            self.vertexIndex = vertexIndex

        def toGap(self, gap):
            gap.write("".join([self.name, self.vertexIndex,":=RadicalSeries(", self.indproj,"[",self.vertexIndex,"]", ");"]), self.fromGap)

        def fromGap(self, data):
            self.value = str(data)
            self.onResult()

        ## todo validering

