import json

class FindDimension:
    def __init__(self, field, quiverName):
        self.field = field
        self.quiverName = quiverName
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
        self.command = "F" + self.quiverName + " := PathAlgebra(" + self.fieldCommand + "," + self.quiverName + ");"

    def expose(self):
        print(json.dumps(self.exposeVariables))

#test method, PathAlgebra
def main():
    #Rationals
    fieldR = {'fieldtype': 'R',
              'galouisfield': ''}

    paR = PathAlgebra(fieldR, 'Ronny')
    paR.expose()
    paR.BuildCommand()
    print(paR.command)

    #GalouisField
    fieldG = {'fieldtype': 'G',
              'galouisfield': '2^2'}

    paG = PathAlgebra(fieldG, 'Gaute')
    paG.expose()
    paG.BuildCommand()
    print(paG.command)


if __name__ == "__main__":
    main()