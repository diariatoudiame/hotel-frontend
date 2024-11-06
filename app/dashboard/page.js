"use client";
import styled from 'styled-components';
import {
    Users, MessageCircle, FileText, MailOpen
} from 'lucide-react';
import React, { useEffect, useState } from "react";
import axios from "axios";

// Constantes
const API_URL = 'https://backend-hotel-51v4.onrender.com';
const STATS_DATA = [
    { icon: MailOpen, color: '#A88ADD', value: '125', label: 'Formulaires' },
    { icon: MessageCircle, color: '#0CC2AA', value: '40', label: 'Messages' },
    { icon: Users, color: '#FCC100', value: '600', label: 'Utilisateurs' },
    { icon: MailOpen, color: '#F90000', value: '25', label: 'E-mails' },
    { icon: FileText, color: '#9C27B0', value: '40', label: 'Hôtels' },
    { icon: Users, color: '#1565C0', value: '02', label: 'Entites' }
];

// Styled Components
const Container = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
`;

const MainContent = styled.div`
    flex: 1;
    background-color: #f5f5f5;
    padding: 0 0;
`;

const WelcomeCard = styled.div`
    background-color: white;
    padding: 1.5rem 2rem; 
    margin-bottom: 1.75rem;
    border-radius: 0.5rem;
`;

const ContentContainer = styled.div`
    padding: 0 0.5rem;
`;

const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
`;

const StatCard = styled.div`
    background-color: white;
    padding: 1.25rem;
    border-radius: 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const IconContainer = styled.div`
    width: 45px;
    height: 45px;
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${props => props.$color};
`;

const StatsCardComponent = ({ stat, index }) => (
    <StatCard key={index}>
        <IconContainer $color={stat.color}>
            <stat.icon className="text-white w-5 h-5" />
        </IconContainer>
        <div>
            <h3 className="m-0 text-xl text-gray-700">{stat.value}</h3>
            <p className="mt-1 mb-0 text-xs text-gray-500">
                {stat.label}<br />Je ne sais pas quoi mettre
            </p>
        </div>
    </StatCard>
);

export default function DashboardPage() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    window.location.href = '/login';
                    return;
                }

                await axios.get(`${API_URL}/api/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            } catch (error) {
                console.error('Erreur lors de la récupération des données utilisateur:', error);
                if (error.response?.status === 401) {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) {
        return (
            <Container>
                <MainContent>
                    {/* Afficher un message de chargement ou un spinner personnalisé ici */}
                    <div>Chargement...</div>
                </MainContent>
            </Container>
        );
    }

    return (
        <Container>
            <MainContent>
                <WelcomeCard>
                    <h2 className="m-0 text-lg text-gray-700">Bienvenue sur RED Product</h2>
                    <p className="mt-1 mb-0 text-gray-500">Lorem ipsum dolor sit amet consectetur</p>
                </WelcomeCard>

                <ContentContainer>
                    <StatsGrid>
                        {STATS_DATA.map((stat, index) => (
                            <StatsCardComponent key={index} stat={stat} index={index} />
                        ))}
                    </StatsGrid>
                </ContentContainer>
            </MainContent>
        </Container>
    );
}