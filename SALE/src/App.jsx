import { useEffect } from 'react';
import { useState } from 'react';
import { useCallback } from 'react';

import axios from 'axios';
import YouTube from 'react-youtube';
import './style.css';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';



function App() {
  const API_URL = 'https://api.themoviedb.org/3'
  const API_KEY = 'd88967bdc6c5044b790a058d0483351e'
  const IMAGE_PATH = 'https://image.tmdb.org/t/p/original'
  const URL_IMAGE = 'https://image.tmdb.org/t/p/original'
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);


  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };

  const tagsEl = document.getElementById('tags');
  const genres = [
    {
      "id": 28,
      "name": "Action"
    },
    {
      "id": 12,
      "name": "Adventure"
    },
    {
      "id": 16,
      "name": "Animation"
    },
    {
      "id": 35,
      "name": "Comedy"
    },
    {
      "id": 80,
      "name": "Crime"
    },
    {
      "id": 99,
      "name": "Documentary"
    },
    {
      "id": 18,
      "name": "Drama"
    },
    {
      "id": 10751,
      "name": "Family"
    },
    {
      "id": 14,
      "name": "Fantasy"
    },
    {
      "id": 36,
      "name": "History"
    },
    {
      "id": 27,
      "name": "Horror"
    },
    {
      "id": 10402,
      "name": "Music"
    },
    {
      "id": 9648,
      "name": "Mystery"
    },
    {
      "id": 10749,
      "name": "Romance"
    },
    {
      "id": 878,
      "name": "Science Fiction"
    },
    {
      "id": 10770,
      "name": "TV Movie"
    },
    {
      "id": 53,
      "name": "Thriller"
    },
    {
      "id": 10752,
      "name": "War"
    },
    {
      "id": 37,
      "name": "Western"
    }
  ]



  var selectedGenre = []
   setGenre();
    function setGenre(){
      tagsEl.innerHTML= '';
      genres.forEach(genre => {
        const t = document.createElement('div');
        t.classList.add('tag');
        t.id=genre.id;
        t.innerText = genre.name;
        t.addEventListener('click', () => {
            if(selectedGenre.length == 0){
              selectedGenre.push(genre.id); 
            } else {
              if(selectedGenre.includes(genre.id)){
                selectedGenre.forEach((id, idx) => {
                  if(id == genre.id){
                    selectedGenre.splice(idx, 1);
                  }
                })
              }else{
                selectedGenre.push(genre.id); 
              }
            }
            console.log(selectedGenre)
            getMovies(API_URL + '&with_genres='+encodeURI(selectedGenre.join(',')))

        })
        tagsEl.append(t);


      })
    }

getMovies(API_URL);
function getMovies(url){
  fetch(url).then(res => res.json()).then(data => {
    console.log(data.results)
    setMovie(data.results);

  })
}


  //variables de estado
  const [movies, setMovies] = useState([]);
  const [searchKey, setSearchKey] = useState("");
 
  const [trailer, setTrailer] = useState(null);
  const [movie, setMovie] = useState({ title: "Cargando Peliculas" });
  const [playing, setPlaying] = useState(false);




  // Definir fetchMovies utilizando useCallback
  const fetchMovies = useCallback(async (searchKey) => {
    const type = searchKey ? "search" : "discover";
    try {
      const {
        data: { results },
      } = await axios.get(`${API_URL}/${type}/movie`, {
        params: {
          api_key: API_KEY,
          query: searchKey,
        },
      });

      setMovies(results);
      setMovie(results[0]);

      if (results.length) {
        await fetchMovie(results[0].id);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  }, []); 



  
  // funcion para la peticion de un solo objeto y mostrar en reproductor de videos
  const fetchMovie = async (id) => {
    const { data } = await axios.get(`${API_URL}/movie/${id}`, {
      params: {
        api_key: API_KEY,
        append_to_response: "videos",
      },
    });

    if (data.videos && data.videos.results) {
      const trailer = data.videos.results.find(
        (vid) => vid.name === "Official Trailer"
      );
      setTrailer(trailer ? trailer : data.videos.results[0]);
    }
    //return data
    setMovie(data);
  };

  const selectMovie = async (movie) => {
    // const data = await fetchMovie(movie.id)
    // console.log(data);
    // setSelectedMovie(movie)
    fetchMovie(movie.id);

    setMovie(movie);
    window.scrollTo(0, 0);
  };
  
const toggleFavorite = () => {
  const isFavorite = favoriteMovies.some(
    (favMovie) => favMovie.id === movie.id
  );

  if (isFavorite) {
    setFavoriteMovies((prevFavorites) =>
      prevFavorites.filter((favMovie) => favMovie.id !== movie.id)
    );
  } else {
    setFavoriteMovies((prevFavorites) => [...prevFavorites, movie]);
  }
};
const toggleFavoritesSection = () => {
  setShowFavorites(!showFavorites);
};


  // funcion para buscar peliculas
  const searchMovies = (e) => {
    e.preventDefault();
    fetchMovies(searchKey);
  };

  useEffect(() => {
    fetchMovies(); // Llama a fetchMovies sin argumentos para obtener películas populares al cargar la página
  }, [fetchMovies]); // Agrega fetchMovies como dependencia


  /* seccion de favoritos */
  const favoritesSection = (
    <div className="container mt-3">
      <h2>Mis Películas Favoritas</h2>
      <Slider dots infinite speed={500} slidesToShow={3} slidesToScroll={1}>
        {favoriteMovies.map((favMovie) => (
          <div key={favMovie.id}>
            <div className='movieCard' onClick={() => selectMovie(favMovie)}>
              <img
                src={`${URL_IMAGE + favMovie.poster_path}`}
                alt={favMovie.title}
                height={300}
                width="80%"
                className='movieImagen'
              />
              <h4 className="text-center">{favMovie.title}</h4>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );


      return (

      
    <div className='seccion-1'>

<header>
      <div>
      <h2 className="text-center-mt-5-mb-5"> Pop movie </h2>
      </div>
    


      {/* el buscador */}
      <form className="container-mb-4" onSubmit={searchMovies}>
        <input className='formSearch'
          type="text" placeholder='buscar' onChange={(e) => setSearchKey(e.target.value)}/>
          
        <button className="btn-primario"><h1>Buscar</h1></button>
      </form>

</header>
      


<div id="tags">
</div>

      {/* contenedor para previsualizar  */}

      <div>
        <main>
         {movie ? (
            <div
              className="viewtrailer"
              style={{
                backgroundImage: `url("${IMAGE_PATH}${movie.backdrop_path}")`,
              }}
            >
              {playing ? (
                <>
                  <YouTube
                    videoId={trailer.key}
                    className="reproductor container"
                    containerClassName={"youtube-container amru"}
                    opts={{
                      width: "100%",
                      height: "100%",
                      playerVars: {
                        autoplay: 1,
                        controls: 0,
                        cc_load_policy: 0,
                        fs: 0,
                        iv_load_policy: 0,
                        modestbranding: 0,
                        rel: 0,
                        showinfo: 0,
                      },
                    }}
                  />
                  <button onClick={() => setPlaying(false)} className="boton-cerrar">
                    Cerrar
                  </button> 
                </>
              ) : (
                <div className="container">
                  <div className="">

                    <h1 className="text-white">{movie.title}</h1>
                    <p className="text-white">{movie.overview}</p>
                    <h2 className="text-white">{movie.URL_GENRES}</h2>

                    {trailer ? (
                      <button
                        className="boton"
                        onClick={() => setPlaying(true)}
                        type="button"
                      >
                        Ver Trailer
                      </button>
                                         
                    ) : (
                      "Sorry, no encontramos el trailer"
                    )}

                   <button onClick={toggleFavorite} className='addlist'>
                        {favoriteMovies.some((favMovie) => favMovie.id === movie.id)
                        ? 'Quitar de Favoritos'
                        : 'Agregar a Favoritos'}
                    </button>

                  </div>
                </div>
              )}
            </div>
          ) : null}
        </main>
      </div>
 
<div>
{showFavorites && favoritesSection}
</div>
      {/* contenedor para mostrar los posters y las peliculas en la peticion a la api */}
      <div className="container mt-3">

        <div className="row">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="col-md-4 mb-3"
              onClick={() => selectMovie(movie)}
            >
              <li className='movieCard'>
              <img
                src={`${URL_IMAGE + movie.poster_path}`}
                alt={movie.title}
                height={600}
                width="100%"
                className='movieImagen'
              />
              </li>
              <h4 className="text-center">{movie.title}</h4>
            </div>
          ))}
        </div>
      </div>
    </div>
        
  );
}

export default App;