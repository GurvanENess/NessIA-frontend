import React from 'react';
import { Heart, Mail, Phone, MapPin, Instagram, Twitter, Linkedin, Github } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#2E3047] text-white mt-auto">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img
                src="/assets/nessia_logo.svg"
                alt="Nessia"
                className="w-10 h-10 invert brightness-0"
              />
              <img
                src="/assets/nessia_title.svg"
                alt="Nessia"
                className="h-8 invert brightness-0"
              />
            </div>
            <p className="text-gray-300 text-lg leading-relaxed mb-6 max-w-md">
              Créez du contenu captivant avec l'intelligence artificielle. 
              Nessia transforme vos idées en publications engageantes pour tous vos réseaux sociaux.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="p-2 bg-[#7C3AED] hover:bg-[#6D28D9] rounded-lg transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-[#7C3AED] hover:bg-[#6D28D9] rounded-lg transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-[#7C3AED] hover:bg-[#6D28D9] rounded-lg transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-[#7C3AED] hover:bg-[#6D28D9] rounded-lg transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-coolvetica text-white mb-6">Navigation</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="/"
                  className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  Chat IA
                </a>
              </li>
              <li>
                <a
                  href="/posts"
                  className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  Publications
                </a>
              </li>
              <li>
                <a
                  href="/chats"
                  className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  Conversations
                </a>
              </li>
              <li>
                <a
                  href="/post/new"
                  className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  Éditeur
                </a>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h3 className="text-lg font-coolvetica text-white mb-6">Support</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Centre d'aide
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Conditions d'utilisation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Politique de confidentialité
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-600 mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3 text-gray-300">
              <Mail className="w-5 h-5 text-[#7C3AED]" />
              <span>contact@nessia.ai</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <Phone className="w-5 h-5 text-[#7C3AED]" />
              <span>+33 1 23 45 67 89</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <MapPin className="w-5 h-5 text-[#7C3AED]" />
              <span>Paris, France</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-600">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              © {currentYear} Nessia. Tous droits réservés.
            </p>
            <div className="flex items-center gap-1 text-gray-400 text-sm">
              <span>Fait avec</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>par l'équipe Nessia</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;