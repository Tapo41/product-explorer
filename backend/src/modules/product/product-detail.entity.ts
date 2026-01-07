import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('product_detail')
export class ProductDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  product_id: string;

  @OneToOne(() => Product, product => product.detail)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'jsonb', nullable: true })
  specs: Record<string, any>;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  ratings_avg: number;

  @Column({ default: 0 })
  reviews_count: number;

  @Column({ type: 'text', array: true, nullable: true })
  recommended_products: string[];

  @Column({ nullable: true })
  publisher: string;

  @Column({ nullable: true })
  publication_date: string;

  @Column({ nullable: true })
  isbn: string;
}