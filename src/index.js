const express = require('express');
const connection = require('./config');

const port = 3000;
const app = express();

// Connexion
connection.connect(function (err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});

// Bienvenue sur l'API
app.get('/', (req, res) => {
  res.send('Welcome to the API listing the pages of my blog');
});

// Recupérer toutes les pages du site
app.get('/api/pages', (req, res) => {
  connection.query('SELECT * from titu_statistics_pages', (err, results) => {
    if (err) {
      res.status(500).send('Error retrieving data');
    } else {
      res.status(200).json(results);
    }
  });
});

// Recupérer une page par son id
app.get('/api/pages/:id', (req, res) => {
  connection.query(
    'SELECT * from titu_statistics_pages WHERE id = ?',
    [req.params.id],
    (err, results) => {
      if (err) {
        res.status(500).send('Error retrieving data');
      } else {
        res.status(200).json(results);
      }
    }
  );
});

// Recupérer une page qui est un article
app.get('/api/pages/posts', (req, res) => {
  connection.query(
    "SELECT * from titu_statistics_pages WHERE type = 'post'",
    (err, results) => {
      if (err) {
        res.status(500).send('Error retrieving data');
      } else {
        res.status(200).json(results);
      }
    }
  );
});

// Recupérer les commencant par 'presta'
app.get('/api/pages/presta', (req, res) => {
  connection.query(
    "SELECT * from titu_statistics_pages WHERE uri = 'presta%'",
    (err, results) => {
      if (err) {
        res.status(500).send('Error retrieving data');
      } else {
        res.status(200).json(results);
      }
    }
  );
});

// Recupérer les élements postérieurs à 2018
app.get('/api/pages/recent', (req, res) => {
  connection.query(
    'SELECT * from titu_statistics_pages WHERE date < 01-01-2018',
    (err, results) => {
      if (err) {
        res.status(500).send('Error retrieving data');
      } else {
        res.status(200).json(results);
      }
    }
  );
});

//  Récupérer les pages par dates de publication
app.get('/api/pages/sort', (req, res) => {
  connection.query(
    'SELECT * from titu_statistics_pages ORDER BY date ?',
    [req.query.asc ? 'ASC' : 'DESC'],
    (err, results) => {
      if (err) {
        res.status(500).send('Error retrieving data');
      } else {
        res.status(200).json(results);
      }
    }
  );
});

//  Ajouter une page à la liste des pages
app.post('/api/pages', (req, res) => {
  const { page_id, uri, type, date, count } = req.body;
  connection.query(
    'INSERT INTO titu_statistics_pages (page_id, uri, type, date, count) VALUES (?,?,?,?,?)',
    [page_id, uri, type, date, count],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error creating a new page');
      } else {
        res.status(200).send('New page created');
      }
    }
  );
});

//  Modifier les données d'une page listée
app.put('/api/page/:id', (req, res) => {
  connection.query(
    'UPDATE titu_statistics_pages SET ? WHERE id = ?',
    [req.body, req.params.id],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error updating a page');
      } else {
        res.status(200).send('Page list updated succesfully');
      }
    }
  );
});

app.put('/api/page/count/:id', (req, res) => {
  connection.query(
    'UPDATE titu_statistics_pages SET count = !count WHERE id = ?',
    [req.params.id],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error updating the status');
      } else {
        res.status(200).send('Status changed');
      }
    }
  );
});

app.delete('/api/page/:id', (req, res) => {
  connection.query(
    'DELETE FROM titu_statistics_pages WHERE id = ?',
    [req.params.id],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send(' Error deleting a page');
      } else {
        res.status(200).send('Page deleted!');
      }
    }
  );
});

app.delete('/api/page', (req, res) => {
  connection.query(
    'DELETE FROM titu_statistics_pages WHERE count = 0',
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error deleting page');
      } else {
        res.status(200).send('Page deleted!');
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Server is runing on 3000`);
});
