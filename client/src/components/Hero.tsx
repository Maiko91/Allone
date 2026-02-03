import React, { useState } from 'react';
import { Box, Typography, TextField, InputAdornment, Button, Container } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';

interface HeroProps {
    onSearch: (query: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onSearch }) => {
    const { t } = useTranslation();
    const [query, setQuery] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query);
        }
    };

    return (
        <Box
            sx={{
                width: '100%',
                minHeight: '40vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                background: `
          radial-gradient(circle at 50% 10%, rgba(204, 255, 0, 0.15) 0%, transparent 50%),
          linear-gradient(180deg, #0a0a0a 0%, #111 100%)
        `,
                position: 'relative',
                pt: 6,
                pb: 6,
            }}
        >
            <Container maxWidth="md">
                <Typography
                    variant="overline"
                    sx={{ color: 'rgba(255,255,255,0.6)', letterSpacing: 2, mb: 1, display: 'block' }}
                >
                    {t('discover_quality')}
                </Typography>

                <Typography
                    variant="h2"
                    component="h1"
                    sx={{
                        color: 'white',
                        mb: 2,
                        background: 'linear-gradient(90deg, #fff 30%, #ccff00 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '-2px',
                        fontSize: { xs: '2.5rem', md: '3.75rem' }
                    }}
                >
                    {t('hero_title')}
                </Typography>

                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, maxWidth: 600, mx: 'auto' }}>
                    {t('hero_subtitle')}
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2, justifyContent: 'center', maxWidth: 600, mx: 'auto', width: '100%', px: 2 }}>
                    <TextField
                        fullWidth
                        placeholder={t('search_placeholder')}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        variant="outlined"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                            sx: {
                                bgcolor: 'rgba(255,255,255,0.05)',
                                borderRadius: 3,
                                color: 'white',
                                '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                            }
                        }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        sx={{ px: 4, borderRadius: 3, color: 'black', fontWeight: 'bold' }}
                    >
                        {t('search')}
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};
