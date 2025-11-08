# Pousser le code sur GitHub

Votre dépôt GitHub est configuré : https://github.com/mmdu34000/discord-bot

## 📤 Pousser le code

### Première fois (push initial)

```bash
cd discord-bot
git push -u origin main
```

### Les fois suivantes

```bash
git add .
git commit -m "Description des modifications"
git push
```

## ✅ Vérifications avant de pousser

1. **Vérifier que `.env` n'est pas commité** :
```bash
git status
# Le fichier .env ne doit PAS apparaître
```

2. **Vérifier les fichiers qui seront poussés** :
```bash
git status
```

## 🔐 Sécurité

⚠️ **IMPORTANT** : Le fichier `.env` contenant le token du bot est dans `.gitignore` et ne sera **JAMAIS** poussé sur GitHub.

Si vous voyez `.env` dans `git status`, ne le commitez **JAMAIS** !

## 📝 Commandes utiles

```bash
# Voir l'état
git status

# Voir les fichiers qui seront poussés
git status --short

# Voir l'historique
git log --oneline

# Voir les différences
git diff
```

