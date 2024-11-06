"use client";
import './globals.css';
import StyledComponentsRegistry from './lib/registry';
import { Toaster } from 'react-hot-toast';
import { ReactNode } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import styled from 'styled-components';
import { usePathname } from 'next/navigation';

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

    const authPaths = [
        '/login',
        '/register',
        '/forgot-password',
        '/reset-password'
    ];

    const isAuthPage = authPaths.includes(pathname || '');

    return (
        <html>
        <body>
        <StyledComponentsRegistry>
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
    );
}