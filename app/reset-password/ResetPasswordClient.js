// app/reset-password/ResetPasswordClient.js
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: black;
  position: relative;
`;
const Logo = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;
    color: white;
    margin-bottom: 20px;

    img {
        height: 40px;
        width: auto;
    }

    h1 {
        font-size: 24px;
        margin: 0;
    }
`;


const BackgroundOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: url('/__before.png') center / cover;
  opacity: 0.3;
  z-index: 10;
`;

const FormContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 20;
`;

const Title = styled.h2`
  color: #333;
`;

const ErrorMessage = styled.div`
  background-color: #fef2f2;
  color: #dc2626;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  border: 1px solid #fee2e2;
`;

const SuccessMessage = styled.div`
  background-color: #f0fdfa;
  color: #0e4da4;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  border: 1px solid #cffafe;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: 1px solid ${({ isError }) => (isError ? '#dc2626' : '#d1d5db')};
  border-radius: 4px;
  margin-bottom: 1rem;
  &:focus {
    border-color: #6b7280;
    outline: none;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 1rem;
  background-color: #374151;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #4b5563;
  }
  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
`;

const ResetPasswordClient = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [token, setToken] = useState('');

    useEffect(() => {
        const tokenFromUrl = searchParams.get('token');
        if (!tokenFromUrl) {
            setError('Token de réinitialisation manquant');
            return;
        }
        setToken(tokenFromUrl);
    }, [searchParams]);

    const validatePassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return regex.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!password || !confirmPassword) {
            setError('Tous les champs sont requis');
            return;
        }

        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        if (!validatePassword(password)) {
            setError('Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token,
                    newPassword: password
                }),
            });

            const data = await response.json();

            if (response.status === 400) {
                setError('Le lien de réinitialisation est invalide ou a expiré');
                return;
            }

            if (!response.ok) {
                throw new Error(data.error || 'Une erreur est survenue');
            }

            setSuccessMessage('Votre mot de passe a été réinitialisé avec succès');

            setTimeout(() => {
                router.push('/login');
            }, 3000);

        } catch (error) {
            console.error('Erreur:', error);
            setError('Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container>
            <Logo>
                <img src="/Link.png" alt="Logo" />
                <h1>RED PRODUCT</h1>
            </Logo>
            <BackgroundOverlay />
            <FormContainer>
                <Title>Réinitialisation du mot de passe</Title>
                <p>Veuillez entrer votre nouveau mot de passe.</p>

                {error && <ErrorMessage>{error}</ErrorMessage>}
                {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}

                <form onSubmit={handleSubmit}>
                    <Input
                        type="password"
                        placeholder="Nouveau mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        isError={!!error}
                        disabled={isLoading}
                    />
                    <Input
                        type="password"
                        placeholder="Confirmer le mot de passe"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        isError={!!error}
                        disabled={isLoading}
                    />
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
                    </Button>
                </form>
            </FormContainer>
        </Container>
    );
};

export default ResetPasswordClient;