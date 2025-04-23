import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

export default function EditStore() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    emplacement: '',
    category: 'other',
    statusBoutique: 'pending',
    location: [{
      addressLine1: '',
      addressLine2: '',
      city: '',
      postalCode: '',
      country: '',
      isDefault: true
    }]
  });
  const [logo, setLogo] = useState(null);
  const [banniere, setBanniere] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [logoLoading, setLogoLoading] = useState(false);
  const [banniereLoading, setBanniereLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:1337/api/boutiques/${id}?populate=*`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
     

        const store = response.data.data;
     

        setFormData({
          nom: store.nom || '',
          description: store.description || '',
          emplacement: store.emplacement || '',
          category: store.category || 'other',
          statusBoutique: store.statusBoutique || 'pending',
          location:[{
            addressLine1: store.location[0].addressLine1 || '',
            addressLine2: store.location[0].addressLine2 || '',
            city: store.location[0].city || '',
            postalCode: store.location[0].postalCode || '',
            country: store.location[0].country || '',
            isDefault: true
          }]
        });

        if (store.logo) {
          setLogo(store.logo);
        }
        if (store.banniere) {
          setBanniere(store.banniere);
        }
      } catch (err) {
        console.error('Error fetching store data:', err);
        setError('Erreur lors du chargement des données de la boutique');
        toast.error('Erreur lors du chargement des données de la boutique', {
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

    fetchStoreData();
  }, [id, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('location.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: [{
          ...prev.location[0],
          [field]: value
        }]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLogoLoading(true);
    const formData = new FormData();
    formData.append('files', file);

    try {
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

      setLogo(uploadResponse.data[0]);
      setLogoLoading(false);

      toast.success('Logo téléchargé avec succès', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      setError('Failed to upload logo');
      setLogoLoading(false);
      console.error('Error uploading logo:', err);
      toast.error('Erreur lors du téléchargement du logo', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleBanniereUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setBanniereLoading(true);
    const formData = new FormData();
    formData.append('files', file);

    try {
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

      setBanniere(uploadResponse.data[0]);
      setBanniereLoading(false);

      toast.success('Bannière téléchargée avec succès', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      setError('Failed to upload banniere');
      setBanniereLoading(false);
      console.error('Error uploading banniere:', err);
      toast.error('Erreur lors du téléchargement de la bannière', {
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
      if (!formData.nom || !formData.description || !formData.category || !formData.emplacement) {
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }

      const storeData = {
        data: {
          nom: formData.nom,
          description: formData.description,
          emplacement: formData.emplacement,
          category: formData.category,
          statusBoutique: formData.statusBoutique,
          location: formData.location,
          logo: logo ? logo.id : null,
          banniere: banniere ? banniere.id : null
        }
      };

      console.log('Submitting Store Data:', JSON.stringify(storeData, null, 2));

      const response = await axios.put(
        `http://localhost:1337/api/boutiques/${id}`,
        storeData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );


      toast.success('Boutique mise à jour avec succès', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      await Swal.fire({
        title: "Boutique mise à jour!",
        text: "La boutique a été mise à jour avec succès.",
        icon: "success",
        confirmButtonText: "OK"
      });

      navigate('/controll/stores');
    } catch (err) {
      console.error('Error updating store:', err);
      console.error('Error details:', err.response?.data);
      setError(err.message || 'Failed to update store');
      toast.error(err.response?.data?.error?.message || 'Erreur lors de la mise à jour de la boutique', {
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
      navigate('/controll/stores');
    }
  };

  if (loading && !formData.nom) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6D28D9]"></div>
      </div>
    );
  }
  

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('store.editStore.title')}</h1>
        <p className="text-gray-500">{t('store.editStore.subtitle')}</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="store-name" className="block text-sm font-medium text-gray-700">
                {t('store.createStore.storeName')}
              </label>
              <input
                type="text"
                id="store-name"
                name="nom"
                value={formData?.nom}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent sm:text-sm"
                placeholder={t('store.createStore.storeNamePlaceholder')}
                required
              />
            </div>

            <div>
              <label htmlFor="store-category" className="block text-sm font-medium text-gray-700">
                {t('store.createStore.category')}
              </label>
              <select
                id="store-category"
                name="category"
                value={formData?.category}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent sm:text-sm"
                required
              >
                <option value="fashion">{t('store.createStore.categories.fashion')}</option>
                <option value="electronics">{t('store.createStore.categories.electronics')}</option>
                <option value="home">{t('store.createStore.categories.home')}</option>
                <option value="beauty">{t('store.createStore.categories.beauty')}</option>
                <option value="food">{t('store.createStore.categories.food')}</option>
                <option value="other">{t('store.createStore.categories.other')}</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="store-description" className="block text-sm font-medium text-gray-700">
                {t('store.createStore.description')}
              </label>
              <textarea
                id="store-description"
                name="description"
                value={formData?.description}
                onChange={handleInputChange}
                rows={4}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent sm:text-sm"
                placeholder={t('store.createStore.descriptionPlaceholder')}
                required
              />
            </div>

            <div>
              <label htmlFor="store-address" className="block text-sm font-medium text-gray-700">
                {t('store.createStore.location')}
              </label>
              <input
                type="text"
                id="store-address"
                name="emplacement"
                value={formData?.emplacement}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent sm:text-sm"
                placeholder={t('store.createStore.locationPlaceholder')}
                required
              />
            </div>

            <div>
              <label htmlFor="location.addressLine1" className="block text-sm font-medium text-gray-700">
                {t('store.createStore.address.line1')}
              </label>
              <input
                id="location.addressLine1"
                name="location.addressLine1"
                value={formData?.location[0]?.addressLine1}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent sm:text-sm"
                placeholder={t('store.createStore.address.line1Placeholder')}
              />
            </div>

            <div>
              <label htmlFor="location.addressLine2" className="block text-sm font-medium text-gray-700">
                {t('store.createStore.address.line2')}
              </label>
              <input
                id="location.addressLine2"
                name="location.addressLine2"
                value={formData?.location[0]?.addressLine2}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent sm:text-sm"
                placeholder={t('store.createStore.address.line2Placeholder')}
              />
            </div>

            <div>
              <label htmlFor="location.city" className="block text-sm font-medium text-gray-700">
                {t('store.createStore.address.city')}
              </label>
              <input
                id="location.city"
                name="location.city"
                value={formData?.location[0]?.city}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent sm:text-sm"
                placeholder={t('store.createStore.address.cityPlaceholder')}
              />
            </div>

            <div>
              <label htmlFor="location.postalCode" className="block text-sm font-medium text-gray-700">
                {t('store.createStore.address.postalCode')}
              </label>
              <input
                id="location.postalCode"
                name="location.postalCode"
                value={formData?.location[0]?.postalCode}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent sm:text-sm"
                placeholder={t('store.createStore.address.postalCodePlaceholder')}
              />
            </div>

            <div>
              <label htmlFor="location.country" className="block text-sm font-medium text-gray-700">
                {t('store.createStore.address.country')}
              </label>
              <input
                id="location.country"
                name="location.country"
                value={formData?.location[0]?.country}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent sm:text-sm"
                placeholder={t('store.createStore.address.countryPlaceholder')}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                {t('store.createStore.logo')}
              </label>
              <div className="mt-1 flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="store-logo"
                  disabled={logoLoading}
                />
                <label
                  htmlFor="store-logo"
                  className={`inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c8c2fd] cursor-pointer ${logoLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {logoLoading ? t('store.editStore.updating') : t('store.createStore.upload')}
                </label>
                {logoLoading ? (
                  <div className="relative w-24 h-24 border-2 border-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#6D28D9]"></div>
                  </div>
                ) : logo && (
                  <div className="relative w-24 h-24 border-2 border-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={`http://localhost:1337${logo.url}`}
                      alt={t('store.createStore.logo')}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setLogo(null)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                {t('store.createStore.banner')}
              </label>
              <div className="mt-1 flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBanniereUpload}
                  className="hidden"
                  id="store-banniere"
                  disabled={banniereLoading}
                />
                <label
                  htmlFor="store-banniere"
                  className={`inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c8c2fd] cursor-pointer ${banniereLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {banniereLoading ? t('store.editStore.updating') : t('store.createStore.upload')}
                </label>
                {banniereLoading ? (
                  <div className="relative w-full h-32 border-2 border-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#6D28D9]"></div>
                  </div>
                ) : banniere && (
                  <div className="relative w-full h-32 border-2 border-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={`http://localhost:1337${banniere.url}`}
                      alt={t('store.createStore.banner')}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setBanniere(null)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c8c2fd]"
        >
          {t('store.createStore.cancel')}
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#6D28D9] hover:bg-[#6D28D9]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c8c2fd] disabled:opacity-50"
        >
          {loading ? t('store.editStore.updating') : t('store.editStore.update')}
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