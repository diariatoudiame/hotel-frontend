"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styled, { css, keyframes } from 'styled-components';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

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

// Styled Components
const SignupContainer = styled.div`
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

    & > * {
        position: relative;
        z-index: 2;
    }
`;

const Logo = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;
    color: white;
    margin-bottom: 20px;
    text-align: center;
    position: relative;
    z-index: 3;

    img {
        height: 40px;
        width: auto;
    }

    h1 {
        font-size: 24px;
        margin: 0;
    }
`;

const SignupCard = styled.div`
    background: white;
    padding: 30px;
    border-radius: 8px;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    position: relative;
    z-index: 3;

    ${props => props.$hasError && css`
        animation: ${shake} 0.5s;
    `}
`;

const SignupTitle = styled.h2`
    color: #333;
    font-size: 16px;
    margin-bottom: 20px;
    text-align: center;
`;

const SignupForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const InputContainer = styled.div`
    position: relative;
`;

const Input = styled.input`
    width: 100%;
    padding: 12px;
    border: 1px solid ${props => props.$hasError ? '#ff4444' : '#ddd'};
    border-radius: 4px;
    font-size: 14px;
    position: relative;
    z-index: 1;

    &:focus {
        outline: none;
        border-color: ${props => props.$hasError ? '#ff4444' : '#666'};
    }
`;

const ErrorMessage = styled.span`
    color: #ff4444;
    font-size: 12px;
    margin-top: 4px;
    display: block;
`;

const CheckboxContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 5px;
    position: relative;
    z-index: 1;

    input[type="checkbox"] {
        margin: 0;
        cursor: pointer;
    }

    label {
        font-size: 14px;
        color: #666;
        cursor: pointer;
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

const SignupButton = styled.button`
    width: 100%;
    padding: 12px;
    background-color: #464646;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    cursor: ${props => (props.$isLoading ? 'wait' : 'pointer')};
    margin-top: 10px;
    opacity: ${props => (props.$isLoading ? 0.8 : 1)};
    transition: background-color 0.3s, opacity 0.3s;
    position: relative;
    z-index: 2;

    &:hover {
        background-color: ${props => (props.$isLoading ? '#464646' : '#333')};
    }

    &:disabled {
        background-color: #999;
        cursor: not-allowed;
    }
`;

const StyledLink = styled.a`
    color: #c4a43c;
    text-decoration: none;
    margin-left: 5px;
    cursor: pointer;
    position: relative;
    z-index: 3;

    &:hover {
        text-decoration: underline;
    }
`;

const LoginLink = styled.div`
    text-align: center;
    margin-top: 15px;
    font-size: 14px;
    color: #666;
    position: relative;
    z-index: 3;
`;

const FileInput = styled.input`
    display: none;
`;

const FileUploadButton = styled.div`
    padding: 12px;
    background-color: #f5f5f5;
    border: 2px dashed #ddd;
    border-radius: 4px;
    text-align: center;
    cursor: pointer;
    margin-bottom: 15px;
    transition: all 0.3s ease;
    font-size: 14px;
    color: #666;

    &:hover {
        border-color: #666;
        background-color: #eee;
    }
`;

const ImagePreview = styled.div`
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin: 10px auto;
    background-image: ${props => props.$imageUrl ? `url(${props.$imageUrl})` : 'none'};
    background-size: cover;
    background-position: center;
    background-color: #f0f0f0;
    border: 1px solid #ddd;
`;

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        acceptTerms: false
    });

    const [photoFile, setPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [formError, setFormError] = useState('');

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

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
        if (formError) {
            setFormError('');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setErrors(prev => ({
                    ...prev,
                    photo: 'La taille du fichier ne doit pas dépasser 5MB'
                }));
                return;
            }

            if (!file.type.startsWith('image/')) {
                setErrors(prev => ({
                    ...prev,
                    photo: 'Veuillez sélectionner une image'
                }));
                return;
            }

            setPhotoFile(file);
            const previewUrl = URL.createObjectURL(file);
            setPhotoPreview(previewUrl);
            setErrors(prev => ({ ...prev, photo: '' }));
        }
    };

    const handleLoginClick = (e) => {
        e.preventDefault();
        router.push('/login');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        setFormError('');

        // Validation
        if (!formData.name) newErrors.name = 'Le nom est requis';
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
        if (!formData.acceptTerms) {
            newErrors.acceptTerms = 'Vous devez accepter les termes et la politique';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            setIsLoading(true);

            // Create FormData object for multipart/form-data
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('password', formData.password);
            if (photoFile) {
                formDataToSend.append('photo', photoFile);
            }

            const response = await fetch('https://backend-hotel-51v4.onrender.com/api/register', {
                method: 'POST',
                body: formDataToSend, // Don't set Content-Type header - browser will set it with boundary
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 400 && data.msg === 'User already exists') {
                    setErrors(prev => ({
                        ...prev,
                        email: 'Cet email est déjà utilisé'
                    }));
                    throw new Error('Cet email est déjà utilisé');
                }
                throw new Error(data.msg || 'Erreur lors de l\'inscription');
            }

            if (data.token) {
                localStorage.setItem('token', data.token);
                if (data.id && data.name && data.email) {
                    localStorage.setItem('user', JSON.stringify({
                        id: data.id,
                        name: data.name,
                        email: data.email,
                        photo: data.photo
                    }));
                }
                toast.success('Inscription réussie!');
                setFormError('');
                router.push('/login');
            }
        } catch (error) {
            console.error('Erreur d\'inscription:', error);

            if (!navigator.onLine) {
                setFormError('Pas de connexion Internet');
            } else if (error.message === 'Failed to fetch') {
                setFormError('Impossible de contacter le serveur');
            } else {
                setFormError(error.message);
                toast.error(error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SignupContainer>
            <Logo>
                <Image src="/Link.png" alt="Logo" />
                <h1>RED PRODUCT</h1>
            </Logo>
            <SignupCard $hasError={!!formError}>
                <SignupTitle>Inscrivez-vous en tant que Admin</SignupTitle>
                {formError && <ErrorMessage>{formError}</ErrorMessage>}

                <SignupForm onSubmit={handleSubmit}>
                    <ImagePreview $imageUrl={photoPreview} />

                    <FileUploadButton onClick={() => document.getElementById('photo-upload').click()}>
                        {photoFile ? 'Changer la photo' : 'Ajouter une photo de profil'}
                    </FileUploadButton>

                    <FileInput
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    {errors.photo && <ErrorMessage>{errors.photo}</ErrorMessage>}

                    <InputContainer>
                        <Input
                            type="text"
                            name="name"
                            placeholder="Nom"
                            value={formData.name}
                            onChange={handleChange}
                            $hasError={!!errors.name}
                        />
                        {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
                    </InputContainer>

                    <InputContainer>
                        <Input
                            type="email"
                            name="email"
                            placeholder="Email"
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
                            name="acceptTerms"
                            checked={formData.acceptTerms}
                            onChange={handleChange}
                        />
                        <label>
                            J&amp;apos;accepte les termes et la politique de confidentialité

                        </label>
                        {errors.acceptTerms && <ErrorMessage>{errors.acceptTerms}</ErrorMessage>}
                    </CheckboxContainer>

                    <SignupButton
                        type="submit"
                        $isLoading={isLoading}
                        disabled={isLoading}
                    >
                        {isLoading ? <LoadingSpinner /> : 'S\'inscrire'}
                    </SignupButton>
                </SignupForm>

                <LoginLink>
                    Déjà un compte? <StyledLink onClick={handleLoginClick}>Connectez-vous</StyledLink>
                </LoginLink>
            </SignupCard>
        </SignupContainer>
    );
}