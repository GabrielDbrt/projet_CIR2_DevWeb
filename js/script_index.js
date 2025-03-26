document.addEventListener('DOMContentLoaded', () => {
    const apiKey = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNGFjZWU2Y2ZmMDBhNTNjYjE1NjE5NWNmNGEyM2M5MyIsIm5iZiI6MTczOTg4NDU0OS4zMjA5OTk5LCJzdWIiOiI2N2I0ODgwNTFlZDQ1Mjg0NTM5ZmI2NTQiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.xfyeXxd9pqUdNS2U8yLfciBOk5pl6hQvexrXowx6rVI';
    let currentTrendingType = 'day';
    let currentTvType = 'top_rated';
    let selectedGenre = '';
    let selectedYear = '';

    const fetchData = (url) => {
        return fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .catch(error => console.error('Erreur lors de la récupération des données:', error));
    };

    const updateTrendingMovies = (type, genre, year) => {
        let movieApiUrl = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&language=fr-FR`;

        if (type) {
            movieApiUrl += `&primary_release_date.gte=${type}`;
        }
        if (genre) {
            movieApiUrl += `&with_genres=${genre}`;
        }
        if (year) {
            movieApiUrl += `&year=${year}`;
        }

        fetchData(movieApiUrl)
            .then(data => {
                const tendancesContainer = document.getElementById('tendances');
                tendancesContainer.innerHTML = ''; // Efface le contenu actuel
                const numberOfMoviesToDisplay = 4;

                for (let i = 0; i < numberOfMoviesToDisplay && i < data.results.length; i++) {
                    const movie = data.results[i];
                    const movieCard = createMediaCard(movie, 'movie');
                    tendancesContainer.appendChild(movieCard);
                }
            });
    };

    const updatePopularTvShows = (type) => {
        const tvApiUrl = `https://api.themoviedb.org/3/tv/${type}?language=fr-FR`;
        fetchData(tvApiUrl)
            .then(data => {
                const populairesContainer = document.getElementById('populaires');
                populairesContainer.innerHTML = '';
                const numberOfShowsToDisplay = 4;

                for (let i = 0; i < numberOfShowsToDisplay && i < data.results.length; i++) {
                    const tvShow = data.results[i];
                    const tvCard = createMediaCard(tvShow, 'tv');
                    populairesContainer.appendChild(tvCard);
                }
            });
    };

    document.getElementById('day').addEventListener('click', () => {
        currentTrendingType = 'day';
        document.getElementById('day').classList.add('active');
        document.getElementById('week').classList.remove('active');
        updateTrendingMovies(currentTrendingType, selectedGenre, selectedYear);
    });

    document.getElementById('week').addEventListener('click', () => {
        currentTrendingType = 'week';
        document.getElementById('week').classList.add('active');
        document.getElementById('day').classList.remove('active');
        updateTrendingMovies(currentTrendingType, selectedGenre, selectedYear);
    });

    document.getElementById('top_rated').addEventListener('click', () => {
        currentTvType = 'top_rated';
        document.getElementById('top_rated').classList.add('active');
        document.getElementById('popular').classList.remove('active');
        updatePopularTvShows(currentTvType);
    });

    document.getElementById('popular').addEventListener('click', () => {
        currentTvType = 'popular';
        document.getElementById('popular').classList.add('active');
        document.getElementById('top_rated').classList.remove('active');
        updatePopularTvShows(currentTvType);
    });

    document.getElementById('genre-filter').addEventListener('change', (event) => {
        selectedGenre = event.target.value;
    });

    document.getElementById('year-filter').addEventListener('input', (event) => {
        selectedYear = event.target.value;
    });

    document.getElementById('apply-filters').addEventListener('click', () => {
        updateTrendingMovies(currentTrendingType, selectedGenre, selectedYear);
    });

    updateTrendingMovies(currentTrendingType, selectedGenre, selectedYear);
    updatePopularTvShows(currentTvType);

    const createMediaCard = (media, type) => {
        const mediaCard = document.createElement('div');
        mediaCard.classList.add('movie');
        const mediaId = media.id;

        const releaseDate = new Date(media.release_date || media.first_air_date);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = releaseDate.toLocaleDateString('fr-FR', options);

        mediaCard.innerHTML = `
            <a href="focus.html?id=${mediaId}&type=${type}">
              <img src="https://image.tmdb.org/t/p/w500${media.poster_path}" alt="${media.title || media.name}">
              <h5>${media.title || media.name}</h5>
              <p>${formattedDate}</p>
              <div class="score">
                <p>${Math.round(media.vote_average * 10)}%</p>
              </div>
            </a>
        `;
        return mediaCard;
    };

    let searchTimeout;
    document.getElementById('search-input').addEventListener('input', (event) => {
        clearTimeout(searchTimeout);
        const query = event.target.value;
        if (query.trim()) {
            searchTimeout = setTimeout(() => {
                searchMovies(query);
            }, 300);
        } else {
            document.getElementById('search-results').style.display = 'none';
        }
    });

    document.getElementById('search-input').addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const query = document.getElementById('search-input').value;
            if (query.trim()) {
                searchMovie(query);
            }
        }
    });

    document.getElementById('search-button').addEventListener('click', () => {
        const query = document.getElementById('search-input').value;
        if (query.trim()) {
            searchMovie(query);
        }
    });

    const searchMovies = (query) => {
        const searchUrl = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=fr-FR`;
        fetchData(searchUrl)
            .then(data => {
                const resultsContainer = document.getElementById('search-results');
                resultsContainer.innerHTML = ''; // Clear previous results
                resultsContainer.style.display = data.results.length > 0 ? 'block' : 'none';

                data.results.slice(0, 5).forEach(movie => { // Limit to 5 results
                    const resultItem = document.createElement('div');
                    resultItem.innerHTML = `
                        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" style="width:60px;margin-right:10px;">
                        <span>${movie.title}</span>
                    `;
                    resultItem.addEventListener('click', () => {
                        window.location.href = `focus.html?id=${movie.id}&type=movie`;
                    });
                    resultsContainer.appendChild(resultItem);
                });
            });
    };

    const searchMovie = (query) => {
        const searchUrl = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=fr-FR`;
        fetchData(searchUrl)
            .then(data => {
                if (data.results.length > 0) {
                    const firstResult = data.results[0];
                    window.location.href = `focus.html?id=${firstResult.id}&type=movie`;
                } else {
                    alert('Aucun résultat trouvé');
                }
            });
    };
});
