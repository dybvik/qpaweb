import subprocess
from qpawebd import settings
import os
import fcntl
from queue import Queue
import pkgutil
import importlib
import inspect

class CommandValidationError(Exception):

    pass

class Process():
    writeQueue = Queue()
    def start(self):
        self.p = subprocess.Popen([settings.gap_exe, "-n", "-b"], stdout=subprocess.PIPE, stdin=subprocess.PIPE, stderr=subprocess.STDOUT)
        fcntl.fcntl(self.p.stdout.fileno(), fcntl.F_SETFL, os.O_NONBLOCK)
        self.data = b""
    def stop(self):
        if p.poll() == None:
            p.kill()

    #reads all availible data from GAP and calls any registered callback
    def read(self):
        data = self.p.stdin.readall()
        if data == None:
            return
        self.data += data
        if len(self.data) < 6:
            return
        if c[-6:len(self.data)] == b"\ngap> ":
            data = self.data
            self.data = b""
            if self.callback:
                self.callback(data[0:-6])
            if not self.writeQueue.empty():
                nwrite = self.writeQueue.get()
                p.stdin.write(nwrite[0])
                self.callback = nwrite[1]
            else:
                self.gap_busy = False
        
    #Write only _one_complete_ GAP command per call to write()
    def write(self, data, callback = None):
        if not p.poll():
            return False
        if self.gap_busy:
            self.writeQueue.put((data,callback))
        else:
            self.gap_busy = True
            p.stdin.write(data)
            self.callback = callback
        return True
    def poll(self):
        if not p.poll():
            return True
        else:
            return False
    def ready(self):
        return self.poll() and not self.gap_busy


class Command():
    pass

class data():
    
    @staticmethod
    def onResult():
        pass

class Field():
    pass

fields = {}
commands = {}
datatypes = {}



fieldSchema = {
    "type": "object",
    "properties": {
        "type": {"type": "string"}
    }
}

def getField(field):
    jsonschema.validate(fieldSchema, field)
    return fields[field["type"]]

def loadgapcom():
    for ms in settings.INSTALL_COMMANDS:
        p = __import__(ms, fromlist=["1"])
        #print(ms)
        for importer, modname, ispkg in pkgutil.iter_modules(p.__path__):
            print(modname)
            
            #m = __import__(modname, fromlist=["1"])
            m = importlib.import_module("." +modname, package=ms)
            for c in inspect.getmembers(m, inspect.isclass):
                if issubclass(c[1], Command):
                    commands[c[0]] = c[1]
                elif issubclass(c[1], data):
                    datatypes[c[0]] = c[1]
                elif issubclass(c[1], Field):
                    fields[c[0]] = c[1]
