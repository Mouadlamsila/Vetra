"use client"

import { useState } from "react"
import { Save, Globe, Bell, Shield } from "lucide-react"
import { useTranslation } from 'react-i18next'
import { changeLanguage } from '../../i18n/i18n'

// Mock data for settings
const initialSettings = {
  site_name: "Marketplace Admin",
  site_description: "Plateforme de gestion pour la marketplace",
  logo_url: "https://example.com/logo.svg",
  primary_color: "#6366f1",
  currency: "EUR",
  language: "fr"
}

export default function Settings() {
  const { t, i18n } = useTranslation()
  const language = localStorage.getItem("lang")
  const [form, setForm] = useState({
    ...initialSettings,
    language: i18n.language // Initialize with current language
  })
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("localization")

  const handleInputChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (key === 'language') {
      changeLanguage(value)
    }
  }

  const handleSaveSettings = (event) => {
    event.preventDefault()
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      alert(t('settingsAdmin.messages.saveSuccess'))
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('settingsAdmin.title')}</h1>
          <p className="text-gray-500">{t('settingsAdmin.subtitle')}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="md:w-64 flex-shrink-0 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4">
            <div className="flex flex-col space-y-1">
              <button
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${activeTab === "localization" ? "bg-purple-50 text-purple-700" : "text-gray-700 hover:bg-gray-100"}`}
                onClick={() => setActiveTab("localization")}
              >
                <Globe className={`${language === "ar" ? "ml-2" : "mr-2"} h-4 w-4`} />
                {t('settingsAdmin.tabs.localization')}
              </button>
              <button
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${activeTab === "notifications" ? "bg-purple-50 text-purple-700" : "text-gray-700 hover:bg-gray-100"}`}
                onClick={() => setActiveTab("notifications")}
              >
                <Bell className={`${language === "ar" ? "ml-2" : "mr-2"} h-4 w-4`} />
                {t('settingsAdmin.tabs.notifications')}
              </button>
              <button
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${activeTab === "permissions" ? "bg-purple-50 text-purple-700" : "text-gray-700 hover:bg-gray-100"}`}
                onClick={() => setActiveTab("permissions")}
              >
                <Shield className={`${language === "ar" ? "ml-2" : "mr-2"} h-4 w-4`} />
                {t('settingsAdmin.tabs.permissions')}
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <form onSubmit={handleSaveSettings}>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              {/* Localization Settings */}
              {activeTab === "localization" && (
                <div>
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">{t('settingsAdmin.localization.title')}</h2>
                    <p className="text-sm text-gray-500">{t('settingsAdmin.localization.subtitle')}</p>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {t('settingsAdmin.localization.defaultLanguage.label')}
                      </label>
                      <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        value={form.language}
                        onChange={(e) => handleInputChange('language', e.target.value)}
                      >
                        <option value="fr">{t('settingsAdmin.localization.defaultLanguage.options.fr')}</option>
                        <option value="en">{t('settingsAdmin.localization.defaultLanguage.options.en')}</option>
                        <option value="ar">{t('settingsAdmin.localization.defaultLanguage.options.ar')}</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                        {t('settingsAdmin.localization.currency.label')}
                      </label>
                      <select
                        id="currency"
                        value={form.currency}
                        onChange={(e) => handleInputChange("currency", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="EUR">{t('settingsAdmin.localization.currency.options.EUR')}</option>
                        <option value="USD">{t('settingsAdmin.localization.currency.options.USD')}</option>
                        <option value="GBP">{t('settingsAdmin.localization.currency.options.GBP')}</option>
                        <option value="JPY">{t('settingsAdmin.localization.currency.options.JPY')}</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {t('settingsAdmin.localization.dateFormat.label')}
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                        <option value="dd/MM/yyyy">{t('settingsAdmin.localization.dateFormat.options.ddMMyyyy')}</option>
                        <option value="MM/dd/yyyy">{t('settingsAdmin.localization.dateFormat.options.MMddyyyy')}</option>
                        <option value="yyyy-MM-dd">{t('settingsAdmin.localization.dateFormat.options.yyyyMMdd')}</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Settings */}
              {activeTab === "notifications" && (
                <div>
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">{t('settingsAdmin.notifications.title')}</h2>
                    <p className="text-sm text-gray-500">{t('settingsAdmin.notifications.subtitle')}</p>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label className="text-sm font-medium text-gray-700">
                          {t('settingsAdmin.notifications.emailNotifications.label')}
                        </label>
                        <p className="text-sm text-gray-500">
                          {t('settingsAdmin.notifications.emailNotifications.description')}
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
                        <label className="text-sm font-medium text-gray-700">
                          {t('settingsAdmin.notifications.newStoreNotifications.label')}
                        </label>
                        <p className="text-sm text-gray-500">
                          {t('settingsAdmin.notifications.newStoreNotifications.description')}
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
                        <label className="text-sm font-medium text-gray-700">
                          {t('settingsAdmin.notifications.supportNotifications.label')}
                        </label>
                        <p className="text-sm text-gray-500">
                          {t('settingsAdmin.notifications.supportNotifications.description')}
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
                    <h2 className="text-lg font-semibold text-gray-800">{t('settingsAdmin.permissions.title')}</h2>
                    <p className="text-sm text-gray-500">{t('settingsAdmin.permissions.subtitle')}</p>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label className="text-sm font-medium text-gray-700">
                          {t('settingsAdmin.permissions.manualStoreApproval.label')}
                        </label>
                        <p className="text-sm text-gray-500">
                          {t('settingsAdmin.permissions.manualStoreApproval.description')}
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
                        <label className="text-sm font-medium text-gray-700">
                          {t('settingsAdmin.permissions.sellerAutoRegistration.label')}
                        </label>
                        <p className="text-sm text-gray-500">
                          {t('settingsAdmin.permissions.sellerAutoRegistration.description')}
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
                        <label className="text-sm font-medium text-gray-700">
                          {t('settingsAdmin.permissions.productModeration.label')}
                        </label>
                        <p className="text-sm text-gray-500">
                          {t('settingsAdmin.permissions.productModeration.description')}
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
                    <span>{t('settingsAdmin.buttons.saving')}</span>
                  ) : (
                    <>
                      <Save className={`${language === "ar" ? "ml-2" : "mr-2"} h-4 w-4`} />
                      {t('settingsAdmin.buttons.save')}
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
