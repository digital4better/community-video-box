# README "appli" (4K et Tactile)

## Pré-requis

Copier tous les fichiers de ce dossier dans ~/appli

## Lancer serveur Node

- `cd ~/appli/nodejs`
- `pm2 start index.js`
- `pm2 save` (pour garantir restart auto à chaque reboot)

## Gestion du capteur

Installer la dépendance python manquante en jouant la commande : `$ pip install python-socketio`

Et se placer dans le bon répertoire : `$ cd ~/appli`

### Test (sans capteur)

- `$ pm2 start test.py`

### Mode "prod"

- `$ pm2 start main.py`
- `$ pm2 save` (pour garantir restart auto à chaque reboot)

## Démarrage écran "4K"

Ouvrir http://localhost:3000/screen dans un navigateur et le mettre en plein écran côté téléviseur

NB : si des lenteurs ou lags sont observées lors du rendu de la vidéo, il est nécessaire d'augmenter la RAM allouée au GPU, via la commande `$ raspi-config`

## Démarrage écran Tactile

Activer interfaces SPI et I2C via `$ raspi-config`

Installer le driver de l'écran :

- `$ git clone https://github.com/waveshare/Waveshare-DSI-LCD`
- `$ cd Waveshare-DSI-LCD/5.15.61/32`
- `$ sudo bash ./WS_xinchDSI_MAIN.sh 70C I2C1`

(Cf doc https://www.waveshare.com/wiki/7inch_DSI_LCD_(C))

Ouvrir http://localhost:3000/phone dans un navigateur et le mettre en plein écran côté écran tactile

## Aide-mémoire pm2

- Pour voir les logs : `$ pm2 logs`
- Pour monitorer les apps lancées via pm2 : `$ pm2 monit`
