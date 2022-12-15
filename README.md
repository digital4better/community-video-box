# README "global"

## Aide-mémoire / Infos clefs

### Login SSH

- Login : cvb
- Password : cvb1234!

## Configuration initiale de la card SD de la raspberry

- Utiliser l'utilitaire "Raspberry Pi Imager", dispo sur le site officiel raspberry
- Pour l'OS, choisir la version recommandée (Raspberry Pi OS 32 bits)
- /!\ Penser à configurer l'accès SSH (qui doit être activé, avec les même valeurs que le login & password indiqué plus haut)
- /!\ Pour se passer de cable ethernet, il est possible de préconfigurer l'accès Wifi (choix du couple SSID & password)

## Se connecter à une raspberry

### Adresses MAC :

- Raspberry 1 "4K" : e4:5f:1:5b:bd:88
- Raspberry 2 "Tactile" : e4:5f:1:5b:bd:0

### Trouver IP sur le réseau local

- `$ arp -a | grep e4:5f:1:5b:bd:88` (remplacer l'adresse mac si nécessaire)
- Si introuvable, lancer un scan du réseau local avant de retenter la commande précédente : `$ nmap -sP 10.8.125.0/24` (le masque du réseau local peut être retrouvé en faisant un "ifconfig")

Autre option selon configuration raspberry : on peut utiliser l'alias raspberrypi.local pour avoir l'IP de la raspberry. Exemple :
`$ ping raspberrypi.local`

## Comment se connecter en SSH

`$ ssh cvb@10.8.125.103` (attention à bien remplacer par l'IP effective)

## Comment copier des fichiers vers la raspberry (via scp)

`$ scp -r Infra cvb@10.8.125.103:~/infra`
`$ scp -r 4K-et-Tactile cvb@10.8.125.103:~/appli`
