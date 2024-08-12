# DevBoost Snippet Manager

DevBoost Snippet Manager est une extension Chrome pour gérer vos snippets de code. Ajoutez, organisez, modifiez et supprimez vos morceaux de code facilement directement depuis votre navigateur.

## Fonctionnalités

- **Ajouter des snippets** : Enregistrez des morceaux de code avec un nom, du contenu, et des tags.
- **Gérer les snippets** : Modifiez ou supprimez des snippets existants.
- **Filtrer par tags** : Organisez et retrouvez facilement vos snippets en les filtrant par tags.
- **Interface utilisateur intuitive** : Utilisez des onglets pour basculer entre l'ajout et la gestion des snippets.

## Prérequis

- **Google Chrome** : L'extension est compatible avec le navigateur Chrome.
- **Connaissances basiques en HTML/CSS/JavaScript** : Utile pour personnaliser ou contribuer au développement de l'extension.

## Installation

1. **Clonez ou téléchargez le dépôt** :
   - Clonez via Git :
     ```bash
     git clone https://github.com/votre-utilisateur/devboost-snippet-manager.git
     ```
   - Ou téléchargez le fichier ZIP depuis le dépôt et extrayez-le.

2. **Ouvrez Google Chrome**.

3. **Accédez à la page des extensions** :
   - Tapez `chrome://extensions/` dans la barre d'adresse et appuyez sur `Entrée`.

4. **Activez le mode développeur** :
   - En haut à droite de la page des extensions, activez l'interrupteur "Mode développeur".

5. **Chargez l'extension** :
   - Cliquez sur "Charger l'extension décompressée".
   - Sélectionnez le dossier où vous avez cloné ou extrait le dépôt.

6. **L'extension est maintenant installée** :
   - Vous devriez voir l'icône de l'extension dans la barre d'outils de Chrome.

## Utilisation

1. **Ajouter un snippet** :
   - Cliquez sur l'icône de l'extension dans la barre d'outils Chrome.
   - Sélectionnez l'onglet "Ajouter un Snippet".
   - Remplissez le nom, le contenu, et les tags (facultatifs) du snippet.
   - Cliquez sur "Ajouter".

2. **Gérer les snippets** :
   - Sélectionnez l'onglet "Gérer les Snippets".
   - Utilisez le menu déroulant pour filtrer les snippets par tags.
   - Cliquez sur "Modifier" pour éditer un snippet ou sur "Supprimer" pour le supprimer.

3. **Modifier un snippet** :
   - Après avoir cliqué sur "Modifier", les informations du snippet seront pré-remplies dans le formulaire.
   - Modifiez les champs nécessaires et cliquez sur "Ajouter" pour enregistrer les changements.

4. **Supprimer un snippet** :
   - Cliquez sur "Supprimer" à côté du snippet que vous souhaitez effacer.

## Structure des fichiers

- `popup.html` : Structure de la page popup de l'extension.
- `styles.css` : Styles CSS pour la popup, incluant les onglets et les formulaires.
- `popup.js` : Fichier JavaScript pour gérer les interactions utilisateurs et la logique de l'extension.
- `README.md` : Documentation de l'extension (ce fichier).

## Explication du HTML (`popup.html`)

<body> : Contient le contenu principal de la popup de l'extension.
<div class="tabs"> : Contient les boutons pour basculer entre les onglets.
<div id="addSnippet" class="tab-content active"> : Section pour ajouter un snippet, affichée par défaut.
<div id="manageSnippets" class="tab-content"> : Section pour gérer les snippets, cachée par défaut.


## Explication des fonctions JavaScript

### 1. **Chargement des snippets**

```javascript
function loadSnippets(filterTag = '') {
    const snippets = getSnippets();
    snippetsList.innerHTML = '';

    const filteredSnippets = filterTag ? snippets.filter(snippet => snippet.tags.includes(filterTag)) : snippets;

    filteredSnippets.forEach((snippet, index) => {
        const snippetDiv = document.createElement('div');
        snippetDiv.className = 'snippet';

        snippetDiv.innerHTML = `
            <strong>${snippet.name}</strong>
            <small>Tags: ${snippet.tags}</small>
            <pre>${snippet.content}</pre>
            <button class="edit">Modifier</button>
            <button class="delete">Supprimer</button>
        `;

        snippetDiv.querySelector('.edit').addEventListener('click', function () {
            snippetNameInput.value = snippet.name;
            snippetContentInput.value = snippet.content;
            snippetTagsInput.value = snippet.tags;
            editIndex = index;
        });

        snippetDiv.querySelector('.delete').addEventListener('click', function () {
            deleteSnippet(index);
        });

        snippetsList.appendChild(snippetDiv);
    });
}
Description : Cette fonction charge les snippets stockés dans le localStorage et les affiche dans la liste. Elle applique un filtre si un tag est spécifié.
Processus :
Récupère tous les snippets avec getSnippets().
Filtre les snippets selon le tag sélectionné.
Affiche chaque snippet dans un élément HTML avec des boutons pour modification et suppression.
Attache des événements aux boutons pour éditer ou supprimer le snippet.

2. Ajouter un snippet

function addSnippet(name, content, tags) {
    const snippets = getSnippets();
    snippets.push({ name, content, tags });
    localStorage.setItem('snippets', JSON.stringify(snippets));
}
Description : Cette fonction ajoute un nouveau snippet à la liste des snippets stockés dans le localStorage.
Processus :
Récupère les snippets existants.
Ajoute le nouveau snippet.
Sauvegarde la liste mise à jour dans le localStorage.

3. Mettre à jour un snippet

function updateSnippet(index, name, content, tags) {
    const snippets = getSnippets();
    snippets[index] = { name, content, tags };
    localStorage.setItem('snippets', JSON.stringify(snippets));
}
Description : Cette fonction met à jour un snippet existant dans la liste.
Processus :
Récupère les snippets.
Modifie le snippet à l'index spécifié.
Sauvegarde la liste mise à jour.

4. Supprimer un snippet

function deleteSnippet(index) {
    const snippets = getSnippets();
    snippets.splice(index, 1);
    localStorage.setItem('snippets', JSON.stringify(snippets));
    loadSnippets();
    populateTagFilter();
}
Description : Cette fonction supprime un snippet de la liste.
Processus :
Récupère les snippets.
Supprime le snippet à l'index spécifié.
Sauvegarde la liste mise à jour et recharge les snippets pour refléter la suppression.

5. Obtenir les snippets

function getSnippets() {
    return JSON.parse(localStorage.getItem('snippets')) || [];
}
Description : Cette fonction récupère la liste des snippets stockés dans le localStorage.
Processus :
Obtient les snippets depuis le localStorage.
Parse les données JSON en un objet JavaScript.
Retourne un tableau vide si aucun snippet n'est trouvé.

6. Remplir la liste des tags pour le filtrage

function populateTagFilter() {
    const snippets = getSnippets();
    const tags = [];

    snippets.forEach(snippet => {
        snippet.tags.split(',').forEach(tag => {
            const trimmedTag = tag.trim();
            if (trimmedTag && !tags.includes(trimmedTag)) {
                tags.push(trimmedTag);
            }
        });
    });

    tagFilter.innerHTML = '<option value="">Tous les tags</option>';
    tags.forEach(tag => {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = tag;
        tagFilter.appendChild(option);
    });
}
Description : Cette fonction remplit la liste des tags dans le menu déroulant pour le filtrage des snippets.
Processus :
Récupère tous les snippets.
Extrait les tags uniques de chaque snippet.
Remplit le menu déroulant avec les tags disponibles.

7. Gérer les onglets

tabButtons.forEach(button => {
    button.addEventListener('click', function () {
        const tab = this.getAttribute('data-tab');

        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        this.classList.add('active');
        document.getElementById(tab).classList.add('active');
    });
});
Description : Cette fonction gère le basculement entre les onglets pour l'ajout et la gestion des snippets.
Processus :
Ajoute des écouteurs d'événements aux boutons d'onglet.
Lorsque l'utilisateur clique sur un onglet, il rend cet onglet actif et affiche le contenu associé, tout en désactivant les autres onglets.


Explication du CSS (styles.css)

Styles globaux : Définit des styles de base pour le corps du document, y compris la police et la mise en page.


Styles pour les onglets :

.tabs : Flexbox pour aligner les boutons d'onglet horizontalement.
.tab-button : Style de base pour les boutons d'onglet.
.tab-button.active : Style pour le bouton d'onglet actif, avec une bordure inférieure colorée.


Styles pour les contenus des onglets :

.tab-content : Caché par défaut.
.tab-content.active : Affiché lorsque l'onglet est actif.


Styles pour le formulaire d'ajout de snippet :

form : Flexbox en colonne pour aligner les éléments du formulaire.
input, textarea : Styles pour les champs de saisie et les zones de texte.
button : Styles pour les boutons, incluant les effets de survol.


Styles pour la liste des snippets :

#snippetsList : Marge au-dessus de la liste des snippets.
.snippet : Style pour chaque snippet, incluant la bordure et le padding.
.snippet pre : Assure que les longues lignes de code ne débordent pas.
