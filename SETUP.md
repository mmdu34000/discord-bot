# Configuration du bot Discord

## 🔐 Configuration des variables d'environnement

Pour sécuriser votre token, créez un fichier `.env` à la racine du projet :

```bash
# Créer le fichier .env
touch .env
```

Puis ajoutez-y :

```
BOT_TOKEN=VOTRE_TOKEN_BOT_DISCORD
API_URL=https://api.vps115454.serveur-vps.net/api/discord/reaction
```

⚠️ **Le fichier `.env` est dans `.gitignore` et ne sera jamais commité.**

## 🚀 Lancer le bot

```bash
npm start
```

Ou :

```bash
node bot.js
```

## 📝 Commandes Git

### Premier commit

```bash
git add .
git commit -m "Initial commit: Bot Discord pour inscription automatique"
```

### Vérifier l'état

```bash
git status
```

### Voir les fichiers ignorés

```bash
git status --ignored
```

Le fichier `.env` ne devrait **PAS** apparaître dans `git status`.

