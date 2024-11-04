"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styled, { keyframes, css, createGlobalStyle } from 'styled-components';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

// Add Global Style for Roboto
const GlobalStyle = createGlobalStyle`
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');

    * {
        font-family: 'Roboto', sans-serif;
    }
`;

// Animations
const spin = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`;

const shake = keyframes`
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
`;

const LoginContainer = styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #000000;
    position: relative;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: url('/__before.png');
        background-size: cover;
        background-position: center;
        opacity: 0.3;
        z-index: 1;
    }
`;

const ContentWrapper = styled.div`
    position: relative;
    z-index: 2;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
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
        font-weight: 500;
    }
`;

const LoginCard = styled.div`
    background: white;
    padding: 30px;
    border-radius: 8px;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

    ${props => props.$hasError && css`
        animation: ${shake} 0.5s;
    `}
`;

const LoginTitle = styled.h2`
    color: #333;
    font-size: 16px;
    margin-bottom: 20px;
    text-align: center;
    font-weight: 500;
`;

const LoginForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const InputContainer = styled.div`
    position: relative;
    margin-bottom: 8px;
`;

const Input = styled.input`
    width: 100%;
    padding: 12px 0;
    border: none;
    border-bottom: 1px solid ${props => props.$hasError ? '#ff4444' : '#ddd'};
    font-size: 14px;
    transition: border-color 0.3s;
    background: transparent;
    font-weight: 400;

    &:focus {
        outline: none;
        border-bottom-color: ${props => props.$hasError ? '#ff4444' : '#666'};
    }

    &::placeholder {
        font-weight: 300;
        color: #757575;
    }
`;

const ErrorMessage = styled.span`
    color: #ff4444;
    font-size: 12px;
    margin-top: 4px;
    display: block;
    font-weight: 400;
`;

const CheckboxContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 15px;

    input[type="checkbox"] {
        margin: 0;
        cursor: pointer;
        width: 16px;
        height: 16px;
    }

    label {
        font-size: 14px;
        color: #666;
        cursor: pointer;
        font-weight: 400;
    }
`;

const LoadingSpinner = styled.div`
    width: 20px;
    height: 20px;
    border: 2px solid #ffffff;
    border-top: 2px solid transparent;
    border-radius: 50%;
    animation: ${spin} 1s linear infinite;
    margin: 0 auto;
`;

const StyledButton = styled.button`
    width: 100%;
    padding: 12px;
    background-color: #464646;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    cursor: ${props => props.$isDisabled ? 'not-allowed' : 'pointer'};
    margin-top: 20px;
    opacity: ${props => props.$isLoading ? 0.8 : 1};
    transition: background-color 0.3s, opacity 0.3s;
    font-weight: 500;

    &:hover:not(:disabled) {
        background-color: #333;
    }

    &:disabled {
        background-color: #999;
    }
`;

const StyledLink = styled(Link)`
    color: #c4a43c;
    text-align: center;
    text-decoration: none;
    font-size: 14px;
    margin-top: 15px;
    display: block;
    cursor: pointer;
    font-weight: 400;

    &:hover {
        text-decoration: underline;
    }
`;

const SignupContainer = styled.div`
    text-align: center;
    margin-top: 15px;
    font-size: 14px;
    color: white;
    font-weight: 400;

    a {
        color: #c4a43c;
        text-decoration: none;
        margin-left: 5px;
        cursor: pointer;
        font-weight: 500;

        &:hover {
            text-decoration: underline;
        }
    }
`;

export default function LoginPage() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [formError, setFormError] = useState('');

    useEffect(() => {
        setMounted(true);
    }, []);

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        setErrors(prev => ({
            ...prev,
            [name]: ''
        }));

        setFormError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        setFormError('');

        if (!formData.email) {
            newErrors.email = 'L\'email est requis';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Email invalide';
        }

        if (!formData.password) {
            newErrors.password = 'Le mot de passe est requis';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        try {
            setIsLoading(true);

            const response = await fetch('https://backend-hotel-51v4.onrender.com/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erreur lors de la connexion');
            }

            toast.success("Connexion réussie!");

            if (data.token) {
                localStorage.setItem('token', data.token);

                if (data.user) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                }

                if (formData.rememberMe) {
                    localStorage.setItem('rememberMe', 'true');
                }

                router.push('/dashboard');
            }

        } catch (error) {
            const errorMessage = error.message || 'Une erreur est survenue lors de la connexion';
            setFormError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if (!mounted) {
        return null;
    }

    return (
        <>
            <GlobalStyle />
            <LoginContainer>
                <ContentWrapper>
                    <Logo>
                        <Image src="/Link.png" alt="Logo" width={40} height={40} />
                        <h1>RED PRODUCT</h1>
                    </Logo>

                    <LoginCard $hasError={!!formError}>
                        <LoginTitle>Connectez-vous en tant que Admin</LoginTitle>
                        {formError && <ErrorMessage>{formError}</ErrorMessage>}

                        <LoginForm onSubmit={handleSubmit}>
                            <InputContainer>
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="E-mail"
                                    value={formData.email}
                                    onChange={handleChange}
                                    $hasError={!!errors.email}
                                />
                                {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
                            </InputContainer>

                            <InputContainer>
                                <Input
                                    type="password"
                                    name="password"
                                    placeholder="Mot de passe"
                                    value={formData.password}
                                    onChange={handleChange}
                                    $hasError={!!errors.password}
                                />
                                {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
                            </InputContainer>

                            <CheckboxContainer>
                                <input
                                    type="checkbox"
                                    id="rememberMe"
                                    name="rememberMe"
                                    checked={formData.rememberMe}
                                    onChange={handleChange}
                                />
                                <label htmlFor="rememberMe">Gardez-moi connecté</label>
                            </CheckboxContainer>

                            <StyledButton
                                type="submit"
                                disabled={isLoading}
                                $isLoading={isLoading}
                                $isDisabled={isLoading}
                            >
                                {isLoading ? <LoadingSpinner /> : 'Se connecter'}
                            </StyledButton>

                            <StyledLink href="/forgot-pwd">
                                Mot de passe oublié?
                            </StyledLink>
                        </LoginForm>
                    </LoginCard>

                    <SignupContainer>
                        Vous avez pas de compte?
                        <Link href="/register">S&apos;inscrire</Link>
                    </SignupContainer>
                </ContentWrapper>
            </LoginContainer>
        </>
    );
}