import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import WeatherService from './weather-service.js';

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


$(document).ready(function() {
  let mode = "city";
  $('#weatherLocation').click(function() {
    let city = $('#location').val();
    clearFields();
    let promise = WeatherService.getWeather(city);
    console.log(promise)
    promise.then(function(response) {
      const body = JSON.parse(response);
      $('.showHumidity').text(`The humidity in ${city} is ${body.main.humidity}%`);
      $('.showTemp').text(`The temperature in Fahrenheit is ${Fahrenheit_Converter(body.main.temp)} degrees.`);
    }, function(error) {
      $('.showErrors').text(`There was an error processing your request: ${error}`);
    });
  });

  $('#radioInput').click(function() {
    if ($('#city').hasClass('hidden')) {
      $('#lat-lon').addClass('hidden');
      $('#city').removeClass('hidden');
      mode = "city";
    } else {
      $('#lat-lon').removeClass('hidden');
      $('#city').addClass('hidden');
      mode = "lat-lon";
    }
  });
});
