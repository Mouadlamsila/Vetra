"use client"

import React, { useState } from 'react';
import { Link } from "react-router-dom"
import { AlertCircle, BookOpen, HelpCircle, Mail, MessageSquare, Phone } from "lucide-react"

export default function HelpPage() {
  const [activeTab, setActiveTab] = useState('guides');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Centre d'aide</h1>
        <p className="text-gray-500">Trouvez des réponses à vos questions et obtenez de l'assistance</p>
      </div>

      <div className="rounded-md bg-blue-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Besoin d'aide rapide ?</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Notre équipe de support est disponible du lundi au vendredi de 9h à 18h. Contactez-nous par téléphone au +33 1
                23 45 67 89 ou par email à support@ecommerce.com.
              </p>
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
            Guides
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
            FAQ
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
            Contact
          </button>
        </nav>
      </div>

      {activeTab === 'guides' && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-5 w-5 text-[#6D28D9]" />
              <h3 className="text-lg font-medium">Premiers pas</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">Apprenez à utiliser le tableau de bord</p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-[#6D28D9]"></div>
                <span>Créer votre compte</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-[#6D28D9]"></div>
                <span>Configurer votre profil</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-[#6D28D9]"></div>
                <span>Créer votre première boutique</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-[#6D28D9]"></div>
                <span>Ajouter des produits</span>
              </li>
            </ul>
            <button className="w-full mt-4 px-4 py-2 text-sm font-medium text-[#6D28D9] hover:text-[#5B21B6] focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:ring-offset-2 rounded-md border border-[#6D28D9]">
              Voir le guide
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-5 w-5 text-[#6D28D9]" />
              <h3 className="text-lg font-medium">Gestion des produits</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">Optimisez votre catalogue</p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-[#6D28D9]"></div>
                <span>Ajouter des produits</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-[#6D28D9]"></div>
                <span>Gérer les stocks</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-[#6D28D9]"></div>
                <span>Définir les prix</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-[#6D28D9]"></div>
                <span>Optimiser les descriptions</span>
              </li>
            </ul>
            <button className="w-full mt-4 px-4 py-2 text-sm font-medium text-[#6D28D9] hover:text-[#5B21B6] focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:ring-offset-2 rounded-md border border-[#6D28D9]">
              Voir le guide
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-5 w-5 text-[#6D28D9]" />
              <h3 className="text-lg font-medium">Gestion des commandes</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">Traitez efficacement vos commandes</p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-[#6D28D9]"></div>
                <span>Traiter les nouvelles commandes</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-[#6D28D9]"></div>
                <span>Gérer les expéditions</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-[#6D28D9]"></div>
                <span>Gérer les retours</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-[#6D28D9]"></div>
                <span>Générer des factures</span>
              </li>
            </ul>
            <button className="w-full mt-4 px-4 py-2 text-sm font-medium text-[#6D28D9] hover:text-[#5B21B6] focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:ring-offset-2 rounded-md border border-[#6D28D9]">
              Voir le guide
            </button>
          </div>
        </div>
      )}

      {activeTab === 'faq' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-4">
            <h2 className="text-lg font-medium">Questions fréquemment posées</h2>
            <p className="text-sm text-gray-500">Trouvez rapidement des réponses aux questions les plus courantes</p>
          </div>
          <div className="space-y-4">
            <div className="border rounded-lg">
              <button
                onClick={() => toggleFaq('item-1')}
                className="flex w-full items-center justify-between p-4 text-left"
              >
                <span className="text-sm font-medium">Comment créer une nouvelle boutique ?</span>
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
                    Pour créer une nouvelle boutique, suivez ces étapes :
                  </p>
                  <ol className="mt-2 list-decimal list-inside space-y-1 text-sm text-gray-500">
                    <li>Accédez à la section "Mes Boutiques" dans le menu latéral</li>
                    <li>Cliquez sur le bouton "Créer une boutique"</li>
                    <li>Remplissez les informations requises (nom, description, catégorie)</li>
                    <li>Ajoutez un logo et une bannière pour votre boutique</li>
                    <li>Cliquez sur "Créer la boutique" pour finaliser</li>
                  </ol>
                </div>
              )}
            </div>

            <div className="border rounded-lg">
              <button
                onClick={() => toggleFaq('item-2')}
                className="flex w-full items-center justify-between p-4 text-left"
              >
                <span className="text-sm font-medium">Comment ajouter un nouveau produit ?</span>
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
                    Pour ajouter un nouveau produit, suivez ces étapes :
                  </p>
                  <ol className="mt-2 list-decimal list-inside space-y-1 text-sm text-gray-500">
                    <li>Accédez à la section "Mes Produits" dans le menu latéral</li>
                    <li>Cliquez sur le bouton "Ajouter un produit"</li>
                    <li>Remplissez les informations du produit dans les différents onglets</li>
                    <li>Ajoutez des images de qualité pour votre produit</li>
                    <li>Cliquez sur "Enregistrer le produit" pour finaliser</li>
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
              <h3 className="text-lg font-medium">Chat en direct</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Notre équipe de support est disponible en chat du lundi au vendredi de 9h à 18h. Temps de réponse
              moyen : moins de 5 minutes.
            </p>
            <button className="w-full px-4 py-2 text-sm font-medium text-white bg-[#6D28D9] hover:bg-[#5B21B6] focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:ring-offset-2 rounded-md">
              Démarrer un chat
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-3">
              <Mail className="h-5 w-5 text-[#6D28D9]" />
              <h3 className="text-lg font-medium">Email</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Envoyez-nous un email à support@ecommerce.com. Nous nous efforçons de répondre à tous les emails dans
              un délai de 24 heures ouvrables.
            </p>
            <button className="w-full px-4 py-2 text-sm font-medium text-white bg-[#6D28D9] hover:bg-[#5B21B6] focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:ring-offset-2 rounded-md">
              Envoyer un email
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-3">
              <Phone className="h-5 w-5 text-[#6D28D9]" />
              <h3 className="text-lg font-medium">Téléphone</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Appelez-nous au +33 1 23 45 67 89. Notre service client est disponible du lundi au vendredi de 9h à
              18h.
            </p>
            <button className="w-full px-4 py-2 text-sm font-medium text-white bg-[#6D28D9] hover:bg-[#5B21B6] focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:ring-offset-2 rounded-md">
              Appeler maintenant
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-3">
              <HelpCircle className="h-5 w-5 text-[#6D28D9]" />
              <h3 className="text-lg font-medium">Centre de documentation</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Notre centre de documentation contient des guides détaillés, des tutoriels vidéo et des réponses aux
              questions fréquentes.
            </p>
            <button className="w-full px-4 py-2 text-sm font-medium text-white bg-[#6D28D9] hover:bg-[#5B21B6] focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:ring-offset-2 rounded-md">
              Accéder à la documentation
            </button>
          </div>
        </div>
      )}

      <div className="h-px bg-gray-200"></div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <p className="text-sm text-gray-500">
          Vous ne trouvez pas ce que vous cherchez ? Consultez notre{" "}
          <Link to="" className="text-[#6D28D9] hover:underline">
            centre de documentation complet
          </Link>{" "}
          ou{" "}
          <Link to="" className="text-[#6D28D9] hover:underline">
            contactez notre équipe de support
          </Link>
          .
        </p>
        <button className="shrink-0 px-4 py-2 text-sm font-medium text-[#6D28D9] hover:text-[#5B21B6] focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:ring-offset-2 rounded-md border border-[#6D28D9]">
          <HelpCircle className="mr-2 h-4 w-4 inline" />
          Demander de l'aide
        </button>
      </div>
    </div>
  )
}
