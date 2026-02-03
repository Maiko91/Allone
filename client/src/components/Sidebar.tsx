import {
    Box,
    List,
    ListItemText,
    Collapse,
    ListItemButton,
    ListSubheader,
    Paper
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../contexts/ThemeContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface SidebarProps {
    onSelect: (category: string | null, listName: string | null) => void;
    activeCategory: string | null;
    activeList: string | null;
}

export const Sidebar = ({ onSelect, activeCategory, activeList }: SidebarProps) => {
    const { t, i18n } = useTranslation();
    const { themeId } = useAppTheme();
    const [navigation, setNavigation] = useState<Record<string, string[]>>({});
    const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});

    const isDark = themeId === 'dark' || themeId === 'glass';

    useEffect(() => {
        const fetchNavigation = async () => {
            try {
                const response = await fetch(`${API_URL}/navigation?lang=${i18n.language}`);
                const data = await response.json();
                setNavigation(data);

                // Abrir todas las categorías por defecto
                const initialOpen: Record<string, boolean> = {};
                Object.keys(data).forEach(cat => initialOpen[cat] = true);
                setOpenCategories(initialOpen);
            } catch (error) {
                console.error('Error fetching navigation:', error);
            }
        };

        fetchNavigation();
    }, [i18n.language]);

    const toggleCategory = (category: string) => {
        setOpenCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    return (
        <Paper
            elevation={0}
            sx={{
                width: 280,
                bgcolor: isDark ? '#1e1e1e' : 'white',
                borderRadius: isDark ? 2 : 4,
                overflow: 'hidden',
                border: isDark ? '1px solid rgba(255,255,255,0.1)' : 'none',
                boxShadow: isDark ? 'none' : '0 4px 20px rgba(0,0,0,0.05)',
                height: 'fit-content',
                position: 'sticky',
                top: 100,
                p: 1
            }}
        >
            <List
                subheader={
                    <ListSubheader sx={{
                        bgcolor: 'transparent',
                        color: isDark ? 'primary.main' : 'text.primary',
                        fontWeight: 800,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        pr: 1,
                        fontSize: '0.9rem',
                        letterSpacing: 1
                    }}>
                        {t('sidebar_title').toUpperCase()}
                    </ListSubheader>
                }
            >
                <ListItemButton
                    onClick={() => onSelect(null, null)}
                    selected={activeCategory === null}
                    sx={{
                        borderRadius: 2,
                        mb: 0.5,
                        '&.Mui-selected': {
                            bgcolor: isDark ? 'rgba(204, 255, 0, 0.1)' : 'rgba(0,0,0,0.05)',
                            '&:hover': { bgcolor: isDark ? 'rgba(204, 255, 0, 0.2)' : 'rgba(0,0,0,0.08)' }
                        }
                    }}
                >
                    <ListItemText primary={t('all_products')} primaryTypographyProps={{ fontWeight: activeCategory === null ? 700 : 500 }} />
                </ListItemButton>

                {Object.entries(navigation).map(([category, lists]) => (
                    <Box key={category} sx={{ mb: 1 }}>
                        <ListItemButton
                            onClick={() => toggleCategory(category)}
                            sx={{ borderRadius: 2 }}
                        >
                            <ListItemText
                                primary={category}
                                primaryTypographyProps={{
                                    fontWeight: activeCategory === category ? 800 : 600,
                                    fontSize: '0.95rem'
                                }}
                            />
                            {openCategories[category] ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>

                        <Collapse in={openCategories[category]} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {lists.map((listName) => (
                                    <ListItemButton
                                        key={listName}
                                        sx={{
                                            pl: 4,
                                            borderRadius: 2,
                                            my: 0.2,
                                            '&.Mui-selected': {
                                                bgcolor: isDark ? 'rgba(204, 255, 0, 0.15)' : 'primary.main',
                                                color: isDark ? 'white' : 'white',
                                                '& .MuiListItemText-secondary': { color: 'white' }
                                            }
                                        }}
                                        selected={activeList === listName}
                                        onClick={() => onSelect(category, listName)}
                                    >
                                        <ListItemText
                                            secondary={listName}
                                            secondaryTypographyProps={{
                                                color: activeList === listName ? (isDark ? 'primary.main' : 'inherit') : 'text.secondary',
                                                fontSize: '0.85rem',
                                                fontWeight: activeList === listName ? 700 : 500
                                            }}
                                        />
                                    </ListItemButton>
                                ))}
                            </List>
                        </Collapse>
                    </Box>
                ))}
            </List>
        </Paper>
    );
};
