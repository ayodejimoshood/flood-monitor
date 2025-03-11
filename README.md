# UK Flood Monitoring Tool

A web application that interacts with the UK Environmental Agency's real-time flood-monitoring API to display water level and flow data from measurement stations across the UK.

## Features

- Browse and search for measurement stations by name, river, or town
- View available measures for each station (water level, flow, etc.)
- Display readings from the last 24 hours as an interactive line chart
- View detailed readings data in a paginated table format

## Technologies Used

- **Next.js**: React framework for building the application
- **TypeScript**: For type safety and better developer experience
- **Recharts**: For creating interactive and responsive charts
- **Axios**: For making API requests to the flood monitoring API
- **CSS**: Plain CSS for styling the application

## API Information

This application uses the UK Environmental Agency's real-time flood-monitoring API:
- API Documentation: [https://environment.data.gov.uk/flood-monitoring/doc/reference](https://environment.data.gov.uk/flood-monitoring/doc/reference)
- Data is provided under the Open Government Licence

## Getting Started

### Prerequisites

- Node.js 18.17 or later

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Select a measurement station from the dropdown or search for a specific station
2. Choose a measure type (e.g., water level, flow)
3. View the readings data displayed as a line chart and in a table format

## Building for Production

```bash
npm run build
```

Then, you can start the production server:

```bash
npm start
```

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgements

- Data provided by the [UK Environmental Agency](https://environment.data.gov.uk/flood-monitoring/doc/reference)
- This project uses the Environment Agency flood and river level data from the real-time data API (Beta)
# flood-monitor
