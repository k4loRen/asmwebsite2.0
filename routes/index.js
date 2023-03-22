var express = require('express');
var router = express.Router();
const admin = require('firebase-admin');
require("../config/firebase-admin-init");
const db = admin.firestore();

/* GET home page. */
/* router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
}); */

const fs = require('fs');
const path = require('path');

router.get('/', function(req, res, next) {
  const photoDir = path.join(__dirname, '../public/images/index-galerie/');
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
  let photoFiles = [];

  fs.readdir(photoDir, function(err, files) {
    if (err) {
      console.error(err);
      return next(err);
    }

    files.forEach(function(file) {
      const extname = path.extname(file);

      if (allowedExtensions.includes(extname.toLowerCase())) {
        photoFiles.push(file);
      }
    });

    res.render('index', { title: 'Express', photos: photoFiles });
  });
});


// Route pour récupérer les détails d'un article à partir de l'identifiant
router.get('/article-details', (req, res) => {
  // Récupérer l'identifiant à partir du paramètre "id" dans l'URL
  const id = req.query.id;

  // Récupérer les détails de l'article correspondant à partir de la base de données
  db.collection('articles').doc(id).get()
    .then(doc => {
      if (!doc.exists) {
        // Si le document n'existe pas, renvoyer une erreur 404
        res.status(404).send('Article introuvable');
      } else {
        // Si le document existe, renvoyer les détails de l'article au format JSON
        res.status(200).render("article_details", {article : doc.data()})
      }
    })
    .catch(error => {
      // En cas d'erreur, renvoyer une erreur 500 avec le message d'erreur
      res.status(500).send(error.message);
    });
});

/* GET mot du president page. */
router.get('/mot-du-president', function(req, res, next) {
  res.render('mot-du-president', { title: 'Express' });
});
/* GET valeurs du club page. */
router.get('/valeurs-du-club', function(req, res, next) {
  res.render('valeurs-du-club', { title: 'Express' });
});
/* GET a propos du club page. */
router.get('/a-propos-du-club', function(req, res, next) {
  res.render('a-propos', { title: 'Express' });
});
/* GET adhesion au club page. */
router.get('/adhesion', function(req, res, next) {
  res.render('adhesion', { title: 'Express' });
});
/* GET galerie page. */
/* router.get('/galerie-photos', function(req, res, next) {
  res.render('galerie-photos', { title: 'Express' });
}); */
router.get('/galerie-photos', function(req, res, next) {
  const photoDir = path.join(__dirname, '../public/images/galerie-photos/');
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
  let photoFiles = [];

  fs.readdir(photoDir, function(err, files) {
    if (err) {
      console.error(err);
      return next(err);
    }

    files.forEach(function(file) {
      const extname = path.extname(file);

      if (allowedExtensions.includes(extname.toLowerCase())) {
        photoFiles.push(file);
      }
    });

    res.render('galerie-photos', { title: 'Express', photos: photoFiles });
  });
});

module.exports = router;
