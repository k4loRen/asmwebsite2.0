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

// Recuperation des articles
// Initialisez Firebase Firestore

// Récupérer la référence de la collection Firestore
const db = firebase.firestore();
const collectionRef = db.collection('articles');

// Récupérer le tableau HTML où les données seront affichées
const news_container = document.getElementById("news");
const foot_news_container = document.getElementById("foot-news");

// Écouter les mises à jour de la collection en temps réel
collectionRef.orderBy("date", "desc").onSnapshot((querySnapshot) => {
    // Supprimer toutes les lignes précédentes
    news_container.innerHTML = "";

    querySnapshot.forEach((doc) => {
        const div = document.createElement('div');
        div.className = 'col-md-4';

        let resume = doc.data().resume;
        // Vérifier la longueur du texte du résumé et ajouter des espaces blancs si nécessaire
        const lineCount = (resume.match(/\n/g) || []).length + 1; // compter le nombre de lignes dans le texte
        if (lineCount < 4) {
            const remainingLines = 4 - lineCount; // calculer le nombre de lignes restantes
            for (let i = 0; i < remainingLines; i++) {
                resume += "\n"; // ajouter des espaces blancs pour atteindre 4 lignes
            }
        }

        div.innerHTML = `
        <div class="item">
          <a href="/article-details?id=${doc.id}" class="img-wrap"><img src="${doc.data().imageUrl}" alt="news-single" style="width: 100%; height: 200px;"></a>
          <a href="news-single.html" class="name" style="-webkit-line-clamp: 2;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;">${doc.data().titre}</a>
          <div class="date mt-4"><a href="news-single.html">${doc.data().date}</a> par <a
            href="news-single.html">${doc.data().auteur}</a></div>
          <p style="-webkit-line-clamp: 4;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;">${resume}</p>
        </div>
      `;

        news_container.appendChild(div);
    });

    const last_news_div = document.createElement('div');
    last_news_div.className = 'item';

    last_news_div.innerHTML = `
        <a href="news.html" class="image"><img class="img-responsive" src="${querySnapshot.docs[0].data().imageUrl}" alt="news-image"></a>
                            <a href="news.html" class="name">${querySnapshot.docs[0].data().titre}</a>
                            <a href="news.html" class="date">${querySnapshot.docs[0].data().date}</a>
                            <span class="separator">dans</span>
                            <a href="news.html" class="category">News</a>
      `;

      foot_news_container.appendChild(last_news_div);
});


// Recuperation des events
// Initialisez Firebase Firestore

// Récupérer la référence de la collection Firestore
const collectionEventsRef = db.collection('events');

// Récupérer le tableau HTML où les données seront affichées
const event_container = document.getElementById("events-container");

// Écouter les mises à jour de la collection en temps réel
collectionEventsRef.orderBy("date", "desc").onSnapshot((querySnapshot) => {
    // Supprimer toutes les lignes précédentes
    event_container.innerHTML = "";

    querySnapshot.forEach((doc) => {
        const div = document.createElement('div');
        div.className = 'col-md-4';

        div.innerHTML = `
        <div class="staff-item">
            <a href="player.html">
                <span class="info">
                    <span class="name">${doc.data().titre}</span>
                    <span class="position">Left Forward</span>
                    <span class="number">14</span>
                </span>
                <img src="${doc.data().imageUrl}" alt="person-slider">
            </a>
        </div>
      `;

        event_container.appendChild(div);
    });
});
