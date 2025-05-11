"use client"

import { useState } from "react"
import { Save, Globe, Bell, Shield, Palette, SettingsIcon } from "lucide-react"

// Mock data for settings
const initialSettings = {
  site_name: "Marketplace Admin",
  site_description: "Plateforme de gestion pour la marketplace",
  logo_url: "https://example.com/logo.svg",
  primary_color: "#6366f1",
  currency: "EUR",
}

export default function Settings() {
  const [form, setForm] = useState(initialSettings)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("general")

  const handleInputChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSaveSettings = (event) => {
    event.preventDefault()
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      alert("Paramètres sauvegardés avec succès")
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Paramètres</h1>
          <p className="text-gray-500">Configurer les paramètres globaux du site</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="md:w-64 flex-shrink-0 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4">
            <div className="flex flex-col space-y-1">
              <button
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${activeTab === "general" ? "bg-purple-50 text-purple-700" : "text-gray-700 hover:bg-gray-100"}`}
                onClick={() => setActiveTab("general")}
              >
                <SettingsIcon className="mr-2 h-4 w-4" />
                Général
              </button>
              <button
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${activeTab === "appearance" ? "bg-purple-50 text-purple-700" : "text-gray-700 hover:bg-gray-100"}`}
                onClick={() => setActiveTab("appearance")}
              >
                <Palette className="mr-2 h-4 w-4" />
                Apparence
              </button>
              <button
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${activeTab === "localization" ? "bg-purple-50 text-purple-700" : "text-gray-700 hover:bg-gray-100"}`}
                onClick={() => setActiveTab("localization")}
              >
                <Globe className="mr-2 h-4 w-4" />
                Localisation
              </button>
              <button
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${activeTab === "notifications" ? "bg-purple-50 text-purple-700" : "text-gray-700 hover:bg-gray-100"}`}
                onClick={() => setActiveTab("notifications")}
              >
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </button>
              <button
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${activeTab === "permissions" ? "bg-purple-50 text-purple-700" : "text-gray-700 hover:bg-gray-100"}`}
                onClick={() => setActiveTab("permissions")}
              >
                <Shield className="mr-2 h-4 w-4" />
                Permissions
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <form onSubmit={handleSaveSettings}>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              {/* General Settings */}
              {activeTab === "general" && (
                <div>
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">Paramètres généraux</h2>
                    <p className="text-sm text-gray-500">Configurez les informations de base de votre site</p>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="site_name" className="block text-sm font-medium text-gray-700">
                        Nom du site
                      </label>
                      <input
                        id="site_name"
                        type="text"
                        value={form.site_name}
                        onChange={(e) => handleInputChange("site_name", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="site_description" className="block text-sm font-medium text-gray-700">
                        Description du site
                      </label>
                      <textarea
                        id="site_description"
                        value={form.site_description}
                        onChange={(e) => handleInputChange("site_description", e.target.value)}
                        rows="4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                      ></textarea>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="logo_url" className="block text-sm font-medium text-gray-700">
                        URL du logo
                      </label>
                      <input
                        id="logo_url"
                        type="text"
                        value={form.logo_url}
                        onChange={(e) => handleInputChange("logo_url", e.target.value)}
                        placeholder="https://example.com/logo.svg"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Settings */}
              {activeTab === "appearance" && (
                <div>
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">Apparence</h2>
                    <p className="text-sm text-gray-500">Personnalisez l'apparence de votre site</p>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="primary_color" className="block text-sm font-medium text-gray-700">
                        Couleur principale
                      </label>
                      <div className="flex items-center space-x-4">
                        <input
                          id="primary_color"
                          type="color"
                          value={form.primary_color}
                          onChange={(e) => handleInputChange("primary_color", e.target.value)}
                          className="w-16 h-10 p-1 border border-gray-300 rounded-md"
                        />
                        <input
                          type="text"
                          value={form.primary_color}
                          onChange={(e) => handleInputChange("primary_color", e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Thème par défaut</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                        <option value="light">Clair</option>
                        <option value="dark">Sombre</option>
                        <option value="system">Système</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Localization Settings */}
              {activeTab === "localization" && (
                <div>
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">Localisation</h2>
                    <p className="text-sm text-gray-500">Configurez les paramètres de langue et de devise</p>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Langue par défaut</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                        <option value="fr">Français</option>
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="de">Deutsch</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                        Devise
                      </label>
                      <select
                        id="currency"
                        value={form.currency}
                        onChange={(e) => handleInputChange("currency", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="EUR">Euro (€)</option>
                        <option value="USD">Dollar US ($)</option>
                        <option value="GBP">Livre sterling (£)</option>
                        <option value="JPY">Yen japonais (¥)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Format de date</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                        <option value="dd/MM/yyyy">DD/MM/YYYY</option>
                        <option value="MM/dd/yyyy">MM/DD/YYYY</option>
                        <option value="yyyy-MM-dd">YYYY-MM-DD</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Settings */}
              {activeTab === "notifications" && (
                <div>
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
                    <p className="text-sm text-gray-500">Gérez les paramètres de notification du système</p>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label className="text-sm font-medium text-gray-700">Notifications par email</label>
                        <p className="text-sm text-gray-500">Envoyer des notifications par email aux utilisateurs</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                    <hr className="border-gray-200" />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label className="text-sm font-medium text-gray-700">
                          Notifications de nouvelles boutiques
                        </label>
                        <p className="text-sm text-gray-500">
                          Recevoir une notification quand une nouvelle boutique est créée
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                    <hr className="border-gray-200" />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label className="text-sm font-medium text-gray-700">Notifications de support</label>
                        <p className="text-sm text-gray-500">
                          Recevoir une notification pour les nouvelles demandes de support
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Permissions Settings */}
              {activeTab === "permissions" && (
                <div>
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">Permissions</h2>
                    <p className="text-sm text-gray-500">Configurez les rôles et les permissions des utilisateurs</p>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label className="text-sm font-medium text-gray-700">Approbation manuelle des boutiques</label>
                        <p className="text-sm text-gray-500">
                          Les nouvelles boutiques doivent être approuvées manuellement par un administrateur
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                    <hr className="border-gray-200" />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label className="text-sm font-medium text-gray-700">Auto-inscription des vendeurs</label>
                        <p className="text-sm text-gray-500">
                          Les utilisateurs peuvent s'inscrire comme vendeurs sans approbation
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                    <hr className="border-gray-200" />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label className="text-sm font-medium text-gray-700">Modération des produits</label>
                        <p className="text-sm text-gray-500">
                          Les nouveaux produits doivent être approuvés par un administrateur
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              <hr className="border-gray-200" />

              <div className="p-6 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <span>Sauvegarde en cours...</span>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Sauvegarder les paramètres
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
