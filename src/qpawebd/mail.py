# Import smtplib for the actual sending function
import smtplib

# Import the email modules we'll need
from email.mime.text import MIMEText

# Open a plain text file for reading.  For this example, assume that
# the text file contains only ASCII characters.
# Create a text/plain message
msg = MIMEText("TEST")

# me == the sender's email address
# you == the recipient's email address
msg['Subject'] = 'Hallo'
msg['From'] = 'QPAWeb@gmail.com'
msg['To'] = 'jsjakobs@stud.hist.no'

# Send the message via our own SMTP server.
s = smtplib.SMTP_SSL('smtp.gmail.com',465)
s.login('QPAWeb@gmail.com','QPAWeb7654')
s.send_message(msg)
s.quit()

#QPAWeb@gmail.com
#QPAWeb7654