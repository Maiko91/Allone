import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    en: {
        translation: {
            "hero_title": "Find the Perfect Product",
            "hero_subtitle": "Expert analysis and rankings of the Top 10 products in every category.",
            "search_placeholder": "Search products (e.g., iPhone 15, Laptop...)",
            "sidebar_title": "Categories",
            "see_deal": "See Deal",
            "reviews": "reviews",
            "all_products": "All Products",
            "login": "Login",
            "logout": "Logout",
            "admin_panel": "Admin Panel",
            "save_product": "Save Product",
            "import": "Import",
            "details": "Product Details",
            "title": "Title",
            "description": "Description",
            "price": "Price",
            "rating": "Rating",
            "category": "Category",
            "list_name": "List Name",
            "import_smart": "Smart Import",
            "amazon_url": "Amazon URL",
            "existing_products": "Existing Products",
            "save": "Save",
            "cancel": "Cancel",
            "delete_confirm": "Are you sure you want to delete this product?",
            "see_less": "See Less",
            "see_more": "See More...",
            "language": "Language",
            "english": "English",
            "spanish": "Spanish",
            "category_description": "Explore our expert selection of the best {{category}} of 2024.",
            "product_manager": "Product Manager",
            "category_manager": "Category Manager",
            "list_manager": "List Manager",
            "name": "Name",
            "name_en": "Name (EN)",
            "parent_category": "Parent Category",
            "create_category": "Create Category",
            "create_list": "Create List",
            "category_created": "Category created successfully",
            "list_created": "List created successfully",
            "category_updated": "Category updated successfully",
            "list_updated": "List updated successfully",
            "category_deleted": "Category deleted",
            "list_deleted": "List deleted"
        }
    },
    es: {
        translation: {
            "hero_title": "Encuentra el Producto Perfecto",
            "hero_subtitle": "Análisis expertos y rankings de los Top 10 productos en cada categoría.",
            "search_placeholder": "Busca productos (ej. iPhone 15, Laptop...)",
            "sidebar_title": "Categorías",
            "see_deal": "Ver Oferta",
            "reviews": "reseñas",
            "all_products": "Todos los Productos",
            "login": "Iniciar Sesión",
            "logout": "Cerrar Sesión",
            "admin_panel": "Panel Admin",
            "save_product": "Guardar Producto",
            "import": "Importar",
            "details": "Detalles del Producto",
            "title": "Título",
            "description": "Descripción",
            "price": "Precio",
            "rating": "Valoración",
            "category": "Categoría",
            "list_name": "Nombre del Listado",
            "import_smart": "Importación Inteligente",
            "amazon_url": "URL de Amazon",
            "existing_products": "Productos Existentes",
            "save": "Guardar",
            "cancel": "Cancelar",
            "delete_confirm": "¿Estás seguro de eliminar este producto?",
            "see_less": "Ver menos",
            "see_more": "Ver más...",
            "language": "Idioma",
            "english": "Inglés",
            "spanish": "Español",
            "category_description": "Explora nuestra selección experta de los mejores {{category}} de 2024.",
            "product_created": "Producto creado exitosamente",
            "product_updated": "Producto actualizado exitosamente",
            "error_creating": "Error al crear el producto",
            "error_updating": "Error al actualizar el producto",
            "product_manager": "Gestor de Productos",
            "category_manager": "Gestor de Categorías",
            "list_manager": "Gestor de Listas",
            "name": "Nombre",
            "name_en": "Nombre (EN)",
            "parent_category": "Categoría Superior",
            "create_category": "Crear Categoría",
            "create_list": "Crear Lista",
            "category_created": "Categoría creada exitosamente",
            "list_created": "Lista creada exitosamente",
            "category_updated": "Categoría actualizada exitosamente",
            "list_updated": "Lista actualizada exitosamente",
            "category_deleted": "Categoría eliminada",
            "list_deleted": "Lista eliminada"
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'es',
        supportedLngs: ['es', 'en'],
        detection: {
            order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
            caches: ['localStorage', 'cookie'],
        },
        interpolation: {
            escapeValue: false
        },
        load: 'languageOnly'
    });

export default i18n;
