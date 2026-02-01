import axios from 'axios';
import * as cheerio from 'cheerio';

export interface ScrapedProduct {
    title: string;
    price: number;
    imageUrl: string;
    amazonUrl: string;
}

export async function scrapeAmazonProduct(url: string): Promise<ScrapedProduct> {
    try {
        // Usamos un User-Agent real para evitar bloqueos básicos de Amazon
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
                'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
            }
        });

        const $ = cheerio.load(data);

        // Selectores comunes de Amazon (estos pueden cambiar con el tiempo)
        const title = $('#productTitle').text().trim() || 'Producto de Amazon';

        // El precio en Amazon es difícil de capturar porque hay muchos formatos
        let priceText = $('#price_inside_buybox').text().trim() ||
            $('#corePrice_feature_div .a-offscreen').first().text().trim() ||
            $('.a-price .a-offscreen').first().text().trim() || '0';

        // Limpiamos el precio (quitamos símbolos de moneda y convertimos a número)
        const price = parseFloat(priceText.replace(/[^0-9.,]/g, '').replace(',', '.')) || 0;

        // Imagen principal
        const imageUrl = $('#landingImage').attr('src') ||
            $('#imgBlkFront').attr('src') ||
            'https://placehold.co/600x400?text=Amazon+Product';

        return {
            title,
            price,
            imageUrl,
            amazonUrl: url
        };
    } catch (error) {
        console.error('Error scraping Amazon:', error);
        throw new Error('No se pudo extraer la información del producto. Verifica el enlace.');
    }
}
