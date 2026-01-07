'use client';

import { useQuery } from '@tanstack/react-query';
import { productApi } from '@/lib/api';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { Star } from 'lucide-react';
import ProductGrid from '@/components/ProductGrid';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => productApi.getById(productId),
  });

  const { data: recommended } = useQuery({
    queryKey: ['recommended', productId],
    queryFn: () => productApi.getRecommended(productId),
    enabled: !!product,
  });

  if (isLoading) {
    return <div className="container-custom py-12">Loading...</div>;
  }

  if (!product) {
    return <div className="container-custom py-12">Product not found</div>;
  }

  return (
    <div className="container-custom py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Product Image */}
        <div className="relative aspect-square">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.title}
              fill
              className="object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
          {product.author && (
            <p className="text-xl text-gray-600 mb-4">by {product.author}</p>
          )}
          
          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-bold text-primary-600">
              {formatPrice(product.price)}
            </span>
            {product.detail?.ratings_avg && (
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{product.detail.ratings_avg.toFixed(1)}</span>
                <span className="text-gray-500">
                  ({product.detail.reviews_count} reviews)
                </span>
              </div>
            )}
          </div>

          {product.detail?.description && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-3">Description</h2>
              <p className="text-gray-700 leading-relaxed">{product.detail.description}</p>
            </div>
          )}

          {/* Product Details */}
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-3">Product Details</h3>
            <dl className="space-y-2">
              {product.detail?.publisher && (
                <div className="flex">
                  <dt className="w-32 text-gray-600">Publisher:</dt>
                  <dd className="font-medium">{product.detail.publisher}</dd>
                </div>
              )}
              {product.detail?.publication_date && (
                <div className="flex">
                  <dt className="w-32 text-gray-600">Published:</dt>
                  <dd className="font-medium">{product.detail.publication_date}</dd>
                </div>
              )}
              {product.detail?.isbn && (
                <div className="flex">
                  <dt className="w-32 text-gray-600">ISBN:</dt>
                  <dd className="font-medium">{product.detail.isbn}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>

      {/* Reviews */}
      {product.reviews && product.reviews.length > 0 && (
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Customer Reviews</h2>
          <div className="space-y-6">
            {product.reviews.map((review) => (
              <div key={review.id} className="card p-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold">{review.author || 'Anonymous'}</span>
                </div>
                {review.text && <p className="text-gray-700">{review.text}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Products */}
      {recommended && recommended.length > 0 && (
        <div>
          <h2 className="text-3xl font-bold mb-6">You May Also Like</h2>
          <ProductGrid products={recommended} />
        </div>
      )}
    </div>
  );
}