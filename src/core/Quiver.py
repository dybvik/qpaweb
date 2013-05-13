## @package QPAweb.core
# Documentation for Quiver

## Requires Python JSON libraries
import json

class Quiver:

    ## The constructor
    # @param self The object pointer
    def __init__(self):
        ## quiver must be present in GAPJob
        self.requires = ["quiver"]
        self.actionMenu = 1

        ## Array accessed by /expose/ http GET method
        # Dynamically builds form fields client side
        # showInMenu = display in action drop down, set by self.actionMenu 1 (on) or 0 (off)
        # menuItems = additional form fields required for doing the calculation
        # No menuItems in Quiver due to graphical input, no further fields
        # required (subject to change?)
        self.exposeVariables = {
            'showInMenu' : self.actionMenu,
        }

    ## Job loader function
    # @param GAPJob JSON GAPJob object from client
    def Load(self, GAPJob):
        # Validator code here?
        self.quiver = GAPJob['quiver']
        self.quiverName = self.quiver['name']
        self.command = ""

    def BuildCommand(self):
        self.command = self.quiverName + " := Quiver("
        #loop through vertices
        #loop through arrows
        return self.command

    def __countVertices__(self):
        self.numVertices = self.quiver.vertices.lenght

    ## Exposes valid methods to client
    def Expose(self):
        print(json.dumps(self.exposeVariables))

## Standalone test method for PathAlgebra
# Runs Expose test
# Runs Quiver test
def main():
    # Expose test
    q = Quiver();
    q.Expose()

    # Quiver test
    gapJobQ = {
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

    q.Load(gapJobQ)
    print(q.BuildCommand())

## Main method
# Runs tests if called standalone by PathAlgebra.py
if __name__ == "__main__":
    main()