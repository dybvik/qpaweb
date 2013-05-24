## Base classes: formats for algebraic objects with functions, as well as code conversion from/to JSON/GAP code
# Common methods for all classes in this file are __init__, toGap, fromGap and validate.
# For the creation of additional algebraic objects not delivered with at the project delivery, copy-paste a class
# and write a new class based on it.

import qpawebd
import qpawebd.gap
import jsonschema
import re

## Quiver - Quiver class. Contains arrows and vertices. JSON Schema describes structure
# Debug: Class status by last revision: Class functions as it should.
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
    nvertices = 0 # Vertex count, public variable
    narrows = 0   # Arrow count, public variable

    ## Constructor.
    # @name Quiver name, if renamed.
    # @quiver The quiver, translated from JSON to Python dictionary (same structure)
    def __init__(self, name, quiver):
        self.name = name
        self.quiver = quiver
        if not self.validate(quiver):  # If quiver isn't validated, throw exception/error
            print(str(quiver))
            raise qpawebd.gap.CommandValidationError()

    ## Converts relevant data from quiver Python dictionary to GAP constructor command
    #TODO: endre navn til toGAP ?
    # @gap ????
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
        
    ## Checks if return value from GAP is kosher
    #TODO: endre navn til fromGAP ? Og bytt ut kosher
    # @data Return value from GAP command line
    def fromGap(self, data):
        m = re.match(r"<quiver width (\d+) vertices and (\d+) arrows>", data)
        if m == None:
            return False
        if m.groups(1) != self.nvertices or m.groups(2) != self.narrows:
            return False
        else:
            return True

    ## Validates input, used in __init__ ??
    # TODO: verifisere dette ?
    def validate(self, quiver):
        #try:
            jsonschema.validate(quiver, self.schema)
            for key, val in quiver["arrows"].items():
                if val["from"] not in quiver["vertices"] or val["to"] not in quiver["vertices"]:
                    return False
            return True
        #except jsonschema.ValidationError:
            return False

    ## Checks if quiver has vertex by name
    # @vertexName Name of the vertex to check if quiver contains
    def hasVertex(self, vertexName):
        return vertexName in self.quiver["vertices"]

## SimpleModule class.
# TODO: I haven't got a clue what this is.
# Debug: Class status by last revision: Class is a copy-paste of Quiver and doesn't do much, yet.
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

## RightModule class.
# TODO: I haven't got a clue what this is.
# Debug: Class status by last revision: Class is a copy-paste of Quiver and doesn't do much, yet.
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

## Rationals field class
# Debug: Class status by last revision: Class functions as it should.
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

    ## Constructor
    # @field Field from input
    def __init__(self, field):
        self.field = field

    ## Converts field data from Python dictionary to GAP constructor command
    #TODO: endre navn til toGAP ?
    # @gap ????
    def toGap(self, gap):
        gap.write("K := Rationals;")

    ## Checks if return value from GAP is kosher
    #TODO: endre navn til fromGAP ? Og bytt ut kosher
    # @data Return value from GAP command line
    def fromGap(self, data):
        if data != "Rationals":
            return False
        else:
            return True

    ## Validates input, used in __init__ ??
    # TODO: verifisere dette ?
    def validate(self, field):
        jsonschema.validate(field, self.schema)
        return True

## Galois field class
# TODO: Rewrite it and convert it for extra input field from the GUI
# Debug: Class status by last revision: Class is a copy paste of Rationals and doesn't do much, yet.
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

## Path Algebra class
# As path algebras don't return anything useful, this class only has a constructor and a conversion to GAP code,
# not the other way around.
# Debug: Class status by last revision: Class functions as it should.
class PathAlgebra(qpawebd.gap.data):
    ## Constructor.
    # @name Path algebra name... Should be dynamic, God knows if it is in commands.py.
    # @quiver The name of the quiver, previously defined (this is Sparta!) (No this is Patrick) (Anyway, it's the
    # the quiver name.
    # @field Field type (if galois then with (valid?) strange numbers.
    # TODO: Only built for Rationals, let's make Galois supported! HAU RUCK. Also the comments above are retarded.
    def __init__(self, name, field, quiver):
        self.name = name
        self.field = field
        self.quiver = quiver

    ## I guess you get the drift
    # TODO: Replace the above comment with something useful
    def toGap(self, gap):
        name = self.name
        gapstr = "".join([name, " := PathAlgebra(", self.field, ", ", self.quiver, ");"])
        gap.write(gapstr)

## Quotient Algebra class
# As with path algebras, GAP doesn't return anything useful, this class only has a constructor and a conversion to
# GAP code, not the other way around.
# Debug: Class status by last revision: Class functions as it should.
class QuotAlgebra(qpawebd.gap.data):
    ## Copypaste constructor shit
    # TODO: Replace shit with actual useful info
    def __init__(self, name, pathAlg, relations):
        self.name = name
        self.pathAlg = pathAlg
        self.relations = relations

    ## Copypaste toGap shit
    # TODO: Replace shit with actual useful info
    def toGap(self, gap):
        gapstr = "".join([self.name, " := ", self.pathAlg, "/", self.relations, ";"])
        gap.write(gapstr, self.fromGap)

    ## Copypaste fromGap shit
    # TODO: Replace shit with actual useful info
    def fromGap(self, data):
        pass

## Relations class
# As with path algebras, GAP doesn't return anything useful, this class only has a constructor and a conversion to
# GAP code, not the other way around.
# Debug: Class status by last revision: Class functions as it should.
class Relations(qpawebd.gap.data):
    ## Copypaste constructor shit
    # TODO: Replace shit with actual useful info
    def __init__(self, name, pathAlg, relations):
        self.name = name
        self.pathAlg = pathAlg
        self.relations = relations

    ## Copypaste toGap shit
    # TODO: Replace shit with actual useful info
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

## Dimension class
# Debug: Class status by last revision: Class functions as it should.
class Dimension(qpawebd.gap.data):
    ## Copypaste constructor shit
    # TODO: Replace shit with actual useful info
    def __init__(self, name, quotalg):
        self.name = name
        self.quotalg = quotalg

    ## Copypaste toGap shit
    # TODO: Replace shit with actual useful info
    def toGap(self, gap):
        gap.write("".join([self.name, ":=Dimension(", self.quotalg, ");"]), self.fromGap)

    ## Copypaste fromGap shit
    # TODO: Replace shit with actual useful info
    def fromGap(self, data):
        # String, because this function could return infinity
        self.value = str(data, "utf-8")
        self.onResult()

## Indec[..] module class
# TODO: Fix it so it works
# Debug: Class status by last revision: Class is a copy paste of Rationals and doesn't do much, yet.
class IndecProjectiveModules(qpawebd.gap.data):
    # ETC
    def __init__(self, name, quotalg):
        self.name = name
        self.quotalg = quotalg
    # ETC
    def toGap(self, gap):
        gap.write("".join([self.name, ":=IndecProjectiveModules(", self.quotalg, ");"]), self.fromGap)
    # ETC
    def fromGap(self, data):
        self.value = str(data)
        self.onResult()

## Radical Series module class
# TODO: Fix it so it works. Needs some input, defined by what?
# Debug: Class status by last revision: Class is a copy paste of Rationals and doesn't do much, yet.
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

