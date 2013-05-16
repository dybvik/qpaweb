## @package QPAweb.core
# Documentation for PathAlgebra
# TODO add validator function for input

## Class for QPAWeb Relations
# Generates Relations code
class Relations:
    ## quiver and relations must be present in GAPJob
    requires = ["quiver", "relations"]
    actionMenu = 1
    commandName = "Relations"
    ## Array accessed by /expose/ http GET method
    # Dynamically builds form fields client side
    # showInMenu = display in action drop down, set by self.actionMenu 1 (on) or 0 (off)
    # menuItems = additional form fields required for doing the calculation
    # No menuItems in Relations due to relations being a static input, which adds
    # to client side array.
    # No fields required (subject to change?)
    exposeVariables = {
        commandName : {
            'showInMenu' : actionMenu,
            },
        }
    ## The constructor
    # @param self The object pointer
    # @param GAPJob JSON GAPJob object from client
    def __init__(self, GAPJob):
        # Validator code here?
        self.relations = GAPJob['relations']
        self.quiverName = GAPJob['quiver']['name']
        self.command = ""

    ## Builds the Relation matrix GAP command
    # @param self The object pointer
    # @return GAP Relation Matrix command
    # Gets quiver name from constructor
    def BuildCommand(self):
        self.command = self.quiverName + "RelationMatrix := ["
        for rel in self.relations:
            self.command += '' + rel + ','

        self.command = self.command[:-1] # remove last comma
        self.command += "];"
        return self.command

    ## Exposes valid methods to client
    @staticmethod
    def Expose():
        return Relations.exposeVariables

## Standalone test method for PathAlgebra
# Runs Expose test
# Runs Quiver test
def main():
    # Expose test
    Relations.Expose()

    # Quiver test
    gapJobRel = {
        'quiver' : {
            'vertices' : {
                'v0' : {
                    'x': 177, # x and
                    'y': 225  # y should be ignored
                },
                'v1' : {
                    'x': 891,
                    'y': 67
                },
                'v2' : {
                    'x': 645,
                    'y': 382
                },
                },
            'arrows' : {
                'a0' : {
                    'source': 'v1',
                    'target': 'v0'
                },
                'a1' : {
                    'source': 'v0',
                    'target': 'v2'
                },
                'a2' : {
                    'source': 'v2',
                    'target': 'v1'
                },
                },
            'name' : 'Ronny', # Ronny the Rational Quiver
        },
        'relations' : {
            'a1*a2',
            'a1+a2'
        },
        'field' : {
            'fieldType': 'R',
            'galoisField': ''}
    }

    r = Relations(gapJobRel)
    print(r.BuildCommand())

## Main method
# Runs tests if called standalone by PathAlgebra.py
if __name__ == "__main__":
    main()