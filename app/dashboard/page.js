"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styled from 'styled-components';
import {
    Users, MessageCircle, FileText, Search,
    Bell, User, LogOut, LayoutDashboard, Building2, Loader, MailOpen
} from 'lucide-react';
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from 'next/image';

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
    overflow: hidden;
`;

const MainContent = styled.div`
    flex: 1;
    background-color: #f5f5f5;
    padding: 1.25rem;
`;

const WelcomeCard = styled.div`
    background-color: white;
    padding: 1.25rem;
    margin-bottom: 1.75rem;
    border-radius: 0.5rem;
`;

const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
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

// Composants
const UserAvatar = ({ user }) => (
    <div className="relative">
        {user?.photo ? (
            <Image
                src={`${API_URL}/${user.photo}`}
                alt="Photo de profil"
                width={24}
                height={24}
                className="rounded-full object-cover"
            />
        ) : (
            <User size={18} />
        )}
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
    </div>
);

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
    const pathname = usePathname();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    window.location.href = '/login';
                    return;
                }

                const response = await axios.get(`${API_URL}/api/me`, {
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

    if (loading) {
        return (
            <LoadingOverlay>
                <Loader size={40} className="animate-spin text-gray-600" />
            </LoadingOverlay>
        );
    }

    return (
        <Container>
            <Header>
                <LogoContainer>
                    <Image
                        src="/Link.png"
                        alt="Logo"
                        width={24}
                        height={24}
                        className="mr-2"
                    />
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

                        <Link href="" className="text-gray-600">
                            <UserAvatar user={user} />
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="text-gray-600 border-none bg-transparent cursor-pointer p-2 hover:bg-gray-100 rounded-full"
                        >
                            <LogOut size={18} />
                        </button>
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
                                            src={`${API_URL}/${user.photo}`}
                                            alt="User Profile"
                                            width={32}
                                            height={32}
                                            className="w-full h-full object-cover"
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
                        {STATS_DATA.map((stat, index) => (
                            <StatsCardComponent key={index} stat={stat} index={index} />
                        ))}
                    </StatsGrid>
                </MainContent>
            </MainContainer>
        </Container>
    );
}