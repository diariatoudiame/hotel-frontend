"use client";
import Link from 'next/link';
import styled from 'styled-components';
import { Search, Bell, LogOut } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { usePathname } from 'next/navigation';

const API_URL = 'https://backend-hotel-51v4.onrender.com';

const HeaderWrapper = styled.header`
    display: flex;
    height: 50px;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
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

const UserAvatar = ({ user }) => {
    const userName = user?.name;
    const firstLetter = userName ? userName.charAt(0).toUpperCase() : '';

    return (
        <div className="relative">
            {user?.photo ? (
                <Image
                    src={`${API_URL}/${user.photo}`}
                    alt="Photo de profile"
                    width={24}
                    height={24}
                    className="rounded-full object-cover"
                />
            ) : (
                <div
                    className="flex items-center justify-center w-6 h-6 bg-white text-gray-800 font-bold rounded-full border border-gray-300"
                    style={{ fontSize: '14px' }}
                >
                    {firstLetter}
                </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
        </div>
    );
};

export function Header() {
    const [user, setUser] = useState(null);
    const pathname = usePathname();

    const handleLogout = () => {
        // Remplacer l'entrée actuelle de l'historique par la page de login
        window.history.replaceState(null, '', '/login');

        // Supprimer le token
        localStorage.removeItem('token');

        // Nettoyer d'autres données de session si nécessaire
        sessionStorage.clear();

        // Ajouter une nouvelle entrée dans l'historique pour la page de login
        window.history.pushState(null, '', '/login');

        // Rediriger vers la page de login
        window.location.href = '/login';
    };

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            if (!token && window.location.pathname !== '/login') {
                // Si pas de token et pas déjà sur la page login, rediriger
                window.history.replaceState(null, '', '/login');
                window.location.href = '/login';
            }
        };

        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    checkAuth();
                    return;
                }

                const response = await axios.get(`${API_URL}/api/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                setUser(response.data);
            } catch (error) {
                if (error.response?.status === 401) {
                    handleLogout();
                }
            }
        };

        fetchUserData();

        // Ajouter un écouteur pour l'événement popstate
        window.addEventListener('popstate', checkAuth);

        return () => {
            // Nettoyer l'écouteur lors du démontage du composant
            window.removeEventListener('popstate', checkAuth);
        };
    }, []);

    const getHeaderText = () => {
        if (pathname === '/dashboard') {
            return 'Dashboard';
        } else if (pathname === '/hotels-list') {
            return 'Liste des hôtels';
        } else {
            return 'Dashboard';
        }
    };

    return (
        <HeaderWrapper>
            <LogoContainer>
                <Image
                    src="/Link.png"
                    alt="Logo"
                    width={24}
                    height={24}
                    className="mr-2"
                />
                <Link href="/public" className="text-white text-sm font-medium no-underline">
                    RED PRODUCT
                </Link>
            </LogoContainer>

            <HeaderContent>
                <div className="text-gray-700 text-sm font-medium">{getHeaderText()}</div>
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
        </HeaderWrapper>
    );
}