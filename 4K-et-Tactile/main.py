#! /usr/bin/env python3
# coding: utf-8
# 

import time
import RPi.GPIO as GPIO
import socketio

# Definition des pins
capteurMagnetique = 16
#BtnReset = 26
# led = 24

GPIO.setmode(GPIO.BOARD) # GPIO.BCM

# Definition des pins en entree / sortie
#GPIO.cleanup()
GPIO.setup(capteurMagnetique, GPIO.IN, pull_up_down = GPIO.PUD_UP)
#GPIO.setup(BtnReset, GPIO.IN, pull_up_down = GPIO.PUD_UP)

# GPIO.setup(led, GPIO.OUT)

# standard Python
sio = socketio.Client()
# mode debug
#sio = socketio.Client(logger=True, engineio_logger=True)

# LedOnState = False
Started = False

@sio.on('GeneralSocket')
def on_message(data):
    # global LedOnState
    global Started
    #print(data)
    if (data == "reset") :
        Started = False
    # if (data == "showPhone") :
    #     LedOnState = True
    # elif(data == "choice-b" or data == "choice-a") :
    #     LedOnState = False

@sio.event
def disconnect():
    print("I'm disconnected!")

@sio.event
def connect():
    print("I'm connected!")

sio.connect('http://localhost:3000')


# Boucle infinie
while True:

	etatcapteurMagnetique = GPIO.input(capteurMagnetique)
	#print (etatcapteurMagnetique)
	#etatBtnReset = GPIO.input(BtnReset)
	# etat==0 => bouton appuye => LED allumee

	if (etatcapteurMagnetique == 0):
		#print("sitdown")
		sio.emit('GeneralSocket', "sitdown")
		if (Started == False):
			Started = True
			print("Personne assise!")
			sio.emit('GeneralSocket', "readytostart")
	elif(etatcapteurMagnetique == 1):
		#print("standup")
		sio.emit('GeneralSocket', "standup")

	#print (LedOnState)
	# GPIO.output(led, LedOnState)
	# print(LedOnState)

	# Temps de repos pour eviter la surchauffe du processeur
	time.sleep(1)