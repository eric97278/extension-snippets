document.addEventListener('DOMContentLoaded', function () {
   const form = document.getElementById('snippet-form');
   const snippetNameInput = document.getElementById('snippet-name');
   const snippetContentInput = document.getElementById('snippet-content');
   const snippetTagsInput = document.getElementById('snippet-tags');
   const snippetsList = document.getElementById('snippets-list');
   const tagFilter = document.getElementById('tag-filter');
   const tabButtons = document.querySelectorAll('.tab-button');
   const tabContents = document.querySelectorAll('.tab-content');

   let editIndex = -1; // Index du snippet en cours d'édition (initialisé à -1 pour l'ajout de nouveaux snippets)

   // Charger les snippets existants au démarrage
   loadSnippets();
   populateTagFilter();

   // Gérer le formulaire de snippets
   form.addEventListener('submit', function (e) {
      e.preventDefault();
      const snippetName = snippetNameInput.value.trim();
      const snippetContent = snippetContentInput.value.trim();
      const snippetTags = snippetTagsInput.value.trim();

      // Ajouter ou mettre à jour un snippet selon le cas
      if (snippetName && snippetContent) {
         if (editIndex === -1) {
            addSnippet(snippetName, snippetContent, snippetTags);
         } else {
            updateSnippet(editIndex, snippetName, snippetContent, snippetTags);
            editIndex = -1;
         }
         // Réinitialiser le formulaire
         snippetNameInput.value = '';
         snippetContentInput.value = '';
         snippetTagsInput.value = '';
         loadSnippets();
         populateTagFilter();
      }
   });

   // Filtrer les snippets par tag
   tagFilter.addEventListener('change', function () {
      loadSnippets(this.value);
   });

   // Gérer le basculement entre les onglets
   tabButtons.forEach(button => {
      button.addEventListener('click', function () {
         const tab = this.getAttribute('data-tab');

         // Changer l'onglet actif
         tabButtons.forEach(btn => btn.classList.remove('active'));
         tabContents.forEach(content => content.classList.remove('active'));

         this.classList.add('active');
         document.getElementById(tab).classList.add('active');
      });
   });

   // Ajouter un nouveau snippet à la liste
   function addSnippet(name, content, tags) {
      const snippets = getSnippets();
      snippets.push({ name, content, tags });
      localStorage.setItem('snippets', JSON.stringify(snippets));
   }

   // Mettre à jour un snippet existant
   function updateSnippet(index, name, content, tags) {
      const snippets = getSnippets();
      snippets[index] = { name, content, tags };
      localStorage.setItem('snippets', JSON.stringify(snippets));
   }

   // Supprimer un snippet de la liste
   function deleteSnippet(index) {
      const snippets = getSnippets();
      snippets.splice(index, 1);
      localStorage.setItem('snippets', JSON.stringify(snippets));
      loadSnippets();
      populateTagFilter();
   }

   // Charger les snippets et les afficher selon le tag sélectionné
   function loadSnippets(filterTag = '') {
      const snippets = getSnippets();
      snippetsList.innerHTML = '';

      // Filtrer les snippets par tag si un tag est sélectionné
      const filteredSnippets = filterTag ? snippets.filter(snippet => snippet.tags.includes(filterTag)) : snippets;

      // Afficher chaque snippet
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

         // Gérer la modification du snippet
         snippetDiv.querySelector('.edit').addEventListener('click', function () {
            snippetNameInput.value = snippet.name;
            snippetContentInput.value = snippet.content;
            snippetTagsInput.value = snippet.tags;
            editIndex = index;
         });

         // Gérer la suppression du snippet
         snippetDiv.querySelector('.delete').addEventListener('click', function () {
            deleteSnippet(index);
         });

         snippetsList.appendChild(snippetDiv);
      });
   }

   // Obtenir les snippets depuis le localStorage
   function getSnippets() {
      return JSON.parse(localStorage.getItem('snippets')) || [];
   }

   // Remplir la liste des tags pour le filtrage
   function populateTagFilter() {
      const snippets = getSnippets();
      const tags = [];

      // Extraire les tags de tous les snippets
      snippets.forEach(snippet => {
         snippet.tags.split(',').forEach(tag => {
            const trimmedTag = tag.trim();
            if (trimmedTag && !tags.includes(trimmedTag)) {
               tags.push(trimmedTag);
            }
         });
      });

      // Remplir le filtre de tags
      tagFilter.innerHTML = '<option value="">Tous les tags</option>';
      tags.forEach(tag => {
         const option = document.createElement('option');
         option.value = tag;
         option.textContent = tag;
         tagFilter.appendChild(option);
      });
   }
});
