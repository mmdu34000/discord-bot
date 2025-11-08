# Bot Discord pour l'inscription automatique aux formations

Ce bot écoute les réactions ✅ sur les messages de session de formation et inscrit automatiquement les joueurs.

## 🚀 Installation rapide

### Étape 1 : Installer les dépendances

Ouvrez un terminal dans le dossier `discord-bot` et exécutez :

```bash
npm install
```

Cela installera :
- `discord.js` : Bibliothèque pour interagir avec Discord
- `axios` : Pour envoyer des requêtes HTTP à l'API Symfony

### Étape 2 : Configurer le bot

Ouvrez le fichier `bot.js` et modifiez ces deux lignes :

Créez un fichier `.env` à la racine du projet :

```
BOT_TOKEN=votre_token_bot_discord
API_URL=https://api.vps115454.serveur-vps.net/api/discord/reaction
```

Le code utilise automatiquement ces variables d'environnement.

**Où trouver le token du bot :**
1. Allez sur https://discord.com/developers/applications
2. Sélectionnez votre application
3. Allez dans l'onglet "Bot"
4. Cliquez sur "Reset Token" ou copiez le token existant
5. ⚠️ **NE PARTAGEZ JAMAIS CE TOKEN**

**URL de l'API :**
- En production : `https://api.vps115454.serveur-vps.net/api/discord/reaction`
- En local (développement) : `http://localhost:8000/api/discord/reaction`

### Étape 3 : Vérifier les Intents Discord

1. Allez sur https://discord.com/developers/applications
2. Sélectionnez votre bot
3. Onglet "Bot"
4. Activez **MESSAGE CONTENT INTENT** (obligatoire)

### Étape 4 : Lancer le bot

```bash
npm start
```

Ou directement :

```bash
node bot.js
```

Vous devriez voir :
```
✅ Bot connecté en tant que [Nom du bot]!
🤖 Bot prêt à écouter les réactions ✅
```

## 🧪 Tester le bot

1. Allez sur Discord dans un canal où il y a un message de session de formation
2. Ajoutez une réaction ✅ sur le message
3. Regardez la console du bot, vous devriez voir :
   ```
   📝 Réaction ✅ détectée:
      👤 Utilisateur: [Pseudo]
      ✅ [Pseudo] inscrit avec succès à la session
   ```

## 🔧 Dépannage

### Le bot ne se connecte pas

- Vérifiez que le token est correct
- Vérifiez que le bot est bien invité sur le serveur

### Le bot ne détecte pas les réactions

- Vérifiez que **MESSAGE CONTENT INTENT** est activé
- Vérifiez que le bot a les permissions de lire les messages

### Erreur "Pas de réponse de l'API"

- Vérifiez que le serveur Symfony est démarré
- Vérifiez que l'URL de l'API est correcte
- Vérifiez que le port est accessible (8000 par défaut)

### Le joueur n'est pas inscrit

- Vérifiez que le pseudo Discord correspond au pseudo dans la base de données
- Regardez les logs Symfony pour voir les erreurs détaillées

## 📝 Faire tourner le bot 24/7

Pour que le bot reste actif même quand vous fermez le terminal, utilisez **PM2** :

```bash
# Installer PM2 globalement
npm install -g pm2

# Lancer le bot avec PM2
pm2 start bot.js --name "discord-bot"

# Voir les logs
pm2 logs discord-bot

# Arrêter le bot
pm2 stop discord-bot

# Redémarrer le bot
pm2 restart discord-bot
```

## 📋 Checklist

- [ ] Node.js installé
- [ ] Dépendances installées (`npm install`)
- [ ] Token du bot configuré
- [ ] URL de l'API configurée
- [ ] MESSAGE CONTENT INTENT activé
- [ ] Bot lancé et connecté
- [ ] Test de réaction réussi

