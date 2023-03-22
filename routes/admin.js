const express = require("express");
const router = express.Router();
const passport = require("passport");
const admin = require('firebase-admin');
require("../config/firebase-admin-init");
const date = require('../config/server-local-date');
const const_admin = require('../config/const-admin');
const db = admin.firestore();
const multer = require('multer');
const request = require('request-promise');
const upload = multer({ storage: multer.memoryStorage() });
const { forwardAuthenticated, ensureAuthenticated } = require("../controllers/auth");

// Login Page
router.get("/login", forwardAuthenticated, (req, res) => {
    //req.flash('success_msg', 'Vous êtes déconnecté.');
    res.render('./admin/login', { title: 'Admin Login' })
});

//Dashboard
router.get("/index", ensureAuthenticated, (req, res) => res.render('./admin/index', { title: 'Admin dashboard' }));

//Breaking news
router.get("/breaking_news", ensureAuthenticated, (req, res) => res.render('./admin/breaking_news', { title: 'Admin dashboard' }));

// Gestion des historiques
router.get("/main_events", ensureAuthenticated, (req, res) => res.render('./admin/main_events', { title: 'Admin dashboard' }));

// Gestion des historiques
router.get("/historique-matchs", ensureAuthenticated, (req, res) => res.render('./admin/historique_matchs', { title: 'Admin dashboard' }));

//Login
router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "./index",
        failureRedirect: "./login",
        //failureFlash: true,
    })(req, res, next);
});

//Logout
router.get('/logout', (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        console.log("logout");
        //req.flash('success_msg', 'Vous êtes déconnecté.');
        res.redirect('/admin/login');
    });
});

// Acces denied Page
router.get("/acces_denied", forwardAuthenticated, (req, res) =>
    res.render("./admin/acces_denied")
);


/* Admin Api */
// Crée un article
router.post("/create_article", upload.single('photo'), (req, res) => {

    // Référence à la collection Firestore
    const collectionRef = db.collection('articles');

    console.log("Server form submit received");

    const file = req.file;
    // Création Article sans photo
    if (!file) {
        req.body.imageUrl = "https://firebasestorage.googleapis.com/v0/b/asm-v2-1.appspot.com/o/news-img-placeholder.png?alt=media&token=db7f1352-306e-43f3-bb3a-af7de5a26ad8";
        req.body.date = date();
        req.body.auteur = const_admin.auteur;
        req.body.source = const_admin.source;
        createArticle(req.body);
        return;
    }

    if (file) {

        // Création Article avec photo
        const bucket = admin.storage().bucket();
        const blob = bucket.file(file.originalname);
        const blobStream = blob.createWriteStream();

        blobStream.on('error', (error) => {
            console.error(error);
            res.status(500).send('Une erreur s\'est produite lors du téléchargement du fichier.');
        });

        blobStream.on('finish', async () => {

            // Récupérer l'URL de téléchargement du fichier
            const baseStorageUrl = `https://firebasestorage.googleapis.com/v0/b/asm-v2-1.appspot.com/o/`;
            const imageRelativePath = encodeURIComponent(file.originalname).replace(/%2F/g, '/');
            const imageUrl = `${baseStorageUrl}${imageRelativePath}`;
           
            const metadataResponse = await request(imageUrl);
            const metadata = JSON.parse(metadataResponse);
            const publicImageUrl = `https://firebasestorage.googleapis.com/v0/b/asm-v2-1.appspot.com/o/${encodeURIComponent(file.originalname)}?alt=media&token=${metadata.downloadTokens}`;

            req.body.imageUrl = publicImageUrl;
            req.body.date = date();
            req.body.auteur = const_admin.auteur;
            req.body.source = const_admin.source;
            createArticle(req.body);
        });


        blobStream.end(file.buffer);
    }


    async function createArticle(data) {
        try {
            await collectionRef.add(data);
            console.log('Article crée avec succès');
            res.status(200).send('Article crée avec succès');
        } catch (error) {
            console.error('Erreur lors de la création du document :', error);
            res.status(500).send(`'Erreur lors de la création du document :  ${error}`);
        }
    }
});

// Crée un evenement
router.post("/create_event", upload.single('image'), (req, res) => {

    // Référence à la collection Firestore
    const collectionRef = db.collection('events');

    console.log("Server form submit received");

    const file = req.file;
    // Création Article sans photo
    if (!file) {
        req.body.imageUrl = "https://firebasestorage.googleapis.com/v0/b/asm-v2-1.appspot.com/o/news-img-placeholder.png?alt=media&token=db7f1352-306e-43f3-bb3a-af7de5a26ad8";
        req.body.date = date();
        req.body.auteur = const_admin.auteur;
        req.body.source = const_admin.source;
        createEvent(req.body);
        return;
    }

    if (file) {

        // Création Article avec photo
        const bucket = admin.storage().bucket();
        const blob = bucket.file(file.originalname);
        const blobStream = blob.createWriteStream();

        blobStream.on('error', (error) => {
            console.error(error);
            res.status(500).send('Une erreur s\'est produite lors du téléchargement du fichier.');
        });

        blobStream.on('finish', async () => {

            // Récupérer l'URL de téléchargement du fichier
            const baseStorageUrl = `https://firebasestorage.googleapis.com/v0/b/asm-v2-1.appspot.com/o/`;
            const imageRelativePath = encodeURIComponent(file.originalname).replace(/%2F/g, '/');
            const imageUrl = `${baseStorageUrl}${imageRelativePath}`;
           
            const metadataResponse = await request(imageUrl);
            const metadata = JSON.parse(metadataResponse);
            const publicImageUrl = `https://firebasestorage.googleapis.com/v0/b/asm-v2-1.appspot.com/o/${encodeURIComponent(file.originalname)}?alt=media&token=${metadata.downloadTokens}`;

            req.body.imageUrl = publicImageUrl;
            req.body.date = date();
            req.body.auteur = const_admin.auteur;
            req.body.source = const_admin.source;
            createEvent(req.body);
        });


        blobStream.end(file.buffer);
    }


    async function createEvent(data) {
        try {
            await collectionRef.add(data);
            console.log('Event crée avec succès');
            console.log(data);
            res.status(200).send('Event crée avec succès');
        } catch (error) {
            console.error('Erreur lors de la création du document :', error);
            res.status(500).send(`'Erreur lors de la création du document :  ${error}`);
        }
    }
});

module.exports = router;