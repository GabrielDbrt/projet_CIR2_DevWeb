document.addEventListener('DOMContentLoaded', () => {
    const apiKey = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNGFjZWU2Y2ZmMDBhNTNjYjE1NjE5NWNmNGEyM2M5MyIsIm5iZiI6MTczOTg4NDU0OS4zMjA5OTk5LCJzdWIiOiI2N2I0ODgwNTFlZDQ1Mjg0NTM5ZmI2NTQiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.xfyeXxd9pqUdNS2U8yLfciBOk5pl6hQvexrXowx6rVI';

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

    const formatRuntime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0) {
            return `${hours}h${mins > 0 ? ` ${mins}min` : ''}`;
        } else {
            return `${minutes}min`;
        }
    };

    const displayMediaDetails = (mediaId, mediaType) => {
        let mediaUrl;
        if (mediaType === 'movie') {
            mediaUrl = `https://api.themoviedb.org/3/movie/${mediaId}?language=fr-FR&append_to_response=credits,videos`;
        } else if (mediaType === 'tv') {
            mediaUrl = `https://api.themoviedb.org/3/tv/${mediaId}?language=fr-FR&append_to_response=credits,videos`;
        }

        fetchData(mediaUrl)
            .then(data => {
                const banner = document.querySelector('.banner');
                banner.style.backgroundImage = `url('https://image.tmdb.org/t/p/w1280${data.backdrop_path}')`;
                document.getElementById('focus-poster').src = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
                document.getElementById('focus-title').innerText = data.title || data.name;

                // Formatage de la date
                const releaseDate = new Date(data.release_date || data.first_air_date);
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                let dateInfo = releaseDate.toLocaleDateString('fr-FR', options);

                const runtime = data.runtime ? ` • Durée : ${formatRuntime(data.runtime)}` : '';
                const genres = data.genres ? ` • Genres : ${data.genres.map(genre => genre.name).join(', ')}` : '';

                document.getElementById('focus-release-date').innerText = `${dateInfo}${runtime}${genres}`;

                document.getElementById('focus-overview').innerText = data.overview;
                document.getElementById('focus-score').innerText = `${data.vote_average * 10}%`;
                document.getElementById('focus-cast').innerHTML = '';

                const cast = data.credits.cast;
                if (cast.length > 0) {
                    cast.slice(0, 8).forEach(actor => {
                        const actorElement = document.createElement('div');
                        actorElement.classList.add('actor');
                        actorElement.innerHTML = `
                            <a href="actor.html?id=${actor.id}">
                                <img src="https://image.tmdb.org/t/p/w500${actor.profile_path}" alt="${actor.name}" data-id="${actor.id}">
                            </a>
                            <h4>${actor.name}</h4>
                            <span>${actor.character}</span>
                        `;
                        document.getElementById('focus-cast').appendChild(actorElement);
                    });
                } else {
                    document.getElementById('focus-cast').innerText = 'Pas de casting disponible';
                }

                const trailer = data.videos.results.find(video => video.type === 'Trailer');
                const trailerContainer = document.getElementById('trailer-container');
                if (trailer) {
                    trailerContainer.innerHTML = `
                        <iframe src="https://www.youtube.com/embed/${trailer.key}" frameborder="0" allowfullscreen></iframe>
                    `;
                } else {
                    trailerContainer.classList.add('no-trailer');
                    trailerContainer.innerText = `
                        Aucune bande d'annonce disponible pour le moment.
                    `;
                }
            });
    };

    const urlParams = new URLSearchParams(window.location.search);
    const mediaId = urlParams.get('id');
    const mediaType = urlParams.get('type');

    if (mediaId && mediaType) {
        displayMediaDetails(mediaId, mediaType);
    } else {
        console.error('Les paramètres ID ou type sont manquants dans l\'URL.');
    }
});
