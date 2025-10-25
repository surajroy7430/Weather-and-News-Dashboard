export const getWeatherIconUrl = (iconCode) => {
  return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
};

export const getWindDirection = (deg) => {
  if (deg == null || isNaN(deg)) return null;

  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

  const index = Math.round(deg / 45) % 8;
  return directions[index];
};

export const getAqiLevel = (aqi) => {
  switch (aqi) {
    case 1:
      return {
        label: "Good",
        color: "text-green-100 bg-green-600",
        description:
          "Air quality is satisfactory, and air pollution poses little or no risk.",
      };
    case 2:
      return {
        label: "Fair",
        color: "text-yellow-100 bg-yellow-600",
        description:
          "Air quality is acceptable. However, there may be a risk for some people.",
      };
    case 3:
      return {
        label: "Moderate",
        color: "text-orange-600 bg-orange-600",
        description:
          "Members of sensitive groups may experience health effects.",
      };
    case 4:
      return {
        label: "Poor",
        color: "text-red-100 bg-red-700",
        description:
          "Some members of the general public may experience health effects.",
      };
    case 5:
      return {
        label: "Very Poor",
        color: "text-purple-100 bg-purple-700",
        description:
          "Health alert: The risk of health effects is increased for everyone.",
      };
  }
};

export const getVisibilityInfo = (visibility) => {
  if (visibility >= 10000) {
    return {
      label: "Excellent",
      color:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    };
  } else if (visibility >= 5000) {
    return {
      label: "Good",
      color:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    };
  } else if (visibility >= 2000) {
    return {
      label: "Moderate",
      color:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    };
  } else if (visibility >= 1000) {
    return {
      label: "Poor",
      color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
  } else {
    return {
      label: "Very Poor",
      color:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    };
  }
};
