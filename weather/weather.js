document.addEventListener('DOMContentLoaded', () => {
    const cityInput = document.getElementById('city-input');
    const searchButton = document.getElementById('search-button');
    const currentWeatherDiv = document.getElementById('current-weather');
    const forecastDiv = document.getElementById('forecast');
    const weatherDataDiv = document.getElementById('weather-data');
    const errorMessage = document.getElementById('error-message');

    // 🔑 Reemplaza con tu clave API real
    const API_KEY = '06eee0833c2718d15dd72279742e7c79';
    const BASE_URL = 'https://api.openweathermap.org/data/2.5/';

    const apiKey= 'TU_API_KEY';

    // Función principal para obtener datos del clima
    const fetchWeather = async (city) => {
        errorMessage.textContent = '';
        currentWeatherDiv.innerHTML = '';
        // Se añade un id para poder limpiar solo los cards de pronóstico después
        forecastDiv.innerHTML = '<h2>Pronóstico para los próximos días</h2><div id="forecast-cards" class="forecast-cards-container"></div>'; 
        weatherDataDiv.style.display = 'none';

        if (!API_KEY || API_KEY === 'TU_API_KEY') {
            console.warn('⚠️ API key de OpenWeatherMap no configurada. Añade tu clave en weather.js para obtener datos reales.');
            errorMessage.textContent = 'Error: Clave API no configurada. Por favor, añade tu API_KEY.';
            return;
        }

        try {
            // 🌤 Clima actual
            // Se usa el acento grave (`) para la plantilla de cadena
            const currentResponse = await fetch(`${BASE_URL}weather?q=${city}&lang=es&units=metric&appid=${API_KEY}`); 
            
            if (!currentResponse.ok) {
                const errorData = await currentResponse.json();
                // Se usa el acento grave (`) para la plantilla de cadena
                throw new Error(`Ciudad no encontrada o error: ${errorData.message}`); 
            }
            const currentData = await currentResponse.json();
            displayCurrentWeather(currentData);

            // 📅 Pronóstico de 5 días
            // Se usa el acento grave (`) para la plantilla de cadena
            const forecastResponse = await fetch(`${BASE_URL}forecast?q=${city}&lang=es&units=metric&appid=${API_KEY}`); 
            
            if (!forecastResponse.ok) {
                throw new Error('Error al obtener el pronóstico extendido.');
            }
            const forecastData = await forecastResponse.json();
            displayForecast(forecastData);

            weatherDataDiv.style.display = 'block';
        } catch (error) {
            // Se usa el acento grave (`) para la plantilla de cadena
            errorMessage.textContent = `Error: ${error.message}. Por favor, verifica el nombre de la ciudad y tu clave API.`; 
            weatherDataDiv.style.display = 'none'; // Asegura que no se muestren datos incompletos
        }
    };

    // Muestra los datos del clima actual
    const displayCurrentWeather = (data) => {
        const temp = Math.round(data.main.temp);
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        // Se cambia a 'https' por seguridad
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`; 
        const windSpeed = data.wind.speed;
        const humidity = data.main.humidity;

        currentWeatherDiv.innerHTML = `
            <h3 class="city-name">${data.name}, ${data.sys.country}</h3>
            <img src="${iconUrl}" alt="${description}" class="weather-icon">
            <p class="temperature">${temp}°C</p>
            <p class="description">${description.charAt(0).toUpperCase() + description.slice(1)}</p>
            <div class="details">
                <p>Viento: ${windSpeed} m/s</p>
                <p>Humedad: ${humidity}%</p>
            </div>
        `;
    };

    // Muestra el pronóstico extendido
    const displayForecast = (data) => {
        const dailyForecasts = {};
        // Se obtiene la referencia al nuevo contenedor para el pronóstico
        const forecastCardsDiv = document.getElementById('forecast-cards'); 

        data.list.forEach(item => {
            const date = item.dt_txt.split(' ')[0];
            
            // Ignorar el pronóstico de hoy (el primer día)
            const today = new Date().toISOString().split('T')[0];
            if (date === today) return; 

            if (!dailyForecasts[date]) {
                dailyForecasts[date] = { temps: [], icon: item.weather[0].icon, description: item.weather[0].description };
            }
            dailyForecasts[date].temps.push(item.main.temp);
        });

        // Iterar sobre los siguientes 4 días (ya excluimos el día de hoy arriba)
        let processedDays = 0;
        for (const date in dailyForecasts) {
            if (processedDays < 4) { // Solo mostrar los siguientes 4 días
                const temps = dailyForecasts[date].temps;
                const maxTemp = Math.round(Math.max(...temps));
                const minTemp = Math.round(Math.min(...temps));
                const iconCode = dailyForecasts[date].icon;
                const description = dailyForecasts[date].description;
                
                // Se cambia a 'https' por seguridad
                const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`; 

                // Formatear el día y fecha
                const dateObj = new Date(date + 'T00:00:00'); // Añadir T00:00:00 para evitar problemas de zona horaria
                const dayName = dateObj.toLocaleDateString('es-MX', { weekday: 'short' });
                const dayMonth = dateObj.toLocaleDateString('es-MX', { day: 'numeric', month: 'numeric' });


                const dayCard = document.createElement('div');
                dayCard.classList.add('day-card');
                dayCard.innerHTML = `
                    <div class="forecast-day">${dayName.charAt(0).toUpperCase() + dayName.slice(1)}. (${dayMonth})</div>
                    <img src="${iconUrl}" alt="${description}" class="weather-icon">
                    <div class="forecast-temp-range">
                        <span class="temp-max">${maxTemp}°C</span> / 
                        <span class="temp-min">${minTemp}°C</span>
                    </div>
                `;
                // Añadir al nuevo contenedor
                forecastCardsDiv.appendChild(dayCard); 
                processedDays++;
            }
        }
    };

    // Evento de búsqueda
    searchButton.addEventListener('click', () => {
        const city = cityInput.value.trim();
        if (city) {
            fetchWeather(city);
        } else {
            errorMessage.textContent = 'Por favor, ingresa el nombre de una ciudad.';
        }
    });

    // Permitir buscar con Enter
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchButton.click();
        }
    });

    // Cargar un clima predeterminado al inicio
    fetchWeather('Ciudad de México');
});