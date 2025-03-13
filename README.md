# UK Flood Monitor

A web and desktop application for monitoring real-time flood data from the UK Environmental Agency's measurement stations across the country.

## Download

You can download the latest version of UK Flood Monitor from our [GitHub Releases page](https://github.com/ayodejimoshood/flood-monitor/releases).

Available platforms:
- macOS (Apple Silicon)
- Windows (Coming Soon)
- Linux (Coming Soon)

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

- Node.js 18+ and npm

### Installation

1. Clone the repository
   ```
   git clone https://github.com/ayodejimoshood/flood-monitor.git
   cd flood-monitor
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Run the development server
   ```
   npm run dev
   ```

4. Run the Electron app in development mode
   ```
   npm run electron:dev
   ```

### Building for Production

To build the desktop application for your platform:

```
npm run electron:build
```

For specific platforms:

```
npm run electron:build:mac    # macOS
npm run electron:build:win    # Windows
npm run electron:build:linux  # Linux
```

This will create distributable packages in the `dist` directory.

## License

This project is open source and available under the MIT License.

## Author

Developed with ❤ by [Ayodeji Moshood](https://github.com/ayodejimoshood)