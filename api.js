const API_KEY = "65051c82c3ad7fbab05612a5f9eb82b7";
const API_URL = "https://api.themoviedb.org/3";
const IMAGE_PATH = "https://image.tmdb.org/t/p/original";
let favoriteMovies = [];

// Función para obtener las películas populares
function fetchPopularMovies() {
  fetch(`${API_URL}/movie/popular?api_key=${API_KEY}`)
    .then((response) => response.json())
    .then((data) => {
      displayMovies(data.results);
    })
    .catch((error) => {
      console.error("Error fetching popular movies:", error);
    });
}

// Función para inicializar el evento DOMContentLoaded y el formulario de búsqueda
document.addEventListener("DOMContentLoaded", function () {
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");

  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const searchTerm = searchInput.value.trim();

    if (searchTerm !== "") {
      searchMovies(searchTerm);
    } else {
      fetchPopularMovies();
    }

    searchInput.value = "";
  });
});

// Función para filtrar películas por clasificación
function filterByClassification(classification) {
  fetch(`${API_URL}/movie/${classification}?api_key=${API_KEY}`)
    .then((response) => response.json())
    .then((data) => {
      displayMovies(data.results);
    })
    .catch((error) => {
      console.error("Error fetching movies by classification:", error);
    });
}

// Función para mostrar películas en el contenedor de películas
function displayMovies(movies) {
  const moviesContainer = document.getElementById("movies");
  moviesContainer.innerHTML = "";

  if (movies.length === 0) {
    moviesContainer.innerHTML = "<p>No se encontraron películas.</p>";
  } else {
    movies.forEach((movie) => {
      const movieElement = createMovieElement(movie);
      moviesContainer.appendChild(movieElement);
    });
  }
}

// Función para buscar películas por término de búsqueda
function searchMovies(query) {
  fetch(`${API_URL}/search/movie?api_key=${API_KEY}&query=${query}`)
    .then((response) => response.json())
    .then((data) => {
      displayMovies(data.results);
    })
    .catch((error) => {
      console.error("Error fetching search results:", error);
    });
}

// Función para crear el elemento HTML de una película
function createMovieElement(movie) {
  const movieElement = document.createElement("div");
  movieElement.classList.add("movie");
  // Verificar si la película está marcada como favorita
  const isFavorite = favoriteMovies.includes(movie.id);
  const favoriteClass = isFavorite ? "selected" : "";
  movieElement.innerHTML = `
        <div>
            <img src="${IMAGE_PATH}${movie.poster_path}" alt="${movie.title}" height="300">
            <h3>${movie.title}</h3>
            <button class="summary-btn" data-movie-id="${movie.id}">Resumen</button>
            <button onclick="showTrailer('${movie.id}')">Tráiler</button>
            <span class="favorite-btn" onclick="toggleFavorite(${movie.id}, this)">
                &#9734;
            </span>
            <div class="summary-container-${movie.id}" style="display: none;">
              <p class="summary"></p>
              <button class="close-summary-btn">Cerrar</button>
            </div>
        </div>
    `;

  return movieElement;
}
// Función para mostrar películas favoritas
function showFavorites() {
  const moviesContainer = document.getElementById("movies");
  moviesContainer.innerHTML = "";

  if (favoriteMovies.length === 0) {
    moviesContainer.innerHTML = "<p>No tienes películas favoritas.</p>";
  } else {
    favoriteMovies.forEach((movieId) => {
      fetch(`${API_URL}/movie/${movieId}?api_key=${API_KEY}`)
        .then((response) => response.json())
        .then((movie) => {
          const movieElement = createMovieElement(movie);
          moviesContainer.appendChild(movieElement);
        })
        .catch((error) => {
          console.error("Error fetching favorite movie:", error);
        });
    });
  }
}
// Función para cambiar el estado de favorito de una película
function toggleFavorite(movieId, button) {
  if (!favoriteMovies.includes(movieId)) {
    favoriteMovies.push(movieId);
    button.classList.add("selected");
  } else {
    const index = favoriteMovies.indexOf(movieId);
    if (index > -1) {
      favoriteMovies.splice(index, 1);
    }
    button.classList.remove("selected");
  }
}

// Event listener para mostrar el resumen al hacer clic en el botón "Resumen" y cerrarlo al hacer clic en el botón "Cerrar"
document.addEventListener("click", function (event) {
  const target = event.target;
  if (target.classList.contains("summary-btn")) {
    const movieId = target.dataset.movieId;
    fetch(`${API_URL}/movie/${movieId}?api_key=${API_KEY}`)
      .then((response) => response.json())
      .then((data) => {
        const summary = data.overview;
        const summaryContainer = document.querySelector(`.summary-container-${movieId}`);
        const summaryParagraph = summaryContainer.querySelector(".summary");
        summaryParagraph.textContent = summary;
        summaryContainer.style.display = "block";
      })
      .catch((error) => {
        console.error("Error fetching movie details:", error);
      });
  }

  if (target.classList.contains("close-summary-btn")) {
    const summaryContainer = target.parentElement;
    summaryContainer.style.display = "none";
  }
});

// Función para mostrar el resumen de una película por su ID en un cuadro modal
function showSummary(movieId) {
  fetch(`${API_URL}/movie/${movieId}?api_key=${API_KEY}`)
    .then((response) => response.json())
    .then((data) => {
      const summary = data.overview;
      document.getElementById("summaryText").textContent = summary;
      showModal();
    })
    .catch((error) => {
      console.error("Error fetching movie details:", error);
    });
}

// Función para mostrar el cuadro modal
function showModal() {
  const modalContainer = document.getElementById("modalContainer");
  modalContainer.style.display = "block";
}

// Función para ocultar el cuadro modal
function hideModal() {
  const modalContainer = document.getElementById("modalContainer");
  modalContainer.style.display = "none";
}


// Función para mostrar el trailer de una película
function showTrailer(movieId) {
  fetch(`${API_URL}/movie/${movieId}/videos?api_key=${API_KEY}`)
    .then((response) => response.json())
    .then((data) => {
      const trailers = data.results.filter((video) => video.type === "Trailer");
      if (trailers.length === 0) {
        alert("No se encontró ningún trailer para esta película.");
      } else {
        const trailerKey = trailers[0].key;
        const trailerURL = `https://www.youtube.com/watch?v=${trailerKey}`;
        window.open(trailerURL, "_blank");
      }
    })
    .catch((error) => {
      console.error("Error fetching movie trailer:", error);
      alert("Hubo un error al obtener el trailer de la película.");
    });
}

// Llamamos a la función para obtener las películas populares al cargar la página
fetchPopularMovies();

