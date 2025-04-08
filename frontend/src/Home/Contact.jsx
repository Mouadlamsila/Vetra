"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  HelpCircle,
  Building,
  Users,
} from "lucide-react"
import EnhancedShinyButton from "./EnhancedShinyButton"

const Contact = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [formStatus, setFormStatus] = useState("idle")
  const [activeTab, setActiveTab] = useState("contact")

  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormStatus("loading")

    // Simuler un envoi de formulaire
    setTimeout(() => {
      // 90% de chance de succès pour la démo
      if (Math.random() > 0.1) {
        setFormStatus("success")
        setFormState({
          name: "",
          email: "",
          subject: "",
          message: "",
        })
      } else {
        setFormStatus("error")
      }
    }, 1500)
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  const contactInfo = [
    {
      icon: <Mail className="h-5 w-5 text-[#6D28D9]" />,
      title: "Email",
      details: "contact@votreentreprise.com",
      action: "mailto:contact@votreentreprise.com",
    },
    {
      icon: <Phone className="h-5 w-5 text-[#6D28D9]" />,
      title: "Téléphone",
      details: "+33 1 23 45 67 89",
      action: "tel:+33123456789",
    },
    {
      icon: <MapPin className="h-5 w-5 text-[#6D28D9]" />,
      title: "Adresse",
      details: "123 Avenue des Champs-Élysées, 75008 Paris, France",
      action: "https://maps.google.com/?q=123+Avenue+des+Champs-Élysées,+75008+Paris,+France",
    },
    {
      icon: <Clock className="h-5 w-5 text-[#6D28D9]" />,
      title: "Heures d'ouverture",
      details: "Lun-Ven: 9h-18h | Sam: 10h-15h",
    },
  ]

  const socialLinks = [
    { icon: <Linkedin className="h-5 w-5" />, url: "https://linkedin.com", name: "LinkedIn" },
    { icon: <Twitter className="h-5 w-5" />, url: "https://twitter.com", name: "Twitter" },
    { icon: <Facebook className="h-5 w-5" />, url: "https://facebook.com", name: "Facebook" },
    { icon: <Instagram className="h-5 w-5" />, url: "https://instagram.com", name: "Instagram" },
    { icon: <Youtube className="h-5 w-5" />, url: "https://youtube.com", name: "YouTube" },
  ]

  const contactTabs = [
    {
      id: "contact",
      label: "Contact général",
      icon: <MessageSquare className="h-5 w-5" />,
      email: "contact@votreentreprise.com",
      phone: "+33 1 23 45 67 89",
    },
    {
      id: "support",
      label: "Support technique",
      icon: <HelpCircle className="h-5 w-5" />,
      email: "support@votreentreprise.com",
      phone: "+33 1 23 45 67 90",
    },
    {
      id: "sales",
      label: "Ventes",
      icon: <Building className="h-5 w-5" />,
      email: "sales@votreentreprise.com",
      phone: "+33 1 23 45 67 91",
    },
    {
      id: "careers",
      label: "Carrières",
      icon: <Users className="h-5 w-5" />,
      email: "careers@votreentreprise.com",
      phone: "+33 1 23 45 67 92",
    },
  ]

  const activeTabData = contactTabs.find((tab) => tab.id === activeTab)

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-[#f9f7ff]">
      <div className="max-w-7xl mx-auto">
        {/* En-tête de la section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.div variants={itemVariants} className="inline-block">
            <span className="bg-[#c8c2fd]/30 text-[#6D28D9] text-sm font-medium px-4 py-1.5 rounded-full">
              Contactez-nous
            </span>
          </motion.div>
          <motion.h2
            variants={itemVariants}
            className="mt-6 text-4xl md:text-5xl font-bold text-gray-900 tracking-tight"
          >
            Discutons de votre <span className="text-[#6D28D9]">projet</span>
          </motion.h2>
          <motion.p variants={itemVariants} className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Nous sommes là pour répondre à vos questions et vous aider à transformer vos idées en réalité.
          </motion.p>
        </motion.div>

        {/* Onglets de contact */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {contactTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-3 rounded-full transition-colors ${
                  activeTab === tab.id ? "bg-[#6D28D9] text-white" : "bg-white text-gray-700 hover:bg-[#c8c2fd]/20"
                }`}
              >
                <span className={`mr-2 ${activeTab === tab.id ? "text-white" : "text-[#6D28D9]"}`}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contenu principal */}
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Formulaire de contact */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="flex items-center mb-6">
              {activeTabData?.icon && (
                <div className="bg-[#c8c2fd]/20 p-2 rounded-full mr-3">
                  <span className="text-[#6D28D9]">{activeTabData.icon}</span>
                </div>
              )}
              <h3 className="text-2xl font-bold text-gray-900">
                {activeTab === "contact" && "Envoyez-nous un message"}
                {activeTab === "support" && "Demande de support"}
                {activeTab === "sales" && "Contact commercial"}
                {activeTab === "careers" && "Rejoignez notre équipe"}
              </h3>
            </div>

            {formStatus === "success" ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-green-800 mb-2">Message envoyé avec succès !</h4>
                <p className="text-green-700 mb-4">
                  Merci de nous avoir contactés. Notre équipe vous répondra dans les plus brefs délais.
                </p>
                <button onClick={() => setFormStatus("idle")} className="text-[#6D28D9] font-medium hover:underline">
                  Envoyer un autre message
                </button>
              </div>
            ) : formStatus === "error" ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-red-800 mb-2">Une erreur est survenue</h4>
                <p className="text-red-700 mb-4">
                  Nous n'avons pas pu envoyer votre message. Veuillez réessayer ou nous contacter directement.
                </p>
                <button onClick={() => setFormStatus("idle")} className="text-[#6D28D9] font-medium hover:underline">
                  Réessayer
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nom complet
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6D28D9]/20 focus:border-[#6D28D9] transition-colors"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6D28D9]/20 focus:border-[#6D28D9] transition-colors"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Sujet
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formState.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6D28D9]/20 focus:border-[#6D28D9] transition-colors"
                  >
                    <option value="">Sélectionnez un sujet</option>
                    {activeTab === "contact" && (
                      <>
                        <option value="information">Demande d'information</option>
                        <option value="devis">Demande de devis</option>
                        <option value="autre">Autre</option>
                      </>
                    )}
                    {activeTab === "support" && (
                      <>
                        <option value="bug">Signaler un bug</option>
                        <option value="question">Question technique</option>
                        <option value="compte">Problème de compte</option>
                      </>
                    )}
                    {activeTab === "sales" && (
                      <>
                        <option value="demo">Demande de démonstration</option>
                        <option value="tarifs">Informations tarifaires</option>
                        <option value="enterprise">Solutions entreprise</option>
                      </>
                    )}
                    {activeTab === "careers" && (
                      <>
                        <option value="emploi">Offre d'emploi</option>
                        <option value="stage">Stage</option>
                        <option value="spontanee">Candidature spontanée</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6D28D9]/20 focus:border-[#6D28D9] transition-colors"
                    placeholder={
                      activeTab === "support"
                        ? "Décrivez votre problème en détail..."
                        : activeTab === "careers"
                          ? "Parlez-nous de vous et de vos motivations..."
                          : "Comment pouvons-nous vous aider ?"
                    }
                  ></textarea>
                </div>

                <div className="pt-2">
                  <EnhancedShinyButton
                    type="submit"
                    fullWidth
                    loading={formStatus === "loading"}
                    disabled={formStatus === "loading"}
                  >
                    {formStatus === "loading" ? "Envoi en cours..." : "Envoyer le message"}
                    <Send className="ml-2 h-4 w-4" />
                  </EnhancedShinyButton>
                </div>
              </form>
            )}
          </motion.div>

          {/* Informations de contact */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Nos coordonnées</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-[#c8c2fd]/20 p-3 rounded-full mr-4 flex-shrink-0">
                    <Mail className="h-5 w-5 text-[#6D28D9]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Email</h4>
                    <a
                      href={`mailto:${activeTabData?.email}`}
                      className="text-gray-600 hover:text-[#6D28D9] transition-colors"
                    >
                      {activeTabData?.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#c8c2fd]/20 p-3 rounded-full mr-4 flex-shrink-0">
                    <Phone className="h-5 w-5 text-[#6D28D9]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Téléphone</h4>
                    <a
                      href={`tel:${activeTabData?.phone?.replace(/\s/g, "")}`}
                      className="text-gray-600 hover:text-[#6D28D9] transition-colors"
                    >
                      {activeTabData?.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#c8c2fd]/20 p-3 rounded-full mr-4 flex-shrink-0">
                    <MapPin className="h-5 w-5 text-[#6D28D9]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Adresse</h4>
                    <a
                      href="https://maps.google.com/?q=123+Avenue+des+Champs-Élysées,+75008+Paris,+France"
                      target="_blank"
                      rel="noreferrer"
                      className="text-gray-600 hover:text-[#6D28D9] transition-colors"
                    >
                      123 Avenue des Champs-Élysées, 75008 Paris, France
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#c8c2fd]/20 p-3 rounded-full mr-4 flex-shrink-0">
                    <Clock className="h-5 w-5 text-[#6D28D9]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Heures d'ouverture</h4>
                    <p className="text-gray-600">Lun-Ven: 9h-18h | Sam: 10h-15h</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Carte */}
            <div className="rounded-xl overflow-hidden shadow-lg h-64 relative">
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                <div className="text-center p-4">
                  <MapPin className="h-8 w-8 text-[#6D28D9] mx-auto mb-2" />
                  <p className="text-gray-600">Carte interactive disponible sur votre site web</p>
                </div>
              </div>
            </div>

            {/* Réseaux sociaux */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Suivez-nous</h3>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-white p-3 rounded-full shadow-sm hover:shadow-md transition-shadow hover:bg-[#c8c2fd]/10"
                    aria-label={`Visitez notre page ${social.name}`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* FAQ rapide */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Questions fréquentes</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-[#6D28D9]">Quel est le délai de réponse ?</h4>
                  <p className="text-sm text-gray-600">Nous répondons généralement dans les 24 heures ouvrables.</p>
                </div>
                <div>
                  <h4 className="font-medium text-[#6D28D9]">Proposez-vous des démonstrations ?</h4>
                  <p className="text-sm text-gray-600">
                    Oui, nous proposons des démonstrations personnalisées de nos solutions.
                  </p>
                </div>
                <a href="#" className="text-sm font-medium text-[#6D28D9] hover:underline inline-block mt-2">
                  Voir toutes les FAQ
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bannière newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-20 bg-gradient-to-r from-[#6D28D9] to-[#5b21b6] rounded-2xl p-8 md:p-12 text-white"
        >
          <div className="md:flex items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h3 className="text-2xl font-bold mb-2">Restez informé</h3>
              <p className="text-white/80">
                Abonnez-vous à notre newsletter pour recevoir nos dernières actualités et offres spéciales.
              </p>
            </div>
            <div className="flex-shrink-0 w-full md:w-auto">
              <form className="flex">
                <input
                  type="email"
                  placeholder="Votre adresse email"
                  className="px-4 py-3 rounded-l-lg w-full md:w-64 focus:outline-none text-gray-800"
                />
                <button
                  type="submit"
                  className="bg-[#4C1D95] hover:bg-[#3b1a74] px-4 py-3 rounded-r-lg text-white font-medium transition-colors"
                >
                  S'abonner
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Contact
