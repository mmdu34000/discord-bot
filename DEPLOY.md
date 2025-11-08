# Guide de déploiement du bot Discord

## 📋 Prérequis

1. **Node.js** installé sur le serveur
2. **Git** installé
3. **PM2** (recommandé) ou **systemd** pour gérer le processus

## 🚀 Installation initiale

### Option 1: Avec PM2 (Recommandé)

```bash
# Installer PM2 globalement
npm install -g pm2

# Aller dans le dossier du bot
cd /var/www/discord-bot

# Installer les dépendances
npm install --production

# Créer le fichier .env
nano .env
# Ajoutez:
# BOT_TOKEN=votre_token_ici
# API_URL=https://api.vps115454.serveur-vps.net/api/discord/reaction

# Démarrer le bot avec PM2
pm2 start ecosystem.config.js

# Sauvegarder la configuration PM2
pm2 save

# Configurer PM2 pour démarrer au boot
pm2 startup
# Suivez les instructions affichées
```

### Option 2: Avec systemd

Créez le fichier `/etc/systemd/system/discord-bot.service` :

```ini
[Unit]
Description=Discord Bot pour inscriptions formations
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/discord-bot
Environment=NODE_ENV=production
ExecStart=/usr/bin/node /var/www/discord-bot/bot.js
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

Puis :

```bash
# Recharger systemd
sudo systemctl daemon-reload

# Activer le service au démarrage
sudo systemctl enable discord-bot

# Démarrer le service
sudo systemctl start discord-bot

# Vérifier le statut
sudo systemctl status discord-bot
```

## 🔄 Déploiement automatique

Le script `deploy.sh` à la racine du projet gère automatiquement :
- La mise à jour du code (git pull)
- L'installation des dépendances
- Le redémarrage du bot

### Utilisation

```bash
# Rendre le script exécutable
chmod +x deploy.sh

# Lancer le déploiement
./deploy.sh
```

## 📝 Commandes utiles

### Avec PM2

```bash
# Voir les logs
pm2 logs discord-bot

# Voir le statut
pm2 status

# Redémarrer
pm2 restart discord-bot

# Arrêter
pm2 stop discord-bot

# Voir les métriques
pm2 monit
```

### Avec systemd

```bash
# Voir les logs
sudo journalctl -u discord-bot -f

# Redémarrer
sudo systemctl restart discord-bot

# Arrêter
sudo systemctl stop discord-bot

# Voir le statut
sudo systemctl status discord-bot
```

## 🔐 Sécurité

⚠️ **Important** : Le fichier `.env` contenant le token ne doit **JAMAIS** être commité.

Vérifiez que `.env` est dans `.gitignore` :

```bash
cd /var/www/discord-bot
git check-ignore .env
# Doit afficher: .env
```

## 🐛 Dépannage

### Le bot ne démarre pas

1. Vérifiez que le fichier `.env` existe et contient `BOT_TOKEN`
2. Vérifiez les logs :
   - PM2: `pm2 logs discord-bot`
   - systemd: `sudo journalctl -u discord-bot -n 50`
3. Testez manuellement :
   ```bash
   cd /var/www/discord-bot
   node bot.js
   ```

### Le bot se redémarre en boucle

1. Vérifiez les logs pour identifier l'erreur
2. Vérifiez que l'API Symfony est accessible depuis le serveur
3. Vérifiez que le token Discord est valide

### Le bot ne détecte pas les réactions

1. Vérifiez que le bot a les permissions nécessaires sur Discord
2. Vérifiez que l'intent `GuildMembers` est activé dans le Developer Portal
3. Vérifiez les logs pour voir si des erreurs sont générées

