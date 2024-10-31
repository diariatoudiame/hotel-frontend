"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import {  Search,  Bell, User, LogOut, LayoutDashboard, Building2} from 'lucide-react';
import styled from 'styled-components';
import CreateHotelModal from './CreateHotelModal';
import axios from "axios";
import Image from 'next/image';


const PriceContainer = styled.div`
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 16px;
`;

//List hotels
const DashboardContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh; // Utilise toute la hauteur de la fenêtre
    background-color: #f5f5f5;
    overflow: hidden; // Empêche le double scroll
`;

const Header = styled.header`
    display: flex;
    height: 50px;
    border-bottom: 1px solid #e0e0e0;
    position: sticky;
    top: 0;
    z-index: 100;
    background-color: white;
`;

const HeaderLeft = styled.div`
    width: 200px;
    background-color: #464646;
    display: flex;
    align-items: center;
    padding: 0 1rem;

    a {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: white;
        text-decoration: none;
        font-size: 14px;
        font-weight: 500;
    }
`;

const HeaderRight = styled.div`
    flex: 1;
    background-color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
`;

const PageTitle = styled.div`
    color: #333;
    font-size: 14px;
    font-weight: 500;
`;

const HeaderActions = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
`;

const SearchBar = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    background-color: white;
    border: 1px solid #e0e0e0;
    border-radius: 20px;
    padding: 6px 12px;

    input {
        border: none;
        outline: none;
        font-size: 14px;
        color: #666;
        background: transparent;
        width: 200px;

        &::placeholder {
            color: #999;
        }
    }

    &:focus-within {
        border-color: #999;
    }
`;

const IconButton = styled.button`
    cursor: pointer;
    padding: 5px;
    border: none;
    background: none;
    border-radius: 50%;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        background-color: #f0f0f0;
    }
`;

const NotificationBadge = styled.div`
    position: relative;
    cursor: pointer;

    &::after {
        content: '';
        position: absolute;
        top: -2px;
        right: -2px;
        width: 8px;
        height: 8px;
        background-color: #FFC107;
        border-radius: 50%;
    }
`;

const MainContainer = styled.div`
    display: flex;
    flex: 1;
    height: calc(100vh - 50px); // Soustrait la hauteur du header
    overflow: hidden; // Empêche le scroll du container principal
`;

// const Sidebar = styled.div`
//     width: 200px;
//     background-color: #464646;
//     color: white;
//     display: flex;
//     flex-direction: column;
// `;
const Sidebar = styled.div`
    width: 200px;
    background-color: #464646;
    color: white;
    height: 100%;
    position: sticky;
    top: 50px; // Même hauteur que le header
    left: 0;
    overflow-y: auto; // Permet le défilement si le contenu de la sidebar est trop long
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

const ProfileSection = styled.div`
    margin-top: auto;
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


// const SidebarMenu = styled.div`
//     padding: 10px 0;
// `;

const MenuItemLink = styled(Link)`
    padding: 10px 15px;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    transition: background-color 0.3s;
    font-size: 14px;
    text-decoration: none;
    color: white;

    &:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }

    ${props => props.$isActive && `
        background-color: rgba(255, 255, 255, 0.1);
    `}
`;

const MainContent = styled.div`
    flex: 1;
    padding: 20px;
    overflow-y: auto; // Permet le défilement du contenu principal
    height: 100%;
`;

const HotelsHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
`;

const HotelsTitle = styled.h1`
    margin: 0;
    font-size: 14px;
    font-weight: 500;
    color: #333;
`;

const AddHotelButton = styled.button`
    background-color: white;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    padding: 8px 16px;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s;

    &:hover {
        background-color: #f5f5f5;
        border-color: #999;
    }

    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;

const HotelsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    padding: 24px;

    @media (max-width: 1200px) {
        grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: 900px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 600px) {
        grid-template-columns: 1fr;
    }
`;

const HotelCard = styled.div`
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease-in-out;

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
`;

const HotelImage = styled.div`
    height: 192px;
    background-image: url(${props => props.src});
    background-size: cover;
    background-position: center;
    background-color: #f5f5f5;
`;

const HotelInfo = styled.div`
    padding: 16px;
`;

const HotelAddress = styled.div`
    font-size: 12px;
    color: #8D4B38;;
    margin-bottom: 4px;
`;

const HotelName = styled.h3`
    margin: 0 0 8px 0;
    font-size: 16px;
    font-weight: 600;
    color: #111827;
`;



const Price = styled.span`
    font-size: 14px;
    font-weight: 600;
    color: #111827;
`;

const PriceUnit = styled.span`
    font-size: 12px;
    color: #6B7280;
`;


const LoadingMessage = styled.div`
    text-align: center;
    padding: 20px;
    color: #666;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;

    small {
        color: #999;
    }
`;

const ErrorMessage = styled.div`
    text-align: center;
    padding: 20px;
    color: #dc3545;
    background-color: rgba(220, 53, 69, 0.1);
    border-radius: 8px;
    margin: 20px 0;

    h3 {
        margin: 0 0 10px 0;
        color: #dc3545;
    }

    p {
        margin: 0;
        color: #666;
    }
`;

const RetryButton = styled.button`
    margin-top: 15px;
    padding: 8px 16px;
    background: #dc3545;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background: #c82333;
    }
`;

export default function HotelsListPage() {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const pathname = usePathname();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    window.location.href = '/login';
                    return;
                }

                const response = await axios.get('https://backend-hotel-51v4.onrender.com/api/me', {
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


    const navigationLinks = [

        {
            href: "/dashboard",
            icon: <LayoutDashboard size={18} />,
            label: "Dashboard"
        },
        {
            href: "/hotels-list",
            icon: <Building2 size={18} />,
            label: "Liste des hôtels"
        }
    ];

    useEffect(() => {
        fetchHotels();
    }, []);

    const getAuthToken = () => {
        return localStorage.getItem('token');
    };

    const fetchHotels = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = getAuthToken();
            if (!token) {
                throw new Error('Non authentifié. Veuillez vous connecter.');
            }

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const response = await fetch('https://backend-hotel-51v4.onrender.com/api/hotels', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                signal: controller.signal,
                credentials: 'include'
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                switch (response.status) {
                    case 401:
                        throw new Error('Session expirée. Veuillez vous reconnecter.');
                    case 403:
                        throw new Error('Accès non autorisé. Vérifiez vos permissions.');
                    case 404:
                        throw new Error('API introuvable. Vérifiez que le serveur est démarré.');
                    case 500:
                        throw new Error('Erreur serveur. Veuillez réessayer plus tard.');
                    default:
                        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
                }
            }

            const data = await response.json();
            setHotels(data.result || []);
        } catch (err) {
            if (err.name === 'AbortError') {
                setError('La requête a pris trop de temps. Vérifiez votre connexion.');
            } else if (err.message === 'Failed to fetch') {
                setError('Impossible de se connecter au serveur. Vérifiez que :\n' +
                    '1. Le serveur backend est démarré sur le port 5000\n' +
                    '2. Vous êtes bien connecté à Internet\n' +
                    '3. Votre token d\'authentification est valide');
            } else {
                setError(err.message);
            }
            console.error('Erreur:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';  // Redirection vers la page de login
    };

    const filteredHotels = hotels.filter(hotel =>
        hotel.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardContainer>

            <Header>
                <HeaderLeft>
                    <Link href="/" className="text-white text-sm font-medium no-underline">
                        <Image src="/Link.png" alt="Logo" className="w-6 h-6" />
                        RED PRODUCT
                    </Link>
                </HeaderLeft>
                <HeaderRight>
                    <PageTitle>Liste des hôtels</PageTitle>
                    <HeaderActions>
                        <SearchBar>
                            <Search size={16} color="#999" />
                            <input
                                placeholder="Rechercher un hôtel..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </SearchBar>
                        <NotificationBadge>
                            <Bell size={18} color="#666" />
                        </NotificationBadge>
                        {user.photo ? (
                            <Image
                                src={`https://backend-hotel-51v4.onrender.com/${user.photo}`}
                                alt="Photo de profil"
                                width={32}
                                height={32}
                                style={{ borderRadius: '50%' }}
                            />
                        ) : (
                            <IconButton>
                                <User size={18} />
                            </IconButton>
                        )}
                        {/*<IconButton>*/}
                        {/*    <User size={18} color="#666" />*/}
                        {/*</IconButton>*/}
                        <IconButton onClick={handleLogout}>
                            <LogOut size={18} color="#666" />
                        </IconButton>
                    </HeaderActions>
                </HeaderRight>
            </Header>

            <MainContainer>
                <Sidebar>
                    <SidebarOverlay />
                    <MenuContainer>
                        <div className="flex-1">
                            <div className="py-2.5">
                                <MenuItemLink href={'/dashboard'}>
                                    Principal
                                </MenuItemLink>
                                {navigationLinks.map((link) => (
                                    <MenuItemLink
                                        key={link.href}
                                        href={link.href}
                                        $isActive={pathname === link.href}
                                    >
                                        {link.icon}
                                        {link.label}
                                    </MenuItemLink>
                                ))}
                            </div>
                        </div>

                        <ProfileSection>
                            <Divider />
                            <ProfileInfo>
                                <Avatar>
                                    {user?.photo ? (
                                        <Image
                                            src={`https://backend-hotel-51v4.onrender.com/${user.photo}`}
                                            alt="Photo de profil"
                                            className="w-6 h-6 rounded-full object-cover"
                                        />
                                    ) : (
                                        <span>{user?.email ? user.email[0].toUpperCase() : 'U'}</span>
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
                    <HotelsHeader>
                        <HotelsTitle>Hôtels ({filteredHotels.length})</HotelsTitle>
                        <AddHotelButton
                            onClick={() => setIsModalOpen(true)} // Modifié pour ouvrir le modal
                            disabled={loading}
                        >
                            {loading ? 'Chargement...' : '+ Créer un nouveau hôtel'}
                        </AddHotelButton>
                    </HotelsHeader>

                    {loading && (
                        <LoadingMessage>
                            <p>Chargement des hôtels...</p>
                            <small>Vérification authentification...</small>
                        </LoadingMessage>
                    )}

                    {error && (
                        <ErrorMessage>
                            <h3>Erreur</h3>
                            <p style={{ whiteSpace: 'pre-line' }}>{error}</p>
                            <RetryButton onClick={fetchHotels}>
                                Réessayer
                            </RetryButton>
                        </ErrorMessage>
                    )}



                    {!loading && !error && filteredHotels.length === 0 && (
                        <LoadingMessage>
                            <p>Chargement des hôtels...</p>
                            <small>Vérification authentification...</small>
                        </LoadingMessage>
                    )}

                    {error && (
                        <ErrorMessage>
                            <h3>Erreur</h3>
                            <p style={{ whiteSpace: 'pre-line' }}>{error}</p>
                            <RetryButton onClick={fetchHotels}>
                                Réessayer
                            </RetryButton>
                        </ErrorMessage>
                    )}


                    {!loading && !error && (
                        <HotelsGrid>
                            {filteredHotels.map((hotel) => (
                                <HotelCard key={hotel._id}>
                                    <HotelImage
                                        src={hotel.photo
                                            ? `https://backend-hotel-51v4.onrender.com${hotel.photo.path}`
                                            : '/api/placeholder/400/320'
                                        }
                                    />
                                    <HotelInfo>
                                        <HotelAddress>{hotel.address}</HotelAddress>
                                        <HotelName>{hotel.name}</HotelName>
                                        <PriceContainer>
                                            <Price>
                                                {parseInt(hotel.price).toLocaleString()} XOF
                                            </Price>
                                            <PriceUnit>par nuit</PriceUnit>
                                        </PriceContainer>
                                    </HotelInfo>
                                </HotelCard>
                            ))}
                        </HotelsGrid>
                    )}

                    {!loading && !error && filteredHotels.length === 0 && (
                        <LoadingMessage>Aucun hôtel trouvé</LoadingMessage>
                    )}
                    <CreateHotelModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSuccess={() => {
                            fetchHotels();
                        }}
                    />
                </MainContent>
            </MainContainer>
        </DashboardContainer>
    );
}



