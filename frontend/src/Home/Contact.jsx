"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"
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
  Contact2,
} from "lucide-react"
import ShinyButton from "../blocks/TextAnimations/ShinyButton/ShinyButton";
import { MdSupportAgent } from "react-icons/md";

const Contact = () => {
  const { t } = useTranslation()
  const langue = localStorage.getItem('lang');
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

  const contactTabs = [
    {
      id: "contact",
      label: t("contact.general"),
      icon: <MessageSquare className="h-5 w-5" />,
      email: "contact@votreentreprise.com",
      phone: "+33 1 23 45 67 89",
    },
    {
      id: "support",
      label: t("contact.support"),
      icon: <HelpCircle className="h-5 w-5" />,
      email: "support@votreentreprise.com",
      phone: "+33 1 23 45 67 90",
    },
    {
      id: "sales",
      label: t("contact.sales"),
      icon: <Building className="h-5 w-5" />,
      email: "sales@votreentreprise.com",
      phone: "+33 1 23 45 67 91",
    },
    {
      id: "careers",
      label: t("contact.careers"),
      icon: <Users className="h-5 w-5" />,
      email: "careers@votreentreprise.com",
      phone: "+33 1 23 45 67 92",
    },
  ]

  const activeTabData = contactTabs.find((tab) => tab.id === activeTab)

  return (
    <section className="py-12 md:py-20 px-4 bg-gradient-to-b from-white to-[#f9f7ff]">
      <div className="max-w-7xl mx-auto">
        {/* En-tête de la section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="text-center mb-12 md:mb-16"
        >
          <motion.div variants={itemVariants} className="inline-block">
           
            <div className="bg-[#E5E7EB] gap-1 text-[#6D28D9] flex p-2 rounded-xl items-center">
              <MdSupportAgent className="w-5 h-5" />
              <h1 className="text-sm sm:text-base"> {t("contact.title")}</h1>
            </div>
          </motion.div>
          <motion.h2
            variants={itemVariants}
            className="mt-4 md:mt-6 text-3xl md:text-5xl font-bold text-gray-900 tracking-tight"
          >
            {t("contact.subtitle")} <span className="text-[#6D28D9]">{t("contact.project")}</span>
          </motion.h2>
          <motion.p variants={itemVariants} className="mt-4 md:mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {t("contact.description")}
          </motion.p>
        </motion.div>

        {/* Onglets de contact */}
        <div className="mb-8 md:mb-12">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {contactTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 md:px-4 py-2 md:py-3 rounded-full transition-colors text-sm md:text-base ${activeTab === tab.id ? "bg-[#6D28D9] text-white" : "bg-white text-gray-700 hover:bg-[#c8c2fd]/20"
                  }`}
              >
                <span className={` ${langue === "ar" ? "ml-2" : "mr-2"}	 ${activeTab === tab.id ? "text-white" : "text-[#6D28D9]"}`}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        {/* Contenu principal */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Formulaire de contact */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-white h-full rounded-2xl shadow border border-[#c8c2fd] p-6 md:p-8 "
          >
            <div className="flex items-center mb-6">
              {activeTabData?.icon && (
                <div className={`bg-[#c8c2fd]/20 p-2 rounded-full ${langue === "ar" ? "ml-3" : "mr-3"}`}>
                  <span className="text-[#6D28D9]">{activeTabData.icon}</span>
                </div>
              )}
              <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                {activeTab === "contact" && t("contact.form.title")}
                {activeTab === "support" && t("contact.form.support")}
                {activeTab === "sales" && t("contact.form.sales")}
                {activeTab === "careers" && t("contact.form.careers")}
              </h3>
            </div>

            {formStatus === "success" ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-green-800 mb-2">{t("contact.form.success.title")}</h4>
                <p className="text-green-700 mb-4">{t("contact.form.success.message")}</p>
                <button onClick={() => setFormStatus("idle")} className="text-[#6D28D9]  font-medium hover:underline">
                  {t("contact.form.success.button")}
                </button>
              </div>
            ) : formStatus === "error" ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-red-800 mb-2">{t("contact.form.error.title")}</h4>
                <p className="text-red-700 mb-4">{t("contact.form.error.message")}</p>
                <button onClick={() => setFormStatus("idle")} className="text-[#6D28D9] font-medium hover:underline">
                  {t("contact.form.error.button")}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      {t("contact.form.name")}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 outline-none rounded-lg border border-gray-300  focus:border-[#6D28D9] transition-colors"
                      placeholder={t("contact.form.namePlaceholder")}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      {t("contact.form.email")}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      required
                      className="w-full outline-none px-4 py-3 rounded-lg border border-gray-300  focus:border-[#6D28D9] transition-colors"
                      placeholder={t("contact.form.emailPlaceholder")}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    {t("contact.form.subject")}
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formState.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300  focus:border-[#6D28D9] outline-0 transition-colors"
                  >
                    <option value="">{t("contact.form.subjectPlaceholder")}</option>
                    {activeTab === "contact" && (
                      <>
                        <option value="information">{t("contact.form.subjects.information")}</option>
                        <option value="devis">{t("contact.form.subjects.quote")}</option>
                        <option value="autre">{t("contact.form.subjects.other")}</option>
                      </>
                    )}
                    {activeTab === "support" && (
                      <>
                        <option value="bug">{t("contact.form.subjects.bug")}</option>
                        <option value="question">{t("contact.form.subjects.question")}</option>
                        <option value="compte">{t("contact.form.subjects.account")}</option>
                      </>
                    )}
                    {activeTab === "sales" && (
                      <>
                        <option value="demo">{t("contact.form.subjects.demo")}</option>
                        <option value="tarifs">{t("contact.form.subjects.pricing")}</option>
                        <option value="enterprise">{t("contact.form.subjects.enterprise")}</option>
                      </>
                    )}
                    {activeTab === "careers" && (
                      <>
                        <option value="emploi">{t("contact.form.subjects.job")}</option>
                        <option value="stage">{t("contact.form.subjects.internship")}</option>
                        <option value="spontanee">{t("contact.form.subjects.spontaneous")}</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    {t("contact.form.message")}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 overflow-hidden resize-none rounded-lg border border-gray-300  focus:border-[#6D28D9] outline-none transition-colors"
                    placeholder={
                      activeTab === "support"
                        ? t("contact.form.messagePlaceholder.support")
                        : activeTab === "careers"
                          ? t("contact.form.messagePlaceholder.careers")
                          : t("contact.form.messagePlaceholder.default")
                    }
                  ></textarea>
                </div>

                <div className="pt-2">
                  <ShinyButton rounded={true} className="w-full sm:w-auto">
                    {formStatus === "loading" ? t("contact.form.sending") : t("contact.form.send")}
                    <Send className="ml-2 h-4 w-4" />
                  </ShinyButton>
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
            className="space-y-6 md:space-y-8"
          >
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">{t("contact.info.title")}</h3>
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-start">
                  <div className={`bg-[#c8c2fd]/20 p-3 rounded-full ${langue === "ar" ? "ml-4" : "mr-4"}  flex-shrink-0`}>
                    <Mail className="h-5 w-5 text-[#6D28D9]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{t("contact.info.email")}</h4>
                    <a
                      href={`mailto:${activeTabData?.email}`}
                      className="text-gray-600 hover:text-[#6D28D9] transition-colors"
                    >
                      {activeTabData?.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className={`bg-[#c8c2fd]/20 p-3 rounded-full ${langue === "ar" ? "ml-4" : "mr-4"} flex-shrink-0`}>
                    <Phone className="h-5 w-5 text-[#6D28D9]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{t("contact.info.phone")}</h4>
                    <a
                      href={`tel:${activeTabData?.phone?.replace(/\s/g, "")}`}
                      className="text-gray-600 hover:text-[#6D28D9] transition-colors"
                    >
                      {activeTabData?.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className={`bg-[#c8c2fd]/20 p-3 rounded-full ${langue === "ar" ? "ml-4" : "mr-4"} flex-shrink-0`}>
                    <MapPin className="h-5 w-5 text-[#6D28D9]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{t("contact.info.address")}</h4>
                    <a
                      href="https://maps.google.com/?q=123+Avenue+des+Champs-Élysées,+75008+Paris,+France"
                      target="_blank"
                      rel="noreferrer"
                      className="text-gray-600 hover:text-[#6D28D9] transition-colors"
                    >
                      {t("contact.info.addressValue")}
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className={`bg-[#c8c2fd]/20 p-3 rounded-full ${langue === "ar" ? "ml-4" : "mr-4"} flex-shrink-0`}>
                    <Clock className="h-5 w-5 text-[#6D28D9]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{t("contact.info.hours")}</h4>
                    <p className="text-gray-600">{t("contact.info.hoursValue")}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full grid gap-2  ">
              {/* Réseaux sociaux */}

              {/* FAQ rapide */}
              <div className="bg-white rounded-xl w-full p-6 shadow border border-[#c8c2fd]">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">{t("contact.faq.title")}</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-[#6D28D9]">{t("contact.faq.responseTime")}</h4>
                    <p className="text-sm text-gray-600">{t("contact.faq.responseTimeValue")}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#6D28D9]">{t("contact.faq.demo")}</h4>
                    <p className="text-sm text-gray-600">{t("contact.faq.demoValue")}</p>
                  </div>
                  <a href="#" className="text-sm font-medium text-[#6D28D9] hover:underline inline-block mt-2">
                    {t("contact.faq.seeAll")}
                  </a>
                </div>
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
          className="mt-12 md:mt-20 bg-gradient-to-r from-[#6D28D9] to-[#5b21b6] rounded-2xl p-6 md:p-12 text-white"
        >
          <div className="md:flex items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h3 className="text-xl md:text-2xl font-bold mb-2">{t("contact.newsletter.title")}</h3>
              <p className="text-white/80">{t("contact.newsletter.description")}</p>
            </div>
            <div className="flex-shrink-0 w-full md:w-auto">
              <form className="flex">
                <input
                  type="email"
                  placeholder={t("contact.newsletter.placeholder")}
                  className={`${langue === "ar" ? "rounded-r-lg" : "rounded-l-lg"} px-4 py-3 bg-white  w-full md:w-64 focus:outline-none text-gray-800`}
                />
                <button
                  type="submit"
                  className={`${langue === "ar" ? "rounded-l-lg" : "rounded-r-lg"} px-4 py-3 bg-[#4C1D95] hover:bg-[#3b1a74] text-white font-medium transition-colors`}
                >
                  {t("contact.newsletter.button")}
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
