import subprocess
import settings
import os
import fcntl


class CommandValidationError(Exception):

    pass

class Process():

    def start(self):
        self.p = subprocess.Popen([settings.gap_exe, "-n", "-b"], stdout=subprocess.PIPE, stdin=subprocess.PIPE, stderr=subprocess.STDOUT)
        fcntl.fcnl(p.stdout.fileno(), fcntl.F_SETFL, os.O_NONBLOCK)
        self.data = b""
    def stop(self):
        if p.poll() == None:
            p.kill()

    def read(self):
        data = self.p.stdin.readall()
        if data == None:
            return None
        self.data += data
        if len(self.data) < 6:
            return None
        if c[-6:len(self.data)] == b"\ngap> ":
            data = self.data
            self.data = b""
            return data[0:-6]
        return None
        
    def write(self, data):
        if self.data != b"":
            return False
        p.stdout.write(data)
        return True
    def poll(self):
        if p.poll() == None and self.data == b"":
            return True
        else:
            return False

