"use client"

import React, { useState } from 'react';
import { Link } from "react-router-dom"
import { AlertCircle, BookOpen, HelpCircle, Mail, MessageSquare, Phone } from "lucide-react"
import { useTranslation } from 'react-i18next';

export default function HelpPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('guides');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const lang = localStorage.getItem('lang');

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('help.help.title')}</h1>
        <p className="text-gray-500">{t('help.help.subtitle')}</p>
      </div>

      <div className="rounded-md bg-blue-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-blue-400" />
          </div>
          <div className={lang === 'ar' ? 'mr-3' : 'ml-3'}>
            <h3 className="text-sm font-medium text-blue-800">{t('help.help.quickHelp.title')}</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>{t('help.help.quickHelp.description')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            type="button"
            onClick={() => setActiveTab('guides')}
            className={`${
              activeTab === 'guides'
                ? 'border-[#6D28D9] text-[#6D28D9]'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
          >
            {t('help.help.tabs.guides')}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('faq')}
            className={`${
              activeTab === 'faq'
                ? 'border-[#6D28D9] text-[#6D28D9]'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
          >
            {t('help.help.tabs.faq')}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('contact')}
            className={`${
              activeTab === 'contact'
                ? 'border-[#6D28D9] text-[#6D28D9]'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
          >
            {t('help.help.tabs.contact')}
          </button>
        </nav>
      </div>

      {activeTab === 'guides' && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-5 w-5 text-[#6D28D9]" />
              <h3 className="text-lg font-medium">{t('help.help.guides.gettingStarted.title')}</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">{t('help.help.guides.gettingStarted.description')}</p>
            <ul className="space-y-2 text-sm">
              {t('help.help.guides.gettingStarted.items', { returnObjects: true }).map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#6D28D9]"></div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <button className="w-full mt-4 px-4 py-2 text-sm font-medium text-[#6D28D9] hover:text-[#5B21B6] focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:ring-offset-2 rounded-md border border-[#6D28D9]">
              {t('help.help.guides.gettingStarted.button')}
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-5 w-5 text-[#6D28D9]" />
              <h3 className="text-lg font-medium">{t('help.help.guides.productManagement.title')}</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">{t('help.help.guides.productManagement.description')}</p>
            <ul className="space-y-2 text-sm">
              {t('help.help.guides.productManagement.items', { returnObjects: true }).map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#6D28D9]"></div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <button className="w-full mt-4 px-4 py-2 text-sm font-medium text-[#6D28D9] hover:text-[#5B21B6] focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:ring-offset-2 rounded-md border border-[#6D28D9]">
              {t('help.help.guides.productManagement.button')}
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-5 w-5 text-[#6D28D9]" />
              <h3 className="text-lg font-medium">{t('help.help.guides.orderManagement.title')}</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">{t('help.help.guides.orderManagement.description')}</p>
            <ul className="space-y-2 text-sm">
              {t('help.help.guides.orderManagement.items', { returnObjects: true }).map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#6D28D9]"></div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <button className="w-full mt-4 px-4 py-2 text-sm font-medium text-[#6D28D9] hover:text-[#5B21B6] focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:ring-offset-2 rounded-md border border-[#6D28D9]">
              {t('help.help.guides.orderManagement.button')}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'faq' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-4">
            <h2 className="text-lg font-medium">{t('help.help.faq.title')}</h2>
            <p className="text-sm text-gray-500">{t('help.help.faq.description')}</p>
          </div>
          <div className="space-y-4">
            <div className="border rounded-lg">
              <button
                onClick={() => toggleFaq('item-1')}
                className="flex w-full items-center justify-between p-4 text-left"
              >
                <span className="text-sm font-medium">{t('help.help.faq.items.createStore.question')}</span>
                <svg
                  className={`h-5 w-5 transform ${expandedFaq === 'item-1' ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedFaq === 'item-1' && (
                <div className="p-4 border-t">
                  <p className="text-sm text-gray-500">
                    {t('help.help.faq.items.createStore.answer.description')}
                  </p>
                  <ol className="mt-2 list-decimal list-inside space-y-1 text-sm text-gray-500">
                    {t('help.help.faq.items.createStore.answer.steps', { returnObjects: true }).map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>

            <div className="border rounded-lg">
              <button
                onClick={() => toggleFaq('item-2')}
                className="flex w-full items-center justify-between p-4 text-left"
              >
                <span className="text-sm font-medium">{t('help.help.faq.items.addProduct.question')}</span>
                <svg
                  className={`h-5 w-5 transform ${expandedFaq === 'item-2' ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedFaq === 'item-2' && (
                <div className="p-4 border-t">
                  <p className="text-sm text-gray-500">
                    {t('help.help.faq.items.addProduct.answer.description')}
                  </p>
                  <ol className="mt-2 list-decimal list-inside space-y-1 text-sm text-gray-500">
                    {t('help.help.faq.items.addProduct.answer.steps', { returnObjects: true }).map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'contact' && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="h-5 w-5 text-[#6D28D9]" />
              <h3 className="text-lg font-medium">{t('help.help.contact.liveChat.title')}</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              {t('help.help.contact.liveChat.description')}
            </p>
            <button className="w-full px-4 py-2 text-sm font-medium text-white bg-[#6D28D9] hover:bg-[#5B21B6] focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:ring-offset-2 rounded-md">
              {t('help.help.contact.liveChat.button')}
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-3">
              <Mail className="h-5 w-5 text-[#6D28D9]" />
              <h3 className="text-lg font-medium">{t('help.help.contact.email.title')}</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              {t('help.help.contact.email.description')}
            </p>
            <button className="w-full px-4 py-2 text-sm font-medium text-white bg-[#6D28D9] hover:bg-[#5B21B6] focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:ring-offset-2 rounded-md">
              {t('help.help.contact.email.button')}
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-3">
              <Phone className="h-5 w-5 text-[#6D28D9]" />
              <h3 className="text-lg font-medium">{t('help.help.contact.phone.title')}</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              {t('help.help.contact.phone.description')}
            </p>
            <button className="w-full px-4 py-2 text-sm font-medium text-white bg-[#6D28D9] hover:bg-[#5B21B6] focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:ring-offset-2 rounded-md">
              {t('help.help.contact.phone.button')}
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-3">
              <HelpCircle className="h-5 w-5 text-[#6D28D9]" />
              <h3 className="text-lg font-medium">{t('help.help.contact.documentation.title')}</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              {t('help.help.contact.documentation.description')}
            </p>
            <button className="w-full px-4 py-2 text-sm font-medium text-white bg-[#6D28D9] hover:bg-[#5B21B6] focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:ring-offset-2 rounded-md">
              {t('help.help.contact.documentation.button')}
            </button>
          </div>
        </div>
      )}

      <div className="h-px bg-gray-200"></div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <p className="text-sm text-gray-500">
          {t('help.help.footer.text')}{" "}
          <Link to="" className="text-[#6D28D9] hover:underline">
            {t('help.help.footer.documentationLink')}
          </Link>{" "}
          {t('help.help.footer.or')}{" "}
          <Link to="" className="text-[#6D28D9] hover:underline">
            {t('help.help.footer.contactLink')}
          </Link>
          .
        </p>
        <button className="shrink-0 items-center flex px-4 py-2 text-sm font-medium text-[#6D28D9] hover:text-[#5B21B6] focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:ring-offset-2 rounded-md border border-[#6D28D9]">
          <HelpCircle className={lang === 'ar' ? 'ml-2 h-4 w-4 inline' : 'mr-2 h-4 w-4 inline'} />
          {t('help.help.footer.button')}
        </button>
      </div>
    </div>
  )
}
