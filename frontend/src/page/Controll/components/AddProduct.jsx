import React, { useState, useEffect } from 'react';
import { Upload } from "lucide-react";
import axios from 'axios';

export default function AddProductPage() {
  const [activeTab, setActiveTab] = useState('info');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    boutiques: null, // Changed from array to single value
    tags: '',
    prix: '', // Changed from price to prix to match your field name
    comparePrice: '',
    cost: '',
    sku: '',
    stock: '',
    lowStockAlert: '',
    weight: '',
    dimensions: {
      length: '',
      width: '',
      height: ''
    },
    shippingClass: '',
    images: []
  });
  const [boutiques, setBoutiques] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch boutiques when component mounts
    const fetchBoutiques = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token non trouvé. Veuillez vous connecter.');
        }

        const response = await axios.get('http://localhost:1337/api/boutiques', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setBoutiques(response.data.data || []);
      } catch (err) {
        setError('Failed to fetch boutiques');
        console.error('Error fetching boutiques:', err);
      }
    };
    fetchBoutiques();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('dimensions.')) {
      const dimension = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        dimensions: {
          ...prev.dimensions,
          [dimension]: value
        }
      }));
    } else if (name === 'boutiques') {
      // Handle single boutique selection
      const selectedOption = Number(e.target.value);
      setFormData(prev => ({
        ...prev,
        boutiques: selectedOption
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageUpload = async (e, isMain = false) => {
    const files = e.target.files;
    if (!files.length) return;

    const formData = new FormData();
    formData.append('files', files[0]);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token non trouvé. Veuillez vous connecter.');
      }

      const uploadResponse = await axios.post(
        'http://localhost:1337/api/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (isMain) {
        setFormData(prev => ({
          ...prev,
          images: [uploadResponse.data[0].id, ...prev.images]
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, uploadResponse.data[0].id]
        }));
      }
    } catch (err) {
      setError('Failed to upload image');
      console.error('Error uploading image:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token non trouvé. Veuillez vous connecter.');
      }

      // Validate required fields
      if (!formData.name || !formData.description || !formData.category || !formData.boutiques) {
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }

      // First, check if the user has permission to create products
      try {
        // Try to fetch the current user to verify permissions
        await axios.get('http://localhost:1337/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        console.log('User info:', formData);
        
        // Now create the product
        await axios.post(
          'http://localhost:1337/api/produits', // Changed from 'products' to 'produits' to match your API
          {
            data: {
              ...formData,
              // Format boutiques as a single ID for the API
              boutiques: formData.boutiques
            }
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
      
        // Reset form and show success message
        setFormData({
          name: '',
          description: '',
          category: '',
          boutiques: null,
          tags: '',
          prix: '',
          comparePrice: '',
          cost: '',
          sku: '',
          stock: '',
          lowStockAlert: '',
          weight: '',
          dimensions: {
            length: '',
            width: '',
            height: ''
          },
          shippingClass: '',
          images: []
        });
        alert('Product created successfully!');
      } catch (apiError) {
        console.error('API Error:', apiError.response?.data || apiError);
        
        if (apiError.response?.status === 403) {
          throw new Error('Vous n\'avez pas les permissions nécessaires pour créer un produit. Veuillez contacter l\'administrateur.');
        } else {
          throw new Error(apiError.response?.data?.error?.message || apiError.message || 'Erreur lors de la création du produit');
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to create product');
      console.error('Error creating product:', err);
    } finally {
      setLoading(false);
    }
  };

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
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block py-3 px-4 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent sm:text-sm"
                  placeholder="Nom du produit"
                />
              </div>

              <div>
                <label htmlFor="product-description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="product-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="mt-1 block py-3 px-4 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent sm:text-sm"
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
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="mt-1 block py-3 px-4 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent sm:text-sm"
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
                  <label htmlFor="product-boutiques" className="block text-sm font-medium text-gray-700">
                    Boutique
                  </label>
                  <select
                    id="product-boutiques"
                    name="boutiques"
                    value={formData.boutiques || ''}
                    onChange={handleInputChange}
                    className="mt-1 block py-3 px-4 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent sm:text-sm"
                  >
                    <option value="">Sélectionnez une boutique</option>
                    {boutiques && boutiques.length > 0 ? (
                      boutiques.map(boutique => (
                        <option key={boutique.id} value={boutique.id}>
                          {boutique.attributes?.nom || `Boutique ${boutique.id}`}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>Aucune boutique disponible</option>
                    )}
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
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="mt-1 block py-3 px-4 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent sm:text-sm"
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
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, true)}
                    className="hidden"
                    id="main-image"
                  />
                  <label
                    htmlFor="main-image"
                    className="mt-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c8c2fd] cursor-pointer"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Télécharger
                  </label>
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
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e)}
                        className="hidden"
                        id={`additional-image-${i}`}
                      />
                      <label
                        htmlFor={`additional-image-${i}`}
                        className="mt-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c8c2fd] cursor-pointer"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Ajouter
                      </label>
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
                  name="prix"
                  value={formData.prix}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="mt-1 block py-3 px-4 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent sm:text-sm"
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
                  name="comparePrice"
                  value={formData.comparePrice}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="mt-1 block py-3 px-4 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent sm:text-sm"
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
                  name="cost"
                  value={formData.cost}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="mt-1 block py-3 px-4 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent sm:text-sm"
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
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  className="mt-1 block py-3 px-4 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent sm:text-sm"
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
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  min="0"
                  className="mt-1 block py-3 px-4 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent sm:text-sm"
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
                  name="lowStockAlert"
                  value={formData.lowStockAlert}
                  onChange={handleInputChange}
                  min="0"
                  className="mt-1 block py-3 px-4 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent sm:text-sm"
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
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="mt-1 block py-3 px-4 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent sm:text-sm"
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
                    name="dimensions.length"
                    value={formData.dimensions.length}
                    onChange={handleInputChange}
                    className="block w-full py-3 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent sm:text-sm"
                  />
                  <input
                    type="number"
                    placeholder="l"
                    name="dimensions.width"
                    value={formData.dimensions.width}
                    onChange={handleInputChange}
                    className="block w-full py-3 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent sm:text-sm"
                  />
                  <input
                    type="number"
                    placeholder="H"
                    name="dimensions.height"
                    value={formData.dimensions.height}
                    onChange={handleInputChange}
                    className="block w-full py-3 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent sm:text-sm"
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
                name="shippingClass"
                value={formData.shippingClass}
                onChange={handleInputChange}
                className="mt-1 block py-3 px-4 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent sm:text-sm"
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
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#6D28D9] hover:bg-[#6D28D9]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c8c2fd] disabled:opacity-50"
        >
          {loading ? 'Enregistrement...' : 'Enregistrer le produit'}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
}
