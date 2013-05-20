import subprocess
from qpawebd import settings
import os
import fcntl
from queue import Queue
import pkgutil
import importlib
import inspect
import jsonschema
import tornado

class CommandValidationError(Exception):
    pass

class Process():
    gap_busy = False
    writeQueue = Queue()
    callback = None
    def start(self):
        
        self.p = subprocess.Popen([settings.gap_exe, "-n", "-b"], stdout=subprocess.PIPE, stdin=subprocess.PIPE, stderr=subprocess.STDOUT, bufsize=1 if os.name == "nt" else 0)
        
            
        fcntl.fcntl(self.p.stdout.fileno(), fcntl.F_SETFL, os.O_NONBLOCK)
        tornado.ioloop.IOLoop.instance().add_handler(self.p.stdout.fileno(), self._stdoutHandler, tornado.ioloop.IOLoop.READ)
        self.data = b""
    def stop(self):
        if p.poll() == None:
            p.kill()

    def _stdoutHandler(self, fd, ev):
        self.read()

      
    #reads all availible data from GAP and calls any registered callback
    def read(self):
        data = self.p.stdout.readall()
        if data == None:
            return
        self.data += data
        if len(self.data) < 6:
            return
        if self.data[-6:len(self.data)] == b"\ngap> ":
            data = self.data
            print(str(self.data, "utf-8"))
            self.data = b""
            if self.callback:
                self.callback(data[0:-6])
            if not self.writeQueue.empty():
                nwrite = self.writeQueue.get()
                print("WRITE: " + str(nwrite[0]))
                self.p.stdin.write(bytes(nwrite[0]+"\n", "utf-8"))
                self.callback = nwrite[1]
            else:
                self.gap_busy = False

        
    #Write only _one_complete_ GAP command per call to write()
    def write(self, data, callback = None):
        print("WRITING")
        if not self.poll():
            print("POLLED FALSE")
            return False
        if self.gap_busy:
            print("BUSY")
            self.writeQueue.put((data,callback))
        else:
            print("WRITE: " + str(data))
            self.gap_busy = True
            self.p.stdin.write(bytes(data+"\n", "utf-8"))
            self.callback = callback
        return True
    def poll(self):
        if self.p.poll() == None:
            return True
        else:
            print("subpoll: " + self.p.poll())
            return False
    def ready(self):
        print(self.poll())
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

def getCommand(cmd):
    print(str(commands))
    return commands[cmd]


fieldSchema = {
    "type": "object",
    "properties": {
        "type": {"type": "string"}
    }
}

def getField(field):
    print(str(fields))
    jsonschema.validate(field, fieldSchema)
    return fields[field["type"]]



def loadgapcom():
    global commands, fields, datatypes
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
                    print(c[0])
                elif issubclass(c[1], data):
                    datatypes[c[0]] = c[1]
                elif issubclass(c[1], Field):
                    fields[c[0]] = c[1]
    print(str(commands))
