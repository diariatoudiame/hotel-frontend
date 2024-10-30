"use client"; // Assurez-vous que cela est au début du fichier

import { useState } from 'react';
import styled from 'styled-components';
import Link from "next/link";
import Image from 'next/image';

const Container = styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: black;
    position: relative;
`;

const BackgroundOverlay = styled.div`
    position: absolute;
    inset: 0;
    background: url('/__before.png') center / cover;
    opacity: 0.3;
    z-index: 1; /* Z-index ajusté pour être inférieur à celui du FormContainer */
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

const FormContainer = styled.div`
    background: white;
    padding: 2rem;
    border-radius: 8px;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    z-index: 20; /* Z-index pour s'assurer qu'il est au-dessus de l'overlay */
`;

const BackToLogin = styled.div`
    text-align: center;
    margin-top: 15px;
    font-size: 14px;
    color: white;

    a {
        color: #c4a43c;
        text-decoration: none;
        margin-left: 5px;
        cursor: pointer;

        &:hover {
            text-decoration: underline;
        }
    }
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

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!email) {
            setError('L\'email est requis');
            return;
        }

        if (!validateEmail(email)) {
            setError('Format d\'email invalide');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.status === 404) {
                setError('Aucun compte n\'est associé à cette adresse email');
                return;
            }

            if (response.status === 500) {
                setError('Une erreur est survenue lors de l\'envoi de l\'email. Veuillez réessayer.');
                return;
            }

            if (!response.ok) {
                throw new Error(data.error || 'Une erreur est survenue');
            }

            setSuccessMessage(data.message || 'Les instructions ont été envoyées à votre adresse email');
            setEmail('');

        } catch (error) {
            console.error('Erreur:', error);
            setError('Une erreur de connexion est survenue. Veuillez vérifier votre connexion internet et réessayer.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container>
            <Logo>
                <Image src="/Link.png" alt="Logo" />
                <h1>RED PRODUCT</h1>
            </Logo>
            <BackgroundOverlay />
            <FormContainer>
                <Title>Mot de passe oublié?</Title>
                <p>Entrez votre adresse e-mail ci-dessous et nous vous enverrons des instructions sur la façon de modifier votre mot de passe.</p>

                {error && <ErrorMessage>{error}</ErrorMessage>}
                {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}

                <form onSubmit={handleSubmit}>
                    <Input
                        type="email"
                        placeholder="Votre e-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        isError={!!error}
                        disabled={isLoading}
                    />
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Envoi en cours...' : 'Envoyer'}
                    </Button>
                </form>

                <BackToLogin>

                    <Link href="/login"> Retour à la connexion</Link>
                </BackToLogin>
            </FormContainer>
        </Container>
    );
};

export default ForgotPasswordPage;
