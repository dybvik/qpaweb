import json

class JSONGAPTranslate:
    def __init__(self):
        self.con = None
        self.cur = None

    def ToGAP(self, jsoninput):
        self.jsonin = json.loads(jsoninput)
#        for key, value in self.jsonin.items():
#            self.jsonin.items[key] = [value, ]
#            self.done()
#            print("key:" + key + ", value: "+ value)
        return("JSONinput ^"+jsoninput)

    def FromGAP(self, gapinput):
        return("GAPinput: "+gapinput)

    def _commandgenerator(self):
        return 1
