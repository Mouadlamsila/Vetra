import React, { useState } from "react";
import { Store, Upload } from "lucide-react";
import ShinyButton from "../../../blocks/TextAnimations/ShinyButton/ShinyButton";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddStorePage() {
  const navigate = useNavigate();
  const [boutique, setBoutique] = useState({
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('location.')) {
      const field = name.split('.')[1];
      setBoutique(prev => ({
        ...prev,
        location: [{
          ...prev.location[0],
          [field]: value
        }]
      }));
    } else {
      setBoutique(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (type === 'logo') {
      setLogo(file);
    } else {
      setBanniere(file);
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

      console.log('Récupération des informations utilisateur...');
      const userResponse = await axios.get('http://localhost:1337/api/users/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Informations utilisateur:', userResponse.data);

      if (!boutique.nom || !boutique.description || !boutique.category || !boutique.emplacement) {
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }

      const requestData = {
        data: {
          nom: boutique.nom,
          description: boutique.description,
          emplacement: boutique.emplacement,
          category: boutique.category,
          statusBoutique: boutique.statusBoutique,
          location: boutique.location,
          owner: userResponse.data.documentId
        }
      };

      console.log('Données de la requête:', JSON.stringify(requestData, null, 2));

      const response = await axios({
        method: 'POST',
        url: 'http://localhost:1337/api/boutiques',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: requestData
      });

      console.log('Réponse de Strapi:', response.data);

      if (response.data.data?.id) {
        const boutiqueId = response.data.data.id;

        if (logo) {
          console.log('Upload du logo...');
          const logoFormData = new FormData();
          logoFormData.append('ref', 'api::boutique.boutique');
          logoFormData.append('refId', boutiqueId);
          logoFormData.append('field', 'logo');
          logoFormData.append('files', logo);

          const logoResponse = await axios.post('http://localhost:1337/api/upload', logoFormData, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          });
          console.log('Logo uploadé:', logoResponse.data);
        }

        if (banniere) {
          console.log('Upload de la bannière...');
          const banniereFormData = new FormData();
          banniereFormData.append('ref', 'api::boutique.boutique');
          banniereFormData.append('refId', boutiqueId);
          banniereFormData.append('field', 'banniere');
          banniereFormData.append('files', banniere);

          const banniereResponse = await axios.post('http://localhost:1337/api/upload', banniereFormData, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          });
          console.log('Bannière uploadée:', banniereResponse.data);
        }

        console.log('Création de la boutique terminée avec succès');
        navigate('/controll/stores');
      }
    } catch (error) {
      console.error('Erreur complète:', error);
      console.error('Détails de l\'erreur:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setError(
        error.response?.data?.error?.message || 
        error.message || 
        'Erreur lors de la création de la boutique'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-10 border-1">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Créer une Boutique</h1>
        <p className="text-muted-foreground text-gray-500">Créez votre nouvelle boutique en ligne</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-lg border-1 border-[#c8c2fd] bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">Informations de la boutique</h3>
          <p className="text-sm text-muted-foreground">Entrez les détails de votre nouvelle boutique</p>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label htmlFor="nom" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Nom de la boutique *
            </label>
            <input
              id="nom"
              name="nom"
              value={boutique.nom}
              onChange={handleInputChange}
              placeholder="Ma Boutique"
              className="w-full h-11 px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={boutique.description}
              onChange={handleInputChange}
              placeholder="Décrivez votre boutique en quelques mots..."
              className="w-full min-h-[100px] px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent transition-all duration-200 placeholder:text-gray-400 resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Catégory *
                </label>
                <select
                  id="category"
                  name="category"
                  value={boutique.category}
                  onChange={handleInputChange}
                  className="w-full h-11 px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
                  required
                >
                  <option value="">Sélectionnez une catégorie</option>
                  <option value="fashion">Mode et Vêtements</option>
                  <option value="electronics">Électronique</option>
                  <option value="home">Maison et Décoration</option>
                  <option value="beauty">Beauté et Bien-être</option>
                  <option value="food">Alimentation</option>
                  <option value="other">Autre</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="emplacement" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Emplacement *
                </label>
                <input
                  id="emplacement"
                  name="emplacement"
                  value={boutique.emplacement}
                  onChange={handleInputChange}
                  placeholder="Adresse de la boutique"
                  className="w-full h-11 px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="location.addressLine1" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Adresse ligne 1
                </label>
                <input
                  id="location.addressLine1"
                  name="location.addressLine1"
                  value={boutique.location[0].addressLine1}
                  onChange={handleInputChange}
                  placeholder="Adresse ligne 1"
                  className="w-full h-11 px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="location.addressLine2" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Adresse ligne 2
                </label>
                <input
                  id="location.addressLine2"
                  name="location.addressLine2"
                  value={boutique.location[0].addressLine2}
                  onChange={handleInputChange}
                  placeholder="Adresse ligne 2"
                  className="w-full h-11 px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="location.city" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Ville
                </label>
                <input
                  id="location.city"
                  name="location.city"
                  value={boutique.location[0].city}
                  onChange={handleInputChange}
                  placeholder="Ville"
                  className="w-full h-11 px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="location.postalCode" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Code postal
                </label>
                <input
                  id="location.postalCode"
                  name="location.postalCode"
                  value={boutique.location[0].postalCode}
                  onChange={handleInputChange}
                  placeholder="Code postal"
                  className="w-full h-11 px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="location.country" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Pays
                </label>
                <input
                  id="location.country"
                  name="location.country"
                  value={boutique.location[0].country}
                  onChange={handleInputChange}
                  placeholder="Pays"
                  className="w-full h-11 px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Logo de la boutique
              </label>
              <div className="border-2 relative border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center gap-2 hover:border-[#c8c2fd] transition-colors duration-200">
                <Store className="h-8 w-8 text-gray-400" />
                <div className="text-center">
                  <p className="text-sm font-medium">Déposez votre logo ici</p>
                  <p className="text-xs text-gray-500">PNG, JPG ou SVG (max. 2MB)</p>
                </div>
                <label htmlFor="logo" className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors duration-200 h-9 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 hover:border-[#c8c2fd]">
                  <Upload className="h-4 w-4 mr-2" />
                  Télécharger
                </label>
                <input 
                  type="file" 
                  id="logo" 
                  className="hidden"
                  onChange={(e) => handleFileChange(e, 'logo')}
                  accept="image/*"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Bannière de la boutique
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center gap-2 hover:border-[#c8c2fd] transition-colors duration-200">
                <div className="text-center">
                  <p className="text-sm font-medium">Déposez votre bannière ici</p>
                  <p className="text-xs text-gray-500">1200 x 300 px recommandé (max. 5MB)</p>
                </div>
                <label htmlFor="banniere" className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors duration-200 h-9 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 hover:border-[#c8c2fd]">
                  <Upload className="h-4 w-4 mr-2" />
                  Télécharger
                </label>
                <input 
                  type="file" 
                  id="banniere" 
                  className="hidden"
                  onChange={(e) => handleFileChange(e, 'banniere')}
                  accept="image/*"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="w-full items-center flex justify-end p-4 gap-2">
          <button 
            type="button"
            onClick={() => navigate('/dashboard')}
            className="inline-flex h-11 items-center justify-center rounded-lg text-sm font-medium transition-colors duration-200 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 hover:border-[#c8c2fd]"
          >
            Annuler
          </button>
          <ShinyButton 
            rounded={true} 
            className="w-full sm:w-auto"
            type="submit"
            disabled={loading}
          >
            <p className="text-sm sm:text-base">
              {loading ? 'Création en cours...' : 'Créer la boutique'}
            </p>
            <Store className="w-4 h-4 sm:w-5 sm:h-5" />
          </ShinyButton>
        </div>
      </form>
    </div>
  );
}

