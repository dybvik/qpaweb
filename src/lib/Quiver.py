class Quiver:

    def __init__(self, quiverIn):
        self.quiver = quiverIn
        self.command = ""
        self.requires = ["quiver"]
        self.actionMenu = 1

    def BuildCommand(self):
        self.command = self.quiverIn.name + " := Quiver("

    def __countVertices__(self):
        self.numVertices = self.quiverIn.vertices.lenght

    def expose(self):