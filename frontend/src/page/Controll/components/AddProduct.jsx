import React, { useState } from 'react';
import { Upload } from "lucide-react";

export default function AddProductPage() {
  const [activeTab, setActiveTab] = useState('info');

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ajouter un Produit</h1>
        <p className="text-gray-500">Créez un nouveau produit pour votre boutique</p>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`${
              activeTab === 'info'
                ? 'border-[#6D28D9] text-[#6D28D9]'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
          >
            Informations
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('images')}
            className={`${
              activeTab === 'images'
                ? 'border-[#6D28D9] text-[#6D28D9]'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
          >
            Images
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pricing')}
            className={`${
              activeTab === 'pricing'
                ? 'border-[#6D28D9] text-[#6D28D9]'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
          >
            Prix et Stock
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('shipping')}
            className={`${
              activeTab === 'shipping'
                ? 'border-[#6D28D9] text-[#6D28D9]'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
          >
            Livraison
          </button>
        </nav>
      </div>

      {activeTab === 'info' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-medium">Informations du produit</h2>
              <p className="text-sm text-gray-500">Entrez les détails de base de votre produit</p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="product-name" className="block text-sm font-medium text-gray-700">
                  Nom du produit
                </label>
                <input
                  type="text"
                  id="product-name"
                  className="mt-1 block py-3 px-4 w-full rounded-md border border-gray-300  focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent sm:text-sm"
                  placeholder="Nom du produit"
                />
              </div>

              <div>
                <label htmlFor="product-description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="product-description"
                  rows={4}
                  className="mt-1 block py-3 px-4 w-full rounded-md border border-gray-300  focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent sm:text-sm"
                  placeholder="Décrivez votre produit en détail..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="product-category" className="block text-sm font-medium text-gray-700">
                    Catégorie
                  </label>
                  <select
                    id="product-category"
                    className="mt-1 block py-3 px-4 w-full rounded-md border border-gray-300  focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent sm:text-sm"
                  >
                    <option value="">Sélectionnez une catégorie</option>
                    <option value="clothing">Vêtements</option>
                    <option value="electronics">Électronique</option>
                    <option value="home">Maison</option>
                    <option value="beauty">Beauté</option>
                    <option value="other">Autre</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="product-store" className="block text-sm font-medium text-gray-700">
                    Boutique
                  </label>
                  <select
                    id="product-store"
                    className="mt-1 block py-3 px-4 w-full rounded-md border border-gray-300  focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent sm:text-sm"
                  >
                    <option value="">Sélectionnez une boutique</option>
                    <option value="boutique-mode">Boutique Mode</option>
                    <option value="tech-store">Tech Store</option>
                    <option value="deco-maison">Déco Maison</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="product-tags" className="block text-sm font-medium text-gray-700">
                  Tags (séparés par des virgules)
                </label>
                <input
                  type="text"
                  id="product-tags"
                  className="mt-1 block py-3 px-4 w-full rounded-md border border-gray-300  focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent sm:text-sm"
                  placeholder="nouveau, tendance, été..."
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'images' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-medium">Images du produit</h2>
              <p className="text-sm text-gray-500">Ajoutez des images de votre produit</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Image principale</label>
                <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center gap-2">
                  <div className="text-center">
                    <p className="text-sm font-medium">Déposez votre image principale ici</p>
                    <p className="text-xs text-gray-500">PNG, JPG (max. 5MB)</p>
                  </div>
                  <button
                    type="button"
                    className="mt-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c8c2fd]"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Télécharger
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Images supplémentaires</label>
                <div className="mt-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center gap-2"
                    >
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Image {i}</p>
                      </div>
                      <button
                        type="button"
                        className="mt-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c8c2fd]"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Ajouter
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'pricing' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-medium">Prix et stock</h2>
              <p className="text-sm text-gray-500">Définissez les prix et la gestion du stock</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="product-price" className="block text-sm font-medium text-gray-700">
                  Prix (€)
                </label>
                <input
                  type="number"
                  id="product-price"
                  min="0"
                  step="0.01"
                  className="mt-1 block py-3 px-4 w-full rounded-md border  border-gray-300  focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent sm:text-sm"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label htmlFor="product-compare-price" className="block text-sm font-medium text-gray-700">
                  Prix comparé (€, optionnel)
                </label>
                <input
                  type="number"
                  id="product-compare-price"
                  min="0"
                  step="0.01"
                  className="mt-1 block py-3 px-4 w-full rounded-md border  border-gray-300  focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent sm:text-sm"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="product-cost" className="block text-sm font-medium text-gray-700">
                  Coût par unité (€)
                </label>
                <input
                  type="number"
                  id="product-cost"
                  min="0"
                  step="0.01"
                  className="mt-1 block py-3 px-4 w-full rounded-md border  border-gray-300  focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent sm:text-sm"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label htmlFor="product-sku" className="block text-sm font-medium text-gray-700">
                  SKU (Référence)
                </label>
                <input
                  type="text"
                  id="product-sku"
                  className="mt-1 block py-3 px-4 w-full rounded-md border border-gray-300  focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent sm:text-sm"
                  placeholder="SKU-12345"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="product-stock" className="block text-sm font-medium text-gray-700">
                  Quantité en stock
                </label>
                <input
                  type="number"
                  id="product-stock"
                  min="0"
                  className="mt-1 block py-3 px-4 w-full rounded-md border border-gray-300  focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent sm:text-sm"
                  placeholder="0"
                />
              </div>

              <div>
                <label htmlFor="product-low-stock" className="block text-sm font-medium text-gray-700">
                  Alerte stock faible
                </label>
                <input
                  type="number"
                  id="product-low-stock"
                  min="0"
                  className="mt-1 block py-3 px-4 w-full rounded-md border border-gray-300  focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent sm:text-sm"
                  placeholder="5"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'shipping' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-medium">Informations de livraison</h2>
              <p className="text-sm text-gray-500">Définissez les options de livraison pour ce produit</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="product-weight" className="block text-sm font-medium text-gray-700">
                  Poids (kg)
                </label>
                <input
                  type="number"
                  id="product-weight"
                  min="0"
                  step="0.01"
                  className="mt-1 block py-3 px-4 w-full rounded-md border border-gray-300  focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent sm:text-sm"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Dimensions (cm, L x l x H)
                </label>
                <div className="mt-1 flex gap-2">
                  <input
                    type="number"
                    placeholder="L"
                    className="block w-full py-3 px-4 rounded-md border border-gray-300  focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent sm:text-sm"
                  />
                  <input
                    type="number"
                    placeholder="l"
                    className="block w-full py-3 px-4 rounded-md border border-gray-300  focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent sm:text-sm"
                  />
                  <input
                    type="number"
                    placeholder="H"
                    className="block w-full py-3 px-4 rounded-md border border-gray-300  focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="product-shipping-class" className="block text-sm font-medium text-gray-700">
                Classe d'expédition
              </label>
              <select
                id="product-shipping-class"
                className="mt-1 block py-3 px-4 w-full rounded-md border border-gray-300  focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent sm:text-sm"
              >
                <option value="">Sélectionnez une classe</option>
                <option value="standard">Standard</option>
                <option value="express">Express</option>
                <option value="economy">Économique</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c8c2fd]"
        >
          Annuler
        </button>
        <button
          type="button"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#6D28D9] hover:bg-[#6D28D9]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c8c2fd]"
        >
          Enregistrer le produit
        </button>
      </div>
    </div>
  );
}
