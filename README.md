# ClimeCast - Weather and News Dashboard

A web application that provides weather forecasts and news updates.

## Key Features & Benefits
*   **OTP Based Authentication:** Send otp and verify to access dashboard. (Check spam folder too)
*   **Real-time Weather Updates:** Get current weather conditions and forecasts for any location.
*   **News Aggregation:** Stay informed with the latest news headlines from various sources.
*   **Favorite Cities:** Save your frequently visited locations for quick access.
*   **User-Friendly Interface:** Easy to navigate and understand.
*   **Responsive Design:** Works seamlessly on desktops and mobile devices.

## Technologies

### Languages

*   JavaScript

### Frameworks

*   Vite
*   React

### Tools & Technologies

*   Node.js
*   Tailwind CSS

## Prerequisites & Dependencies

Before you begin, ensure you have the following installed:

*   **Node.js:** (version 18 or higher)
*   **npm or bun:** (Node Package Manager or Bun package manager)
*   **Git:** For version control.

## Installation & Setup Instructions

Follow these steps to set up the project locally:

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/surajroy7430/Weather-and-News-Dashboard.git
    cd Weather-and-News-Dashboard
    ```

2.  **Install dependencies using npm or bun:**

    Using npm:

    ```bash
    npm install
    ```

    or using bun:

    ```bash
    bun install
    ```

3.  **Create a `.env.local` file:**

    Copy the contents of `.env.example` into a new file named `.env.local` in the root directory.

    ```bash
    cp .env.example .env.local
    ```

4.  **Configure API Keys:**

    Obtain API keys for weather and news services (e.g., OpenWeatherMap, News API) and update the `.env.local` file with your keys.

    ```
    WEATHER_API_KEY=your_weather_api_key
    NEWS_API_KEY=your_news_api_key
    ```

5.  **Start the development server:**

    Using npm:

    ```bash
    npm run dev
    ```

    or using bun:

    ```bash
    bun run dev
    ```

    The application will be available at `http://localhost:5173`.

## Project Structure

```
weather-news-dashboard/
├── .env.example
├── .gitignore
├── README.md
├── bun.lock
├── components.json
├── eslint.config.js
├── index.html
├── jsconfig.json
├── package.json
└── public/
    ├── favicon.png
└── src/
    ├── App.jsx
    └── components/
        ├── FavoriteCities.jsx
        ├── Header.jsx
        ├── Loader.jsx
        ├── SearchCity.jsx
        └── ...
```

## Usage Examples

*   **OTP Based Authentication:** Send otp to your email address and verify to access dashboard. (Please check your spam folder also if not received)
*   **Searching for a city:** Use the search bar to enter a city name. The application will display current weather information for that location.
*   **Adding a city to favorites:**  Click the "Add to Favorites" button to save the city for quick access in the future.
*   **Viewing News:**  Browse the latest news headlines displayed on the dashboard.

## Configuration Options

*   **API Keys:**  Configure your weather and news API keys in the `.env.local` file.

## Contributing Guidelines

Contributions are welcome! To contribute to this project:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with descriptive messages.
4.  Push your branch to your forked repository.
5.  Submit a pull request to the main repository.

## License Information

License not specified.

## Acknowledgments

*   This project uses open-source libraries and frameworks like React, Vite, and Tailwind CSS.
