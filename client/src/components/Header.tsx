import { AppBar, Toolbar, Typography, Button, Box, Avatar, Menu, MenuItem, Divider, IconButton } from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../contexts/ThemeContext';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

export function Header() {
    const { user, login, logout, isAdmin } = useAuth();
    const { t, i18n } = useTranslation();
    const { mode, toggleTheme } = useAppTheme();
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
        <AppBar position="sticky" sx={{
            bgcolor: mode === 'dark' ? '#1a1a1a' : 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(8px)',
            boxShadow: mode === 'dark' ? 3 : '0 2px 10px rgba(0,0,0,0.05)',
            borderBottom: mode === 'dark' ? 'none' : '1px solid rgba(0,0,0,0.05)',
            color: mode === 'dark' ? 'white' : 'text.primary'
        }}>
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Typography
                    variant="h6"
                    component="a"
                    href="/"
                    sx={{
                        textDecoration: 'none',
                        color: mode === 'dark' ? 'primary.main' : 'text.primary',
                        fontWeight: 700,
                        '&:hover': { opacity: 0.8 }
                    }}
                >
                    Top 10 Products
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
                    {/* Language Switcher */}
                    <Box sx={{ display: 'flex', bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', p: 0.5, borderRadius: 2 }}>
                        <Button
                            onClick={() => changeLanguage('es')}
                            sx={{
                                minWidth: 40,
                                px: 1,
                                height: 32,
                                borderRadius: 1.5,
                                fontSize: '0.75rem',
                                bgcolor: i18n.language === 'es' ? (mode === 'dark' ? 'primary.main' : '#1a1a1a') : 'transparent',
                                color: i18n.language === 'es' ? (mode === 'dark' ? 'black' : 'white') : (mode === 'dark' ? 'white' : 'text.primary'),
                                '&:hover': { bgcolor: i18n.language === 'es' ? 'primary.main' : 'rgba(255,255,255,0.1)' }
                            }}
                        >
                            ES
                        </Button>
                        <Button
                            onClick={() => changeLanguage('en')}
                            sx={{
                                minWidth: 40,
                                px: 1,
                                height: 32,
                                borderRadius: 1.5,
                                fontSize: '0.75rem',
                                bgcolor: i18n.language === 'en' ? (mode === 'dark' ? 'primary.main' : '#1a1a1a') : 'transparent',
                                color: i18n.language === 'en' ? (mode === 'dark' ? 'black' : 'white') : (mode === 'dark' ? 'white' : 'text.primary'),
                                '&:hover': { bgcolor: i18n.language === 'en' ? 'primary.main' : 'rgba(255,255,255,0.1)' }
                            }}
                        >
                            EN
                        </Button>
                    </Box>

                    {/* Theme Toggle */}
                    <IconButton onClick={toggleTheme} sx={{ color: 'inherit' }}>
                        {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                    </IconButton>

                    {user ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {isAdmin && (
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={handleAdminClick}
                                    sx={{
                                        textTransform: 'none',
                                        display: { xs: 'none', sm: 'inline-flex' },
                                        color: mode === 'dark' ? 'primary.main' : 'text.primary',
                                        borderColor: mode === 'dark' ? 'primary.main' : 'rgba(0,0,0,0.2)'
                                    }}
                                >
                                    {t('admin_panel')}
                                </Button>
                            )}
                            <Avatar
                                src={user.picture}
                                alt={user.name}
                                onClick={handleMenu}
                                sx={{
                                    cursor: 'pointer',
                                    width: 35,
                                    height: 35,
                                    border: '2px solid',
                                    borderColor: mode === 'dark' ? 'primary.main' : 'rgba(0,0,0,0.1)'
                                }}
                            />
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                                PaperProps={{
                                    sx: { mt: 1.5, minWidth: 180 }
                                }}
                            >
                                <Box sx={{ px: 2, py: 1 }}>
                                    <Typography variant="body2" fontWeight="bold">{user.name}</Typography>
                                    <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                                </Box>
                                <Divider />
                                {isAdmin && (
                                    <MenuItem onClick={() => { handleAdminClick(); handleClose(); }} sx={{ display: { xs: 'flex', sm: 'none' } }}>
                                        {t('admin_panel')}
                                    </MenuItem>
                                )}
                                <MenuItem onClick={handleLogout}>{t('logout')}</MenuItem>
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
                            theme={mode === 'dark' ? "filled_black" : "outline"}
                            size="medium"
                            text="signin_with"
                            shape="pill"
                        />
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}
