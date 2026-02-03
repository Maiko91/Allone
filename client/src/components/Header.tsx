import { AppBar, Toolbar, Typography, Button, Box, Avatar, Menu, MenuItem, Divider, IconButton } from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppTheme, type ThemeId } from '../contexts/ThemeContext';
import PaletteIcon from '@mui/icons-material/Palette';

export function Header() {
    const { user, login, logout, isAdmin } = useAuth();
    const { t, i18n } = useTranslation();
    const { themeId, setTheme } = useAppTheme();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [themeAnchorEl, setThemeAnchorEl] = useState<null | HTMLElement>(null);
    const navigate = useNavigate();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleThemeMenu = (event: React.MouseEvent<HTMLElement>) => {
        setThemeAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setThemeAnchorEl(null);
    };

    const handleThemeSelect = (id: ThemeId) => {
        setTheme(id);
        handleClose();
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

    const isDark = themeId === 'dark' || themeId === 'glass';

    return (
        <AppBar position="sticky" sx={{
            bgcolor: themeId === 'dark' ? '#1a1a1a' : (themeId === 'glass' ? 'rgba(10,10,10,0.8)' : 'rgba(255,255,255,0.8)'),
            backdropFilter: 'blur(8px)',
            boxShadow: themeId === 'dark' ? 3 : '0 2px 10px rgba(0,0,0,0.05)',
            borderBottom: isDark ? 'none' : '1px solid rgba(0,0,0,0.05)',
            color: isDark ? 'white' : 'text.primary'
        }}>
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Box
                    component="a"
                    href="/"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        textDecoration: 'none',
                        '&:hover': { opacity: 0.8 },
                        transition: 'opacity 0.2s'
                    }}
                >
                    <img
                        src="/assets/logo.png"
                        alt="allOne"
                        style={{
                            height: '40px',
                            width: 'auto',
                            display: 'block'
                        }}
                    />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
                    {/* Language Switcher */}
                    <Box sx={{ display: 'flex', bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', p: 0.5, borderRadius: 2 }}>
                        <Button
                            onClick={() => changeLanguage('es')}
                            sx={{
                                minWidth: 40,
                                px: 1,
                                height: 32,
                                borderRadius: 1.5,
                                fontSize: '0.75rem',
                                bgcolor: i18n.language === 'es' ? (isDark ? 'primary.main' : '#1a1a1a') : 'transparent',
                                color: i18n.language === 'es' ? (isDark ? 'black' : 'white') : (isDark ? 'white' : 'text.primary'),
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
                                bgcolor: i18n.language === 'en' ? (isDark ? 'primary.main' : '#1a1a1a') : 'transparent',
                                color: i18n.language === 'en' ? (isDark ? 'black' : 'white') : (isDark ? 'white' : 'text.primary'),
                                '&:hover': { bgcolor: i18n.language === 'en' ? 'primary.main' : 'rgba(255,255,255,0.1)' }
                            }}
                        >
                            EN
                        </Button>
                    </Box>

                    {/* Theme Selector */}
                    <IconButton onClick={handleThemeMenu} sx={{ color: 'inherit' }}>
                        <PaletteIcon />
                    </IconButton>
                    <Menu
                        anchorEl={themeAnchorEl}
                        open={Boolean(themeAnchorEl)}
                        onClose={handleClose}
                        PaperProps={{ sx: { mt: 1.5, minWidth: 150 } }}
                    >
                        <MenuItem onClick={() => handleThemeSelect('dark')} selected={themeId === 'dark'}>
                            {t('theme_dark', { defaultValue: 'Dark (Original)' })}
                        </MenuItem>
                        <MenuItem onClick={() => handleThemeSelect('light')} selected={themeId === 'light'}>
                            {t('theme_light', { defaultValue: 'Minimalist (Light)' })}
                        </MenuItem>
                        <MenuItem onClick={() => handleThemeSelect('glass')} selected={themeId === 'glass'}>
                            {t('theme_glass', { defaultValue: 'Modern (Glass)' })}
                        </MenuItem>
                    </Menu>

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
                                        color: isDark ? 'primary.main' : 'text.primary',
                                        borderColor: isDark ? 'primary.main' : 'rgba(0,0,0,0.2)'
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
                                    borderColor: isDark ? 'primary.main' : 'rgba(0,0,0,0.1)'
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
                            theme={isDark ? "filled_black" : "outline"}
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
