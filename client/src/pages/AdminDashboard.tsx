import { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    TextField,
    Button,
    Paper,
    Grid,
    Card,
    CardContent,
    CardActions,
    IconButton,
    Alert,
    Autocomplete,
    Tabs,
    Tab
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

import type { Product } from '../types';

export function AdminDashboard() {
    const { t, i18n } = useTranslation();
    const [mainTab, setMainTab] = useState(0); // 0: Products, 1: Categories, 2: Lists
    const [products, setProducts] = useState<Product[]>([]);
    const [categoriesList, setCategoriesList] = useState<any[]>([]);
    const [listsList, setListsList] = useState<any[]>([]);
    const [navigation, setNavigation] = useState<Record<string, string[]>>({});
    const [tabValue, setTabValue] = useState(0); // 0: ES, 1: EN
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        rating: '',
        reviewCount: '',
        imageUrl: '',
        amazonUrl: '',
        category: '',
        listName: ''
    });
    const [categoryFormData, setCategoryFormData] = useState({ name: '' });
    const [listFormData, setListFormData] = useState({ name: '', categoryId: '' });

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editFormData, setEditFormData] = useState<any>({
        title: '',
        description: '',
        en_title: '',
        en_description: '',
        category: '',
        listName: '',
        name: '',
        en_name: '',
        categoryId: ''
    });
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        loadProducts();
        loadNavigation();
        loadCategories();
        loadLists();
    }, []);

    // Sincronizar tabValue con el idioma global
    useEffect(() => {
        setTabValue(i18n.language === 'en' ? 1 : 0);
        loadProducts(); // Recargar productos en el nuevo idioma
    }, [i18n.language]);

    const loadProducts = async (category?: string, list?: string) => {
        try {
            let url = `${API_URL}/products?lang=${i18n.language}`;
            if (category) url += `&category=${encodeURIComponent(category)}`;
            if (list) url += `&listName=${encodeURIComponent(list)}`;

            const response = await fetch(url);
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error loading products:', error);
        }
    };

    const loadCategories = async () => {
        try {
            const response = await fetch(`${API_URL}/categories`);
            const data = await response.json();
            setCategoriesList(data);
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    };

    const loadLists = async () => {
        try {
            const response = await fetch(`${API_URL}/lists`);
            const data = await response.json();
            setListsList(data);
        } catch (error) {
            console.error('Error loading lists:', error);
        }
    };

    const loadNavigation = async () => {
        try {
            const response = await fetch(`${API_URL}/navigation`);
            const data = await response.json();
            setNavigation(data);
        } catch (error) {
            console.error('Error loading navigation:', error);
        }
    };

    const handleScrape = async () => {
        if (!formData.amazonUrl) {
            setMessage({ type: 'error', text: 'Por favor, introduce una URL de Amazon' });
            return;
        }

        setMessage({ type: 'success', text: 'Extrayendo datos de Amazon...' });

        try {
            const response = await fetch(`${API_URL}/scrape`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: formData.amazonUrl })
            });

            const data = await response.json();

            if (response.ok) {
                setFormData({
                    ...formData,
                    title: data.title || '',
                    description: data.description || '',
                    price: data.price ? data.price.toString() : '',
                    rating: data.rating ? data.rating.toString() : '',
                    reviewCount: data.reviewCount ? data.reviewCount.toString() : '',
                    imageUrl: data.imageUrl || '',
                });
                setMessage({ type: 'success', text: 'Datos extraídos correctamente. Puedes revisarlos antes de guardar.' });
            } else {
                setMessage({ type: 'error', text: data.error || 'Error al extraer datos' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error de conexión con el servidor de scraping' });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(`${API_URL}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    rating: parseFloat(formData.rating),
                    reviewCount: parseInt(formData.reviewCount)
                })
            });

            if (response.ok) {
                setMessage({ type: 'success', text: t('product_created') });
                setFormData({
                    ...formData,
                    title: '',
                    description: '',
                    price: '',
                    rating: '',
                    reviewCount: '',
                    imageUrl: '',
                    amazonUrl: '',
                });
                loadProducts();
                loadNavigation();
            } else {
                const errorData = await response.json();
                setMessage({ type: 'error', text: errorData.error || t('error_creating') });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error de conexión' });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este producto?')) return;

        try {
            const response = await fetch(`${API_URL}/products/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setMessage({ type: 'success', text: 'Producto eliminado' });
                loadProducts();
                loadNavigation();
            } else {
                setMessage({ type: 'error', text: 'Error al eliminar' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error de conexión' });
        }
    };

    const handleStartEdit = (product: Product) => {
        setEditingId(product.id);
        const enTrans = product.translations?.find((t: any) => t.lang === 'en');
        const esTrans = product.translations?.find((t: any) => t.lang === 'es');

        setEditFormData({
            title: esTrans?.title || product.title,
            description: esTrans?.description || product.description,
            en_title: enTrans?.title || '',
            en_description: enTrans?.description || '',
            category: product.categories[0]?.name || '',
            listName: product.lists[0]?.name || ''
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
    };

    const handleUpdateProduct = async (id: string) => {
        try {
            const translations = {
                es: { title: editFormData.title, description: editFormData.description },
                en: { title: editFormData.en_title, description: editFormData.en_description }
            };

            const response = await fetch(`${API_URL}/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...editFormData,
                    translations
                })
            });

            if (response.ok) {
                setMessage({ type: 'success', text: t('product_updated') });
                setEditingId(null);
                loadProducts();
                loadNavigation();
            } else {
                const errorData = await response.json();
                setMessage({ type: 'error', text: errorData.error || t('error_updating') });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error de conexión' });
        }
    };

    // --- CATEGORY HANDLERS ---
    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/categories`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: categoryFormData.name })
            });
            if (response.ok) {
                setMessage({ type: 'success', text: 'Categoría creada' });
                setCategoryFormData({ name: '' });
                loadCategories();
                loadNavigation();
            }
        } catch (error) { setMessage({ type: 'error', text: 'Error al crear categoría' }); }
    };

    const handleUpdateCategory = async (id: string) => {
        try {
            const translations = {
                es: { name: editFormData.name },
                en: { name: editFormData.en_name }
            };
            const response = await fetch(`${API_URL}/categories/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: editFormData.name, translations })
            });
            if (response.ok) {
                setMessage({ type: 'success', text: 'Categoría actualizada' });
                setEditingId(null);
                loadCategories();
                loadNavigation();
            }
        } catch (error) { setMessage({ type: 'error', text: 'Error al actualizar categoría' }); }
    };

    const handleDeleteCategory = async (id: string) => {
        if (!confirm('¿Eliminar categoría? Esto puede fallar si tiene productos.')) return;
        try {
            const response = await fetch(`${API_URL}/categories/${id}`, { method: 'DELETE' });
            if (response.ok) {
                setMessage({ type: 'success', text: 'Categoría eliminada' });
                loadCategories();
                loadNavigation();
            } else {
                const data = await response.json();
                setMessage({ type: 'error', text: data.error || 'Error al eliminar' });
            }
        } catch (error) { setMessage({ type: 'error', text: 'Error de conexión' }); }
    };

    // --- LIST HANDLERS ---
    const handleCreateList = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/lists`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: listFormData.name,
                    categoryId: listFormData.categoryId
                })
            });
            if (response.ok) {
                setMessage({ type: 'success', text: 'Lista creada' });
                setListFormData({ name: '', categoryId: '' });
                loadLists();
                loadNavigation();
            }
        } catch (error) { setMessage({ type: 'error', text: 'Error al crear lista' }); }
    };

    const handleUpdateList = async (id: string) => {
        try {
            const translations = {
                es: { name: editFormData.name },
                en: { name: editFormData.en_name }
            };
            const response = await fetch(`${API_URL}/lists/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: editFormData.name,
                    categoryId: editFormData.categoryId,
                    translations
                })
            });
            if (response.ok) {
                setMessage({ type: 'success', text: 'Lista actualizada' });
                setEditingId(null);
                loadLists();
                loadNavigation();
            }
        } catch (error) { setMessage({ type: 'error', text: 'Error al actualizar lista' }); }
    };

    const handleDeleteList = async (id: string) => {
        if (!confirm('¿Eliminar lista?')) return;
        try {
            const response = await fetch(`${API_URL}/lists/${id}`, { method: 'DELETE' });
            if (response.ok) {
                setMessage({ type: 'success', text: 'Lista eliminada' });
                loadLists();
                loadNavigation();
            }
        } catch (error) { setMessage({ type: 'error', text: 'Error al eliminar' }); }
    };

    const categories = Object.keys(navigation);
    const listsForSelectedCategory = formData.category ? (navigation[formData.category] || []) : [];

    const getTranslatedName = (item: any) => {
        const trans = item.translations?.find((t: any) => t.lang === 'es');
        return trans?.name || item.name;
    };

    const getTranslatedNameEN = (item: any) => {
        const trans = item.translations?.find((t: any) => t.lang === 'en');
        return trans?.name || '';
    };

    const renderProductManager = () => (
        <Grid container spacing={4}>
            {/* Formulario */}
            <Grid size={{ xs: 12, md: 5 }}>
                <Paper sx={{ p: 3, bgcolor: '#1e1e1e' }}>
                    <Typography variant="h5" gutterBottom sx={{ color: 'primary.main' }}>
                        {t('import_smart')}
                    </Typography>
                    <Box sx={{ mb: 4, display: 'flex', gap: 1 }}>
                        <TextField
                            fullWidth
                            label={t('amazon_url')}
                            placeholder="https://www.amazon.es/..."
                            value={formData.amazonUrl}
                            onChange={(e) => setFormData({ ...formData, amazonUrl: e.target.value })}
                        />
                        <Button variant="outlined" onClick={handleScrape}>
                            {t('import')}
                        </Button>
                    </Box>

                    <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', mt: 2 }}>
                        {t('details')}
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label={t('title')}
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                        <TextField
                            label={t('description')}
                            required
                            multiline
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                        <TextField
                            label={t('price')}
                            type="number"
                            required
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        />
                        <TextField
                            label={t('rating')}
                            type="number"
                            inputProps={{ step: 0.1, min: 0, max: 5 }}
                            required
                            value={formData.rating}
                            onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                        />
                        <TextField
                            label={t('reviews')}
                            type="number"
                            required
                            value={formData.reviewCount}
                            onChange={(e) => setFormData({ ...formData, reviewCount: e.target.value })}
                        />
                        <TextField
                            label="URL Imagen"
                            required
                            value={formData.imageUrl}
                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        />

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Autocomplete
                                freeSolo
                                options={categories}
                                value={formData.category}
                                onChange={(_, newValue) => {
                                    setFormData({ ...formData, category: newValue || '' });
                                }}
                                onInputChange={(_, newInputValue) => {
                                    setFormData({ ...formData, category: newInputValue });
                                }}
                                renderInput={(params) => (
                                    <TextField {...params} label={t('category')} required />
                                )}
                            />

                            <Autocomplete
                                freeSolo
                                options={listsForSelectedCategory}
                                value={formData.listName}
                                onChange={(_, newValue) => {
                                    setFormData({ ...formData, listName: newValue || '' });
                                }}
                                onInputChange={(_, newInputValue) => {
                                    setFormData({ ...formData, listName: newInputValue });
                                }}
                                renderInput={(params) => (
                                    <TextField {...params} label={t('list_name')} required />
                                )}
                            />
                        </Box>

                        <Button type="submit" variant="contained" size="large" sx={{ color: 'black', fontWeight: 'bold' }}>
                            {t('save_product')}
                        </Button>
                    </Box>
                </Paper>
            </Grid>

            {/* Lista de productos */}
            <Grid size={{ xs: 12, md: 7 }}>
                <Typography variant="h5" gutterBottom sx={{ color: 'primary.main' }}>
                    {t('existing_products')} ({products.length})
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {products.map((product) => {
                        const isEditing = editingId === product.id;

                        return (
                            <Card key={product.id} sx={{ bgcolor: '#1e1e1e', border: isEditing ? '1px solid #b3e600' : 'none' }}>
                                <CardContent>
                                    {!isEditing ? (
                                        <>
                                            <Typography variant="h6" sx={{ color: 'primary.main' }}>
                                                {product.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {product.description}
                                            </Typography>
                                            <Box sx={{ mt: 1, display: 'flex', gap: 2 }}>
                                                <Typography variant="body2">
                                                    💰 ${product.price}
                                                </Typography>
                                                <Typography variant="body2">
                                                    ⭐ {product.rating}
                                                </Typography>
                                                <Typography variant="body2">
                                                    📝 {product.reviewCount} {t('reviews')}
                                                </Typography>
                                            </Box>
                                        </>
                                    ) : (
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                                            <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
                                                <Tab label="ES" />
                                                <Tab label="EN" />
                                            </Tabs>
                                            {tabValue === 0 ? (
                                                <>
                                                    <TextField
                                                        size="small"
                                                        label={t('title')}
                                                        value={editFormData.title}
                                                        onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                                                    />
                                                    <TextField
                                                        size="small"
                                                        label={t('description')}
                                                        multiline
                                                        rows={2}
                                                        value={editFormData.description}
                                                        onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                                                    />
                                                </>
                                            ) : (
                                                <>
                                                    <TextField
                                                        size="small"
                                                        label={`${t('title')} (EN)`}
                                                        value={editFormData.en_title}
                                                        onChange={(e) => setEditFormData({ ...editFormData, en_title: e.target.value })}
                                                    />
                                                    <TextField
                                                        size="small"
                                                        label={`${t('description')} (EN)`}
                                                        multiline
                                                        rows={2}
                                                        value={editFormData.en_description}
                                                        onChange={(e) => setEditFormData({ ...editFormData, en_description: e.target.value })}
                                                    />
                                                </>
                                            )}
                                            <Autocomplete
                                                freeSolo
                                                size="small"
                                                options={categories}
                                                value={editFormData.category}
                                                onChange={(_, newValue) => {
                                                    setEditFormData({ ...editFormData, category: newValue || '' });
                                                }}
                                                renderInput={(params) => (
                                                    <TextField {...params} label={t('category')} />
                                                )}
                                            />
                                        </Box>
                                    )}
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'flex-end', gap: 1 }}>
                                    {!isEditing ? (
                                        <>
                                            <IconButton size="small" color="primary" onClick={() => handleStartEdit(product)}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton size="small" color="error" onClick={() => handleDelete(product.id)}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </>
                                    ) : (
                                        <>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                color="primary"
                                                startIcon={<SaveIcon />}
                                                onClick={() => handleUpdateProduct(product.id)}
                                                sx={{ color: 'black', fontWeight: 'bold' }}
                                            >
                                                {t('save')}
                                            </Button>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                color="inherit"
                                                startIcon={<CloseIcon />}
                                                onClick={handleCancelEdit}
                                            >
                                                {t('cancel')}
                                            </Button>
                                        </>
                                    )}
                                </CardActions>
                            </Card>
                        );
                    })}
                </Box>
            </Grid>
        </Grid>
    );

    const renderCategoryManager = () => (
        <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 5 }}>
                <Paper sx={{ p: 3, bgcolor: '#1e1e1e' }}>
                    <Typography variant="h5" gutterBottom sx={{ color: 'primary.main' }}>
                        {t('create_category')}
                    </Typography>
                    <Box component="form" onSubmit={handleCreateCategory} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label={t('name')}
                            required
                            value={categoryFormData.name}
                            onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                        />
                        <Button type="submit" variant="contained" sx={{ color: 'black', fontWeight: 'bold' }}>
                            {t('save')}
                        </Button>
                    </Box>
                </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 7 }}>
                <Typography variant="h5" gutterBottom sx={{ color: 'primary.main' }}>
                    {t('category_manager')} ({categoriesList.length})
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {categoriesList.map((cat) => (
                        <Card key={cat.id} sx={{ bgcolor: '#1e1e1e' }}>
                            <CardContent>
                                {editingId === cat.id ? (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        <TextField
                                            label={t('name')}
                                            value={editFormData.name}
                                            onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                        />
                                        <TextField
                                            label={t('name_en')}
                                            value={editFormData.en_name}
                                            onChange={(e) => setEditFormData({ ...editFormData, en_name: e.target.value })}
                                        />
                                    </Box>
                                ) : (
                                    <>
                                        <Typography variant="h6" sx={{ color: 'primary.main' }}>
                                            {getTranslatedName(cat)}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            EN: {getTranslatedNameEN(cat)}
                                        </Typography>
                                        <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                                            Lists: {cat._count?.lists || 0} | Products: {cat._count?.products || 0}
                                        </Typography>
                                    </>
                                )}
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'flex-end' }}>
                                {editingId === cat.id ? (
                                    <>
                                        <Button size="small" variant="contained" color="primary" onClick={() => handleUpdateCategory(cat.id)}>
                                            {t('save')}
                                        </Button>
                                        <Button size="small" variant="outlined" onClick={() => setEditingId(null)}>
                                            {t('cancel')}
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button size="small" variant="text" onClick={() => { loadProducts(cat.name); setMainTab(0); }}>
                                            Ver Productos
                                        </Button>
                                        <IconButton size="small" color="primary" onClick={() => { setEditingId(cat.id); setEditFormData({ name: getTranslatedName(cat), en_name: getTranslatedNameEN(cat) }); }}>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small" color="error" onClick={() => handleDeleteCategory(cat.id)}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </>
                                )}
                            </CardActions>
                        </Card>
                    ))}
                </Box>
            </Grid>
        </Grid>
    );

    const renderListManager = () => (
        <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 5 }}>
                <Paper sx={{ p: 3, bgcolor: '#1e1e1e' }}>
                    <Typography variant="h5" gutterBottom sx={{ color: 'primary.main' }}>
                        {t('create_list')}
                    </Typography>
                    <Box component="form" onSubmit={handleCreateList} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label={t('name')}
                            required
                            value={listFormData.name}
                            onChange={(e) => setListFormData({ ...listFormData, name: e.target.value })}
                        />
                        <Autocomplete
                            options={categoriesList}
                            getOptionLabel={(option) => getTranslatedName(option)}
                            value={categoriesList.find(c => c.id === listFormData.categoryId) || null}
                            onChange={(_, newValue) => setListFormData({ ...listFormData, categoryId: newValue?.id || '' })}
                            renderInput={(params) => <TextField {...params} label={t('parent_category')} required />}
                        />
                        <Button type="submit" variant="contained" sx={{ color: 'black', fontWeight: 'bold' }}>
                            {t('save')}
                        </Button>
                    </Box>
                </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 7 }}>
                <Typography variant="h5" gutterBottom sx={{ color: 'primary.main' }}>
                    {t('list_manager')} ({listsList.length})
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {listsList.map((ls) => (
                        <Card key={ls.id} sx={{ bgcolor: '#1e1e1e' }}>
                            <CardContent>
                                {editingId === ls.id ? (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        <TextField
                                            label={t('name')}
                                            value={editFormData.name}
                                            onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                        />
                                        <TextField
                                            label={t('name_en')}
                                            value={editFormData.en_name}
                                            onChange={(e) => setEditFormData({ ...editFormData, en_name: e.target.value })}
                                        />
                                        <Autocomplete
                                            options={categoriesList}
                                            getOptionLabel={(option) => getTranslatedName(option)}
                                            value={categoriesList.find(c => c.id === editFormData.categoryId) || null}
                                            onChange={(_, newValue) => setEditFormData({ ...editFormData, categoryId: newValue?.id || '' })}
                                            renderInput={(params) => <TextField {...params} label={t('parent_category')} />}
                                        />
                                    </Box>
                                ) : (
                                    <>
                                        <Typography variant="h6" sx={{ color: 'primary.main' }}>
                                            {getTranslatedName(ls)}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Cat: {getTranslatedName(ls.category)}
                                        </Typography>
                                        <Typography variant="caption" sx={{ display: 'block' }}>
                                            Products: {ls._count?.products || 0}
                                        </Typography>
                                    </>
                                )}
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'flex-end' }}>
                                {editingId === ls.id ? (
                                    <>
                                        <Button size="small" variant="contained" color="primary" onClick={() => handleUpdateList(ls.id)}>
                                            {t('save')}
                                        </Button>
                                        <Button size="small" variant="outlined" onClick={() => setEditingId(null)}>
                                            {t('cancel')}
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button size="small" variant="text" onClick={() => { loadProducts(undefined, ls.name); setMainTab(0); }}>
                                            Ver Productos
                                        </Button>
                                        <IconButton size="small" color="primary" onClick={() => { setEditingId(ls.id); setEditFormData({ name: getTranslatedName(ls), en_name: getTranslatedNameEN(ls), categoryId: ls.categoryId }); }}>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small" color="error" onClick={() => handleDeleteList(ls.id)}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </>
                                )}
                            </CardActions>
                        </Card>
                    ))}
                </Box>
            </Grid>
        </Grid>
    );

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Typography variant="h3" gutterBottom sx={{ color: 'primary.main', fontWeight: 700 }}>
                {t('admin_panel')}
            </Typography>

            {message && (
                <Alert severity={message.type} onClose={() => setMessage(null)} sx={{ mb: 3 }}>
                    {message.text}
                </Alert>
            )}

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
                <Tabs value={mainTab} onChange={(_, v) => setMainTab(v)} sx={{ mb: 1 }}>
                    <Tab label={t('product_manager')} />
                    <Tab label={t('category_manager')} />
                    <Tab label={t('list_manager')} />
                </Tabs>
            </Box>

            {mainTab === 0 && renderProductManager()}
            {mainTab === 1 && renderCategoryManager()}
            {mainTab === 2 && renderListManager()}
        </Container>
    );
}
