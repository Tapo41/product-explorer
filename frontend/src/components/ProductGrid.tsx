import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Star } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/product/${product.id}`}
          className="card group hover:scale-105 transition-transform duration-300"
        >
          <div className="relative aspect-square">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-sm">No image</span>
              </div>
            )}
          </div>
          
          <div className="p-4">
            <h3 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-primary-600 transition-colors">
              {product.title}
            </h3>
            
            {product.author && (
              <p className="text-xs text-gray-600 mb-2 line-clamp-1">
                by {product.author}
              </p>
            )}
            
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-primary-600">
                {formatPrice(product.price)}
              </span>
              
              {product.detail?.ratings_avg && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">
                    {product.detail.ratings_avg.toFixed(1)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}