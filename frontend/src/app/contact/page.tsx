import { Mail, Github, Linkedin } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="container-custom py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
        
        <div className="card p-8 mb-8">
          <p className="text-gray-600 mb-6 text-center">
            Have questions or feedback? We'd love to hear from you!
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Mail className="w-6 h-6 text-primary-600" />
              <div>
                <h3 className="font-semibold">Email</h3>
                <a href="mailto:contact@productexplorer.com" className="text-primary-600 hover:underline">
                  contact@productexplorer.com
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Github className="w-6 h-6 text-primary-600" />
              <div>
                <h3 className="font-semibold">GitHub</h3>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" 
                   className="text-primary-600 hover:underline">
                  View Repository
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Linkedin className="w-6 h-6 text-primary-600" />
              <div>
                <h3 className="font-semibold">LinkedIn</h3>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                   className="text-primary-600 hover:underline">
                  Connect with us
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-8">
          <h2 className="text-2xl font-bold mb-4">API Access</h2>
          <p className="text-gray-600 mb-4">
            Interested in using our API? Check out our comprehensive API documentation.
          </p>
          <a href={`${process.env.NEXT_PUBLIC_API_URL}/api/docs`}
             target="_blank"
             rel="noopener noreferrer"
             className="btn-primary inline-block">
            View API Docs
          </a>
        </div>
      </div>
    </div>
  );
}