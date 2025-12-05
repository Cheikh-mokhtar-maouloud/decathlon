# 🏋️‍♂️ Antigravity | Web App d’Évaluation Sportive & Posturale

## Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [Screenshots / Demo](#screenshots--demo)
- [Technologies](#technologies)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [License](#license)
- [My Links](#my-links)

---

## 📌 Overview

**Antigravity** est une application web interactive qui évalue le **profil sportif et postural** d’un utilisateur à travers un QCM simple, puis lui propose :

- un exercice adapté selon ses besoins,  
- des instructions détaillées pour l’exécuter correctement,  
- des conseils personnalisés pour améliorer sa posture et éviter les blessures,  
- une petite zone Chat pour poser des questions.

Le tout fonctionne **sans backend**, grâce au **HTML, CSS, JavaScript** et un fichier **JSON dynamique** contenant les exercices.

Antigravity vise à rendre l’éducation sportive plus **simple, visuelle et accessible**.

---

## ⭐ Key Features

### 🎯 QCM Sport & Posture
Évaluation rapide du niveau sportif, posture, douleurs potentielles.

### 🔍 Recherche d’un Exercice
Page dédiée où l’utilisateur recherche et choisit **un seul exercice** parmi une liste dynamique.

### 🏋️ Fiche Exercice Détaillée
Après la sélection, une page dédiée affiche :

- l’image de l’exercice,  
- une description précise,  
- les étapes pour bien l’exécuter,  
- des conseils métiers (posture, respiration, technique).

### 💬 Mini Chat d’Assistance
Un petit assistant en JavaScript répond aux questions de base.

### 📱 Design Responsive
Compatible mobile, tablette et desktop.

### 📁 Gestion via JSON
Tous les exercices (nom, image, steps, références) sont chargés depuis **exercices.json**.

---

## 🏗️ System Architecture

```text
HTML / CSS / JavaScript
           │
           │
       JSON File
(Exercices + Images + Steps)
           │
           │
     LocalStorage API
(Stockage temporaire des choix)
```

### 🔸 Pages de l’application
- **Page 1 :** Accueil + informations utilisateur  
- **Page 2 :** QCM Sport & Posture  
- **Page 3 :** Recherche & choix d’un exercice  
- **Page 4 :** Résultats + Conseils + Instructions de l’exercice choisi  

Aucun backend n'est nécessaire.

---

## 🎥 Screenshots / Demo

*(À compléter plus tard : captures d’écran ou lien vers une vidéo de démonstration.)*

---

## 🛠️ Technologies

- **HTML5**
- **CSS3**
- **JavaScript (Vanilla JS)**
- **JSON**
- **LocalStorage**
- **Illustrations SVG/PNG**

---

## 🚀 Getting Started

### 1. Cloner le dépôt

```bash
git clone https://github.com/cheikhmokhtar/antigravity
cd antigravity
```

### 2. Lancer l’application

Ouvre simplement le fichier suivant dans ton navigateur :

```text
page1.html
```

Aucune installation ni serveur n’est nécessaire.

---

## 📂 Project Structure

```text
/images
    squat.png
    dog.png
    hipthrust.png
    plank.png
    sideplank.png
    ...
/css
    style.css
/js
    app.js
    qcm.js
    exercice.js
    result.js
exercices.json
page1.html
page2.html
page3.html
page4.html
README.md
```

---

## 📜 License

Ce projet est sous licence **MIT**.  
Tu peux le modifier, l’utiliser et le redistribuer librement.

---

## 🔗 My Links

[![Facebook](https://img.shields.io/badge/Facebook-1877F2?style=for-the-badge&logo=facebook&logoColor=white)](https://www.facebook.com/habib.sidiahmed.5)  
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/sidi-ahmed-habib-18163220a/)  
[![GitHub](https://img.shields.io/badge/GitHub-000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/)
