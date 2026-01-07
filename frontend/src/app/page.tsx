"use client";

import { useQuery } from "@tanstack/react-query";
import { navigationApi } from "@/lib/api";
import Link from "next/link";
import { BookOpen, ChevronRight } from "lucide-react";
import LoadingSkeleton from "@/components/LoadingSkeleton";

export default function Home() {
  const {
    data: navigation,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["navigation"],
    queryFn: () => navigationApi.getAll(),
  });

  if (isLoading) {
    return (
      <div className="container-custom py-12">
        <h1 className="text-4xl font-bold mb-8">Explore Books</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <LoadingSkeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800">
            Failed to load navigation. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-5xl font-bold mb-4 text-gray-900">
          Welcome to Product Explorer
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover thousands of books from World of Books. Browse by category
          and find your next great read.
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-primary-600" />
          Browse Categories
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
        {navigation?.map((item) => (
          <Link
            key={item.id}
            href={`/category/${item.id}`}
            className="card group p-6 hover:border-primary-500 border-2 border-transparent transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500">
                  Click to explore categories
                </p>
              </div>
              <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        ))}
      </div>

      {(!navigation || navigation.length === 0) && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No categories available at the moment.
          </p>
        </div>
      )}
    </div>
  );
}
