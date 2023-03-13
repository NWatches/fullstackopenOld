import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [inputText, setInputText] = useState('');
  const [countries, setCountries] = useState([]);
  const [buttonSelected, setButtonSelected] = useState(false);
  const api_key = process.env.REACT_APP_API_KEY
  
  // Get all countries info
  useEffect(() => {
    axios
      .get(`https://restcountries.com/v3.1/all/`)
      .then(response => {
        setCountries(response.data);
      });
  }, []);

  // Filter and show only those countries that match the input, case ignored
  const countriesToShow = countries.filter(country => country.name.common.toLowerCase().includes(inputText));
  // Filter and show only the country that was selected with the button
  const buttonShow = countries.filter(country => country.name.common.toLowerCase().includes(buttonSelected));

  // Input handler, If input changed then erase selected button country, set input text to lowercase of input,
  const handleInput = (e) => {
    setButtonSelected(null)
    setInputText(e.target.value.toLowerCase())
  }

  // Button selected, set value to country selected
  const handleButton = (e) => {
    setButtonSelected(e.target.value.toLowerCase())
  }

  const CountryList = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [icon, setIcon] = useState(null)

    useEffect(() => {
      if (countriesToShow.length === 1) {
        const capital = countriesToShow[0].capital;
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}`)
          .then(response => {
            setWeatherData(response.data);
            setIcon(response.data.weather[0].icon)
            console.log(response.data)
          })
      }
    }, [countriesToShow]);

    // Blank if no input
    if (inputText.length == 0) {
      return <></>
    }

    // If there is a button selected country return details of this country
    if (buttonSelected) {
      return (
        <>
          <h1>{buttonShow[0].name.common}</h1>
          <p>capital {buttonShow[0].capital}</p>
          <p>area {buttonShow[0].area}</p>
          <b>languages:</b>
          <ul>
            {Object.values(buttonShow[0].languages).map(lang => <li key={lang}>{lang}</li>)}
          </ul>
          <div>
          <img src={buttonShow[0].flags.png} />
          </div>
        </>
        )
    }
    // If only one country matches the input automatically show the details for this country
    if (countriesToShow.length == 1) {
      return (
      <>
        <h1>{countriesToShow[0].name.common}</h1>
        <p>capital {countriesToShow[0].capital}</p>
        <p>area {countriesToShow[0].area}</p>
        <b>languages:</b>
        <ul>
          {Object.values(countriesToShow[0].languages).map(lang => <li key={lang}>{lang}</li>)}
        </ul>
        <div>
        <img src={countriesToShow[0].flags.png} />
        <h2>Weather in {countriesToShow[0].capital}</h2>
        {weatherData && <p>temperature {(weatherData.main.temp - 273.5).toFixed(2)} Celsius</p>}
        {icon && <img src={`https://openweathermap.org/img/wn/${icon}@2x.png`}/>}
        {weatherData && <p>wind {weatherData.wind.speed} m/s</p>}
        </div>
      </>
      )
    }
    // If there are less than 10 matches for the input show a list of each country with a button
    // If more than 10 matches, write "too many to list"
    return (
    <ul>
    {countriesToShow.length <= 10 ? 
      countriesToShow.map(country => <li key={country.cca3}>{country.name.common} <button onClick={handleButton} value={country.name.common}>
        Show</button></li> ) : 'Too many to list'}
    </ul>
    )
  }
  // Input to enter country with handleInput event handler and CountryList component rendered undereath
  return (
    <div>
      <span>enter country </span><input onChange={handleInput}></input>
      <CountryList />
    </div>
  );
}

export default App;
