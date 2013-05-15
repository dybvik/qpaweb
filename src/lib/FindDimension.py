## @package QPAweb.core
# Documentation for FindDimension
# TODO add validator function for input

## Requires Python JSON libraries
import json

## FindDimension
# Generates Find dimension code
class FindDimension:

    ## The constructor
    # @param self The object pointer
    def __init__(self):
        ## quiver, fieldType and galoisField must be present in GAPJob
        self.requires = ["quiver", "fieldType", "galoisField"]
        self.actionMenu = 1

        ## Variable accessed by /expose/ http GET method \n
        # Dynamically builds form fields client side \n
        # showInMenu = display in action drop down, set by self.actionMenu 1 (on) or 0 (off) \n
        # menuItems = additional form fields required for doing the calculation \n
        # fieldType / galoisField = form field name \n
        # select / input = type of form field \n
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

    ## Job loader function
    # @param GAPJob JSON GAPJob object from client
    def Load(self, GAPJob):
        # Validator code here?
        self.field = GAPJob['field']
        self.quiverName = GAPJob['quiver']['name']
        self.command = ""

    ## Builds the Path Algebra GAP command \n
    # Gets quiver name from constructor
    # @param self The object pointer
    # @return GAP Path Algebra command
    def BuildCommand(self):
        ## Two valid inputs for fieldType:
        # R = Rationals, G = Galois Field
        # If Galois Field, a valid field galoisField is required
        if self.field['fieldType'] == "R":
            self.fieldCommand = "Rationals"
        else:
            self.fieldCommand = "GF(" + self.field['galoisField'] + ")"

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
# Runs Expose, Rational, Galois Field tests
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