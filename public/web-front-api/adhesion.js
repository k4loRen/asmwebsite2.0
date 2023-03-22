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

// Récupération du formulaire
const signupForm = document.getElementById('signup-form');

// Ajout d'un événement sur la soumission du formulaire
signupForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Empêche le formulaire de recharger la page

    // Récupération des champs
    const form = document.querySelector('#signup-form'); // sélectionnez le formulaire
    const nomPrenom = form.elements['nomPrenom'].value; // récupérer la valeur de Nom et prénom
    const dateNaissance = form.elements['dateNaissance'].value; // récupérer la valeur de Date de naissance
    const sexe = form.elements['sexe'].value; // récupérer la valeur de Sexe
    const ville = form.elements['ville'].value; // récupérer la valeur de Ville de résidence
    const telephone = form.elements['telephone'].value; // récupérer la valeur de Numéro de téléphone
    const email = form.elements['email'].value; // récupérer la valeur de Email
    const password1 = form.elements['password1'].value; // récupérer la valeur de Mot de passe
    const password2 = form.elements['password2'].value; // récupérer la valeur de Confirmer mot de passe
    const bio = form.elements['bio'].value; // récupérer la valeur de A propos de vous

    try {
        // Création du compte Firebase Auth
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password1);
        const user = userCredential.user;
      
        // Écriture des informations dans Firestore
        await firebase.firestore().collection('adherents').doc(user.uid).set({
            nomPrenom,
            dateNaissance,
            sexe,
            ville,
            telephone,
            email,
            bio,
      
        });
      
        // Ajout de l'écouteur d'authentification
        firebase.auth().onAuthStateChanged(user => {
          if (user) {
            alert(`Bienvenue ${user.email} !`);
          }
        });
      
        // Redirection vers la page d'accueil
        //window.location.href = '/'; // À remplacer par l'URL de votre choix
      } catch (error) {
        console.error(error);
        alert('Une erreur est survenue lors de la création du compte.');
      }
      
});
