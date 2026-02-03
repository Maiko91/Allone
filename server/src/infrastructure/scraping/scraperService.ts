import axios from 'axios';
import * as cheerio from 'cheerio';

export interface ScrapedProduct {
    title: string;
    description: string;
    price: number;
    rating: number;
    reviewCount: number;
    imageUrl: string;
    amazonUrl: string;
}

export async function scrapeAmazonProduct(url: string): Promise<ScrapedProduct> {
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
                'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
            }
        });

        const $ = cheerio.load(data);

        // Título
        const title = $('#productTitle').text().trim() || 'Producto de Amazon';

        // Descripción (Bullets de Amazon)
        const description = $('#feature-bullets ul li')
            .map((_, el) => $(el).text().trim())
            .get()
            .join(' ') ||
            $('#productDescription').text().trim() ||
            '';

        // Precio
        let priceText = $('#price_inside_buybox').text().trim() ||
            $('#corePrice_feature_div .a-offscreen').first().text().trim() ||
            $('.a-price .a-offscreen').first().text().trim() || '0';

        const price = parseFloat(priceText.replace(/[^0-9.,]/g, '').replace(',', '.')) || 0;

        // Rating
        const ratingText = $('span.a-icon-alt').first().text().trim();
        const rating = parseFloat(ratingText.split(' ')[0].replace(',', '.')) || 0;

        // Review Count
        const reviewText = $('#acrCustomerReviewText').first().text().trim();
        const reviewCount = parseInt(reviewText.replace(/[^0-9]/g, '')) || 0;

        // Imagen
        const imageUrl = $('#landingImage').attr('src') ||
            $('#imgBlkFront').attr('src') ||
            'https://placehold.co/600x400?text=Amazon+Product';

        return {
            title,
            description: description.substring(0, 500), // Limitamos para no saturar
            price,
            rating,
            reviewCount,
            imageUrl,
            amazonUrl: url
        };
    } catch (error) {
        console.error('Error scraping Amazon:', error);
        throw new Error('No se pudo extraer la información del producto. Amazon podría estar bloqueando el acceso o el enlace no es válido.');
    }
}
