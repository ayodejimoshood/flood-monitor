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
        {/* <header style={{ 
          backgroundColor: 'var(--card-background)', 
          borderBottom: '1px solid var(--border-color)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }}>
          <div style={{ 
            maxWidth: '1200px', 
            margin: '0 auto', 
            padding: '1rem 1.5rem',
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                style={{ marginRight: '0.75rem' }}
              >
                <path 
                  d="M12 2L1 21h22L12 2z" 
                  fill="var(--primary-color)" 
                  stroke="var(--primary-color)" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
              <h1 style={{ 
                margin: 0, 
                fontSize: '1.25rem', 
                fontWeight: 800,
                letterSpacing: '-0.03em',
              }}>
                UK Flood Monitor
              </h1>
            </div>
            <nav>
              <a 
                href="https://environment.data.gov.uk/flood-monitoring/doc/reference" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  color: 'var(--text-secondary)', 
                  marginLeft: '1.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  transition: 'color 0.2s ease',
                }}
                className="nav-link"
              >
                API Docs
              </a>
            </nav>
          </div>
        </header> */}
        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
          {children}
        </main>
        <footer style={{ 
          borderTop: '1px solid var(--border-color)',
          padding: '2rem 0',
          marginTop: '3rem',
        }}>
          <div style={{ 
            maxWidth: '1200px', 
            margin: '0 auto', 
            padding: '0 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                style={{ marginRight: '0.5rem' }}
              >
                <path 
                  d="M12 2L1 21h22L12 2z" 
                  fill="var(--primary-color)" 
                  stroke="var(--primary-color)" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
              <span style={{ 
                fontSize: '0.875rem', 
                fontWeight: 600,
                color: 'var(--text-color)',
              }}>
                UK Flood Monitor
              </span>
            </div>
            <p style={{ 
              margin: 0, 
              fontSize: '0.75rem', 
              color: 'var(--text-secondary)',
              textAlign: 'center',
            }}>
              Data provided by the <a href="https://environment.data.gov.uk/flood-monitoring/doc/reference" target="_blank" rel="noopener noreferrer">UK Environmental Agency</a> under the Open Government Licence
            </p>
            <p style={{ 
              margin: 0, 
              fontSize: '0.75rem', 
              color: 'var(--text-secondary)',
              textAlign: 'center',
            }}>
              Developed with <span style={{ color: 'var(--error-color)' }}>❤</span> by <span style={{ fontWeight: 500 }}>Ayodeji Moshood</span>
            </p>
            <p style={{ 
              margin: 0, 
              fontSize: '0.75rem', 
              color: 'var(--text-secondary)',
              opacity: 0.8,
              textAlign: 'center',
            }}>
              © {new Date().getFullYear()} UK Flood Monitor. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
