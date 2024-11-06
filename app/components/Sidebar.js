import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styled from 'styled-components';
import { LayoutDashboard, Building2 } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'https://backend-hotel-51v4.onrender.com';

const SidebarWrapper = styled.div`
    width: 200px;
    background-color: #464646;
    color: white;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
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
    overflow-y: auto;
    padding: 1rem 0;
`;

const LogoContainer = styled.div`
    width: 200px;
    background-color: #464646;
    display: flex;
    align-items: center;
    padding: 0 1rem;
`;


const MenuItem = styled(Link)`
    padding: 0.625rem 1rem;
    display: flex;
    align-items: center;
    gap: 0.625rem;
    font-size: 0.875rem;
    color: white;
    text-decoration: none;
    //&:hover {
    //    background-color: rgba(255, 255, 255);
    //    color: #333333; 
    //}
    ${props => props.$active && `
        background-color: rgba(255, 255, 255);
        color: #333333; 
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

export function Sidebar() {
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

                const response = await axios.get(`${API_URL}/api/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                setUser(response.data);
            } catch (error) {
                if (error.response?.status === 401) {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }
            }
        };

        fetchUserData();
    }, []);

    return (
        <SidebarWrapper>
            <SidebarOverlay />
            <MenuContainer>
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
                                user?.name ? user.name[0].toUpperCase() : 'U'
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
        </SidebarWrapper>
    );
}