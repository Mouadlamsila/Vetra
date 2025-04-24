import {Link} from "react-router-dom"
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container px-15 mx-auto px-4 py-12">
        <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">À propos de ShopEase</h3>
            <p className="text-sm mb-4">
              ShopEase est votre destination en ligne pour des produits de qualité à des prix compétitifs. Nous
              proposons une large gamme de produits électroniques, de mode et d'articles pour la maison.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Liens rapides</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  À propos de nous
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contactez-nous
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Conditions générales
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-white transition-colors">
                  Informations de livraison
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-purple-400 flex-shrink-0" />
                <span>123 Rue du Commerce, 75001 Paris, France</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-purple-400 flex-shrink-0" />
                <span>+33 1 23 45 67 89</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-purple-400 flex-shrink-0" />
                <span>contact@shopease.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Newsletter</h3>
            <p className="text-sm mb-4">
              Inscrivez-vous à notre newsletter pour recevoir les dernières offres et promotions.
            </p>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="w-full bg-gray-800 border-gray-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              <button className="w-full bg-purple-700 hover:bg-purple-800 text-white py-2 px-4 rounded-md">
                S'abonner
              </button>
            </div>
          </div>
        </div>

        <hr className="my-8 border-gray-800" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">&copy; {new Date().getFullYear()} ShopEase. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <img src="/placeholder.svg?height=24&width=38" alt="Visa" className="h-6" />
            <img src="/placeholder.svg?height=24&width=38" alt="Mastercard" className="h-6" />
            <img src="/placeholder.svg?height=24&width=38" alt="PayPal" className="h-6" />
            <img src="/placeholder.svg?height=24&width=38" alt="Apple Pay" className="h-6" />
          </div>
        </div>
      </div>
    </footer>
  )
}
