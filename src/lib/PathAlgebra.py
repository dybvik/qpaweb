## @package QPAweb.core
# Documentation for PathAlgebra

## Requires Python JSON libraries
import json

## PathAlgebra
# Generates Path Algebras
class PathAlgebra:

    ## The constructor
    # @param self The object pointer
    # @param GAPJob JSON GAPJob object from client
    def __init__(self):
        ## quiver, fieldType and galoisField must be present in GAPJob
        self.requires = ["quiver", "fieldType", "galoisField"]
        self.actionMenu = 1

        ## Variable accessed by /expose/ http GET method
        # Dynamically builds form fields client side
        # showInMenu = display in action drop down, set by self.actionMenu 1 (on) or 0 (off)
        # menuItems = additional form fields required for doing the calculation
        # fieldType / galoisField = form field name
        # select / input = type of form field
        # galoisField values = readable command : command value
        self.exposeVariables = {
            'showInMenu' : self.actionMenu,
            'menuItems' :{
                'fieldType': {
                    'select':
                        {'strRat': 'R',
                         'strGal': 'G'},
                    },
                'galoisField':
                    'input',
                },
            }

    def Load(self, GAPJob):
        self.field = GAPJob['field']
        self.quiverName = GAPJob['quiver']['name']
        self.command = ""

        ## Two valid inputs
        # R = Rationals
        # G = Galois Field
        # If Galois Field, a valid field galoisField is required
        if self.field['fieldType'] == "R":
            self.fieldCommand = "Rationals"
        else:
            self.fieldCommand = "GF(" + self.field['galoisField'] + ")"

    ## Builds the Path Algebra
    # @param self The object pointer
    # @return GAP Path Algebra command
    # Gets quiver name from constructor
    def BuildCommand(self):
        self.command = "F" + \
                       self.quiverName + \
                       " := PathAlgebra(" + \
                       self.fieldCommand + "," + \
                       self.quiverName + ");"
        return self.command

    ## Exposes valid methods to client
    def Expose(self):
        print(json.dumps(self.exposeVariables))

## Standalone test method for PathAlgebra
# Runs two tests, Rational and Galois Field
def main():
    # Expose test
    pa = PathAlgebra();
    pa.Expose()

    # Rationals test
    gapJobR = {
        'field' : {
          'fieldType': 'R',
          'galoisField': ''},
        'quiver' : {'name': 'Ronny'}
    }

    pa.Load(gapJobR)
    print(pa.BuildCommand())

    #GaloisField test
    gapJobG = {
        'field' : {
            'fieldType': 'G',
            'galoisField': '2^2'},
        'quiver' : {'name': 'Gaute'}
    }

    pa.Load(gapJobG)
    print(pa.BuildCommand())

## Main method
# Runs tests if called standalone by PathAlgebra.py
if __name__ == "__main__":
    main()