import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { ProductDetail } from './product-detail.entity';
import { Review } from './review.entity';
import { ScraperService } from '../scraper/scraper.service';
import { CategoryService } from '../category/category.service';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);
  private readonly CACHE_DURATION_HOURS = 12;

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductDetail)
    private productDetailRepository: Repository<ProductDetail>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    private scraperService: ScraperService,
    private categoryService: CategoryService,
  ) {}

  async getByCategoryId(
    categoryId: string,
    page = 1,
    limit = 24,
    forceRefresh = false,
  ): Promise<{ products: Product[]; total: number; page: number; limit: number }> {
    if (!forceRefresh) {
      const [products, total] = await this.productRepository.findAndCount({
        where: { category_id: categoryId },
        take: limit,
        skip: (page - 1) * limit,
        order: { created_at: 'DESC' },
      });

      if (products.length > 0) {
        const cacheExpiry = new Date();
        cacheExpiry.setHours(cacheExpiry.getHours() - this.CACHE_DURATION_HOURS);

        const recentCache = products.find(p => p.last_scraped_at > cacheExpiry);
        if (recentCache) {
          return { products, total, page, limit };
        }
      }
    }

    await this.scrapeAndSave(categoryId, page, limit);

    const [products, total] = await this.productRepository.findAndCount({
      where: { category_id: categoryId },
      take: limit,
      skip: (page - 1) * limit,
      order: { created_at: 'DESC' },
    });

    return { products, total, page, limit };
  }

  async scrapeAndSave(categoryId: string, page = 1, limit = 24): Promise<Product[]> {
    this.logger.log(`Scraping products for category: ${categoryId}`);
    
    try {
      const category = await this.categoryService.getById(categoryId);
      const categoryUrl = category?.url || '/en-gb/category/books';
      
      const scrapedProducts = await this.scraperService.scrapeProducts(categoryUrl, page, limit);
      const savedProducts = [];

      for (const item of scrapedProducts) {
        let product = await this.productRepository.findOne({
          where: { source_id: item.source_id },
        });

        if (product) {
          product.title = item.title;
          product.author = item.author;
          product.price = parseFloat(item.price) || 0;
          product.image_url = item.image_url;
          product.source_url = item.source_url;
          product.last_scraped_at = new Date();
        } else {
          product = this.productRepository.create({
            source_id: item.source_id,
            title: item.title,
            author: item.author,
            price: parseFloat(item.price) || 0,
            currency: 'GBP',
            image_url: item.image_url,
            source_url: item.source_url,
            category_id: categoryId,
            last_scraped_at: new Date(),
          });
        }

        savedProducts.push(await this.productRepository.save(product));
      }

      await this.categoryService.updateProductCount(categoryId, savedProducts.length);
      this.logger.log(`Saved ${savedProducts.length} products`);
      
      return savedProducts;
    } catch (error) {
      this.logger.error('Failed to scrape products', error.stack);
      throw error;
    }
  }

  async getById(id: string, forceRefresh = false): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['detail', 'reviews', 'category'],
    });

    if (!product) {
      return null;
    }

    if (!forceRefresh && product.detail) {
      const cacheExpiry = new Date();
      cacheExpiry.setHours(cacheExpiry.getHours() - this.CACHE_DURATION_HOURS);

      if (product.last_scraped_at > cacheExpiry) {
        return product;
      }
    }

    await this.scrapeProductDetail(product);
    
    return await this.productRepository.findOne({
      where: { id },
      relations: ['detail', 'reviews', 'category'],
    });
  }

  async scrapeProductDetail(product: Product): Promise<void> {
    this.logger.log(`Scraping product detail: ${product.id}`);
    
    try {
      const scrapedDetail = await this.scraperService.scrapeProductDetail(product.source_url);

      let detail = await this.productDetailRepository.findOne({
        where: { product_id: product.id },
      });

      if (detail) {
        detail.description = scrapedDetail.description;
        detail.ratings_avg = scrapedDetail.ratings_avg;
        detail.reviews_count = scrapedDetail.reviews_count;
        detail.recommended_products = scrapedDetail.recommended_products;
        detail.specs = scrapedDetail.specs;
      } else {
        detail = this.productDetailRepository.create({
          product_id: product.id,
          description: scrapedDetail.description,
          ratings_avg: scrapedDetail.ratings_avg,
          reviews_count: scrapedDetail.reviews_count,
          recommended_products: scrapedDetail.recommended_products,
          specs: scrapedDetail.specs,
        });
      }

      await this.productDetailRepository.save(detail);

      // Save reviews
      await this.reviewRepository.delete({ product_id: product.id });
      
      for (const reviewData of scrapedDetail.reviews || []) {
        const review = this.reviewRepository.create({
          product_id: product.id,
          author: reviewData.author,
          rating: reviewData.rating,
          text: reviewData.text,
        });
        await this.reviewRepository.save(review);
      }

      // Update product last_scraped_at
      await this.productRepository.update(product.id, { last_scraped_at: new Date() });

      this.logger.log(`Updated product detail for: ${product.id}`);
    } catch (error) {
      this.logger.error('Failed to scrape product detail', error.stack);
      throw error;
    }
  }

  async search(query: string, page = 1, limit = 24): Promise<{ products: Product[]; total: number }> {
    const [products, total] = await this.productRepository
      .createQueryBuilder('product')
      .where('product.title ILIKE :query', { query: `%${query}%` })
      .orWhere('product.author ILIKE :query', { query: `%${query}%` })
      .take(limit)
      .skip((page - 1) * limit)
      .orderBy('product.created_at', 'DESC')
      .getManyAndCount();

    return { products, total };
  }

  async getRecommended(productId: string, limit = 6): Promise<Product[]> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['detail', 'category'],
    });

    if (!product || !product.category_id) {
      return [];
    }

    const products = await this.productRepository.find({
      where: { category_id: product.category_id },
      take: limit + 1,
      order: { created_at: 'DESC' },
    });

    return products.filter(p => p.id !== productId).slice(0, limit);
  }
}