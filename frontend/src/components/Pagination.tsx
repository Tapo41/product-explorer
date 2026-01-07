import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export default function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = [];
  const showPages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
  let endPage = Math.min(totalPages, startPage + showPages - 1);

  if (endPage - startPage < showPages - 1) {
    startPage = Math.max(1, endPage - showPages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <Link
        href={`${baseUrl}?page=${currentPage - 1}`}
        className={`p-2 rounded-lg transition-colors ${
          currentPage === 1
            ? 'text-gray-400 cursor-not-allowed'
            : 'hover:bg-gray-100'
        }`}
        aria-disabled={currentPage === 1}
      >
        <ChevronLeft className="w-5 h-5" />
      </Link>

      {startPage > 1 && (
        <>
          <Link href={`${baseUrl}?page=1`} className="px-4 py-2 rounded-lg hover:bg-gray-100">
            1
          </Link>
          {startPage > 2 && <span className="px-2">...</span>}
        </>
      )}

      {pages.map((page) => (
        <Link
          key={page}
          href={`${baseUrl}?page=${page}`}
          className={`px-4 py-2 rounded-lg transition-colors ${
            page === currentPage
              ? 'bg-primary-600 text-white'
              : 'hover:bg-gray-100'
          }`}
        >
          {page}
        </Link>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2">...</span>}
          <Link
            href={`${baseUrl}?page=${totalPages}`}
            className="px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            {totalPages}
          </Link>
        </>
      )}

      <Link
        href={`${baseUrl}?page=${currentPage + 1}`}
        className={`p-2 rounded-lg transition-colors ${
          currentPage === totalPages
            ? 'text-gray-400 cursor-not-allowed'
            : 'hover:bg-gray-100'
        }`}
        aria-disabled={currentPage === totalPages}
      >
        <ChevronRight className="w-5 h-5" />
      </Link>
    </div>
  );
}