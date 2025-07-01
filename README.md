# Dashboard Mannheim

This project is an interactive web dashboard for visualizing temperature data from various weather stations across Mannheim, Germany. It provides a user-friendly interface with a map-based visualization, charts, and data filtering options.

## Features

  * **Interactive Map:** Displays weather stations on a map of Mannheim using Leaflet. Users can click on stations to view more detailed information.
  * **Data Visualization:** Includes line charts and bar charts to visualize temperature trends over time and compare data between different stations.
  * **Date Filtering:** A date picker allows users to select a specific date range to analyze the temperature data.
  * **Station Information:** Detailed information for each station is available, including metadata and data stories.
  * **Responsive Design:** The dashboard is built with a responsive layout that should adapt to different screen sizes.

## Technologies Used

  * **Frontend Framework:** React with TypeScript
  * **Build Tool:** Vite
  * **Mapping Library:** Leaflet and React-Leaflet
  * **Charting Library:** Recharts
  * **Styling:** Tailwind CSS with CSS Modules
  * **UI Components:** Shadcn/ui

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have Node.js and npm (or a compatible package manager like yarn or pnpm) installed on your system.

### Installation

1.  Clone the repository to your local machine:
    ```sh
    git clone https://github.com/your-username/dashboard_mannheim.git
    ```
2.  Navigate to the project directory:
    ```sh
    cd dashboard_mannheim
    ```
3.  Install the dependencies:
    ```sh
    npm install
    ```

### Running the Development Server

To start the development server, run the following command:

```sh
npm run dev
```

This will start the application in development mode. You can view it by opening [http://localhost:5173](https://www.google.com/search?q=http://localhost:5173) in your browser. The page will reload if you make edits.

### Building for Production

To create a production build of the application, run:

```sh
npm run build
```

This will build the app for production to the `dist` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

## Data Source

The primary data for this dashboard is located in `public/data.csv`. This file contains the temperature readings from the different weather stations.

Additional metadata and data stories for the stations are stored in `src/metadata.json` and `src/dataStoriesStations.json`.

## Project Structure

The project follows a standard React project structure:

```
dashboard_mannheim/
├── public/
│   └── data.csv
├── src/
│   ├── components/
│   │   ├── ui/
│   │   ├── styles/
│   │   ├── BarChart.tsx
│   │   ├── CityMap.tsx
│   │   ├── Dashboard.tsx
│   │   ├── DatePicker.tsx
│   │   ├── ExtraInfoCard.tsx
│   │   ├── LeafletMapTemperature.tsx
│   │   ├── Legend.tsx
│   │   ├── LineChart.tsx
│   │   └── StationInfoCard.tsx
│   ├── utils/
│   │   └── DataHandler.ts
│   ├── App.tsx
│   ├── main.tsx
│   ├── dataStoriesStations.json
│   └── metadata.json
├── package.json
└── README.md
```
