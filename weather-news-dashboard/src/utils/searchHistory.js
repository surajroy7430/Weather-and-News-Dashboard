const SEARCH_HISTORY_KEY = "climecast_search_history";
const MAX_HISTORY_ITEMS = 10;

export const getSearchHistory = () => {
  try {
    const history = localStorage.getItem(SEARCH_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error("Error reading search history:", error);
    return [];
  }
};

export const addToSearchHistory = (city) => {
  try {
    const history = getSearchHistory();

    // Remove if already exists to avoid duplicates
    const filteredHistory = history.filter(
      (item) => item.toLowerCase() !== city.toLowerCase()
    );

    // Add to beginning and limit to MAX_HISTORY_ITEMS
    const newHistory = [city, ...filteredHistory].slice(0, MAX_HISTORY_ITEMS);

    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
  } catch (error) {
    console.error("Error adding to search history:", error);
  }
};

export const removeFromSearchHistory = (city) => {
  try {
    const history = getSearchHistory();
    const filteredHistory = history.filter((item) => item !== city);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(filteredHistory));
  } catch (error) {
    console.error("Error removing from search history:", error);
  }
};

export const clearSearchHistory = () => {
  try {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  } catch (error) {
    console.error("Error clearing search history:", error);
  }
};
