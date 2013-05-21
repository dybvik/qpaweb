import qpawebd
import jsonschema
from qpawebd.operations import base

## FindDimension
# Translates to and from JSON-GAP command
# User story 1.e
# Functions, but needs cleanup
class FindDimension(qpawebd.gap.Command):
    ## Defines whether or not to show command capability to GUI
    actionMenu = 1
    # Shorthand command name for command menu, translated by the client
    commandName = "FindDimension"
    ## Extra variables required from GUI
    exposeVariables = {
        commandName: {
            'showInMenu': actionMenu,
            'menuItems': {
                'field': {
                    'select':
                        {'strRat': 'R',
                         'strGal': 'G'},
                },
                'galoisField': {
                    'input':
                        {'visible': 'field.strGal'},
                },
            },
        },
    }
    # JSON schema to validate for
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
        jsonschema.validate(self.schema, job)

    ## Exposes requirements to client
    @staticmethod
    def Expose():
        return FindDimension.exposeVariables

# Translates to and from JSON-GAP command
# User story 1.f1
# Should function
# needs cleanup
class FindIndecProjectiveModules(qpawebd.gap.Command):
    ## Defines whether or not to show command capability to GUI
    actionMenu = 1
    # Shorthand command name for command menu, translated by the client
    commandName = "IndecProjectiveModules"
    ## Extra variables required from GUI
    exposeVariables = {
        commandName: {
            'showInMenu': actionMenu,
            'menuItems': {
                'field': {
                    'select':
                        {'strRat': 'R',
                         'strGal': 'G'},
                },
                'galoisField': {
                    'input':
                        {'visible': 'field.strGal'},
                },
            },
        },
    }
    # JSON schema to validate for
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
        self.indecproj = base.IndecProjectiveModule("indproj", "A")

    def fromGap(self):
        self.jobHandler.reportResult(self.job.id, self.indecproj.value)

    def toGap(self, gap):
        print("INDECPROJ toGap")
        self.dimension.onResult = self.fromGap
        self.quiver.toGap(gap)
        self.field.toGap(gap)
        self.pathalg.toGap(gap)
        self.relations.toGap(gap)
        self.quotalg.toGap(gap)
        self.indecproj.toGap(gap)

    def validate(self, job):
        jsonschema.validate(schema, job)

# Translates to and from JSON-GAP command
# User story 1.f2
# Should function
# needs cleanup
class FindRadicalSeries(qpawebd.gap.Command):
    ## Defines whether or not to show command capability to GUI
    actionMenu = 1
    # Shorthand command name for command menu, translated by the client
    commandName = "RadicalSeries"
    ## Extra variables required from GUI
    exposeVariables = {
        commandName: {
            'showInMenu': actionMenu,
            'menuItems': {
                'field': {
                    'select':
                        {'strRat': 'R',
                         'strGal': 'G'},
                },
                'galoisField': {
                    'input':
                        {'visible': 'field.strGal'},
                },
                'radSeriesIndex' : {
                    'input'
                }
            },
        },
    }
    # JSON schema to validate for
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
        self.indecproj = base.IndecProjectiveModule("indproj", "A")
        self.radicalseries = base.RadicalSeries("radseries", "indproj", self.job.data["radSeriesIndex"])

    def fromGap(self):
        self.jobHandler.reportResult(self.job.id, self.radicalseries.value)

    def toGap(self, gap):
        print("INDECPROJ toGap")
        self.dimension.onResult = self.fromGap
        self.quiver.toGap(gap)
        self.field.toGap(gap)
        self.pathalg.toGap(gap)
        self.relations.toGap(gap)
        self.quotalg.toGap(gap)
        self.indecproj.toGap(gap)
        self.radicalseries.toGap(gap)

    def validate(self, job):
        jsonschema.validate(schema, job)

# User story 2.f
# Not implemented
class FindHomomorphyBasis(qpawebd.gap.Command):
    ## Defines whether or not to show command capability to GUI
    actionMenu = 0
    # Shorthand command name for command menu, translated by the client
    commandName = "RadicalSeries"
    ## Extra variables required from GUI
    exposeVariables = {
        commandName: {
            'showInMenu': actionMenu,
            'menuItems': {
                'field': {
                    'select':
                        {'strRat': 'R',
                         'strGal': 'G'},
                    },
                'galoisField': {
                    'input':
                        {'visible': 'field.strGal'},
                    },
                'radSeriesIndex' : {
                    'input'
                }
            },
            },
        }
    # JSON schema to validate for
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
        self.indecproj = base.IndecProjectiveModule("indproj", "A")
        self.radicalseries = base.RadicalSeries("radseries", "indproj", self.job.data["radSeriesIndex"])

    def fromGap(self):
        self.jobHandler.reportResult(self.job.id, self.radicalseries.value)

    def toGap(self, gap):
        print("INDECPROJ toGap")
        self.dimension.onResult = self.fromGap
        self.quiver.toGap(gap)
        self.field.toGap(gap)
        self.pathalg.toGap(gap)
        self.relations.toGap(gap)
        self.quotalg.toGap(gap)
        self.indecproj.toGap(gap)
        self.radicalseries.toGap(gap)

    def validate(self, job):
        jsonschema.validate(schema, job)

# User story 2.g
# Not implemented
class FindExtentionBasis(qpawebd.gap.Command):
    # grad
    ## Defines whether or not to show command capability to GUI
    actionMenu = 0
    # Shorthand command name for command menu, translated by the client
    commandName = "RadicalSeries"
    ## Extra variables required from GUI
    exposeVariables = {
        commandName: {
            'showInMenu': actionMenu,
            'menuItems': {
                'field': {
                    'select':
                        {'strRat': 'R',
                         'strGal': 'G'},
                    },
                'galoisField': {
                    'input':
                        {'visible': 'field.strGal'},
                    },
                'radSeriesIndex' : {
                    'input'
                }
            },
            },
        }
    # JSON schema to validate for
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
        self.indecproj = base.IndecProjectiveModule("indproj", "A")
        self.radicalseries = base.RadicalSeries("radseries", "indproj", self.job.data["radSeriesIndex"])

    def fromGap(self):
        self.jobHandler.reportResult(self.job.id, self.radicalseries.value)

    def toGap(self, gap):
        print("INDECPROJ toGap")
        self.dimension.onResult = self.fromGap
        self.quiver.toGap(gap)
        self.field.toGap(gap)
        self.pathalg.toGap(gap)
        self.relations.toGap(gap)
        self.quotalg.toGap(gap)
        self.indecproj.toGap(gap)
        self.radicalseries.toGap(gap)

    def validate(self, job):
        jsonschema.validate(schema, job)

# User story 3.f1
# Not implemented
class FindObjectComplexity(qpawebd.gap.Command):
    # grad
    ## Defines whether or not to show command capability to GUI
    actionMenu = 0
    # Shorthand command name for command menu, translated by the client
    commandName = "RadicalSeries"
    ## Extra variables required from GUI
    exposeVariables = {
        commandName: {
            'showInMenu': actionMenu,
            'menuItems': {
                'field': {
                    'select':
                        {'strRat': 'R',
                         'strGal': 'G'},
                    },
                'galoisField': {
                    'input':
                        {'visible': 'field.strGal'},
                    },
                'radSeriesIndex' : {
                    'input'
                }
            },
            },
        }
    # JSON schema to validate for
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
        self.indecproj = base.IndecProjectiveModule("indproj", "A")
        self.radicalseries = base.RadicalSeries("radseries", "indproj", self.job.data["radSeriesIndex"])

    def fromGap(self):
        self.jobHandler.reportResult(self.job.id, self.radicalseries.value)

    def toGap(self, gap):
        print("INDECPROJ toGap")
        self.dimension.onResult = self.fromGap
        self.quiver.toGap(gap)
        self.field.toGap(gap)
        self.pathalg.toGap(gap)
        self.relations.toGap(gap)
        self.quotalg.toGap(gap)
        self.indecproj.toGap(gap)
        self.radicalseries.toGap(gap)

    def validate(self, job):
        jsonschema.validate(schema, job)

# User story 3.f2
# Not implemented
class FindOmegaPeriodic(qpawebd.gap.Command):
    # grad
    ## Defines whether or not to show command capability to GUI
    actionMenu = 0
    # Shorthand command name for command menu, translated by the client
    commandName = "RadicalSeries"
    ## Extra variables required from GUI
    exposeVariables = {
        commandName: {
            'showInMenu': actionMenu,
            'menuItems': {
                'field': {
                    'select':
                        {'strRat': 'R',
                         'strGal': 'G'},
                    },
                'galoisField': {
                    'input':
                        {'visible': 'field.strGal'},
                    },
                'radSeriesIndex' : {
                    'input'
                }
            },
            },
        }
    # JSON schema to validate for
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
        self.indecproj = base.IndecProjectiveModule("indproj", "A")
        self.radicalseries = base.RadicalSeries("radseries", "indproj", self.job.data["radSeriesIndex"])

    def fromGap(self):
        self.jobHandler.reportResult(self.job.id, self.radicalseries.value)

    def toGap(self, gap):
        print("INDECPROJ toGap")
        self.dimension.onResult = self.fromGap
        self.quiver.toGap(gap)
        self.field.toGap(gap)
        self.pathalg.toGap(gap)
        self.relations.toGap(gap)
        self.quotalg.toGap(gap)
        self.indecproj.toGap(gap)
        self.radicalseries.toGap(gap)

    def validate(self, job):
        jsonschema.validate(schema, job)

# User story 4.e
# Not implemented
class FindIsSelfinjective(qpawebd.gap.Command):
    # grad
    ## Defines whether or not to show command capability to GUI
    actionMenu = 0
    # Shorthand command name for command menu, translated by the client
    commandName = "RadicalSeries"
    ## Extra variables required from GUI
    exposeVariables = {
        commandName: {
            'showInMenu': actionMenu,
            'menuItems': {
                'field': {
                    'select':
                        {'strRat': 'R',
                         'strGal': 'G'},
                    },
                'galoisField': {
                    'input':
                        {'visible': 'field.strGal'},
                    },
                'radSeriesIndex' : {
                    'input'
                }
            },
            },
        }
    # JSON schema to validate for
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
        self.indecproj = base.IndecProjectiveModule("indproj", "A")
        self.radicalseries = base.RadicalSeries("radseries", "indproj", self.job.data["radSeriesIndex"])

    def fromGap(self):
        self.jobHandler.reportResult(self.job.id, self.radicalseries.value)

    def toGap(self, gap):
        print("INDECPROJ toGap")
        self.dimension.onResult = self.fromGap
        self.quiver.toGap(gap)
        self.field.toGap(gap)
        self.pathalg.toGap(gap)
        self.relations.toGap(gap)
        self.quotalg.toGap(gap)
        self.indecproj.toGap(gap)
        self.radicalseries.toGap(gap)

    def validate(self, job):
        jsonschema.validate(schema, job)

# User story 4.g
# Not implemented
class FindOmegaPeriodicOverEnvelope(qpawebd.gap.Command):
    # grad
    ## Defines whether or not to show command capability to GUI
    actionMenu = 0
    # Shorthand command name for command menu, translated by the client
    commandName = "RadicalSeries"
    ## Extra variables required from GUI
    exposeVariables = {
        commandName: {
            'showInMenu': actionMenu,
            'menuItems': {
                'field': {
                    'select':
                        {'strRat': 'R',
                         'strGal': 'G'},
                    },
                'galoisField': {
                    'input':
                        {'visible': 'field.strGal'},
                    },
                'radSeriesIndex' : {
                    'input'
                }
            },
            },
        }
    # JSON schema to validate for
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
        self.indecproj = base.IndecProjectiveModule("indproj", "A")
        self.radicalseries = base.RadicalSeries("radseries", "indproj", self.job.data["radSeriesIndex"])

    def fromGap(self):
        self.jobHandler.reportResult(self.job.id, self.radicalseries.value)

    def toGap(self, gap):
        print("INDECPROJ toGap")
        self.dimension.onResult = self.fromGap
        self.quiver.toGap(gap)
        self.field.toGap(gap)
        self.pathalg.toGap(gap)
        self.relations.toGap(gap)
        self.quotalg.toGap(gap)
        self.indecproj.toGap(gap)
        self.radicalseries.toGap(gap)

    def validate(self, job):
        jsonschema.validate(schema, job)

# User story 5
# Not implemented
# class
