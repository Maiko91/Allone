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
    Autocomplete
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    rating: number;
    reviewCount: number;
    imageUrl: string;
    amazonUrl?: string | null;
    category: string;
    listName: string;
}

export function AdminDashboard() {
    const [products, setProducts] = useState<Product[]>([]);
    const [navigation, setNavigation] = useState<Record<string, string[]>>({});
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        rating: '',
        reviewCount: '',
        imageUrl: '',
        amazonUrl: '',
        category: 'Celulares',
        listName: 'Mejores Celulares 2024'
    });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editFormData, setEditFormData] = useState({
        category: '',
        listName: ''
    });
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        loadProducts();
        loadNavigation();
    }, []);

    const loadProducts = async () => {
        try {
            const response = await fetch(`${API_URL}/products`);
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error loading products:', error);
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
                setMessage({ type: 'success', text: 'Producto creado exitosamente' });
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
                setMessage({ type: 'error', text: errorData.error || 'Error al crear el producto' });
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
        setEditFormData({
            category: product.category,
            listName: product.listName
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
    };

    const handleUpdateProduct = async (id: string) => {
        try {
            const response = await fetch(`${API_URL}/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editFormData)
            });

            if (response.ok) {
                setMessage({ type: 'success', text: 'Producto actualizado exitosamente' });
                setEditingId(null);
                loadProducts();
                loadNavigation();
            } else {
                const errorData = await response.json();
                setMessage({ type: 'error', text: errorData.error || 'Error al actualizar el producto' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error de conexión' });
        }
    };

    const categories = Object.keys(navigation);
    const listsForSelectedCategory = formData.category ? (navigation[formData.category] || []) : [];
    const editListsForSelectedCategory = editFormData.category ? (navigation[editFormData.category] || []) : [];

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h3" gutterBottom sx={{ color: 'primary.main', fontWeight: 700 }}>
                Panel de Administración
            </Typography>

            {message && (
                <Alert severity={message.type} onClose={() => setMessage(null)} sx={{ mb: 3 }}>
                    {message.text}
                </Alert>
            )}

            <Grid container spacing={4}>
                {/* Formulario */}
                <Grid size={{ xs: 12, md: 5 }}>
                    <Paper sx={{ p: 3, bgcolor: '#1e1e1e' }}>
                        <Typography variant="h5" gutterBottom sx={{ color: 'primary.main' }}>
                            Importación Inteligente
                        </Typography>
                        <Box sx={{ mb: 4, display: 'flex', gap: 1 }}>
                            <TextField
                                fullWidth
                                label="URL de Amazon"
                                placeholder="https://www.amazon.es/..."
                                value={formData.amazonUrl}
                                onChange={(e) => setFormData({ ...formData, amazonUrl: e.target.value })}
                            />
                            <Button variant="outlined" onClick={handleScrape}>
                                Importar
                            </Button>
                        </Box>

                        <Typography variant="h5" gutterBottom sx={{ color: 'primary.main' }}>
                            Detalles del Producto
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                label="Título"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                            <TextField
                                label="Descripción"
                                required
                                multiline
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                            <TextField
                                label="Precio"
                                type="number"
                                required
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            />
                            <TextField
                                label="Rating (0-5)"
                                type="number"
                                inputProps={{ step: 0.1, min: 0, max: 5 }}
                                required
                                value={formData.rating}
                                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                            />
                            <TextField
                                label="Número de Reviews"
                                type="number"
                                required
                                value={formData.reviewCount}
                                onChange={(e) => setFormData({ ...formData, reviewCount: e.target.value })}
                            />
                            <TextField
                                label="URL de Imagen"
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
                                        <TextField {...params} label="Categoría" required />
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
                                        <TextField {...params} label="Nombre del Listado" required />
                                    )}
                                />
                            </Box>

                            <Button type="submit" variant="contained" size="large">
                                Guardar Producto
                            </Button>
                        </Box>
                    </Paper>
                </Grid>

                {/* Lista de productos */}
                <Grid size={{ xs: 12, md: 7 }}>
                    <Typography variant="h5" gutterBottom sx={{ color: 'primary.main' }}>
                        Productos Existentes ({products.length})
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {products.map((product) => {
                            const isEditing = editingId === product.id;

                            return (
                                <Card key={product.id} sx={{ bgcolor: '#1e1e1e', border: isEditing ? '1px solid #b3e600' : 'none' }}>
                                    <CardContent>
                                        <Typography variant="h6" sx={{ color: 'primary.main', mb: isEditing ? 2 : 0 }}>
                                            {product.title}
                                        </Typography>

                                        {!isEditing ? (
                                            <>
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
                                                        📝 {product.reviewCount} reviews
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                                                    <Typography variant="caption" sx={{ bgcolor: 'primary.main', color: 'black', px: 1, borderRadius: 1 }}>
                                                        {product.category}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ bgcolor: 'grey.800', color: 'white', px: 1, borderRadius: 1 }}>
                                                        {product.listName}
                                                    </Typography>
                                                </Box>
                                            </>
                                        ) : (
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                                                <Autocomplete
                                                    freeSolo
                                                    size="small"
                                                    options={categories}
                                                    value={editFormData.category}
                                                    onChange={(_, newValue) => {
                                                        setEditFormData({ ...editFormData, category: newValue || '' });
                                                    }}
                                                    onInputChange={(_, newInputValue) => {
                                                        setEditFormData({ ...editFormData, category: newInputValue });
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField {...params} label="Categoría" />
                                                    )}
                                                />
                                                <Autocomplete
                                                    freeSolo
                                                    size="small"
                                                    options={editListsForSelectedCategory}
                                                    value={editFormData.listName}
                                                    onChange={(_, newValue) => {
                                                        setEditFormData({ ...editFormData, listName: newValue || '' });
                                                    }}
                                                    onInputChange={(_, newInputValue) => {
                                                        setEditFormData({ ...editFormData, listName: newInputValue });
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField {...params} label="Nombre del Listado" />
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
                                                    Guardar
                                                </Button>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    color="inherit"
                                                    startIcon={<CloseIcon />}
                                                    onClick={handleCancelEdit}
                                                >
                                                    Cancelar
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
        </Container>
    );
}
