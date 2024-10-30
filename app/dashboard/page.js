"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styled from 'styled-components';
import {
    Users, MessageCircle, Mail, FileText, Search,
    Bell, User, LogOut, LayoutDashboard, Building2, Loader
} from 'lucide-react';
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from 'next/image';

// Styled Components
const Container = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
`;

const LoadingOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const Header = styled.header`
    display: flex;
    height: 50px;
`;

const LogoContainer = styled.div`
    width: 200px;
    background-color: #464646;
    display: flex;
    align-items: center;
    padding: 0 1rem;
`;

const HeaderContent = styled.div`
    flex: 1;
    background-color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1.25rem;
    border-bottom: 1px solid #e5e7eb;
`;

const SearchContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: white;
    border: 1px solid #e5e7eb;
    border-radius: 9999px;
    padding: 0.375rem 0.75rem;
`;

const SearchInput = styled.input`
    border: none;
    outline: none;
    font-size: 0.875rem;
    color: #4b5563;
    width: 200px;
    background-color: transparent;
    &::placeholder {
        color: #9ca3af;
    }
`;

const MainContainer = styled.div`
    display: flex;
    flex: 1;
`;

const Sidebar = styled.div`
    width: 200px;
    background-color: #464646;
    color: white;
    display: flex;
    flex-direction: column;
    position: relative;
    background-image: url("/__before.png");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
`;

const SidebarOverlay = styled.div`
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.7);
`;

const MenuContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
    z-index: 10;
`;

const MenuItem = styled(Link)`
    padding: 0.625rem 1rem;
    display: flex;
    align-items: center;
    gap: 0.625rem;
    font-size: 0.875rem;
    color: white;
    text-decoration: none;
    &:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }
    ${props => props.$active && `
    background-color: rgba(255, 255, 255, 0.1);
  `}
`;

const ProfileSection = styled.div`
    margin-bottom: 5rem;
`;

const Divider = styled.div`
    margin: 0 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
`;

const ProfileInfo = styled.div`
    padding: 1rem;
    display: flex;
    align-items: center;
    gap: 0.625rem;
`;

const Avatar = styled.div`
    width: 2rem;
    height: 2rem;
    border-radius: 9999px;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #4b5563;
    font-size: 0.875rem;
    font-weight: 500;
`;

const MainContent = styled.div`
    flex: 1;
    background-color: #f5f5f5;
`;

const WelcomeCard = styled.div`
    background-color: white;
    padding: 1.25rem;
    margin-bottom: 1.75rem;
`;

const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
    padding: 0 1.25rem;
`;

const StatCard = styled.div`
    background-color: white;
    padding: 1.25rem;
    border-radius: 0.5rem;
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

export default function DashboardPage() {
    const pathname = usePathname();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';  // Redirection vers la page de login
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    window.location.href = '/login';
                    return;
                }

                const response = await axios.get('http://localhost:5000/api/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                setUser(response.data);
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

    return (
        <Container>
            {loading && (
                <LoadingOverlay>
                    <Loader size={40} className="animate-spin text-gray-600" />
                </LoadingOverlay>
            )}

            <Header>
                <LogoContainer>
                    <Image src="/Link.png" alt="Logo" className="w-6 h-6 mr-2" />
                    <Link href="/" className="text-white text-sm font-medium no-underline">
                        RED PRODUCT
                    </Link>
                </LogoContainer>

                <HeaderContent>
                    <div className="text-gray-700 text-sm font-medium">Dashboard</div>
                    <div className="flex items-center gap-5">
                        <SearchContainer>
                            <Search size={16} className="text-gray-400" />
                            <SearchInput placeholder="Rechercher..." />
                        </SearchContainer>
                        <Link href="/notifications" className="relative">
                            <Bell size={18} className="text-gray-600" />
                            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-yellow-400 rounded-full" />
                        </Link>
                        <Link href="/profile" className="text-gray-600 relative">
                            {user?.photo ? (
                                <>
                                    <Image
                                        src={`http://localhost:5000/${user.photo}`}
                                        alt="Photo de profil"
                                        className="w-6 h-6 rounded-full object-cover"
                                    />
                                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                </>
                            ) : (
                                <>
                                    <User size={18} />
                                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                </>
                            )}
                        </Link>

                        <Link href="/logout" onClick={handleLogout} className="text-gray-600">
                            <LogOut size={18} />
                        </Link>
                    </div>
                </HeaderContent>
            </Header>

            <MainContainer>
                <Sidebar>
                    <SidebarOverlay />
                    <MenuContainer>
                        <div className="flex-1">
                            <div className="py-2.5">
                                <MenuItem href="/dashboard">Principal</MenuItem>
                                <MenuItem href="/dashboard" $active={pathname === '/dashboard'}>
                                    <LayoutDashboard size={18} />
                                    Dashboard
                                </MenuItem>
                                <MenuItem href="/hotels-list" $active={pathname === '/hotels-list'}>
                                    <Building2 size={18} />
                                    Liste des hôtels
                                </MenuItem>
                            </div>
                        </div>

                        <ProfileSection>
                            <Divider />
                            <ProfileInfo>
                                <Avatar>
                                    {user?.photo ? (
                                        <Image
                                            src={`http://localhost:5000/${user.photo}`} // Remplace par l'URL complète de l'image
                                            alt="User Profile"
                                            style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                                        />
                                    ) : (
                                        user?.email ? user.email[0].toUpperCase() : 'U'
                                    )}
                                </Avatar>
                                <div className="text-sm">
                                    <p className="m-0 text-white small-text">
                                        {user?.name || 'Utilisateur'}
                                    </p>
                                    <div className="flex items-center gap-1">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <p className="m-0 text-xs text-gray-400">en ligne</p>
                                    </div>
                                </div>
                            </ProfileInfo>
                        </ProfileSection>
                    </MenuContainer>
                </Sidebar>

                <MainContent>
                    <WelcomeCard>
                        <h2 className="m-0 text-lg text-gray-700">Bienvenue sur RED Product</h2>
                        <p className="mt-1 mb-0 text-gray-500">Lorem ipsum dolor sit amet consectetur</p>
                    </WelcomeCard>

                    <StatsGrid>
                        {[
                            { icon: Users, color: '#9C27B0', value: '125', label: 'Formulaires' },
                            { icon: MessageCircle, color: '#00BCD4', value: '40', label: 'Messages' },
                            { icon: Users, color: '#FFC107', value: '600', label: 'Utilisateurs' },
                            { icon: Mail, color: '#f44336', value: '25', label: 'E-mails' },
                            { icon: FileText, color: '#9C27B0', value: '40', label: 'Hôtels' },
                            { icon: Users, color: '#2196F3', value: '02', label: 'Entites' }
                        ].map((stat, index) => (
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
                        ))}
                    </StatsGrid>
                </MainContent>
            </MainContainer>
        </Container>
    );
}