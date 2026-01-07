export default function AboutPage() {
  return (
    <div className="container-custom py-12">
      <h1 className="text-4xl font-bold mb-8">About Product Explorer</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-xl text-gray-600 mb-6">
          Product Explorer is a modern web application that helps you discover and explore books from World of Books.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">Features</h2>
        <ul className="space-y-2 text-gray-700">
          <li>Browse thousands of books across multiple categories</li>
          <li>Search products by title or author</li>
          <li>View detailed product information including reviews and ratings</li>
          <li>Discover recommended products based on your interests</li>
          <li>Responsive design that works on all devices</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">Technology Stack</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="card p-6">
            <h3 className="font-bold mb-2">Frontend</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>Next.js 14 (App Router)</li>
              <li>TypeScript</li>
              <li>Tailwind CSS</li>
              <li>TanStack Query</li>
            </ul>
          </div>
          <div className="card p-6">
            <h3 className="font-bold mb-2">Backend</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>NestJS</li>
              <li>PostgreSQL</li>
              <li>TypeORM</li>
              <li>Crawlee + Playwright</li>
            </ul>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">Ethical Scraping</h2>
        <p className="text-gray-700">
          This application respects robots.txt and implements ethical web scraping practices:
        </p>
        <ul className="space-y-2 text-gray-700 mt-4">
          <li>Rate limiting and delays between requests</li>
          <li>Intelligent caching to minimize requests</li>
          <li>Proper error handling and retry logic</li>
          <li>Compliance with website terms of service</li>
        </ul>
      </div>
    </div>
  );
}