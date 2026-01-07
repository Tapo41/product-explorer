import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { Navigation } from '../navigation/navigation.entity';
import { Product } from '../product/product.entity';

@Entity('category')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  navigation_id: string;

  @ManyToOne(() => Navigation, navigation => navigation.categories)
  @JoinColumn({ name: 'navigation_id' })
  navigation: Navigation;

  @Column({ nullable: true })
  @Index()
  parent_id: string;

  @ManyToOne(() => Category, category => category.children, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent: Category;

  @OneToMany(() => Category, category => category.parent)
  children: Category[];

  @Column()
  title: string;

  @Column({ unique: true })
  @Index()
  slug: string;

  @Column({ nullable: true })
  url: string;

  @Column({ default: 0 })
  product_count: number;

  @Column({ type: 'timestamp', nullable: true })
  @Index()
  last_scraped_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Product, product => product.category)
  products: Product[];
}