import React, { useState, useEffect } from 'react';
import { Upload } from "lucide-react";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';

export default function EditProduct() {
  const { t } = useTranslation();
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
    imgMain: null,
    imgsAdditional: []
  });
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const IDUser = localStorage.getItem('IDUser');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token non trouvé. Veuillez vous connecter.');
        }

        // Fetch stores
        const storesResponse = await axios.get(`http://localhost:1337/api/users/${IDUser}?populate=boutiques`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setStores(storesResponse.data.boutiques || []);

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
          boutique: product.boutique?.id || null,
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
          imgMain: product.imgMain || null,
          imgsAdditional  : product.imgsAdditional?.map(img => img.id) || []
        });
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Erreur lors du chargement des données');
        toast.error(t('product.editProduct.fetchError'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, IDUser, t]);

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
          imgMain: uploadResponse.data[0].id
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          imgsAdditional: [...prev.imgsAdditional, uploadResponse.data[0].id]
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

      const productData = {
        data: {
          name: formData.name,
          description: formData.description,
          categories: formData.categories,
          boutique: formData.boutique,
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
          imgMain: formData.imgMain,
          imgsAdditional: formData.imgsAdditional
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

      toast.success(t('product.editProduct.success'));

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
      toast.error(t('product.editProduct.error'));
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
        <h1 className="text-3xl font-bold tracking-tight">{t('product.editProduct.title')}</h1>
        <p className="text-gray-500">{t('product.editProduct.description')}</p>
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
            {t('product.editProduct.info')}
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
            {t('product.editProduct.images')}
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
            {t('product.editProduct.pricing')}
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
            {t('product.editProduct.shipping')}
          </button>
        </nav>
      </div>

      {activeTab === 'info' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-medium">{t('product.editProduct.productInfo')}</h2>
              <p className="text-sm text-gray-500">{t('product.editProduct.productInfoDescription')}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="product-name" className="block text-sm font-medium text-gray-700">
                  {t('product.editProduct.productName')}
                </label>
                <input
                  type="text"
                  id="product-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block py-3 px-4 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent sm:text-sm"
                  placeholder={t('product.editProduct.productNamePlaceholder')}
                />
              </div>

              <div>
                <label htmlFor="product-description" className="block text-sm font-medium text-gray-700">
                  {t('product.editProduct.description')}
                </label>
                <textarea
                  id="product-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="mt-1 block py-3 px-4 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent sm:text-sm"
                  placeholder={t('product.editProduct.descriptionPlaceholder')}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="product-category" className="block text-sm font-medium text-gray-700">
                    {t('product.editProduct.category')}
                  </label>
                  <select
                    id="product-category"
                    name="categories"
                    value={formData.categories}
                    onChange={handleInputChange}
                    className="mt-1 block py-3 px-4 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent sm:text-sm"
                  >
                    <option value="">{t('product.editProduct.selectCategory')}</option>
                    <option value="clothing">{t('product.editProduct.clothing')}</option>
                    <option value="electronics">{t('product.editProduct.electronics')}</option>
                    <option value="home">{t('product.editProduct.home')}</option>
                    <option value="beauty">{t('product.editProduct.beauty')}</option>
                    <option value="other">{t('product.editProduct.other')}</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="product-store" className="block text-sm font-medium text-gray-700">
                    {t('product.editProduct.store')}
                  </label>
                  <select
                    id="product-store"
                    name="boutique"
                    value={formData.boutique}
                    onChange={handleInputChange}
                    className="mt-1 block py-3 px-4 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent sm:text-sm"
                  >
                    <option value="">{t('product.editProduct.selectStore')}</option>
                    {stores.map(store => (
                      <option key={store.id} value={store.id}>
                        {store.nom}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="product-tags" className="block text-sm font-medium text-gray-700">
                  {t('product.editProduct.tags')}
                </label>
                <input
                  type="text"
                  id="product-tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="mt-1 block py-3 px-4 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent sm:text-sm"
                  placeholder={t('product.editProduct.tagsPlaceholder')}
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
              <h2 className="text-lg font-medium">{t('product.editProduct.productImages')}</h2>
              <p className="text-sm text-gray-500">{t('product.editProduct.productImagesDescription')}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('product.editProduct.mainImage')}</label>
                <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center gap-2">
                  <div className="text-center">
                    <p className="text-sm font-medium">{t('product.editProduct.mainImageDescription')}</p>
                    <p className="text-xs text-gray-500">{t('product.editProduct.mainImageSize')}</p>
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
                    {t('product.editProduct.uploadMainImage')}
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">{t('product.editProduct.additionalImages')}</label>
                <div className="mt-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center gap-2"
                    >
                      <div className="text-center">
                        <p className="text-xs text-gray-500">{t('product.editProduct.additionalImageDescription', { index: i })}</p>
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
                        {t('product.editProduct.addAdditionalImage')}
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
              <h2 className="text-lg font-medium">{t('product.editProduct.productPricing')}</h2>
              <p className="text-sm text-gray-500">{t('product.editProduct.productPricingDescription')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="product-price" className="block text-sm font-medium text-gray-700">
                  {t('product.editProduct.price')}
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
                  placeholder={t('product.editProduct.pricePlaceholder')}
                />
              </div>

              <div>
                <label htmlFor="product-compare-price" className="block text-sm font-medium text-gray-700">
                  {t('product.editProduct.comparePrice')}
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
                  placeholder={t('product.editProduct.comparePricePlaceholder')}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="product-cost" className="block text-sm font-medium text-gray-700">
                  {t('product.editProduct.cost')}
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
                  placeholder={t('product.editProduct.costPlaceholder')}
                />
              </div>

              <div>
                <label htmlFor="product-sku" className="block text-sm font-medium text-gray-700">
                  {t('product.editProduct.sku')}
                </label>
                <input
                  type="text"
                  id="product-sku"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  className="mt-1 block py-3 px-4 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent sm:text-sm"
                  placeholder={t('product.editProduct.skuPlaceholder')}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="product-stock" className="block text-sm font-medium text-gray-700">
                  {t('product.editProduct.stock')}
                </label>
                <input
                  type="number"
                  id="product-stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  min="0"
                  className="mt-1 block py-3 px-4 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent sm:text-sm"
                  placeholder={t('product.editProduct.stockPlaceholder')}
                />
              </div>

              <div>
                <label htmlFor="product-low-stock" className="block text-sm font-medium text-gray-700">
                  {t('product.editProduct.lowStockAlert')}
                </label>
                <input
                  type="number"
                  id="product-low-stock"
                  name="lowStockAlert"
                  value={formData.lowStockAlert}
                  onChange={handleInputChange}
                  min="0"
                  className="mt-1 block py-3 px-4 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent sm:text-sm"
                  placeholder={t('product.editProduct.lowStockAlertPlaceholder')}
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
              <h2 className="text-lg font-medium">{t('product.editProduct.productShipping')}</h2>
              <p className="text-sm text-gray-500">{t('product.editProduct.productShippingDescription')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="product-weight" className="block text-sm font-medium text-gray-700">
                  {t('product.editProduct.weight')}
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
                  placeholder={t('product.editProduct.weightPlaceholder')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('product.editProduct.dimensions')}
                </label>
                <div className="mt-1 flex gap-2">
                  <input
                    type="number"
                    placeholder={t('product.editProduct.lengthPlaceholder')}
                    name="dimensions.length"
                    value={formData.dimensions[0].length}
                    onChange={handleInputChange}
                    className="block w-full py-3 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent sm:text-sm"
                  />
                  <input
                    type="number"
                    placeholder={t('product.editProduct.widthPlaceholder')}
                    name="dimensions.width"
                    value={formData.dimensions[0].width}
                    onChange={handleInputChange}
                    className="block w-full py-3 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent sm:text-sm"
                  />
                  <input
                    type="number"
                    placeholder={t('product.editProduct.heightPlaceholder')}
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
                    <option value="cm">{t('product.editProduct.cm')}</option>
                    <option value="m">{t('product.editProduct.m')}</option>
                    <option value="mm">{t('product.editProduct.mm')}</option>
                    <option value="in">{t('product.editProduct.in')}</option>
                    <option value="ft">{t('product.editProduct.ft')}</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="product-shipping-class" className="block text-sm font-medium text-gray-700">
                {t('product.editProduct.shippingClass')}
              </label>
              <select
                id="product-shipping-class"
                name="shippingClass"
                value={formData.shippingClass}
                onChange={handleInputChange}
                className="mt-1 block py-3 px-4 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent sm:text-sm"
              >
                <option value="">{t('product.editProduct.selectShippingClass')}</option>
                <option value="standard">{t('product.editProduct.standard')}</option>
                <option value="express">{t('product.editProduct.express')}</option>
                <option value="free">{t('product.editProduct.free')}</option>
                <option value="local_pickup">{t('product.editProduct.localPickup')}</option>
                <option value="heavy">{t('product.editProduct.heavy')}</option>
                <option value="fragile">{t('product.editProduct.fragile')}</option>
                <option value="international">{t('product.editProduct.international')}</option>
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
          {t('product.editProduct.cancel')}
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#6D28D9] hover:bg-[#6D28D9]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c8c2fd] disabled:opacity-50"
        >
          {loading ? t('product.editProduct.updating') : t('product.editProduct.update')}
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