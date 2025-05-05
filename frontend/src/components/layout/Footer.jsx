import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-secondary-900 text-white">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <GraduationCap className="h-6 w-6 text-teal-600" />
              <span className="text-xl font-bold">MDAF</span>
            </Link>
            <p className="text-secondary-400 text-sm mt-4 max-w-xs">
              Connecting students with expert tutors for personalized learning experiences that transform education.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-secondary-400 hover:text-teal-600 transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-secondary-400 hover:text-teal-600 transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-secondary-400 hover:text-teal-600 transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-secondary-400 hover:text-teal-600 transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/find-tutors" className="text-secondary-400 hover:text-teal-600 transition-colors">
                  Find Tutors
                </Link>
              </li>
              <li>
                <Link to="/become-tutor" className="text-secondary-400 hover:text-teal-600 transition-colors">
                  Become a Tutor
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-secondary-400 hover:text-teal-600 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-secondary-400 hover:text-teal-600 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/FAQ" className="text-secondary-400 hover:text-teal-600 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/blog" className="text-secondary-400 hover:text-teal-600 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/success-stories" className="text-secondary-400 hover:text-teal-600 transition-colors">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-secondary-400 hover:text-teal-600 transition-colors">
                  Learning Resources
                </Link>
              </li>
              <li>
                <Link to="/webinars" className="text-secondary-400 hover:text-teal-600 transition-colors">
                  Webinars
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-secondary-400 hover:text-teal-600 transition-colors">
                  Support Center
                </Link>
              </li>
            </ul>
          </div> */}

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-teal-600 mt-0.5 mr-2" />
                <span className="text-secondary-400">support@mdafsupport.com</span>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="inline-flex items-center bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md transition-colors text-sm mt-2"
                >
                  Send Message
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-secondary-400 text-sm">
              &copy; {new Date().getFullYear()} EduConnect. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/terms-and-conditions" className="text-sm text-secondary-400 hover:text-teal-600 transition-colors">
                Terms of Service
              </Link>
              <Link to="/privacy-policy" className="text-sm text-secondary-400 hover:text-teal-600 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/cookie-policy" className="text-sm text-secondary-400 hover:text-teal-600 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
