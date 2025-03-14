// public/javascripts/movieSearch.js

document.addEventListener('DOMContentLoaded', () => {

    const movieForm = document.getElementById('movieForm');
    const movieInfoDiv = document.getElementById('movieInfo');

    movieForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const movieName = document.getElementById('movieName').value;

        fetch('/getMovieInfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ movieName: movieName })
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => { throw new Error(data.error || `Errore HTTP: ${response.status}`); });
                }
                return response.json();
            })
            .then(data => {
                if (data.error) {
                    renderErrorInfo(data.error);
                } else {
                    renderMovieList(data); // Visualizza la lista dei film
                }
            })
            .catch(error => {
                console.error('Errore durante la richiesta:', error);
                renderErrorInfo(error.message);
            });
    });

    function renderMovieList(movies) {
        let html = '';
        if (movies.length > 0) {
            html = '<div class="row">';
            movies.forEach(movie => {
                // Usa movie.posterUrl, gestendo il caso in cui sia null/undefined
                const posterUrl = movie.posterUrl || '/images/placeholder.jpg';

                html += `
                    <div class="col-md-4 mb-3">
                        <div class="card h-100">
                            <img src="${posterUrl}" class="card-img-top" alt="Locandina di ${movie.name}">
                            <div class="card-body">
                                <h5 class="card-title">${movie.name}</h5>
                                <p class="card-text">Anno: ${movie.date}</p>
                                <a href="/movie-details/${movie.id}" class="btn btn-primary">Dettagli</a>
                            </div>
                        </div>
                    </div>
                `;
            });
            html += '</div>';
        } else {
            html = '<div class="alert alert-info" role="alert">Nessun film trovato.</div>';
        }
        movieInfoDiv.innerHTML = html;
    }



    function renderErrorInfo(message) {
        movieInfoDiv.innerHTML = `<div class="alert alert-danger" role="alert">${message}</div>`;
    }
});