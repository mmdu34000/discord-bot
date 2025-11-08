# Installation du bot Discord sur le serveur

## 📋 Installation initiale

### Étape 1 : Cloner le dépôt

```bash
cd /var/www
git clone https://github.com/mmdu34000/discord-bot.git discord-bot
cd discord-bot
git checkout main
```

### Étape 2 : Installer les dépendances

```bash
npm install --production
```

### Étape 3 : Configurer le fichier .env

```bash
nano .env
```

Ajoutez :

```
BOT_TOKEN=votre_token_bot_discord
API_URL=https://api.vps115454.serveur-vps.net/api/discord/reaction
```

⚠️ **Important** : Remplacez `votre_token_bot_discord` par le vrai token de votre bot.

### Étape 4 : Installer et configurer PM2 (Recommandé)

```bash
# Installer PM2 globalement
npm install -g pm2

# Démarrer le bot
pm2 start ecosystem.config.js

# Sauvegarder la configuration
pm2 save

# Configurer PM2 pour démarrer au boot
pm2 startup
# Suivez les instructions affichées
```

### Étape 5 : Vérifier que le bot fonctionne

```bash
# Voir les logs
pm2 logs discord-bot

# Voir le statut
pm2 status
```

Vous devriez voir :
```
✅ Bot connecté en tant que [Nom du bot]!
🤖 Bot prêt à écouter les réactions ✅
```

## 🔄 Mise à jour (via le script de déploiement)

Une fois le bot installé, le script `deploy.sh` gérera automatiquement les mises à jour :

```bash
cd /var/www/fof  # ou là où se trouve deploy.sh
./deploy.sh
```

Le script va :
1. Mettre à jour le code (git pull)
2. Installer les dépendances
3. Redémarrer le bot automatiquement

## 🐛 Dépannage

### Le bot ne démarre pas

1. **Vérifier que le fichier .env existe** :
```bash
cd /var/www/discord-bot
ls -la .env
```

2. **Vérifier que le token est correct** :
```bash
cat .env | grep BOT_TOKEN
```

3. **Vérifier les logs PM2** :
```bash
pm2 logs discord-bot --lines 50
```

4. **Tester manuellement** :
```bash
cd /var/www/discord-bot
node bot.js
```

### Le bot ne détecte pas les réactions

1. Vérifier que les Intents sont activés sur Discord :
   - Allez sur https://discord.com/developers/applications
   - Activez **MESSAGE CONTENT INTENT** et **SERVER MEMBERS INTENT**

2. Vérifier que l'API est accessible :
```bash
curl https://api.vps115454.serveur-vps.net/api/discord/reaction
```

### Le bot se redémarre en boucle

1. Vérifier les logs pour identifier l'erreur :
```bash
pm2 logs discord-bot --err
```

2. Vérifier que l'API Symfony est accessible depuis le serveur

3. Vérifier que le token Discord est valide

## 📝 Commandes utiles

```bash
# Voir les logs en temps réel
pm2 logs discord-bot

# Redémarrer le bot
pm2 restart discord-bot

# Arrêter le bot
pm2 stop discord-bot

# Voir le statut
pm2 status

# Voir les métriques
pm2 monit
```

## 🔐 Sécurité

- Le fichier `.env` ne doit **JAMAIS** être commité
- Vérifiez que `.env` est dans `.gitignore` :
```bash
cd /var/www/discord-bot
git check-ignore .env
# Doit afficher: .env
```

