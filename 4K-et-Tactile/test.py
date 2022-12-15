#! /usr/bin/env python3
# coding: utf-8
# 

import time
import socketio

sio = socketio.Client()
# mode debug
#sio = socketio.Client(logger=True, engineio_logger=True)

#@sio.on('GeneralSocket')
#def on_message(data):
    #print(data)

@sio.event
def disconnect():
    print("I'm disconnected!")

@sio.event
def connect():
    print("I'm connected!")

sio.connect('http://localhost:3000')

print("test 1 : utilisation normale")
time.sleep(2)
sio.emit('GeneralSocket', "readytostart")
time.sleep(60) # 15 (start) + 30 (metrage de test) + 15 (end)
time.sleep(5) # on reste sur le reset

print("test 2 : la personne se lève au milieu du métrage")
sio.emit('GeneralSocket', "readytostart")
time.sleep(30)
sio.emit('GeneralSocket', "standup")
time.sleep(10) # on attend le reset et on y reste

print("test 3 : la personne se lève au milieu du métrage mais se rassoit rapidement")
sio.emit('GeneralSocket', "readytostart")
time.sleep(30)
sio.emit('GeneralSocket', "standup")
time.sleep(0.5)
sio.emit('GeneralSocket', "sitdown")
time.sleep(30) # le métrage continue
time.sleep(5) # on reste sur le reset

print("test 4 : la personne se lève au milieu du métrage mais se rassoit 'trop tard'")
sio.emit('GeneralSocket', "readytostart")
time.sleep(30)
sio.emit('GeneralSocket', "standup")
time.sleep(10) # on attend le reset
sio.emit('GeneralSocket', "sitdown")
time.sleep(5) # on reste sur le reset