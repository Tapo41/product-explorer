'use client';

import { useQuery } from '@tanstack/react-query';
import { productApi } from '@/lib/api';
import { useSearchParams } from 'next/navigation';
import ProductGrid from '@/components/ProductGrid';
import { Search } from 'lucide-react';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const page = Number(searchParams.get('page')) || 1;

  const { data, isLoading } = useQuery({
    queryKey: ['search', query, page],
    queryFn: () => productApi.search(query, page, 24),
    enabled: query.length > 0,
  });

  if (!query) {
    return (
      <div className="container-custom py-12 text-center">
        <Search className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Search Products</h1>
        <p className="text-gray-600">Enter a search term to find products</p>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <h1 className="text-4xl font-bold mb-2">Search Results</h1>
      <p className="text-gray-600 mb-8">
        {isLoading ? 'Searching...' : `Found ${data?.total || 0} results for "${query}"`}
      </p>

      {!isLoading && data && data.products.length > 0 ? (
        <ProductGrid products={data.products} />
      ) : !isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found matching your search.</p>
        </div>
      ) : null}
    </div>
  );
}