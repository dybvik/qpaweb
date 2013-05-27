import subprocess
import os
import time


p = subprocess.Popen(["ub.exe", "C:/gap4r6/bin/gapw95.exe", "-n", "-e", "-l", "/cygdrive/c/gap4r6"], stdout=subprocess.PIPE, stdin=subprocess.PIPE, env={"SystemRoot": os.environ["SystemRoot"], "TERMINFO": "/cygdrive/c/gap4r6/terminfo",
  "CYGWIN": "nodosfilewarning", "LANG":"en_US.UTF-8", "HOME": os.environ["HOMEDRIVE"]+os.environ["HOMEPATH"], "PATH": "C:/gap4r6/bin", "TERM": "cygwin"}, shell=False)


for line in iter(p.stdout.readline, b''):
    print(line.rstrip().decode("utf-8"))
