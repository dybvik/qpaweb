import json
from src.lib import Quiver as Q
from src.lib import PathAlgebra as PA
from src.lib import Relations as R

class JSONGAPTranslate:
    def __init__(self):
        self.con = None
        self.cur = None

    ## Expose \n
    # Called from the daemon, shows daemon capabilities
    # and exposes which dynamic input fields to generate client side.
    # For each method to expose, add
    # toExpose.update(<module reference>.Expose())
    @staticmethod
    def Expose():
        toExpose = Q.Quiver.Expose()
        toExpose.update(PA.PathAlgebra.Expose())
        toExpose.update(R.Relations.Expose())
        toExpose = {'modules' :toExpose}
        return toExpose

    def ToGAP(self, jsoninput):
        self.jsonin = json.loads(jsoninput)
        #        for key, value in self.jsonin.GAPJob():
        #            self.jsonin.items[key] = [value, ]
        #            self.done()
        #            print("key:" + key + ", value: "+ value)
        return("JSONinput ^"+jsoninput)

    def FromGAP(self, gapinput):
        return("GAPinput: "+gapinput)

    def _commandgenerator(self):
        return 1

def main():
    # Expose test
    JSONGAPTranslate.Expose()

## Main method
# Runs tests if called standalone by PathAlgebra.py
if __name__ == "__main__":
    main()