"use client";
import './globals.css';
import StyledComponentsRegistry from './lib/registry';
import { Toaster } from 'react-hot-toast';
import { ReactNode, useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import styled from 'styled-components';
import { usePathname } from 'next/navigation';

// Loader Styles
const LoaderContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
`;

const Loader = styled.div`
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
`;

const MainContainer = styled.div`
    display: flex;
    flex: 1;
`;

const MainContent = styled.div`
    flex: 1;
    background-color: #f5f5f5;
    padding: 0 0;
    margin-left: 200px;
    padding-top: 50px;
`;

interface RootLayoutProps {
    children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(true); // State pour gérer le loader

    const authPaths = [
        '/login',
        '/register',
        '/forgot-password',
        '/reset-password'
    ];

    const isAuthPage = authPaths.includes(pathname || '');

    // Simuler un chargement avec useEffect
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false); // Après 2 secondes, on cache le loader
        }, 2000); // Le délai peut être ajusté ou être remplacé par une logique conditionnelle (par exemple, une requête API)

        return () => clearTimeout(timer); // Nettoyer le timer si le composant est démonté
    }, []);

    return (
        <>
            {/* Assurez-vous qu'il n'y a aucun espace ou retour à la ligne entre les balises */}
            <html lang="fr">
            <body>
            <StyledComponentsRegistry>
                {isLoading ? (
                    <LoaderContainer>
                        <Loader />
                    </LoaderContainer>
                ) : (
                    <>
                        {isAuthPage ? (
                            <>{children}</>
                        ) : (
                            <Container>
                                <Header />
                                <MainContainer>
                                    <Sidebar />
                                    <MainContent>
                                        {children}
                                    </MainContent>
                                </MainContainer>
                            </Container>
                        )}
                    </>
                )}
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 3000,
                        style: {
                            background: '#333',
                            color: '#fff',
                            padding: '16px',
                            borderRadius: '8px',
                            fontSize: '14px',
                        },
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
        </>
    );
}
