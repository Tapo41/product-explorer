'use client';

import { useQuery } from '@tanstack/react-query';
import { categoryApi, productApi } from '@/lib/api';
import { useParams, useSearchParams } from 'next/navigation';
import ProductGrid from '@/components/ProductGrid';
import Pagination from '@/components/Pagination';
import { ProductGridSkeleton } from '@/components/LoadingSkeleton';

export default function CategoryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const categoryId = params.id as string;

  const { data: category, isLoading: categoryLoading } = useQuery({
    queryKey: ['category', categoryId],
    queryFn: () => categoryApi.getById(categoryId),
  });

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['products', categoryId, page],
    queryFn: () => productApi.getByCategoryId(categoryId, page, 24),
  });

  if (categoryLoading || productsLoading) {
    return (
      <div className="container-custom py-12">
        <div className="skeleton h-10 w-64 mb-8" />
        <ProductGridSkeleton />
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <h1 className="text-4xl font-bold mb-8">{category?.title}</h1>
      
      {productsData && productsData.products.length > 0 ? (
        <>
          <ProductGrid products={productsData.products} />
          <Pagination
            currentPage={page}
            totalPages={Math.ceil(productsData.total / productsData.limit)}
            baseUrl={`/category/${categoryId}`}
          />
        </>
      ) : (
        <p className="text-center text-gray-500 py-12">No products found.</p>
      )}
    </div>
  );
}