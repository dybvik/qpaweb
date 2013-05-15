## @package QPAweb.core
# Documentation for PathAlgebra
# TODO add validator function for input

## PathAlgebra
# Generates Path Algebra code
class PathAlgebra:
    ## quiver, fieldType and galoisField must be present in GAPJob
    requires = ["quiver", "fieldType", "galoisField"]
    actionMenu = 1
    commandName = "PathAlgebra"
    ## Variable accessed by /expose/ http GET method
    # Dynamically builds form fields client side
    # showInMenu = display in action drop down, set by self.actionMenu 1 (on) or 0 (off)
    # menuItems = additional form fields required for doing the calculation
    # fieldType / galoisField = form field name
    # select / input = type of form field
    # galoisField values = readable command : command value
    exposeVariables = {
        commandName: {
            'showInMenu': actionMenu,
            'menuItems': {
                'fieldType': {
                    'select':
                        {'strRat': 'R',
                         'strGal': 'G'},
                },
                'galoisField': {
                    'input':
                        {'visible' : 'strGal'},
                    },
                },
            },
        }

    ## The constructor
    # @param self The object pointer
    # @param GAPJob JSON GAPJob object from client
    def __init__(self, GAPJob):
        # Validator code here?
        self.field = GAPJob['field']
        self.quiverName = GAPJob['quiver']['name']
        self.command = ""

    ## Builds the Path Algebra GAP command
    # @param self The object pointer
    # @return GAP Path Algebra command
    # Gets quiver name from constructor
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
    @staticmethod
    def Expose():
        return PathAlgebra.exposeVariables

## Standalone test method for PathAlgebra
# Runs Expose test
# Runs Rational test
# Runs Galois Field test
def main():
    # Expose test
    print(PathAlgebra.Expose())

    # Rationals test
    gapJobR = {
        'field': {
            'fieldType': 'R',
            'galoisField': ''},
        'quiver': {'name': 'Ronny'}
    }

    pa = PathAlgebra(gapJobR)
    print(pa.BuildCommand())

    #GaloisField test
    gapJobG = {
        'field': {
            'fieldType': 'G',
            'galoisField': '2^2'},
        'quiver': {'name': 'Gaute'}
    }

    pa = PathAlgebra(gapJobG)
    print(pa.BuildCommand())

## Main method
# Runs tests if called standalone by PathAlgebra.py
if __name__ == "__main__":
    main()