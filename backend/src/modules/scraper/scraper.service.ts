import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlaywrightCrawler, Dataset } from 'crawlee';
import { ScrapeJob, ScrapeJobStatus, ScrapeJobType } from './scrape-job.entity';

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);
  private readonly baseUrl = 'https://www.worldofbooks.com';
  private readonly delayMs = 2000;

  constructor(
    @InjectRepository(ScrapeJob)
    private scrapeJobRepository: Repository<ScrapeJob>,
  ) {}

  async scrapeNavigation(): Promise<any[]> {
    const job = await this.createJob(this.baseUrl, ScrapeJobType.NAVIGATION);
    
    try {
      await this.updateJobStatus(job.id, ScrapeJobStatus.IN_PROGRESS);
      
      const results = [];
      const crawler = new PlaywrightCrawler({
        requestHandlerTimeoutSecs: 60,
        maxRequestRetries: 3,
        async requestHandler({ page, request }) {
          await page.waitForLoadState('domcontentloaded');
          await page.waitForTimeout(2000);

          const navigationItems = await page.$$eval('nav a, header a[href*="/en-"]', (links) => {
            return links
              .filter(link => {
                const href = link.getAttribute('href');
                const text = link.textContent?.trim();
                return href && text && text.length > 0 && !href.includes('account');
              })
              .map(link => ({
                title: link.textContent?.trim(),
                url: link.getAttribute('href'),
                slug: link.getAttribute('href')?.split('/').filter(Boolean).pop() || '',
              }));
          });

          const uniqueItems = Array.from(
            new Map(navigationItems.map(item => [item.slug, item])).values()
          );

          results.push(...uniqueItems);
        },
      });

      await crawler.run([this.baseUrl]);
      await this.updateJobStatus(job.id, ScrapeJobStatus.COMPLETED);
      
      return results;
    } catch (error) {
      this.logger.error(`Navigation scraping failed: ${error.message}`, error.stack);
      await this.updateJobStatus(job.id, ScrapeJobStatus.FAILED, error.message);
      throw error;
    }
  }

  async scrapeCategory(categoryUrl: string): Promise<any> {
    const job = await this.createJob(categoryUrl, ScrapeJobType.CATEGORY);
    
    try {
      await this.updateJobStatus(job.id, ScrapeJobStatus.IN_PROGRESS);
      
      const result = { categories: [], products: [] };
      const fullUrl = categoryUrl.startsWith('http') ? categoryUrl : `${this.baseUrl}${categoryUrl}`;
      
      const crawler = new PlaywrightCrawler({
        requestHandlerTimeoutSecs: 60,
        maxRequestRetries: 3,
        async requestHandler({ page }) {
          await page.waitForLoadState('domcontentloaded');
          await page.waitForTimeout(2000);

          // Scrape subcategories
          const subcategories = await page.$$eval('a[href*="/en-"]', (links) => {
            return links
              .filter(link => {
                const href = link.getAttribute('href');
                return href && href.includes('/en-');
              })
              .slice(0, 20)
              .map(link => ({
                title: link.textContent?.trim(),
                url: link.getAttribute('href'),
                slug: link.getAttribute('href')?.split('/').filter(Boolean).pop() || '',
              }));
          });

          result.categories = subcategories;
        },
      });

      await crawler.run([fullUrl]);
      await this.updateJobStatus(job.id, ScrapeJobStatus.COMPLETED);
      
      return result;
    } catch (error) {
      this.logger.error(`Category scraping failed: ${error.message}`, error.stack);
      await this.updateJobStatus(job.id, ScrapeJobStatus.FAILED, error.message);
      throw error;
    }
  }

  async scrapeProducts(categoryUrl: string, page = 1, limit = 24): Promise<any[]> {
    const job = await this.createJob(categoryUrl, ScrapeJobType.PRODUCTS);
    
    try {
      await this.updateJobStatus(job.id, ScrapeJobStatus.IN_PROGRESS);
      
      const products = [];
      const fullUrl = categoryUrl.startsWith('http') ? categoryUrl : `${this.baseUrl}${categoryUrl}`;
      const urlWithPage = `${fullUrl}?page=${page}`;
      
      const crawler = new PlaywrightCrawler({
        requestHandlerTimeoutSecs: 60,
        maxRequestRetries: 3,
        async requestHandler({ page: browserPage }) {
          await browserPage.waitForLoadState('domcontentloaded');
          await browserPage.waitForTimeout(2000);

          const items = await browserPage.$$eval('article, .product-item, [data-product], .product-card', (elements) => {
            return elements.slice(0, 24).map((el, index) => {
              const titleEl = el.querySelector('h2, h3, .product-title, [class*="title"]');
              const priceEl = el.querySelector('[class*="price"], .price');
              const imageEl = el.querySelector('img');
              const linkEl = el.querySelector('a');
              const authorEl = el.querySelector('[class*="author"], .author');

              return {
                source_id: `wob-${Date.now()}-${index}`,
                title: titleEl?.textContent?.trim() || 'Unknown Product',
                author: authorEl?.textContent?.trim() || null,
                price: priceEl?.textContent?.replace(/[^0-9.]/g, '') || '0',
                image_url: imageEl?.getAttribute('src') || imageEl?.getAttribute('data-src') || null,
                source_url: linkEl?.getAttribute('href') || '',
              };
            });
          });

          products.push(...items);
        },
      });

      await crawler.run([urlWithPage]);
      await this.updateJobStatus(job.id, ScrapeJobStatus.COMPLETED);
      
      return products.slice(0, limit);
    } catch (error) {
      this.logger.error(`Products scraping failed: ${error.message}`, error.stack);
      await this.updateJobStatus(job.id, ScrapeJobStatus.FAILED, error.message);
      throw error;
    }
  }

  async scrapeProductDetail(productUrl: string): Promise<any> {
    const job = await this.createJob(productUrl, ScrapeJobType.PRODUCT_DETAIL);
    
    try {
      await this.updateJobStatus(job.id, ScrapeJobStatus.IN_PROGRESS);
      
      let detail = null;
      const fullUrl = productUrl.startsWith('http') ? productUrl : `${this.baseUrl}${productUrl}`;
      
      const crawler = new PlaywrightCrawler({
        requestHandlerTimeoutSecs: 60,
        maxRequestRetries: 3,
        async requestHandler({ page }) {
          await page.waitForLoadState('domcontentloaded');
          await page.waitForTimeout(2000);

          detail = await page.evaluate(() => {
            const descEl = document.querySelector('[class*="description"], .description, [data-description]');
            const ratingEl = document.querySelector('[class*="rating"], .rating');
            const reviewEls = document.querySelectorAll('[class*="review"], .review-item');
            const recommendedEls = document.querySelectorAll('[class*="recommended"], .recommended-product');

            const reviews = Array.from(reviewEls).slice(0, 10).map((rev) => {
              const authorEl = rev.querySelector('[class*="author"], .author');
              const ratingEl = rev.querySelector('[class*="rating"], .rating');
              const textEl = rev.querySelector('[class*="text"], .review-text');
              
              return {
                author: authorEl?.textContent?.trim() || 'Anonymous',
                rating: parseFloat(ratingEl?.textContent?.replace(/[^0-9.]/g, '') || '0'),
                text: textEl?.textContent?.trim() || '',
              };
            });

            const recommended = Array.from(recommendedEls).slice(0, 6).map((rec) => {
              const linkEl = rec.querySelector('a');
              return linkEl?.getAttribute('href') || '';
            }).filter(Boolean);

            return {
              description: descEl?.textContent?.trim() || '',
              ratings_avg: parseFloat(ratingEl?.textContent?.replace(/[^0-9.]/g, '') || '0'),
              reviews_count: reviews.length,
              reviews,
              recommended_products: recommended,
              specs: {},
            };
          });
        },
      });

      await crawler.run([fullUrl]);
      await this.updateJobStatus(job.id, ScrapeJobStatus.COMPLETED);
      
      return detail;
    } catch (error) {
      this.logger.error(`Product detail scraping failed: ${error.message}`, error.stack);
      await this.updateJobStatus(job.id, ScrapeJobStatus.FAILED, error.message);
      throw error;
    }
  }

  private async createJob(targetUrl: string, targetType: ScrapeJobType): Promise<ScrapeJob> {
    const job = this.scrapeJobRepository.create({
      target_url: targetUrl,
      target_type: targetType,
      status: ScrapeJobStatus.PENDING,
    });
    return await this.scrapeJobRepository.save(job);
  }

  private async updateJobStatus(
    jobId: string,
    status: ScrapeJobStatus,
    errorLog?: string,
  ): Promise<void> {
    const updates: any = { status };
    
    if (status === ScrapeJobStatus.IN_PROGRESS) {
      updates.started_at = new Date();
    } else if (status === ScrapeJobStatus.COMPLETED || status === ScrapeJobStatus.FAILED) {
      updates.finished_at = new Date();
    }
    
    if (errorLog) {
      updates.error_log = errorLog;
    }

    await this.scrapeJobRepository.update(jobId, updates);
  }

  async getJobStatus(jobId: string): Promise<ScrapeJob> {
    return await this.scrapeJobRepository.findOne({ where: { id: jobId } });
  }
}