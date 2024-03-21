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

// Event listener para el formulario de búsqueda
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

// Función para filtrar por clasificación
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

  movieElement.innerHTML = `
    <div>
      <img src="${IMAGE_PATH}${movie.poster_path}" alt="${movie.title}" height="300">
      <h3>${movie.title}</h3>
      <button onclick="showReviews(${movie.id})">Ver Reseñas</button>   <!— /* // HACER UN POPU */ -->
      <button onclick="showTrailer(${movie.id})">Ver Trailer</button>  <!— /* // REEMPLAZAR POR UN HREF  */ -->
      <span class="favorite-btn" onclick="toggleFavorite(${movie.id}, this)">
        &#9734;
      </span>
    </div>
  `;

  return movieElement;
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
// Llamamos a la función para obtener las películas populares al cargar la página
fetchPopularMovies();