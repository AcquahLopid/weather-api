var api_key = "3fcad851cc5224beedb708448672a871";
var getWeatherBtn = document.getElementById('getWeatherBtn');
var cityInput = document.getElementById('cityInput');
var weatherOutput = document.getElementById('weatherOutput');
var futureWeatherOutput = document.getElementById('futureWeatherOutput');
var searchHistory = document.getElementById('searchHistory');
var searchHistoryList = document.createElement('ul');
searchHistory.appendChild(searchHistoryList);

getWeatherBtn.addEventListener('click', () => {
  var city_name = cityInput.value;

  fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=${api_key}`)
    .then(response => response.json())
    .then(data => {
      var kelvinTemp = data.main.temp;
      var celsiusTemp = kelvinTemp - 273.15;
      var fahrenheitTemp = (kelvinTemp - 273.15) * 9/5 + 32;
      var weatherDescription = data.weather[0].description;
      var cityName = data.name;

      weatherOutput.textContent = `The current temperature in ${cityName} is ${celsiusTemp.toFixed(2)}°C or ${fahrenheitTemp.toFixed(2)}°F, with ${weatherDescription}.`;

      // Add city to search history
      var searchItem = document.createElement('li');
      searchItem.textContent = cityName;
      searchHistoryList.appendChild(searchItem);

      // Get future weather data
      return fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${city_name}&appid=${api_key}`);
    })
    .then(response => response.json())
    .then(data => {
      var futureWeather = data.list.filter(item => item.dt_txt.includes('12:00:00'));
      let futureWeatherOutputText = '';

      futureWeather.forEach(item => {
        var date = new Date(item.dt * 1000);
        var dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
        var kelvinTemp = item.main.temp;
        var celsiusTemp = kelvinTemp - 273.15;
        var fahrenheitTemp = (kelvinTemp - 273.15) * 9/5 + 32;
        var weatherDescription = item.weather[0].description;

        futureWeatherOutputText += `<div>${dayOfWeek}: ${celsiusTemp.toFixed(2)}°C or ${fahrenheitTemp.toFixed(2)}°F, with ${weatherDescription}.</div>`;
      });

      futureWeatherOutput.innerHTML = futureWeatherOutputText;
    })
    .catch(error => {
      console.error('Error getting weather data:', error);
      weatherOutput.textContent = 'Error getting weather data';
      futureWeatherOutput.textContent = '';
    });
});