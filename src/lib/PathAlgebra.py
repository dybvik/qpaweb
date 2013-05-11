import json

class PathAlgebra:
    def __init__(self, GAPJob):
        self.field = GAPJob['field']
        self.quiverName = GAPJob['quiver']['name']
        self.command = ""
        self.requires = ["quiver", "field"]
        self.actionMenu = 1
        self.exposeVariables = {'showInMenu' : self.actionMenu,
                                'menuItems' :{
                                  'fieldtype':
                                     {'dropdown':
                                        {'strRat': 'R',
                                         'strGal': 'G'},
                                     },
                                  'galouisfield':
                                   'input',
                                 },
        }

        if self.field['fieldtype'] == "R":
            self.fieldCommand = "Rationals"
        else:
            self.fieldCommand = "GF(" + self.field['galouisfield'] + ")"

    def BuildCommand(self):
        self.command = "F" + \
                       self.quiverName + \
                       " := PathAlgebra(" + \
                       self.fieldCommand + "," + \
                       self.quiverName + ");"

    def expose(self):
        print(json.dumps(self.exposeVariables))

#test method, PathAlgebra
def main():
    #Rationals
    gapJobR = {
        'field' : {
          'fieldtype': 'R',
          'galouisfield': ''},
        'quiver' : {'name': 'Ronny'}
    }

    paR = PathAlgebra(gapJobR)
    paR.expose()
    paR.BuildCommand()
    print(paR.command)

    #GalouisField
    gapJobG = {
        'field' : {
            'fieldtype': 'G',
            'galouisfield': '2^2'},
        'quiver' : {'name': 'Gaute'}
    }

    paG = PathAlgebra(gapJobG)
    paG.expose()
    paG.BuildCommand()
    print(paG.command)

if __name__ == "__main__":
    main()