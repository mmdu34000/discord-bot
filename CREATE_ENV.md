# Créer le fichier .env sur le serveur

## 🚀 Création rapide

Sur votre serveur, exécutez :

```bash
cd /var/www/discord-bot
nano .env
```

Puis ajoutez ces lignes (remplacez `VOTRE_TOKEN_BOT_DISCORD` par le vrai token) :

```
BOT_TOKEN=VOTRE_TOKEN_BOT_DISCORD
API_URL=https://api.vps115454.serveur-vps.net/api/discord/reaction
```

Sauvegardez avec `Ctrl+O`, puis `Enter`, puis `Ctrl+X`.

## 🔐 Où trouver le token du bot Discord

1. Allez sur https://discord.com/developers/applications
2. Sélectionnez votre application/bot
3. Allez dans l'onglet **Bot**
4. Cliquez sur **Reset Token** ou copiez le token existant
5. ⚠️ **NE PARTAGEZ JAMAIS CE TOKEN**

## ✅ Vérification

Après avoir créé le fichier, vérifiez qu'il existe :

```bash
cd /var/www/discord-bot
ls -la .env
cat .env
```

Vous devriez voir :
```
BOT_TOKEN=MTQzMzE1NDEzNDQ5MTc5NTUyNw.GMtmRQ...
API_URL=https://api.vps115454.serveur-vps.net/api/discord/reaction
```

## 🔄 Redémarrer le bot

Une fois le fichier `.env` créé, redémarrez le bot :

```bash
cd /var/www/discord-bot
pm2 restart discord-bot
```

Ou si le bot n'est pas encore démarré :

```bash
pm2 start ecosystem.config.js
pm2 save
```

## 📝 Vérifier les logs

Pour voir si le bot démarre correctement :

```bash
pm2 logs discord-bot --lines 20
```

Vous devriez voir :
```
✅ Bot connecté en tant que [Nom du bot]!
🤖 Bot prêt à écouter les réactions ✅
```

## ⚠️ Sécurité

- Le fichier `.env` est dans `.gitignore` et ne sera **JAMAIS** commité
- Ne partagez jamais le token publiquement
- Si le token est compromis, régénérez-le immédiatement sur Discord

