"use client"

import React, { useState } from 'react';
import { AlertTriangle } from "lucide-react"
import { useTranslation } from 'react-i18next';

export default function SettingsPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('general');
  const [language, setLanguage] = useState('fr');
  const [timezone, setTimezone] = useState('europe-paris');
  const [currency, setCurrency] = useState('eur');
  const [notifications, setNotifications] = useState({
    newOrder: true,
    orderStatus: true,
    lowStock: true,
    marketing: false,
    pushOrders: true,
    pushMessages: true
  });
  const [twoFactor, setTwoFactor] = useState(false);

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('settings.settings.title')}</h1>
        <p className="text-gray-500">{t('settings.settings.subtitle')}</p>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`${
              activeTab === 'general'
                ? 'border-[#6D28D9] text-[#6D28D9]'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
          >
            {t('settings.settings.tabs.general')}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('notifications')}
            className={`${
              activeTab === 'notifications'
                ? 'border-[#6D28D9] text-[#6D28D9]'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
          >
            {t('settings.settings.tabs.notifications')}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`${
              activeTab === 'security'
                ? 'border-[#6D28D9] text-[#6D28D9]'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
          >
            {t('settings.settings.tabs.security')}
          </button>
        </nav>
      </div>

      {activeTab === 'general' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <h2 className="text-lg font-medium">{t('settings.settings.general.language.title')}</h2>
              <p className="text-sm text-gray-500">{t('settings.settings.general.language.description')}</p>
            </div>
            <div className="space-y-4">
              {Object.entries(t('settings.settings.general.language.options', { returnObjects: true })).map(([code, lang]) => (
                <div key={code} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={code}
                    name="language"
                    value={code}
                    checked={language === code}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="h-4 w-4 text-[#6D28D9] focus:ring-[#6D28D9] border-gray-300"
                  />
                  <label htmlFor={code} className="text-sm font-medium text-gray-700">
                    {lang.name} <span className="text-gray-500">({lang.native})</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <h2 className="text-lg font-medium">{t('settings.settings.general.timezone.title')}</h2>
              <p className="text-sm text-gray-500">{t('settings.settings.general.timezone.description')}</p>
            </div>
            <div className="space-y-4">
              {Object.entries(t('settings.settings.general.timezone.options', { returnObjects: true })).map(([code, option]) => (
                <div key={code} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={code}
                    name="timezone"
                    value={code}
                    checked={timezone === code}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="h-4 w-4 text-[#6D28D9] focus:ring-[#6D28D9] border-gray-300"
                  />
                  <label htmlFor={code} className="text-sm font-medium text-gray-700">{option.label}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <h2 className="text-lg font-medium">{t('settings.settings.general.currency.title')}</h2>
              <p className="text-sm text-gray-500">{t('settings.settings.general.currency.description')}</p>
            </div>
            <div className="space-y-4">
              {Object.entries(t('settings.settings.general.currency.options', { returnObjects: true })).map(([code, option]) => (
                <div key={code} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={code}
                    name="currency"
                    value={code}
                    checked={currency === code}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="h-4 w-4 text-[#6D28D9] focus:ring-[#6D28D9] border-gray-300"
                  />
                  <label htmlFor={code} className="text-sm font-medium text-gray-700">{option.label}</label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <h2 className="text-lg font-medium">{t('settings.settings.notifications.email.title')}</h2>
              <p className="text-sm text-gray-500">{t('settings.settings.notifications.email.description')}</p>
            </div>
            <div className="space-y-4">
              {Object.entries(t('settings.settings.notifications.email.options', { returnObjects: true })).map(([key, option]) => (
                <div key={key}>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label htmlFor={key} className="text-sm font-medium text-gray-700">{option.label}</label>
                      <p className="text-sm text-gray-500">{option.description}</p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={notifications[key]}
                      onClick={() => handleNotificationChange(key)}
                      className={`${
                        notifications[key] ? 'bg-[#6D28D9]' : 'bg-gray-200'
                      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:ring-offset-2`}
                    >
                      <span
                        className={`${
                          notifications[key] ? 'translate-x-5' : 'translate-x-0'
                        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                      />
                    </button>
                  </div>
                  <div className="h-px bg-gray-200" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <h2 className="text-lg font-medium">{t('settings.settings.notifications.push.title')}</h2>
              <p className="text-sm text-gray-500">{t('settings.settings.notifications.push.description')}</p>
            </div>
            <div className="space-y-4">
              {Object.entries(t('settings.settings.notifications.push.options', { returnObjects: true })).map(([key, option]) => (
                <div key={key}>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label htmlFor={key} className="text-sm font-medium text-gray-700">{option.label}</label>
                      <p className="text-sm text-gray-500">{option.description}</p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={notifications[key]}
                      onClick={() => handleNotificationChange(key)}
                      className={`${
                        notifications[key] ? 'bg-[#6D28D9]' : 'bg-gray-200'
                      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:ring-offset-2`}
                    >
                      <span
                        className={`${
                          notifications[key] ? 'translate-x-5' : 'translate-x-0'
                        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                      />
                    </button>
                  </div>
                  <div className="h-px bg-gray-200" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <h2 className="text-lg font-medium">{t('settings.settings.security.twoFactor.title')}</h2>
              <p className="text-sm text-gray-500">{t('settings.settings.security.twoFactor.description')}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium text-gray-700">{t('settings.settings.security.twoFactor.label')}</label>
                <p className="text-sm text-gray-500">{t('settings.settings.security.twoFactor.description')}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={twoFactor}
                onClick={() => setTwoFactor(!twoFactor)}
                className={`${
                  twoFactor ? 'bg-[#6D28D9]' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:ring-offset-2`}
              >
                <span
                  className={`${
                    twoFactor ? 'translate-x-5' : 'translate-x-0'
                  } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
              </button>
            </div>
            <div className="mt-4">
              <button className="px-4 py-2 text-sm font-medium text-[#6D28D9] hover:text-[#5B21B6] focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:ring-offset-2 rounded-md border border-[#6D28D9]">
                {t('settings.settings.security.twoFactor.configure')}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <h2 className="text-lg font-medium">{t('settings.settings.security.sessions.title')}</h2>
              <p className="text-sm text-gray-500">{t('settings.settings.security.sessions.description')}</p>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-700">Cet appareil</p>
                  <p className="text-sm text-gray-500">Paris, France · Dernière activité il y a 2 minutes</p>
                </div>
                <button
                  disabled
                  className="px-3 py-1 text-sm font-medium text-gray-400 bg-gray-100 rounded-md cursor-not-allowed"
                >
                  {t('settings.settings.security.sessions.current')}
                </button>
              </div>
              <div className="h-px bg-gray-200" />
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-700">Chrome sur Windows</p>
                  <p className="text-sm text-gray-500">Lyon, France · Dernière activité il y a 3 jours</p>
                </div>
                <button className="px-3 py-1 text-sm font-medium text-[#6D28D9] hover:text-[#5B21B6] focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:ring-offset-2 rounded-md border border-[#6D28D9]">
                  {t('settings.settings.security.sessions.disconnect')}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <h2 className="text-lg font-medium">{t('settings.settings.security.deleteAccount.title')}</h2>
              <p className="text-sm text-gray-500">{t('settings.settings.security.deleteAccount.description')}</p>
            </div>
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{t('settings.settings.security.deleteAccount.warning.title')}</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{t('settings.settings.security.deleteAccount.warning.description')}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <button className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-md">
                {t('settings.settings.security.deleteAccount.button')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
