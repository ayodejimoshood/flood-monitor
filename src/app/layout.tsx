import type { Metadata } from "next";
import "./globals.css";
import "./platform.css";
import PlatformUI from "./components/PlatformUI";
import RainAnimation from "./components/RainAnimation";
import { Suspense } from "react";

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
        <PlatformUI />
        
        <div id="rain-animation-container" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 9999, pointerEvents: 'none' }}>
          <Suspense fallback={null}>
            <RainAnimation intensity="storm" />
          </Suspense>
        </div>
        
        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem', position: 'relative', zIndex: 1 }}>
          {children}
        </main>
        <footer style={{ 
          borderTop: '1px solid var(--border-color)',
          padding: '2rem 0',
          marginTop: '3rem',
          position: 'relative',
          zIndex: 1
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
