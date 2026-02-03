import { AppBar, Toolbar, Typography, Button, Box, Avatar, Menu, MenuItem, ButtonGroup } from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function Header() {
    const { user, login, logout, isAdmin } = useAuth();
    const { i18n } = useTranslation();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const navigate = useNavigate();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        handleClose();
        navigate('/');
    };

    const handleAdminClick = () => {
        handleClose();
        navigate('/admin');
    };

    return (
        <AppBar position="static" sx={{ bgcolor: '#1a1a1a', boxShadow: 3 }}>
            <Toolbar>
                <Typography
                    variant="h6"
                    component="a"
                    href="/"
                    sx={{
                        flexGrow: 1,
                        textDecoration: 'none',
                        color: 'primary.main',
                        fontWeight: 700,
                        '&:hover': { opacity: 0.8 }
                    }}
                >
                    Top 10 Products
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mr: 2 }}>
                    <ButtonGroup variant="outlined" size="small" sx={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                        <Button
                            onClick={() => changeLanguage('es')}
                            sx={{
                                px: 1,
                                bgcolor: i18n.language === 'es' ? 'primary.main' : 'transparent',
                                color: i18n.language === 'es' ? 'black' : 'white',
                                borderColor: 'rgba(255,255,255,0.1)',
                                '&:hover': { bgcolor: i18n.language === 'es' ? 'primary.dark' : 'rgba(255,255,255,0.05)' }
                            }}
                        >
                            ES
                        </Button>
                        <Button
                            onClick={() => changeLanguage('en')}
                            sx={{
                                px: 1,
                                bgcolor: i18n.language === 'en' ? 'primary.main' : 'transparent',
                                color: i18n.language === 'en' ? 'black' : 'white',
                                borderColor: 'rgba(255,255,255,0.1)',
                                '&:hover': { bgcolor: i18n.language === 'en' ? 'primary.dark' : 'rgba(255,255,255,0.05)' }
                            }}
                        >
                            EN
                        </Button>
                    </ButtonGroup>
                </Box>

                {user ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {isAdmin && (
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={handleAdminClick}
                                sx={{ textTransform: 'none' }}
                            >
                                Admin Panel
                            </Button>
                        )}
                        <Avatar
                            src={user.picture}
                            alt={user.name}
                            onClick={handleMenu}
                            sx={{ cursor: 'pointer', border: '2px solid', borderColor: 'primary.main' }}
                        />
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem disabled>
                                <Typography variant="body2">{user.name}</Typography>
                            </MenuItem>
                            <MenuItem disabled>
                                <Typography variant="caption" color="text.secondary">
                                    {user.email}
                                </Typography>
                            </MenuItem>
                            {isAdmin && (
                                <MenuItem disabled>
                                    <Typography variant="caption" color="primary">
                                        ⭐ Administrador
                                    </Typography>
                                </MenuItem>
                            )}
                            <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
                        </Menu>
                    </Box>
                ) : (
                    <GoogleLogin
                        onSuccess={(credentialResponse) => {
                            if (credentialResponse.credential) {
                                login(credentialResponse.credential);
                            }
                        }}
                        onError={() => {
                            console.error('Login Failed');
                        }}
                        theme="filled_black"
                        size="large"
                        text="signin_with"
                        shape="rectangular"
                    />
                )}
            </Toolbar>
        </AppBar>
    );
}
