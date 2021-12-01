import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import WeatherService from './services/weather-service.js';
import GiphyService from './services/giphy-service.js';

function Fahrenheit_Converter(kelvin) {
  return ((kelvin - 273.15) * 9/5 + 32);
}

function clearFields() {
  $('#location').val("");
  $('#latition').val("");
  $('#longitude').val("");
  $('.showErrors').text("");
  $('.showHumidity').text("");
  $('.showTemp').text("");
}

function displayWeatherDescription(description) {
  $('.weather-description').text(`The weather is ${description}`)
}

function displayGif(response) {
  const url = response.data[0].images.downsized.url
  $('.show-gif').html(`<img src='${url}'>`);
}

function displayError(error) {
  $('.show-error').text(`${error}`);
}

function getElements(response) {
  if (response.main) {
    $('.showHumidity').text(`The humidity in ${response.name} is ${response.main.humidity}%`);
    $('.showTemp').text(`The temperature in Fahrenheit is ${Fahrenheit_Converter(response.main.temp)} degrees.`);
  } else {
    $('.showErrors').text(`There was an error: ${response.message}`);
  }
}

async function makeApiCall(city) {
  const response = await WeatherService.getWeather(city);
  getElements(response);
}

$(document).ready(function() {
  $('#weatherLocation').click(function() {
    let city = $('#location').val();
    clearFields();
    WeatherService.getWeather(city)
    .then(function(weatherResponse) {
      if (weatherResponse instanceof Error) {
        throw Error(`OpenWeather API error: ${weatherResponse.message}`);
      }
      const weatherDescription = weatherResponse.message[0].description;
      displayWeatherDescription(weatherDescription);
      return GiphyService.getGif(weatherDescription);
    })
    .then(function(giphyResponse) {
      if (giphyResponse instanceof Error) {
        throw Error(`Giphy API error: ${giphyResponse.message}`)
      }
      displayGif(giphyResponse);
    })
    .catch(function(error) {
      displayError(error.message)
    })
  });
});
