"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Star, ChevronRight, Users, Award, Clock, Globe, CheckCircle, Brain, Rocket, Sparkles, TrendingUp, Lightbulb, Target, ChevronLeft } from "lucide-react"
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";

const AboutSection = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("mission")
  const role = localStorage.getItem("role");

  // Team members data
  const teamMembers = [
    {
      name: "Sophie Martin",
      role: t('founderCEO'),
      bio: t('sophieBio'),
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "Thomas Dubois",
      role: t('techDirector'),
      bio: t('thomasBio'),
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "Emma Leclerc",
      role: t('marketingDirector'),
      bio: t('emmaBio'),
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "Lucas Bernard",
      role: t('designLead'),
      bio: t('lucasBio'),
      image: "/placeholder.svg?height=300&width=300",
    },
  ]

  // Timeline events data
  const timelineEvents = [
    {
      year: "2018",
      title: t('foundation'),
      description: t('foundationDesc'),
      icon: <Rocket className="sm:block hidden h-6 w-6 text-white" />,
    },
    {
      year: "2019",
      title: t('firstProduct'),
      description: t('firstProductDesc'),
      icon: <Sparkles className="sm:block hidden h-6 w-6 text-white" />,
    },
    {
      year: "2020",
      title: t('expansion'),
      description: t('expansionDesc'),
      icon: <Globe className="sm:block hidden h-6 w-6 text-white" />,
    },
    {
      year: "2021",
      title: t('funding'),
      description: t('fundingDesc'),
      icon: <TrendingUp className="sm:block hidden h-6 w-6 text-white" />,
    },
    {
      year: "2022",
      title: t('innovation'),
      description: t('innovationDesc'),
      icon: <Lightbulb className="sm:block hidden h-6 w-6 text-white" />,
    },
    {
      year: "2023",
      title: t('today'),
      description: t('todayDesc'),
      icon: <Target className="sm:block hidden h-6 w-6 text-white" />,
    },
  ]

  // Animation variants for Framer Motion
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
  const language = localStorage.getItem("lang");

  return (
    <section className="py-20 px-4  bg-white ">
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
            <div className="bg-[#E5E7EB] gap-1 text-[#6D28D9] flex p-2 rounded-xl items-center">
              <Brain className="w-5 h-5" />
              <h1 className="text-sm sm:text-base">{t('aboutUs')}</h1>
            </div>
          </motion.div>
          <motion.h2
            variants={itemVariants}
            className="mt-6 text-4xl md:text-5xl font-bold text-gray-900 tracking-tight"
          >
            {t('transformIdeas')}
          </motion.h2>
          <motion.p variants={itemVariants} className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            {t('companyVision')}
          </motion.p>
        </motion.div>

        {/* Onglets */}
        <div className="mb-16">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {["mission", "team", "history", "testimonials"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab
                    ? "border-[#6D28D9] text-[#6D28D9]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                >
                  {tab === "mission"
                    ? t('ourMission')
                    : tab === "team"
                      ? t('ourTeam')
                      : tab === "history"
                        ? t('ourHistory')
                        : t('testimonials')}
                </button>
              ))}
            </nav>
          </div>

          {/* Contenu des onglets */}
          <div className="mt-8">
            {/* Onglet Mission */}
            {activeTab === "mission" && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="grid md:grid-cols-2 gap-12"
              >
                <motion.div variants={itemVariants}>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('missionTitle')}</h3>
                  <p className="text-gray-600 mb-6">
                    {t('missionText')}
                  </p>
                  <p className="text-gray-600 mb-8">
                    {t('missionText2')}
                  </p>
                  <ul className="space-y-3">
                    {[
                      t('constantInnovation'),
                      t('executionExcellence'),
                      t('uncompromisingIntegrity'),
                      t('measurableImpact'),
                    ].map((value, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className={`h-5 w-5 text-[#6D28D9] ${language==='ar' ? 'ml-2':'mr-2'}  flex-shrink-0 mt-0.5`} />
                        <span className="text-gray-700">{value}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
                <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="bg-[#6D28D9] px-6 py-8 text-white">
                    <h3 className="text-xl font-bold mb-2">{t('ourVision')}</h3>
                    <p className="text-white/80">
                      {t('visionText')}
                    </p>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#c8c2fd]/10 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Users className={`${language === "ar" ? "ml-2" : "mr-2"} h-5 w-5 text-[#6D28D9]`} />
                          <h4 className="font-medium text-gray-900">{t('humanCentered')}</h4>
                        </div>
                        <p className="text-sm text-gray-600">
                          {t('humanCenteredDesc')}
                        </p>
                      </div>
                      <div className="bg-[#c8c2fd]/10 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Award className={`${language === "ar" ? "ml-2" : "mr-2"} h-5 w-5 text-[#6D28D9] `} />
                          <h4 className="font-medium text-gray-900">{t('premiumQuality')}</h4>
                        </div>
                        <p className="text-sm text-gray-600">
                          {t('premiumQualityDesc')}
                        </p>
                      </div>
                      <div className="bg-[#c8c2fd]/10 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Clock className={`${language === "ar" ? "ml-2" : "mr-2"} h-5 w-5 text-[#6D28D9] `} />
                          <h4 className="font-medium text-gray-900">{t('agility')}</h4>
                        </div>
                        <p className="text-sm text-gray-600">
                          {t('agilityDesc')}
                        </p>
                      </div>
                      <div className="bg-[#c8c2fd]/10 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Globe className={`${language === "ar" ? "ml-2" : "mr-2"} h-5 w-5 text-[#6D28D9] `} />
                          <h4 className="font-medium text-gray-900">{t('globalImpact')}</h4>
                        </div>
                        <p className="text-sm text-gray-600">
                          {t('globalImpactDesc')}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Onglet Équipe */}
            {activeTab === "team" && (
              <motion.div initial="hidden" animate="visible" variants={containerVariants}>
                <motion.div variants={itemVariants} className="text-center mb-12">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('ourTeam')}</h3>
                  <p className="text-gray-600 max-w-3xl mx-auto">
                    {t('teamDescription')}
                  </p>
                </motion.div>
                <motion.div variants={containerVariants} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {teamMembers.map((member, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg"
                    >
                      <div className="h-64 relative">
                        <img
                          src={member.image || "/placeholder.svg"}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <h4 className="text-lg font-bold text-gray-900">{member.name}</h4>
                        <p className="text-[#6D28D9] font-medium mb-3">{member.role}</p>
                        <p className="text-gray-600 text-sm">{member.bio}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* Onglet Histoire */}
            {activeTab === "history" && (
              <motion.div initial="hidden" animate="visible" variants={containerVariants}>
                <motion.div variants={itemVariants} className="text-center mb-12">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('ourHistory')}</h3>
                  <p className="text-gray-600 max-w-3xl mx-auto">
                    {t('historyDescription')}
                  </p>
                </motion.div>
                <div className="relative">
                  {/* Ligne verticale */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-[#c8c2fd]"></div>

                  <motion.div variants={containerVariants} className="relative z-10">
                    {timelineEvents.map((event, index) => (
                      <motion.div
                        key={index}
                        variants={itemVariants}
                        className={`mb-12 flex items-center ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                          } md:flex-row-reverse md:even:flex-row`}
                      >
                        <div
                          className={`w-full md:w-1/2 px-4 md:px-8 ${index % 2 === 0 ? "text-right" : "text-left"} md:text-left md:even:text-right`}
                        >
                          <span className="inline-block bg-[#c8c2fd] text-[#6D28D9] text-sm font-medium px-3 py-1 rounded-full mb-2">
                            {event.year}
                          </span>
                          <h4 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h4>
                          <p className="text-gray-600">{event.description}</p>
                        </div>
                        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                          <div className="sm:h-10 sm:w-10 h-3 w-3 rounded-full bg-[#6D28D9] sm:border-4 border border-white shadow flex items-center justify-center">
                            {event.icon}
                          </div>
                        </div>
                        <div className="w-full md:w-1/2"></div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Onglet Témoignages */}
            {activeTab === "testimonials" && (
              <motion.div initial="hidden" animate="visible" variants={containerVariants}>
                <motion.div variants={itemVariants} className="text-center mb-12">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('testimonials')}</h3>
                  <p className="text-gray-600 max-w-3xl mx-auto">
                    {t('testimonialsDescription')}
                  </p>
                </motion.div>
                <motion.div variants={containerVariants} className="grid md:grid-cols-3 gap-8">
                  {[
                    {
                      quote: t('testimonial1'),
                      author: "Marie Dupont",
                      company: "Directrice, Innovatech",
                      rating: 5,
                    },
                    {
                      quote: t('testimonial2'),
                      author: "Jean Leroy",
                      company: "Fondateur, TechSolutions",
                      rating: 5,
                    },
                    {
                      quote: t('testimonial3'),
                      author: "Claire Moreau",
                      company: "CMO, GlobalVision",
                      rating: 4,
                    },
                  ].map((testimonial, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className="bg-white p-6 rounded-xl shadow-md relative"
                    >

                      <div className={`absolute top-6 ${language === "ar" ? "left-3" : "right-3"}  text-[#c8c2fd] text-4xl font-serif`}>"</div>
                      <p className="text-gray-700 mb-6 relative z-10">{testimonial.quote}</p>
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-full bg-[#c8c2fd]/30 flex items-center justify-center text-[#6D28D9] font-bold">
                          {testimonial.author.charAt(0)}
                        </div>
                        <div className={`${language === "ar" ? "mr-4" : "ml-4"}`}>
                          <p className="font-medium text-gray-900">{testimonial.author}</p>
                          <p className="text-sm text-gray-500">{testimonial.company}</p>
                          <div className="flex mt-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                  }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Appel à l'action */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="bg-gradient-to-r from-[#6D28D9] to-[#5b21b6] rounded-2xl p-8 md:p-12 text-center text-white mt-16"
        >
          <motion.h3 variants={itemVariants} className="text-2xl md:text-3xl  font-bold mb-4">
            {t('readyToTransform')}
          </motion.h3>
          <motion.p variants={itemVariants} className="text-white/80 max-w-2xl mx-auto mb-8">
            {t('joinUsers')}
          </motion.p>
          <motion.div variants={itemVariants}>
            {
              role === "User" ? <Link to={'/to-owner'} >
                <button className="bg-white text-[#6D28D9] px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-all duration-300">
                  {t('startNow')} {language === "ar" ? <ChevronLeft className="ml-2 h-5 w-5 inline" /> : <ChevronRight className="ml-2 h-5 w-5 inline" />}
                </button>
              </Link> :
                <Link to={'/controll'} >
                  <button className="bg-white text-[#6D28D9] px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-all duration-300">
                    {t('startNow')} {language === "ar" ? <ChevronLeft className="ml-2 h-5 w-5 inline" /> : <ChevronRight className="ml-2 h-5 w-5 inline" />}
                  </button>
                </Link>
            }
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default AboutSection
