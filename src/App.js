import {useEffect, useState} from 'react';
import './App.scss';
import Species from './Species';
import {useFetch} from './hooks/useFetch';

const API_URL = 'https://swapi.dev/api/films/2/';
const SPECIES_IMAGES = {
  droid:
    'https://static.wikia.nocookie.net/starwars/images/f/fb/Droid_Trio_TLJ_alt.png',
  human:
    'https://static.wikia.nocookie.net/starwars/images/3/3f/HumansInTheResistance-TROS.jpg',
  trandoshan:
    'https://static.wikia.nocookie.net/starwars/images/7/72/Bossk_full_body.png',
  wookie:
    'https://static.wikia.nocookie.net/starwars/images/1/1e/Chewbacca-Fathead.png',
  "yoda's species":
    'https://static.wikia.nocookie.net/starwars/images/d/d6/Yoda_SWSB.png',
};
const CM_TO_IN_CONVERSION_RATIO = 2.54;

function App() {
  const [species, setSpecies] = useState([]);
  const {data, isFetching, error, setError, setIsFetching} = useFetch(API_URL)

  useEffect(()=> {
    if (data.species){
      const speciesUrls = data.species;
      const speciesRequests = speciesUrls.map(url =>
        fetch(url).then(response => response.json())
      );
      if(speciesRequests.length > 0) {
        setIsFetching && setIsFetching(true);
        Promise.all(speciesRequests)
          .then(speciesData => setSpecies(speciesData))
          .catch(error => setError(error))
          .finally(() => setIsFetching && setIsFetching(false));
      }
    }
  },[data, setIsFetching, setError])

  return (
    <div className="App">
      <h1>Empire Strikes Back - Species Listing</h1>
      {isFetching ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Something went wrong</p>
      ) : (
        <div className="App-species">
          {species.map((species, index) => (
            <Species
              key={index}
              name={species.name}
              classification={species.classification}
              designation={species.designation}
              height={
                !isNaN(species.average_height)
                  ? `${Math.ceil(
                      species.average_height / CM_TO_IN_CONVERSION_RATIO
                    )}"`
                  : species.average_height
              }
              numFilms={species.films.length}
              image={SPECIES_IMAGES[species.name.toLowerCase()]}
              language={species.language}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
