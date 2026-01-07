import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { ScraperService } from '../scraper/scraper.service';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);
  private readonly CACHE_DURATION_HOURS = 24;

  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private scraperService: ScraperService,
  ) {}

  async getByNavigationId(navigationId: string, forceRefresh = false): Promise<Category[]> {
    if (!forceRefresh) {
      const cached = await this.categoryRepository.find({
        where: { navigation_id: navigationId },
        relations: ['children'],
        order: { title: 'ASC' },
      });

      if (cached.length > 0) {
        const cacheExpiry = new Date();
        cacheExpiry.setHours(cacheExpiry.getHours() - this.CACHE_DURATION_HOURS);

        const recentCache = cached.find(c => c.last_scraped_at > cacheExpiry);
        if (recentCache) {
          return cached;
        }
      }
    }

    return await this.scrapeAndSave(navigationId);
  }

  async scrapeAndSave(navigationId: string, categoryUrl?: string): Promise<Category[]> {
    this.logger.log(`Scraping categories for navigation: ${navigationId}`);
    
    try {
      const url = categoryUrl || '/en-gb/category/books';
      const scrapedData = await this.scraperService.scrapeCategory(url);
      const savedCategories = [];

      for (const item of scrapedData.categories) {
        let category = await this.categoryRepository.findOne({
          where: { slug: item.slug },
        });

        if (category) {
          category.title = item.title;
          category.url = item.url;
          category.last_scraped_at = new Date();
        } else {
          category = this.categoryRepository.create({
            navigation_id: navigationId,
            title: item.title,
            slug: item.slug,
            url: item.url,
            last_scraped_at: new Date(),
          });
        }

        savedCategories.push(await this.categoryRepository.save(category));
      }

      this.logger.log(`Saved ${savedCategories.length} categories`);
      return savedCategories;
    } catch (error) {
      this.logger.error('Failed to scrape categories', error.stack);
      
      const cached = await this.categoryRepository.find({
        where: { navigation_id: navigationId },
      });
      
      if (cached.length > 0) {
        this.logger.log('Returning cached category data due to scrape failure');
        return cached;
      }
      
      throw error;
    }
  }

  async getById(id: string): Promise<Category> {
    return await this.categoryRepository.findOne({
      where: { id },
      relations: ['children', 'products'],
    });
  }

  async getBySlug(slug: string): Promise<Category> {
    return await this.categoryRepository.findOne({
      where: { slug },
      relations: ['children', 'products'],
    });
  }

  async updateProductCount(categoryId: string, count: number): Promise<void> {
    await this.categoryRepository.update(categoryId, { product_count: count });
  }
}