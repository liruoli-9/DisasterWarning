// utils/timeWeatherUtils.js

export function updateCurrentTime(currentTimeRef) {
  const now = new Date();
  const formattedTime = now.toLocaleTimeString("zh-CN", { hour12: false });
  currentTimeRef.value = formattedTime;
}

export function updateCurrentDate(currentDateRef) {
  const now = new Date();
  const options = { year: "numeric", month: "long", day: "numeric", weekday: "long" };
  currentDateRef.value = now.toLocaleDateString("zh-CN", options);
}

export async function fetchLocation(amapKey, fetchWeather) {
  try {
    const response = await fetch(`https://restapi.amap.com/v3/ip?key=${amapKey}`);
    const data = await response.json();
    if (data.status === '1' && data.city) {
      const city = data.city;
      fetchWeather(city, amapKey);
    } else {
      console.error("Failed to get location data:", data.info);
    }
  } catch (error) {
    console.error("Error fetching location:", error);
  }
}

export async function fetchWeather(city, amapKey, weatherInfoRef) {
  try {
    const response = await fetch(`https://restapi.amap.com/v3/weather/weatherInfo?city=${city}&key=${amapKey}`);
    const data = await response.json();
    if (data.status === '1' && data.lives && data.lives.length > 0) {
      const weather = data.lives[0];
      weatherInfoRef.value =weather;
    } else {
      console.error("Failed to get weather data:", data.info);
    }
  } catch (error) {
    console.error("Error fetching weather:", error);
  }
}
