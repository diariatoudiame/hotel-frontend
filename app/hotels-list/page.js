"use client";
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import CreateHotelModal from './CreateHotelModal';

const MainContent = styled.div`
    padding: 20px;
    overflow-y: auto;
    height: 100%;
`;

// const HotelsHeader = styled.div`
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//     margin-bottom: 20px;
// `;
const HotelsHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 16px;
    margin: -20px -20px 20px -20px;
`;

// const HotelsTitle = styled.h1`
//     margin: 0;
//     font-size: 18px;
//     //font-weight: 500;
//     color: #333;
// `;
const HotelsTitle = styled.h1`
    margin: 0;
    font-size: 18px;
    color: #333; // Noir
`;

const HotelsCount = styled.span`
    color: #666; // Gris foncé
    font-weight: normal;
`;

const AddHotelButton = styled.button`
    //background-color: white;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    padding: 8px 16px;
    font-size: 17px;
    font-weight: 500;
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

const PriceContainer = styled.div`
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 16px;
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

const HotelsListPage = () => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);


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

            if (!data.success) {
                throw new Error(data.msg || 'Erreur lors de la récupération des hôtels');
            }

            setHotels(data.result);
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

    return (
        <MainContent>
            <HotelsHeader>
                <HotelsTitle>Hôtels <HotelsCount>{hotels.length}</HotelsCount></HotelsTitle>
                <AddHotelButton
                    onClick={() => setIsModalOpen(true)}
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

            {!loading && !error && (
                <HotelsGrid>
                    {hotels.map((hotel) => (
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

            {!loading && !error && hotels.length === 0 && (
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
    );
};

export default HotelsListPage;