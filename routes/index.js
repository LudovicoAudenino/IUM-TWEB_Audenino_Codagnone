// routes/index.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

const springBootServerUrl = 'http://localhost:8080/api/movies'; // URL *base* corretta

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Movie Database' });
});

// Modifica per usare il percorso e i parametri di Spring Boot
router.post('/getMovieInfo', async (req, res) => {
  const movieName = req.body.movieName;

  try {
    // Utilizzo il percorso di ricerca per nome di Spring Boot
    const response = await axios.get(`${springBootServerUrl}/search`, {
      params: { name: movieName },  // Passa il nome come parametro di query
      timeout: 5000,
    });

    // Spring Boot dovrebbe restituire una lista di film, anche se ne trova uno solo
    res.json(response.data);

  } catch (error) {
    // Gestione degli errori (come prima, ma semplificata)
    console.error('Errore:', error);
    let statusCode = 500;
    let errorMessage = 'Errore del server.';

    if (error.response) {
      statusCode = error.response.status;
      errorMessage = `Errore da Spring Boot: ${statusCode}`;
      if (statusCode === 404) {
        errorMessage = "Film non trovato";  // Messaggio più specifico
      }
    } else if (error.code === 'ECONNABORTED') {
      statusCode = 408;
      errorMessage = 'Tempo scaduto.';
    } else if (error.code === 'ERR_INVALID_URL') {
      statusCode = 500; // Errore, ma lato client, URL Express errato.
      errorMessage = "Errore, URL non valido";
    }
    res.status(statusCode).json({ error: errorMessage });
  }
});

router.get('/movie-details/:id', async (req, res) => {
  const movieId = req.params.id;

  try {
    // Richiesta per ottenere i dettagli del film (percorso corretto)
    const movieResponse = await axios.get(`${springBootServerUrl}/${movieId}`, {
      timeout: 5000,
    });

    if (movieResponse.status !== 200) {
      throw new Error(`Errore: ${movieResponse.status}`);
    }

    const movie = movieResponse.data; // Dati del film

    // Le recensioni non sono gestite in questa esercitazione,
    // ma le lascio commentate per riferimento futuro

    // const reviewsResponse = await axios.get(`${springBootServerUrl}/${movieId}/reviews`, {
    //   timeout: 5000,
    // });
    //
    // if (reviewsResponse.status !== 200) {
    //   throw new Error(`Errore: ${reviewsResponse.status}`);
    // }
    // const reviews = reviewsResponse.data;

    // Renderizza la vista 'movie-details', passando il film (e le recensioni, se presenti)
    res.render('movie-details', { title: 'Dettagli Film', movie: movie, reviews: [] }); // reviews: reviews


  } catch (error) {
    console.error('Errore:', error);
    let statusCode = 500;
    let errorMessage = 'Errore del server.';

    if (error.response) {
      statusCode = error.response.status;
      errorMessage = `Errore da Spring Boot: ${statusCode}`;
      if (statusCode === 404) {
        errorMessage = "Film non trovato";
      }
    } else if (error.code === 'ECONNABORTED') {
      statusCode = 408;
      errorMessage = 'Tempo Scaduto';
    } else if (error.code === 'ERR_INVALID_URL') {
      statusCode = 500; // Errore, ma lato client, URL Express errato.
      errorMessage = "Errore, URL non valido"
    }

    res.status(statusCode).render('error', { message: errorMessage, error: { status: statusCode } });
  }
});
module.exports = router;