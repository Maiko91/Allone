import React, { useState } from 'react';
import { Box, Typography, TextField, InputAdornment, Button, Container } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface HeroProps {
    onSearch: (query: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onSearch }) => {
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
                minHeight: '60vh',
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
                pt: 8,
                pb: 8,
            }}
        >
            <Container maxWidth="md">
                <Typography
                    variant="overline"
                    sx={{ color: 'rgba(255,255,255,0.6)', letterSpacing: 2, mb: 1, display: 'block' }}
                >
                    Discover Quality
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
                    }}
                >
                    Find the Top 10 Best Sellers
                </Typography>

                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 6, maxWidth: 600, mx: 'auto' }}>
                    Enter a category like "Cell Phones" or "Laptops" and let our AI curate the highest rated Amazon products for you instantly.
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2, justifyContent: 'center', maxWidth: 600, mx: 'auto', width: '100%', px: 2 }}>
                    <TextField
                        fullWidth
                        placeholder="Search for a topic (e.g. Headphones)..."
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
                        sx={{ px: 4, borderRadius: 3, color: 'black' }}
                    >
                        Search
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};
