const firebaseConfig = {
    apiKey: "AIzaSyA7IM-QWajBdz4AJoQbXjhv20zwllkqct4",
    authDomain: "asm-v2-1.firebaseapp.com",
    projectId: "asm-v2-1",
    storageBucket: "asm-v2-1.appspot.com",
    messagingSenderId: "830524445349",
    appId: "1:830524445349:web:511d55630e618d93f0b34c",
    measurementId: "G-6E22TLERXD"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


// Crée un article
const form = document.getElementById('form_new_article');

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    console.log("form submit started");
    const formData = new FormData(form);
    console.log(formData);

    const submitBtn = document.getElementById("submit");

    if (!submitBtn.classList.contains('modifier')) {
        // Le bouton n'a pas la classe "modifier"
        // Effectuez ici les opérations de création sur Firestore
        axios({
            method: 'post',
            url: '/admin/create_article',
            data: formData,
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then(function (response) {
                //handle success
                console.log(response);
                // Fermeture de la modal
                $("#large-Modal").modal("hide");

                // Réinitialisation du formulaire
                document.querySelector("#form_new_article").reset();
            })
            .catch(function (response) {
                //handle error
                console.log(response);
            });
    }


});


// Recuperation des articles
// Initialisez Firebase Firestore

// Récupérer la référence de la collection Firestore
const db = firebase.firestore();
const collectionRef = db.collection('articles');

// Récupérer le tableau HTML où les données seront affichées
const table = document.getElementById("tab-article");

// Écouter les mises à jour de la collection en temps réel
collectionRef.orderBy("date", "desc").onSnapshot((querySnapshot) => {
    // Supprimer toutes les lignes précédentes du tableau
    table.innerHTML = "";

    querySnapshot.forEach((doc) => {
        // Créer une nouvelle ligne pour chaque document dans la collection
        const row = table.insertRow(-1);

        // Ajouter les données de chaque document aux colonnes de la ligne en coupant le texte s'il est trop long
        row.insertCell(0).innerHTML = doc.data().titre.substring(0, 50) + (doc.data().titre.length > 50 ? "..." : "");
        row.insertCell(1).innerHTML = doc.data().date.substring(0, 10);
        row.insertCell(2).innerHTML = doc.data().categorie.substring(0, 20) + (doc.data().categorie.length > 20 ? "..." : "");
        row.insertCell(3).innerHTML = doc.data().auteur.substring(0, 20) + (doc.data().auteur.length > 20 ? "..." : "");
        row.insertCell(4).innerHTML = doc.data().source.substring(0, 20) + (doc.data().source.length > 20 ? "..." : "");
        row.insertCell(5).innerHTML = doc.data().imageUrl.substring(0, 20) + (doc.data().imageUrl.length > 20 ? "..." : "");

        // Ajouter des boutons "Modifier" et "Supprimer" à la fin de la ligne
        const editButton = document.createElement("button");
        editButton.textContent = "Modifier";
        editButton.classList.add("btn", "btn-warning", "btn-show-update-modal");
        editButton.setAttribute("data-toggle", "modal");
        editButton.setAttribute("data-target", "#large-Modal");
        editButton.addEventListener("click", () => {
            // Logique pour modifier le document ici
            console.log("Modifier le document", doc.id);
            showUpdateModal(doc);
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Supprimer";
        deleteButton.classList.add("btn", "btn-danger", "mx-2");
        deleteButton.addEventListener("click", () => {
            // Logique pour supprimer le document ici
            console.log("Supprimer le document", doc.id);
            Swal.fire({
                title: 'Suppression !',
                text: "Voulez vous vraiment supprimé cette article ?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Oui, supprimer!'
            }).then((result) => {
                if (result.isConfirmed) {
                    db.collection("articles").doc(doc.id).delete().then(() => {
                        console.log("Document supprimé avec succès !");
                        Swal.fire(
                            'Supprimé!',
                            'Document supprimé avec succès !',
                            'success'
                        )
                    }).catch((error) => {
                        console.error("Erreur lors de la suppression du document : ", error);
                    });

                }
            })
        });

        const cell = row.insertCell(-1);
        cell.appendChild(editButton);
        cell.appendChild(deleteButton);
    });
});

// Mettre a jour l'article

function showUpdateModal(doc) {
    // On change le texte du bouton et on ajoute la classe "modifier" pour le distinguer
    const submitBtn = document.getElementById("submit");
    submitBtn.textContent = "Modifier l'article";
    submitBtn.classList.add("modifier");

    // Récupérer la modal et les éléments HTML correspondants
    const modal = document.getElementById('large-Modal');
    const form = document.getElementById('form_new_article');
    const titreInput = form.querySelector('[name="titre"]');
    const auteurInput = form.querySelector('[name="auteur"]');
    const dateInput = form.querySelector('[name="date"]');
    const sourceInput = form.querySelector('[name="source"]');
    const categorieInput = form.querySelector('[name="categorie"]');
    const resumeInput = form.querySelector('[name="resume"]');
    const contenuInput = form.querySelector('[name="contenu"]');

    // Pré-remplir les champs de formulaire avec les données du document Firestore
    titreInput.value = doc.data().titre;
    auteurInput.value = doc.data().auteur;
    dateInput.value = doc.data().date;
    sourceInput.value = doc.data().source;
    categorieInput.value = doc.data().categorie;
    resumeInput.value = doc.data().resume;
    contenuInput.value = doc.data().contenu;



    // Ajouter un listener sur le formulaire pour gérer la modification de l'article
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (submitBtn.classList.contains('modifier')) {
            // Le bouton a la classe "modifier"
            // Effectuez ici les opérations de modification sur Firestore
            const updatedArticle = {
                titre: titreInput.value,
                resume: resumeInput.value,
                contenu: contenuInput.value,
            };

            // Mettre à jour le document Firestore avec les nouvelles données
            db.collection('articles')
                .doc(doc.id)
                .update(updatedArticle)
                .then(() => {
                    // Fermeture de la modal
                    $("#large-Modal").modal("hide");

                    // Réinitialisation du formulaire
                    document.querySelector("#form_new_article").reset();

                    // On enlève la classe "modifier" du bouton submit et on remet le texte initial
                    submitBtn.classList.remove("modifier");
                    submitBtn.textContent = "Créer l'article";
                })
                .catch((error) => {
                    console.error('Error updating document: ', error);
                });
        }

    });

    // Afficher la modal
    //modal.show();
}

function editArticle(doc) {
    // Remplissage des champs du formulaire avec les données du document Firestore
    document.querySelector("#form_new_article [name='titre']").value = doc.data().titre;
    document.querySelector("#form_new_article [name='categorie']").value = doc.data().categorie;
    document.querySelector("#form_new_article [name='auteur']").value = doc.data().auteur;
    document.querySelector("#form_new_article [name='source']").value = doc.data().source;
    document.querySelector("#form_new_article [name='date']").value = doc.data().date;
    document.querySelector("#form_new_article [name='resume']").value = doc.data().resume;
    document.querySelector("#form_new_article [name='contenu']").value = doc.data().contenu;

    // On ajoute un écouteur d'événement sur le formulaire pour gérer la soumission
    document.querySelector("#form_new_article").addEventListener("submit", (event) => {
        event.preventDefault();

        // Récupération des données du formulaire
        const titre = document.querySelector("#form_new_article [name='titre']").value;
        const categorie = document.querySelector("#form_new_article [name='categorie']").value;
        const auteur = document.querySelector("#form_new_article [name='auteur']").value;
        const source = document.querySelector("#form_new_article [name='source']").value;
        const date = document.querySelector("#form_new_article [name='date']").value;
        const resume = document.querySelector("#form_new_article [name='resume']").value;
        const contenu = document.querySelector("#form_new_article [name='contenu']").value;

        if (submitBtn.classList.contains('modifier')) {
            // Le bouton a la classe "modifier"
            // Effectuez ici les opérations de modification sur Firestore
            // Modification du document Firestore avec les nouvelles données
            db.collection("articles").doc(doc.id).update({
                titre: titre,
                categorie: categorie,
                resume: resume,
                contenu: contenu,
            }).then(() => {
                // Fermeture de la modal
                $("#large-Modal").modal("hide");

                // Réinitialisation du formulaire
                document.querySelector("#form_new_article").reset();

                // On enlève la classe "modifier" du bouton submit et on remet le texte initial
                submitBtn.classList.remove("modifier");
                submitBtn.textContent = "Créer l'article";
            }).catch((error) => {
                console.error("Erreur lors de la modification de l'article :", error);
            });
        } else {

        }

    });

    // Ouverture de la modal
    //$("#large-Modal").modal("show");
}



