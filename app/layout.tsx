// app/layout.tsx
import './globals.css';
import StyledComponentsRegistry from './lib/registry';
import { Toaster } from 'react-hot-toast';
import { ReactNode } from 'react';

interface RootLayoutProps {
    children: ReactNode; // Spécifiez le type de children ici
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html>
        <body>
        <StyledComponentsRegistry>
            {children}
            <Toaster
                position="top-right"
                toastOptions={{
                    // Style par défaut pour tous les toasts
                    duration: 3000,
                    style: {
                        background: '#333',
                        color: '#fff',
                        padding: '16px',
                        borderRadius: '8px',
                        fontSize: '14px',
                    },
                    // Styles spécifiques pour chaque type de toast
                    success: {
                        style: {
                            background: '#2e7d32',
                        },
                        iconTheme: {
                            primary: '#fff',
                            secondary: '#2e7d32',
                        },
                    },
                    error: {
                        style: {
                            background: '#d32f2f',
                        },
                        iconTheme: {
                            primary: '#fff',
                            secondary: '#d32f2f',
                        },
                        duration: 5000,
                    },
                    loading: {
                        style: {
                            background: '#333',
                        },
                        iconTheme: {
                            primary: '#fff',
                            secondary: '#333',
                        },
                    },
                }}
            />
        </StyledComponentsRegistry>
        </body>
        </html>
    );
}
