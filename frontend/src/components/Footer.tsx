import Link from 'next/link';
import { Github, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-white font-bold text-lg mb-4">Product Explorer</h3>
            <p className="text-sm mb-4">
              A modern platform for exploring and discovering books from World of Books.
              Built with Next.js, NestJS, and powered by intelligent web scraping.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" 
                 className="hover:text-primary-400 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                 className="hover:text-primary-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="mailto:contact@example.com" className="hover:text-primary-400 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-primary-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary-400 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href={`${process.env.NEXT_PUBLIC_API_URL}/api/docs`} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="hover:text-primary-400 transition-colors">
                  API Documentation
                </a>
              </li>
              <li>
                <a href="https://github.com" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="hover:text-primary-400 transition-colors">
                  GitHub Repository
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Product Explorer. All rights reserved.</p>
          <p className="mt-2 text-xs text-gray-500">
            Data sourced from World of Books. This project respects robots.txt and implements ethical scraping.
          </p>
        </div>
      </div>
    </footer>
  );
}