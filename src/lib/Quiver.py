## @package QPAweb.core
# Documentation for Quiver
# TODO add validator function for input

## Class for QPAWeb Quiver
# Generates Quiver code
class Quiver:
## quiver must be present in GAPJob
    requires = ["quiver"]
    actionMenu = 0
    commandName = "Quiver"

    ## Array accessed by /expose/ http GET method
    # Dynamically builds form fields client side
    # showInMenu = display in action drop down, set by self.actionMenu 1 (on) or 0 (off)
    # menuItems = additional form fields required for doing the calculation
    # No menuItems in Quiver due to graphical input, no further fields
    # required (subject to change?)
    exposeVariables = {
        commandName  : {
            'showInMenu' : actionMenu,
            },
        }
    ## The constructor
    # @param self The object pointer
    # @param GAPJob JSON GAPJob object from client
    def __init__(self, GAPJob):
        # Validator code here?
        self.quiver = GAPJob['quiver']
        self.quiverName = self.quiver['name']
        self.command = ""

    ## Builds the Quiver GAP command
    # @param self The object pointer
    # @return GAP Quiver command
    # Gets quiver name from constructor
    def BuildCommand(self):
        self.command = self.quiverName + " := Quiver(["
        #loop through vertices
        for vertex in self.quiver['vertices']:
            self.command += '"' + vertex + "',"

        self.command = self.command[:-1] # remove last comma

        self.command += "],["
        #loop through arrows
        for arrowName, arrow in self.quiver['arrows'].items():
            self.command += '["' + \
                            arrowName + '","' + \
                            arrow['source'] + '","' + \
                            arrow['target'] + '"],'

        self.command = self.command[:-1] # remove last comma
        self.command += "]);"

        return self.command
    #Er denne nødvendig?
    def __countVertices__(self):
        self.numVertices = len(self.quiver['vertices'])

    ## Exposes valid methods to client
    @staticmethod
    def Expose():
        return Quiver.exposeVariables

## Standalone test method for PathAlgebra
# Runs Expose test
# Runs Quiver test
def main():
    # Expose test
    Quiver.Expose()

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

    q = Quiver(gapJobQ)
    print(q.BuildCommand())

## Main method
# Runs tests if called standalone by PathAlgebra.py
if __name__ == "__main__":
    main()