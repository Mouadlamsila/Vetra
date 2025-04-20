import React, { useState, useEffect } from 'react';
import { Upload } from "lucide-react";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

export default function EditProduct() {
  const [activeTab, setActiveTab] = useState('info');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categories: '',
    boutique: null,
    tags: '',
    prix: 0,
    comparePrice: 0,
    cost: 0,
    sku: '',
    stock: 0,
    lowStockAlert: 0,
    weight: 0,
    dimensions: [{
      length: 0,
      width: 0,
      height: 0,
      unit: 'cm'
    }],
    shippingClass: '',
    images: []
  });
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token non trouvé. Veuillez vous connecter.');
        }

        // Fetch stores
        const storesResponse = await axios.get('http://localhost:1337/api/boutiques', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setStores(storesResponse.data.data);

        // Fetch product data
        const productResponse = await axios.get(`http://localhost:1337/api/products/${id}?populate=*`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const product = productResponse.data.data;
        setFormData({
          name: product.name || '',
          description: product.description || '',
          categories: product.categories || '',
          boutique: product.boutique?.nom || null,
          tags: product.tags || '',
          prix: product.prix || 0,
          comparePrice: product.comparePrice || 0,
          cost: product.cost || 0,
          sku: product.sku || '',
          stock: product.stock || 0,
          lowStockAlert: product.lowStockAlert || 0,
          weight: product.weight || 0,
          dimensions: product.dimensions || [{
            length: 0,
            width: 0,
            height: 0,
            unit: 'cm'
          }],
          shippingClass: product.shippingClass || '',
          images: product.images?.map(img => img.id) || []
        });
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Erreur lors du chargement des données');
        toast.error('Erreur lors du chargement des données', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    if (name.startsWith('dimensions.')) {
      const dimension = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        dimensions: [{
          ...prev.dimensions[0],
          [dimension]: dimension === 'unit' ? value : Number(value)
        }]
      }));
    } else if (name === 'boutique') {
      setFormData(prev => ({
        ...prev,
        boutique: value
      }));
    } else {
      if (type === 'number') {
        setFormData(prev => ({
          ...prev,
          [name]: Number(value)
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
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
          images: [uploadResponse.data[0].id]
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, uploadResponse.data[0].id]
        }));
      }

      toast.success('Image téléchargée avec succès', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      setError('Failed to upload image');
      console.error('Error uploading image:', err);
      toast.error('Erreur lors du téléchargement de l\'image', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };
  console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token non trouvé. Veuillez vous connecter.');
      }

      if (!formData.name || !formData.description || !formData.categories || !formData.boutique) {
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }

      // Find the selected store object
      const selectedStore = stores.find(store => store.nom === formData.boutique);
      if (!selectedStore) {
        throw new Error('Boutique sélectionnée invalide');
      }

      const productData = {
        data: {
          name: formData.name,
          description: formData.description,
          categories: formData.categories,
          boutique: selectedStore.id,
          tags: formData.tags,
          prix: Number(formData.prix),
          comparePrice: Number(formData.comparePrice),
          cost: Number(formData.cost),
          sku: formData.sku,
          stock: Number(formData.stock),
          lowStockAlert: Number(formData.lowStockAlert),
          weight: Number(formData.weight),
          dimensions: formData.dimensions.map(dim => ({
            length: Number(dim.length),
            width: Number(dim.width),
            height: Number(dim.height),
            unit: dim.unit
          })),
          shippingClass: formData.shippingClass,
          images: formData.images.map(imgId => 
            imgId
          )
        }
      };

        
      

      await axios.put(
        `http://localhost:1337/api/products/${id}`,
        productData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success('Produit mis à jour avec succès', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      await Swal.fire({
        title: "Produit mis à jour!",
        text: "Le produit a été mis à jour avec succès.",
        icon: "success",
        confirmButtonText: "OK"
      });

      navigate('/controll/products');
    } catch (err) {
      setError(err.message || 'Failed to update product');
      console.error('Error updating product:', err);
      toast.error(err.message || 'Erreur lors de la mise à jour du produit', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    const result = await Swal.fire({
      title: "Êtes-vous sûr?",
      text: "Toutes les modifications non enregistrées seront perdues.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, quitter",
      cancelButtonText: "Annuler"
    });
    
    if (result.isConfirmed) {
      navigate('/controll/products');
    }
  };
  

  if (loading && !formData.name) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6D28D9]"></div>
      </div>
    );
  }


  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Modifier un Produit</h1>
        <p className="text-gray-500">Modifiez les informations de votre produit</p>
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
              <p className="text-sm text-gray-500">Modifiez les détails de base de votre produit</p>
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
                    name="categories"
                    value={formData.categories}
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
                  <label htmlFor="product-store" className="block text-sm font-medium text-gray-700">
                    Boutique
                  </label>
                  <select
                    id="product-store"
                    name="boutique"
                    value={formData.boutique}
                    onChange={handleInputChange}
                    className="mt-1 block py-3 px-4 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent sm:text-sm"
                  >
                    <option value="store.nom">Sélectionnez une boutique</option>
                    {stores ? (
                      stores.map(store => 
                        <option key={store.id} value={store.nom}>
                          {store?.nom || `Boutique ${store.nom}`}
                        </option>
                      )
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
              <p className="text-sm text-gray-500">Modifiez les images de votre produit</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Image principale</label>
                <div className="mt-1 border-2 border-dashed  border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center gap-2" style={{ backgroundImage: `url(http://localhost:1337${formData?.images[5]?.url})` }}>
                  <div className="text-center ">
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
              <p className="text-sm text-gray-500">Modifiez les prix et la gestion du stock</p>
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
              <p className="text-sm text-gray-500">Modifiez les options de livraison pour ce produit</p>
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
                    value={formData.dimensions[0].length}
                    onChange={handleInputChange}
                    className="block w-full py-3 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent sm:text-sm"
                  />
                  <input
                    type="number"
                    placeholder="l"
                    name="dimensions.width"
                    value={formData.dimensions[0].width}
                    onChange={handleInputChange}
                    className="block w-full py-3 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent sm:text-sm"
                  />
                  <input
                    type="number"
                    placeholder="H"
                    name="dimensions.height"
                    value={formData.dimensions[0].height}
                    onChange={handleInputChange}
                    className="block w-full py-3 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent sm:text-sm"
                  />
                  <select 
                    name="dimensions.unit" 
                    value={formData.dimensions[0].unit}
                    onChange={handleInputChange}
                    className="block w-full py-3 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent sm:text-sm"
                  >
                    <option value="cm">cm</option>
                    <option value="m">m</option>
                    <option value="mm">mm</option>
                    <option value="in">in</option>
                    <option value="ft">ft</option>
                  </select>
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
                <option value="free">Free</option>
                <option value="local_pickup">Local Pickup</option>
                <option value="heavy">Heavy</option>
                <option value="fragile">Fragile</option>
                <option value="international">International</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={handleCancel}
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
          {loading ? 'Enregistrement...' : 'Mettre à jour le produit'}
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