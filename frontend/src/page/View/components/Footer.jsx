import { Link, useParams } from "react-router-dom"
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react"
import { useEffect, useState } from "react"
import axios from "axios"
import { FaPaypal } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { getUserId } from "../../utils/auth";

export default function Footer() {
  const { t } = useTranslation();
  const id = localStorage.getItem("IDBoutique");
  const userId = getUserId();
  const ownerId = localStorage.getItem("idOwner");
  const [boutique, setBoutique] = useState(null);
  const [owner, setOwner] = useState(null);
  
  useEffect(() => {
    axios.get(`https://stylish-basket-710b77de8f.strapiapp.com/api/boutiques/${id}?filters[owner][id][$eq]=${ownerId}&populate=*`)
      .then((res) => {
        setBoutique(res.data.data)
        setOwner(res.data.data.owner)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  return (
    <footer className="bg-[#1e3a8a] text-gray-300">
      <div className="container px-4 sm:px-15 mx-auto px-4 py-12">
        <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4  ">
              <img src={`${boutique?.logo?.url}`} alt="" className="w-10 h-10 rounded-full" />
              <h3 className="text-white font-semibold text-lg "> {boutique?.nom}</h3>
            </div>
            <p className="text-sm mb-4">
              {boutique?.description}
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
            <h3 className="text-white font-semibold text-lg mb-4">{t('view.footer.quickLinks')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  {t('view.footer.aboutUs')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  {t('view.footer.contactUs')}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  {t('view.footer.terms')}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  {t('view.footer.privacy')}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  {t('view.footer.faq')}
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-white transition-colors">
                  {t('view.footer.shipping')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">{t('view.footer.contact')}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-purple-400 flex-shrink-0" />
                {
                  boutique?.location.map((e, index) =>
                    <span key={index}>{e.addressLine1 || e.addressLine2 || ''}, {e.postalCode || ''} {e.city || ''}, {e.country || ''}</span>
                  )
                }
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-purple-400 flex-shrink-0" />
                <span>{owner?.phone || 'no number'}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-purple-400 flex-shrink-0" />
                <span>{owner?.email}</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">{t('view.footer.newsletter')}</h3>
            <p className="text-sm mb-4">
              {t('view.footer.newsletterDesc')}
            </p>
            <div className="space-y-3">
              <input
                type="email"
                placeholder={t('view.footer.emailPlaceholder')}
                className="w-full bg-[#1e3a8a] border-2 border-purple-500 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              <button className="w-full bg-purple-700 hover:bg-purple-800 text-white py-2 px-4 rounded-md">
                {t('view.footer.subscribe')}
              </button>
            </div>
          </div>
        </div>

        <hr className="my-8 border-purple-500" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">&copy; {boutique?.createdAt.split('-')[0]} {boutique?.nom}. {t('view.footer.rights')}</p>
          <div className="flex items-center gap-4">
           <Link to={`/view/${boutique?.documentId}`}>
           <FaPaypal className="h-6 w-6 text-purple-400" />  
           </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
