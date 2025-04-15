import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit, MoreHorizontal, Package, PlusCircle, Search, Trash } from "lucide-react";

export default function ProductsPage() {
  const [isDropdownOpen, setIsDropdownOpen] = useState({});
  const [selectedStore, setSelectedStore] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Données statiques des boutiques
  const stores = [
    { id: 1, nom: "Boutique Mode" },
    { id: 2, nom: "Tech Store" },
    { id: 3, nom: "Déco Maison" }
  ];

  // Données statiques des produits
  const staticProducts = [
    {
      id: 1,
      nom: "T-shirt Premium",
      prix: 29.99,
      stock: 45,
      boutique: { id: 1, nom: "Boutique Mode" },
      description: "T-shirt en coton premium"
    },
    {
      id: 2,
      nom: "Écouteurs sans fil",
      prix: 89.99,
      stock: 12,
      boutique: { id: 2, nom: "Tech Store" },
      description: "Écouteurs bluetooth avec réduction de bruit"
    },
    {
      id: 3,
      nom: "Vase décoratif",
      prix: 39.99,
      stock: 8,
      boutique: { id: 3, nom: "Déco Maison" },
      description: "Vase en céramique fait main"
    },
    {
      id: 4,
      nom: "Montre connectée",
      prix: 129.99,
      stock: 0,
      boutique: { id: 2, nom: "Tech Store" },
      description: "Montre intelligente avec suivi d'activité"
    },
    {
      id: 5,
      nom: "Pantalon Chino",
      prix: 49.99,
      stock: 23,
      boutique: { id: 1, nom: "Boutique Mode" },
      description: "Pantalon chino coupe slim"
    }
  ];

  const toggleDropdown = (productId) => {
    setIsDropdownOpen(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const getStatusBadgeClass = (stock) => {
    if (stock > 10) return 'bg-green-100 text-green-800';
    if (stock > 0) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getStatusText = (stock) => {
    if (stock > 10) return 'En stock';
    if (stock > 0) return 'Stock faible';
    return 'Épuisé';
  };

  // Filtrage des produits
  const filteredProducts = staticProducts.filter(product => {
    if (selectedStore !== 'all' && product.boutique.id !== parseInt(selectedStore)) {
      return false;
    }
    return product.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
           product.description.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mes Produits</h1>
          <p className="text-gray-500">Gérez vos produits en vente</p>
        </div>
        <Link 
          to="/controll/AddProduct"
          className="inline-flex items-center px-4 py-2 bg-[#6D28D9] text-white rounded-lg hover:bg-[#6D28D9]/90 transition-colors"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter un produit
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="relative w-full md:w-[200px]">
          <select
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent"
          >
            <option value="all">Toutes les boutiques</option>
            {stores.map(store => (
              <option key={store.id} value={store.id}>
                {store.nom}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          Aucun produit trouvé
        </div>
      ) : (
        <div className="border rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">ID</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Boutique</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                        <Package className="h-4 w-4 text-gray-400" />
                      </div>
                      <span className="font-medium">{product.nom}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell text-gray-500">
                    {product.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {product.prix.toFixed(2)} €
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {product.stock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                    {product.boutique.nom}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(product.stock)}`}>
                      {getStatusText(product.stock)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="relative">
                      <button
                        onClick={() => toggleDropdown(product.id)}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                      {isDropdownOpen[product.id] && (
                        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                          <div className="py-1">
                            <div className="px-4 py-2 text-start text-sm text-gray-700 font-medium">Actions</div>
                            <div className="h-px bg-gray-200"></div>
                            <Link
                              to={`/dashboard/edit-product/${product.id}`}
                              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Modifier
                            </Link>
                            <button 
                              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                              onClick={() => {
                                setIsDropdownOpen({});
                                // Logique pour gérer le stock
                              }}
                            >
                              <Package className="mr-2 h-4 w-4" />
                              Gérer le stock
                            </button>
                            <div className="h-px bg-gray-200"></div>
                            <button 
                              className="w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                              onClick={() => {
                                if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
                                  // Logique de suppression
                                  setIsDropdownOpen({});
                                }
                              }}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Supprimer
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
