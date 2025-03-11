import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UK Flood Monitoring Tool",
  description: "Monitor real-time flood data from the UK Environmental Agency",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header style={{ 
          backgroundColor: 'var(--primary-color)', 
          color: 'white', 
          padding: '1.25rem 0',
          boxShadow: 'var(--shadow)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}>
          <div className="container" style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 1.5rem'
          }}>
            <h1 style={{ margin: 0, fontSize: '1.75rem' }}>
              <span style={{ fontWeight: 800 }}>UK</span> Flood Monitor
            </h1>
            <nav>
              <a 
                href="https://environment.data.gov.uk/flood-monitoring/doc/reference" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  color: 'white', 
                  marginLeft: '1rem',
                  opacity: 0.9,
                  fontSize: '0.9rem',
                  fontWeight: 500
                }}
              >
                API Docs
              </a>
            </nav>
          </div>
        </header>
        <main className="container">
          {children}
        </main>
        <footer style={{ 
          backgroundColor: 'var(--card-background)',
          borderTop: '1px solid var(--border-color)',
          padding: '2rem 0',
          marginTop: '3rem',
          color: 'var(--text-secondary)',
          fontSize: '0.875rem'
        }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <p style={{ margin: 0 }}>
              Data provided by the <a href="https://environment.data.gov.uk/flood-monitoring/doc/reference" target="_blank" rel="noopener noreferrer">UK Environmental Agency</a> under the Open Government Licence
            </p>
            <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', opacity: 0.8 }}>
              This uses Environment Agency flood and river level data from the real-time data API (Beta)
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
