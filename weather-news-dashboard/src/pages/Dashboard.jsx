import axios from "axios";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useFetch } from "../hooks/use-fetch";
import Loader from "../components/Loader";
import Header from "../components/Header";
import NewsPanel from "../components/news/NewsPanel";
import FavoriteCities from "../components/FavoriteCities";
import WeatherCard from "../components/weather/WeatherCard";
import TodayTemperature from "../components/weather/forecast/TodayTemperature";
import TabNavigation from "../components/TabNavigation";
import WeatherDetails from "../components/weather/WeatherDetails";
import ForecastData from "../components/weather/forecast/ForecastData";

const Dashboard = () => {
  const [currentCity, setCurrentCity] = useState("Delhi");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [forecastTimeout, setForecastTimeout] = useState(false);
  const [newsData, setNewsData] = useState([]);
  const [newsTimeout, setNewsTimeout] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user, logout } = useAuth();
  const { theme, themeMode, toggleTheme, setAutoTheme } = useTheme();
  const { request } = useFetch();

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (currentCity) {
      loadWeatherData(currentCity);
      loadForecastData(currentCity);
      loadNewsData(currentCity);

      const timer = setTimeout(() => {
        setNewsTimeout(true);
        setForecastTimeout(true);
      }, 20000);

      return () => clearTimeout(timer);
    }
  }, [currentCity]);

  const getCityFromCurrentWeather = async (lat, lon) => {
    try {
      const response = await request({
        url: `/weather/current?lat=${lat}&lon=${lon}`,
      });
      if (response.success && response?.data?.data?.name) {
        return response.data.data.name;
      }

      return null;
    } catch (error) {
      console.error("Error getting city from coordinates:", error);
      return null;
    }
  };

  const handleFallbackLocation = () => {
    // Priority 2: uUse saved location from user preferences
    if (user?.savedLocations?.[0]?.name) {
      setCurrentCity(user.savedLocations[0].name);
    } else {
      setCurrentCity("Delhi");
    }

    setLoading(false);
  };

  const loadInitialData = async () => {
    try {
      // Load user favorites
      const favResponse = await request({ url: "/locations" });
      if (favResponse.success) {
        setFavorites(favResponse.data.data);
      }

      // Priority 1: get user's geolocation
      if (navigator.geolocation) {
        const geoTimeout = setTimeout(() => handleFallbackLocation(), 5000);

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            clearTimeout(geoTimeout);

            const { latitude, longitude } = position.coords;

            let cityName = await getCityFromCurrentWeather(latitude, longitude);

            if (cityName) {
              setCurrentCity(cityName);
            } else {
              handleFallbackLocation();
            }

            setLoading(false);
          },
          (error) => {
            clearTimeout(geoTimeout);
            console.error("Geolocation error:", error.message);
            handleFallbackLocation();
          },
          {
            timeout: 5000,
            enableHighAccuracy: false,
            maximumAge: 300000,
          }
        );
      } else {
        handleFallbackLocation();
      }
    } catch (error) {
      if (axios.isCancel(error)) return;
      console.error("Error loading initial data:", error);
      setCurrentCity("Delhi");
      setLoading(false);
    }
  };

  const loadWeatherData = async (city) => {
    try {
      const response = await request({
        url: `/weather/current?city=${encodeURIComponent(city)}`,
      });
      if (response.success) {
        setWeatherData(response.data.data);
      }
    } catch (error) {
      if (axios.isCancel(error)) return;
      console.error("Error loading weather data:", error);
    }
  };

  const loadForecastData = async (city) => {
    try {
      const response = await request({
        url: `/weather/forecast?city=${encodeURIComponent(city)}`,
      });
      if (response.success) {
        setForecastData(response.data.data);
      }
    } catch (error) {
      console.error("Error loading forecast data:", error);
    }
  };

  const loadNewsData = async (city) => {
    try {
      const response = await request({
        url: `/news?query=${encodeURIComponent(city)}&limit=10`,
      });
      if (response.success) {
        setNewsData(response.data.data.articles || []);
      }
    } catch (error) {
      if (axios.isCancel(error)) return;
      console.error("Error loading news data:", error);
    }
  };

  const handleCitySelect = (city) => {
    if (city && city.trim()) {
      setCurrentCity(city.trim());
    }
  };

  const addToFavorites = async () => {
    if (!weatherData) return;

    try {
      const response = await request({
        url: "/locations",
        method: "POST",
        data: {
          name: weatherData.name,
          country: weatherData.sys.country,
          lat: weatherData.coord?.lat,
          lon: weatherData.coord?.lon,
          temp: Math.round(weatherData.main.temp),
          icon: weatherData.weather?.[0].icon,
          condition: weatherData.weather?.[0].description,
        },
      });

      if (response.success) {
        setFavorites([...favorites, response.data.data]);
        toast.success(`Added ${weatherData.name} to favorites`);
      }
    } catch (error) {
      console.error("Error adding to favorites:", error);
    }
  };

  const removeFavorite = async (id) => {
    try {
      const response = await request({
        url: `/locations/${id}`,
        method: "DELETE",
      });

      if (response.success) {
        setFavorites(favorites?.filter((fav) => fav._id !== id));
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  useEffect(() => {
    if (!forecastData?.hourly || !weatherData) return;

    const temps = forecastData.hourly.map((item) => item.temp);
    if (temps.length > 0) {
      const minTemp = Math.min(...temps);
      const maxTemp = Math.max(...temps);

      setWeatherData((prev) => ({
        ...prev,
        main: {
          ...prev.main,
          temp_min: minTemp,
          temp_max: maxTemp,
        },
      }));
    }
  }, [forecastData]);

  if (loading) return <Loader />;

  const weatherContent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeatherCard
          weatherData={weatherData}
          favorites={favorites}
          city={currentCity}
          addToFavorites={addToFavorites}
        />

        <TodayTemperature hourlyData={forecastData?.hourly} />

        <WeatherDetails cityData={weatherData} />

        <ForecastData
          dailyData={forecastData?.daily}
          timeout={forecastTimeout}
        />
      </div>
    </div>
  );

  const newsContent = (
    <NewsPanel newsData={newsData} city={currentCity} timeout={newsTimeout} />
  );

  return (
    <div className="min-h-screen">
      <div className="flex-1">
        {/* Header with Search */}
        <Header
          user={user}
          logout={logout}
          theme={theme}
          themeMode={themeMode}
          toggleTheme={toggleTheme}
          setAutoTheme={setAutoTheme}
          favorites={favorites}
          onSelectCity={handleCitySelect}
          onRemoveFavorite={removeFavorite}
        />

        {/* Dashboard Content */}
        <main className="p-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Favorite Cities */}
            <FavoriteCities
              cities={favorites}
              onSelectCity={handleCitySelect}
              onRemove={removeFavorite}
            />

            <TabNavigation
              weatherData={weatherData}
              cityData={forecastData?.city}
              weatherContent={weatherContent}
              newsContent={newsContent}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
