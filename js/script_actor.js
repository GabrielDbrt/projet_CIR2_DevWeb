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

    const displayActorDetails = (actorId) => {
        const actorUrl = `https://api.themoviedb.org/3/person/${actorId}?language=fr-FR&append_to_response=combined_credits`;

        fetchData(actorUrl)
            .then(data => {
                console.log('Données de l\'acteur:', data);

                document.getElementById('actor-poster').src = `https://image.tmdb.org/t/p/w500${data.profile_path}`;
                document.getElementById('actor-name').innerText = data.name;
                document.getElementById('actor-biography').innerText = data.biography;

                const filmographyContainer = document.getElementById('actor-filmography');
                filmographyContainer.innerHTML = '';

                const movies = data.combined_credits.cast.slice(0, 10); // Limiter à 10 films
                movies.forEach(movie => {
                    const movieElement = document.createElement('div');
                    movieElement.classList.add('movie');
                    movieElement.innerHTML = `
                        <a href="focus.html?id=${movie.id}&type=${movie.media_type}">
                        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title || movie.name}" />
                        <h3>${movie.title || movie.name}</h3>
                        <p>${movie.character}</p>
                    `;
                    filmographyContainer.appendChild(movieElement);
                });
            });
    };

    const urlParams = new URLSearchParams(window.location.search);
    const actorId = urlParams.get('id');

    if (actorId) {
        displayActorDetails(actorId);
    } else {
        console.error('Le paramètre ID est manquant dans l\'URL.');
    }
});
