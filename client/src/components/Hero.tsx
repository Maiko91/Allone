import React, { useState } from 'react';
import { Box, Typography, TextField, InputAdornment, Button, Container } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../contexts/ThemeContext';

interface HeroProps {
    onSearch: (query: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onSearch }) => {
    const { t } = useTranslation();
    const { themeId } = useAppTheme();
    const [query, setQuery] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query);
        }
    };

    const isDark = themeId === 'dark' || themeId === 'glass';

    return (
        <Box
            sx={{
                width: '100%',
                minHeight: '45vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                background: isDark ? `
          radial-gradient(circle at 50% 10%, rgba(204, 255, 0, 0.15) 0%, transparent 50%),
          linear-gradient(180deg, #0a0a0a 0%, #111 100%)
        ` : `
          radial-gradient(circle at 50% 10%, rgba(63, 81, 181, 0.05) 0%, transparent 50%),
          linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)
        `,
                position: 'relative',
                pt: 10,
                pb: 10,
            }}
        >
            <Container maxWidth="md">
                <Typography
                    variant="overline"
                    sx={{
                        color: isDark ? 'rgba(255,255,255,0.6)' : 'text.secondary',
                        letterSpacing: 3,
                        mb: 1.5,
                        display: 'block',
                        fontWeight: 700
                    }}
                >
                    {t('discover_quality')}
                </Typography>

                <Typography
                    variant="h2"
                    component="h1"
                    sx={{
                        color: isDark ? 'white' : 'text.primary',
                        mb: 3,
                        background: isDark ? 'linear-gradient(90deg, #fff 30%, #ccff00 100%)' : 'none',
                        WebkitBackgroundClip: isDark ? 'text' : 'none',
                        WebkitTextFillColor: isDark ? 'transparent' : 'inherit',
                        letterSpacing: '-2px',
                        fontSize: { xs: '2.5rem', md: '4rem' },
                        fontWeight: 800
                    }}
                >
                    {t('hero_title')}
                </Typography>

                <Typography variant="body1" sx={{
                    color: isDark ? 'rgba(255,255,255,0.7)' : 'text.secondary',
                    mb: 6,
                    maxWidth: 650,
                    mx: 'auto',
                    fontSize: '1.1rem',
                    lineHeight: 1.6
                }}>
                    {t('hero_subtitle')}
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{
                    display: 'flex',
                    gap: 2,
                    justifyContent: 'center',
                    maxWidth: 700,
                    mx: 'auto',
                    width: '100%',
                    px: 2,
                    flexDirection: { xs: 'column', sm: 'row' }
                }}>
                    <TextField
                        fullWidth
                        placeholder={t('search_placeholder')}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        variant="outlined"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color={isDark ? "primary" : "action"} />
                                </InputAdornment>
                            ),
                            sx: {
                                bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'white',
                                borderRadius: isDark ? 3 : 4,
                                color: isDark ? 'white' : 'text.primary',
                                boxShadow: isDark ? 'none' : '0 4px 20px rgba(0,0,0,0.05)',
                                '& fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' },
                                '&:hover fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'primary.main' },
                                '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: 2 },
                            }
                        }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        sx={{
                            px: 5,
                            borderRadius: isDark ? 3 : 4,
                            color: isDark ? 'black' : 'white',
                            fontWeight: 800,
                            bgcolor: isDark ? 'primary.main' : 'primary.main',
                            boxShadow: isDark ? '0 8px 20px rgba(204, 255, 0, 0.2)' : '0 8px 20px rgba(0,0,0,0.1)',
                            '&:hover': {
                                bgcolor: isDark ? '#b3e600' : '#333'
                            }
                        }}
                    >
                        {t('search')}
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};
