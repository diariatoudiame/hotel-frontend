import React, { useState, useEffect } from 'react';
// import { X, ImagePlus, ArrowLeft } from 'lucide-react';
import { ImagePlus, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
// import styled from 'styled-components';
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');

    * {
        font-family: 'Roboto', sans-serif;
    }
`;

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

const ModalContainer = styled.div`
    background: white;
    border-radius: 8px;
    width: 90%;
    max-width: 600px;
    padding: 24px;
    position: relative;
    max-height: 90vh;
    overflow-y: auto;
`;

const ModalHeader = styled.div`
    display: flex;
    //justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
`;

const ModalTitle = styled.h2`
    margin: 0;
    font-size: 18px;
    color: #333;
    font-weight: 500;
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const InputRow = styled.div`
    display: flex;
    gap: 16px;
    width: 100%;
`;

const InputGroup = styled.div`
    flex: 1;
`;

const Label = styled.label`
    display: block;
    font-size: 14px;
    color: #666;
    margin-bottom: 8px;
`;

const Input = styled.input`
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    font-size: 14px;

    &:focus {
        outline: none;
        border-color: #666;
    }
`;

const Select = styled.select`
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    font-size: 14px;
    background-color: white;

    &:focus {
        outline: none;
        border-color: #666;
    }
`;

const ImageUploadArea = styled.div`
    border: 2px dashed #e0e0e0;
    border-radius: 8px;
    padding: 24px;
    text-align: center;
    cursor: pointer;
    margin-top: 12px;

    &:hover {
        border-color: #666;
    }
`;

const SubmitButton = styled.button`
    width: 25%;
    margin-left: 400px;
    padding: 10px;
    background-color: #464646;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    margin-top: 12px;

    &:hover {
        background-color: #333;
    }

    &:disabled {
        background-color: #999;
        cursor: not-allowed;
    }
`;

const ErrorMessage = styled.p`
    color: #dc3545;
    font-size: 14px;
    margin-top: 4px;
`;
const ImagePreviewContainer = styled.div`
    width: 100%;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border-radius: 4px;
    background-color: #f5f5f5;
`;

const ImagePreview = styled.img`
    max-width: 100%;
    max-height: 100%;
    object-fit: cover;
`;

const CreateHotelModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        email: '',
        phone_number: '',
        price: '',
        devise: 'F XOF',
        photo: null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [imagePreview, setImagePreview] = useState(null);

    const validateForm = () => {
        if (!formData.photo) {
            setError('La photo est requise');
            return false;
        }

        // Validation email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Format d\'email invalide');
            return false;
        }

        // Validation téléphone
        const phoneRegex = /^\+?[\d\s-]{8,}$/;
        if (!phoneRegex.test(formData.phone_number)) {
            setError('Format de numéro de téléphone invalide');
            return false;
        }

        // Validation prix
        if (isNaN(parseFloat(formData.price))) {
            setError('Le prix doit être un nombre valide');
            return false;
        }

        setError('');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        const loadingToastId = toast.loading('Création de l\'hôtel en cours...');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Vous devez être connecté pour créer un hôtel');
            }

            const data = new FormData();

            // Ajout des données du formulaire
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null) {
                    if (key === 'price') {
                        data.append(key, parseFloat(formData[key]));
                    } else {
                        data.append(key, formData[key]);
                    }
                }
            });

            const response = await fetch('https://backend-hotel-51v4.onrender.com/api/hotels', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: data
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'Erreur lors de la création de l\'hôtel');
            }

            toast.success('L\'hôtel a été créé avec succès!', {
                id: loadingToastId,
                duration: 3000
            });

            onSuccess?.(responseData.data);
            onClose();

            // Réinitialisation du formulaire
            setFormData({
                name: '',
                address: '',
                email: '',
                phone_number: '',
                price: '',
                devise: 'F XOF',
                photo: null
            });
        } catch (error) {
            console.error('Erreur:', error);
            toast.error(error.message || 'Une erreur est survenue lors de la création de l\'hôtel', {
                id: loadingToastId,
                duration: 5000
            });
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setError('La taille de l\'image ne doit pas dépasser 5MB');
                toast.error('La taille de l\'image ne doit pas dépasser 5MB');
                return;
            }
            if (!file.type.startsWith('image/')) {
                setError('Veuillez sélectionner une image valide');
                toast.error('Veuillez sélectionner une image valide');
                return;
            }
            setFormData(prev => ({
                ...prev,
                photo: file
            }));
            // Ajout de cette ligne dans handleFileChange après les validations
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
            setError('');
            toast.success('Image sélectionnée avec succès');
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <GlobalStyle />
        <ModalOverlay onClick={(e) => e.target === e.currentTarget && onClose()}>
            <ModalContainer>
                <ModalHeader>
                    <CloseButton onClick={onClose}>
                        <ArrowLeft size={20} />
                    </CloseButton>
                    <ModalTitle>CRÉER UN NOUVEAU HÔTEL</ModalTitle>
                    {/*<CloseButton onClick={onClose}>*/}
                    {/*    <X size={20} />*/}
                    {/*</CloseButton>*/}
                </ModalHeader>

                <Form onSubmit={handleSubmit}>
                    {error && <ErrorMessage>{error}</ErrorMessage>}

                    <InputRow>
                        <InputGroup>
                            <Label>Nom hôtel</Label>
                            <Input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="CAP Marniane"
                                required
                            />
                        </InputGroup>
                        <InputGroup>
                            <Label>Adresse</Label>
                            <Input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Les îles du saloum, Mar Lodj"
                                required
                            />
                        </InputGroup>
                    </InputRow>

                    <InputRow>
                        <InputGroup>
                            <Label>E-mail</Label>
                            <Input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="information@gmail.com"
                                required
                            />
                        </InputGroup>
                        <InputGroup>
                            <Label>Numéro de téléphone</Label>
                            <Input
                                type="tel"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleChange}
                                placeholder="+221 77 777 77 77"
                                required
                            />
                        </InputGroup>
                    </InputRow>

                    <InputRow>
                        <InputGroup>
                            <Label>Prix par nuit</Label>
                            <Input
                                type="text"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="25000"
                                required
                            />
                        </InputGroup>
                        <InputGroup>
                            <Label>Devise</Label>
                            <Select
                                name="devise"
                                value={formData.devise}
                                onChange={handleChange}
                                required
                            >
                                <option value="F XOF">F XOF</option>
                                <option value="Euro">Euro</option>
                                <option value="Dollar">Dollar</option>
                            </Select>
                        </InputGroup>
                    </InputRow>

                    <InputGroup>
                        <Label>Ajouter une photo</Label>
                        <ImageUploadArea>
                            <input
                                type="file"
                                id="photo"
                                name="photo"
                                onChange={handleFileChange}
                                style={{display: 'none'}}
                                accept="image/*"
                                required
                            />
                            <label htmlFor="photo" style={{cursor: 'pointer'}}>
                                {imagePreview ? (
                                    <ImagePreviewContainer>
                                        <ImagePreview src={imagePreview} alt="Aperçu"/>
                                    </ImagePreviewContainer>
                                ) : (
                                    <>
                                        <ImagePlus size={24} color="#666" style={{margin: '0 auto'}}/>
                                        <p style={{margin: '8px 0 0', color: '#666', fontSize: '14px'}}>
                                            Ajouter une photo
                                        </p>
                                    </>
                                )}
                            </label>
                        </ImageUploadArea>
                    </InputGroup>

                    <SubmitButton type="submit" disabled={loading}>
                        {loading ? 'Création en cours...' : 'Enregistrer'}
                    </SubmitButton>
                </Form>
            </ModalContainer>
        </ModalOverlay>
        </>

    );
};

export default CreateHotelModal;