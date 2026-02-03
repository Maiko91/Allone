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

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface SidebarProps {
    onSelect: (category: string | null, listName: string | null) => void;
    activeCategory: string | null;
    activeList: string | null;
}

export const Sidebar = ({ onSelect, activeCategory, activeList }: SidebarProps) => {
    const { t, i18n } = useTranslation();
    const [navigation, setNavigation] = useState<Record<string, string[]>>({});
    const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});

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

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

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
                bgcolor: '#1e1e1e',
                borderRadius: 2,
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.1)',
                height: 'fit-content',
                position: 'sticky',
                top: 100
            }}
        >
            <List
                subheader={
                    <ListSubheader sx={{ bgcolor: 'transparent', color: 'primary.main', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
                        {t('sidebar_title').toUpperCase()}
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <ListItemButton
                                onClick={() => changeLanguage('es')}
                                sx={{ p: '2px 6px', fontSize: '0.7rem', minWidth: 0, borderRadius: 1, bgcolor: i18n.language === 'es' ? 'primary.main' : 'transparent', color: i18n.language === 'es' ? 'black' : 'white' }}
                            >
                                ES
                            </ListItemButton>
                            <ListItemButton
                                onClick={() => changeLanguage('en')}
                                sx={{ p: '2px 6px', fontSize: '0.7rem', minWidth: 0, borderRadius: 1, bgcolor: i18n.language === 'en' ? 'primary.main' : 'transparent', color: i18n.language === 'en' ? 'black' : 'white' }}
                            >
                                EN
                            </ListItemButton>
                        </Box>
                    </ListSubheader>
                }
            >
                <ListItemButton
                    onClick={() => onSelect(null, null)}
                    selected={activeCategory === null}
                    sx={{
                        '&.Mui-selected': { bgcolor: 'rgba(179, 230, 0, 0.1)' }
                    }}
                >
                    <ListItemText primary={t('all_products')} />
                </ListItemButton>

                {Object.entries(navigation).map(([category, lists]) => (
                    <Box key={category}>
                        <ListItemButton onClick={() => toggleCategory(category)}>
                            <ListItemText
                                primary={category}
                                primaryTypographyProps={{ fontWeight: activeCategory === category ? 'bold' : 'normal' }}
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
                                            '&.Mui-selected': { bgcolor: 'rgba(179, 230, 0, 0.2)' }
                                        }}
                                        selected={activeList === listName}
                                        onClick={() => onSelect(category, listName)}
                                    >
                                        <ListItemText
                                            secondary={listName}
                                            secondaryTypographyProps={{
                                                color: activeList === listName ? 'primary.main' : 'text.secondary',
                                                fontSize: '0.875rem'
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
