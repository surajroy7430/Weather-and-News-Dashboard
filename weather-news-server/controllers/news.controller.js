const axios = require("axios");
const logger = require("../utils/logger");
const { getCache, setCache } = require("../utils/cache");

const NEWSAPI_KEY = process.env.NEWSAPI_KEY;
const NEWSAPI_BASE_URL = "https://newsapi.org/v2";

const getNewsArticles = async (req, res, next) => {
  try {
    const {
      query: searchQuery = "latest news",
      limit = 20,
      page = 1,
      category = "general",
      language = "en",
    } = req.query;

    // Create cache key
    const cacheKey = `news:${searchQuery}:${category}:${language}:${page}:${limit}`;

    // Check cache first
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return res.json({
        status: "success",
        data: cachedData,
        cached: true,
      });
    }

    // Determine which endpoint to use
    let apiUrl;
    let params = {
      apiKey: NEWSAPI_KEY,
      language,
      pageSize: Math.min(parseInt(limit), 100),
      page: parseInt(page),
    };

    if (searchQuery && searchQuery !== "latest news") {
      apiUrl = `${NEWSAPI_BASE_URL}/everything`;
      params.q = searchQuery;
      params.sortBy = "publishedAt";
    } else {
      apiUrl = `${NEWSAPI_BASE_URL}/top-headlines`;
      params.category = category;
      params.country = language === "en" ? "us" : "gb"; // Default countries
    }

    // Fetch from NewsAPI
    const response = await axios.get(apiUrl, {
      params,
      timeout: 10000,
    });

    const newsData = response.data;

    // Filter out articles with missing essential data
    const filteredArticles = newsData.articles.filter(
      (article) =>
        article.title &&
        article.title !== "[Removed]" &&
        article.description &&
        article.url
    );

    const processedData = {
      ...newsData,
      articles: filteredArticles,
      totalResults: Math.min(newsData.totalResults, 1000), // NewsAPI limit
      query: searchQuery,
      category,
      language,
      page: parseInt(page),
      pageSize: parseInt(limit),
    };

    // Cache the response
    await setCache(cacheKey, processedData);

    logger.info(
      `News data fetched for query: ${searchQuery}, category: ${category}`
    );

    res.json({
      status: "success",
      data: processedData,
      cached: false,
    });
  } catch (error) {
    next(error);
  }
};

const getNewsSources = async (req, res, next) => {
  try {
    const { category, language = "en", country } = req.query;

    // Create cache key
    const cacheKey = `sources:${category || "all"}:${language}:${
      country || "all"
    }`;

    // Check cache first
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return res.json({
        status: "success",
        data: cachedData,
        cached: true,
      });
    }

    const params = {
      apiKey: NEWSAPI_KEY,
    };

    if (category) params.category = category;
    if (language) params.language = language;
    if (country) params.country = country;

    const response = await axios.get(`${NEWSAPI_BASE_URL}/sources`, {
      params,
      timeout: 5000,
    });

    const sourcesData = response.data;

    // Cache the response
    await setCache(cacheKey, sourcesData);

    logger.info(`News sources fetched for category: ${category || "all"}`);

    res.json({
      status: "success",
      data: sourcesData,
      cached: false,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getNewsArticles, getNewsSources };
