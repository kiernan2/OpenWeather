import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';

function Fahrenheit_Converter(kelvin) {
  return ((kelvin - 273.15) * 9/5 + 32);
}

$(document).ready(function() {
  
  let mode = "city";

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

  $('#weatherLocation').click(function() {
    const city = $('#location').val();
    const lat = $('#latitude').val();
    const lon = $('#longitude').val();
    $('#location').val("");
    $('#latitude').val("");
    $('#longitude').val("");
    let request = new XMLHttpRequest();
    let url = '';
    if (mode === 'city') {
      url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.API_KEY}`;
    }
    else if (mode === 'lat-lon') {
      url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.API_KEY}`;
    }

    request.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        const response = JSON.parse(this.responseText);
        getElements(response);
      }
    };

    request.open("GET", url, true);
    request.send();

    function getElements(response) {
      $('.showHumidity').text(`The humidity in ${response.name} is ${response.main.humidity}%`);
      $('.showTemp').text(`The temperature in Fahrenheit is ${Fahrenheit_Converter(response.main.temp)} Degrees.`);
    }
  });
});