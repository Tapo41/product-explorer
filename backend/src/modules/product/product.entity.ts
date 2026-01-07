import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { Category } from '../category/category.entity';
import { ProductDetail } from './product-detail.entity';
import { Review } from './review.entity';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @Index()
  source_id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  author: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({ default: 'GBP' })
  currency: string;

  @Column({ nullable: true })
  image_url: string;

  @Column({ unique: true })
  @Index()
  source_url: string;

  @Column({ nullable: true })
  @Index()
  category_id: string;

  @ManyToOne(() => Category, category => category.products, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ type: 'timestamp', nullable: true })
  @Index()
  last_scraped_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => ProductDetail, detail => detail.product, { cascade: true })
  detail: ProductDetail;

  @OneToMany(() => Review, review => review.product, { cascade: true })
  reviews: Review[];
}