document.addEventListener('DOMContentLoaded', () => {
    const apiKey = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNGFjZWU2Y2ZmMDBhNTNjYjE1NjE5NWNmNGEyM2M5MyIsIm5iZiI6MTczOTg4NDU0OS4zMjA5OTk5LCJzdWIiOiI2N2I0ODgwNTFlZDQ1Mjg0NTM5ZmI2NTQiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.xfyeXxd9pqUdNS2U8yLfciBOk5pl6hQvexrXowx6rVI'; // Remplace par ton token d'accès
    let currentTrendingType = 'day';
    let currentTvType = 'top_rated';

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

    const updateTrendingMovies = (type) => {
        const movieApiUrl = `https://api.themoviedb.org/3/trending/movie/${type}?language=fr-FR`;
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
                populairesContainer.innerHTML = ''; // Efface le contenu actuel
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
        updateTrendingMovies(currentTrendingType);
    });

    document.getElementById('week').addEventListener('click', () => {
        currentTrendingType = 'week';
        document.getElementById('week').classList.add('active');
        document.getElementById('day').classList.remove('active');
        updateTrendingMovies(currentTrendingType);
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

    updateTrendingMovies(currentTrendingType);
    updatePopularTvShows(currentTvType);

    const createMediaCard = (media, type) => {
        const mediaCard = document.createElement('div');
        mediaCard.classList.add('movie');
        const mediaId = media.id;
        mediaCard.innerHTML = `
        <a href="focus.html?id=${mediaId}&type=${type}">
          <img src="https://image.tmdb.org/t/p/w500${media.poster_path}" alt="${media.title || media.name}">
          <h5>${media.title || media.name}</h5>
          <div class="score">
            <p>${media.vote_average * 10}%</p>
          </div>
        </a>
    `;
        return mediaCard;
    };


});