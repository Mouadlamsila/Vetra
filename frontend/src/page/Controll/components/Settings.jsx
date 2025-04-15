"use client"

import React, { useState } from 'react';
import { AlertTriangle } from "lucide-react"

export default function SettingsPage() {
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

  const languages = [
    { code: 'fr', name: 'Français', native: 'Français' },
    { code: 'en', name: 'English', native: 'English' },
    { code: 'ar', name: 'Arabic', native: 'العربية' }
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-gray-500">Gérez les paramètres de votre compte</p>
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
            Général
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
            Notifications
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
            Sécurité
          </button>
        </nav>
      </div>

      {activeTab === 'general' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <h2 className="text-lg font-medium">Langue</h2>
              <p className="text-sm text-gray-500">Choisissez la langue de l'interface</p>
            </div>
            <div className="space-y-4">
              {languages.map((lang) => (
                <div key={lang.code} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={lang.code}
                    name="language"
                    value={lang.code}
                    checked={language === lang.code}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="h-4 w-4 text-[#6D28D9] focus:ring-[#6D28D9] border-gray-300"
                  />
                  <label htmlFor={lang.code} className="text-sm font-medium text-gray-700">
                    {lang.name} <span className="text-gray-500">({lang.native})</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <h2 className="text-lg font-medium">Fuseau horaire</h2>
              <p className="text-sm text-gray-500">Définissez votre fuseau horaire</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="europe-paris"
                  name="timezone"
                  value="europe-paris"
                  checked={timezone === 'europe-paris'}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="h-4 w-4 text-[#6D28D9] focus:ring-[#6D28D9] border-gray-300"
                />
                <label htmlFor="europe-paris" className="text-sm font-medium text-gray-700">Europe/Paris (UTC+01:00)</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="europe-london"
                  name="timezone"
                  value="europe-london"
                  checked={timezone === 'europe-london'}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="h-4 w-4 text-[#6D28D9] focus:ring-[#6D28D9] border-gray-300"
                />
                <label htmlFor="europe-london" className="text-sm font-medium text-gray-700">Europe/London (UTC+00:00)</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="america-new_york"
                  name="timezone"
                  value="america-new_york"
                  checked={timezone === 'america-new_york'}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="h-4 w-4 text-[#6D28D9] focus:ring-[#6D28D9] border-gray-300"
                />
                <label htmlFor="america-new_york" className="text-sm font-medium text-gray-700">America/New_York (UTC-05:00)</label>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <h2 className="text-lg font-medium">Format de devise</h2>
              <p className="text-sm text-gray-500">Choisissez votre format de devise préféré</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="eur"
                  name="currency"
                  value="eur"
                  checked={currency === 'eur'}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="h-4 w-4 text-[#6D28D9] focus:ring-[#6D28D9] border-gray-300"
                />
                <label htmlFor="eur" className="text-sm font-medium text-gray-700">Euro (€)</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="usd"
                  name="currency"
                  value="usd"
                  checked={currency === 'usd'}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="h-4 w-4 text-[#6D28D9] focus:ring-[#6D28D9] border-gray-300"
                />
                <label htmlFor="usd" className="text-sm font-medium text-gray-700">Dollar US ($)</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="gbp"
                  name="currency"
                  value="gbp"
                  checked={currency === 'gbp'}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="h-4 w-4 text-[#6D28D9] focus:ring-[#6D28D9] border-gray-300"
                />
                <label htmlFor="gbp" className="text-sm font-medium text-gray-700">Livre Sterling (£)</label>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <h2 className="text-lg font-medium">Notifications par email</h2>
              <p className="text-sm text-gray-500">Gérez vos préférences de notifications par email</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label htmlFor="new-order" className="text-sm font-medium text-gray-700">Nouvelles commandes</label>
                  <p className="text-sm text-gray-500">Recevoir un email pour chaque nouvelle commande</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={notifications.newOrder}
                  onClick={() => handleNotificationChange('newOrder')}
                  className={`${
                    notifications.newOrder ? 'bg-[#6D28D9]' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      notifications.newOrder ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                  />
                </button>
              </div>
              <div className="h-px bg-gray-200" />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label htmlFor="order-status" className="text-sm font-medium text-gray-700">Changements de statut</label>
                  <p className="text-sm text-gray-500">Recevoir un email quand le statut d'une commande change</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={notifications.orderStatus}
                  onClick={() => handleNotificationChange('orderStatus')}
                  className={`${
                    notifications.orderStatus ? 'bg-[#6D28D9]' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      notifications.orderStatus ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                  />
                </button>
              </div>
              <div className="h-px bg-gray-200" />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label htmlFor="low-stock" className="text-sm font-medium text-gray-700">Alerte stock faible</label>
                  <p className="text-sm text-gray-500">Recevoir un email quand un produit atteint un niveau de stock faible</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={notifications.lowStock}
                  onClick={() => handleNotificationChange('lowStock')}
                  className={`${
                    notifications.lowStock ? 'bg-[#6D28D9]' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      notifications.lowStock ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                  />
                </button>
              </div>
              <div className="h-px bg-gray-200" />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label htmlFor="marketing" className="text-sm font-medium text-gray-700">Emails marketing</label>
                  <p className="text-sm text-gray-500">Recevoir des conseils, offres et mises à jour</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={notifications.marketing}
                  onClick={() => handleNotificationChange('marketing')}
                  className={`${
                    notifications.marketing ? 'bg-[#6D28D9]' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      notifications.marketing ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <h2 className="text-lg font-medium">Notifications push</h2>
              <p className="text-sm text-gray-500">Gérez vos préférences de notifications push</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label htmlFor="push-orders" className="text-sm font-medium text-gray-700">Commandes</label>
                  <p className="text-sm text-gray-500">Recevoir des notifications pour les nouvelles commandes</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={notifications.pushOrders}
                  onClick={() => handleNotificationChange('pushOrders')}
                  className={`${
                    notifications.pushOrders ? 'bg-[#6D28D9]' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      notifications.pushOrders ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                  />
                </button>
              </div>
              <div className="h-px bg-gray-200" />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label htmlFor="push-messages" className="text-sm font-medium text-gray-700">Messages</label>
                  <p className="text-sm text-gray-500">Recevoir des notifications pour les nouveaux messages</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={notifications.pushMessages}
                  onClick={() => handleNotificationChange('pushMessages')}
                  className={`${
                    notifications.pushMessages ? 'bg-[#6D28D9]' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      notifications.pushMessages ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <h2 className="text-lg font-medium">Authentification à deux facteurs</h2>
              <p className="text-sm text-gray-500">Ajoutez une couche de sécurité supplémentaire à votre compte</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium text-gray-700">Activer l'authentification à deux facteurs</label>
                <p className="text-sm text-gray-500">Protégez votre compte avec une authentification à deux facteurs</p>
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
                Configurer
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <h2 className="text-lg font-medium">Sessions actives</h2>
              <p className="text-sm text-gray-500">Gérez vos sessions actives sur différents appareils</p>
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
                  Actuel
                </button>
              </div>
              <div className="h-px bg-gray-200" />
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-700">Chrome sur Windows</p>
                  <p className="text-sm text-gray-500">Lyon, France · Dernière activité il y a 3 jours</p>
                </div>
                <button className="px-3 py-1 text-sm font-medium text-[#6D28D9] hover:text-[#5B21B6] focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:ring-offset-2 rounded-md border border-[#6D28D9]">
                  Déconnecter
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <h2 className="text-lg font-medium">Supprimer le compte</h2>
              <p className="text-sm text-gray-500">Supprimez définitivement votre compte et toutes vos données</p>
            </div>
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Attention</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>Cette action est irréversible. Toutes vos données, boutiques et produits seront définitivement supprimés.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <button className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-md">
                Supprimer mon compte
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
