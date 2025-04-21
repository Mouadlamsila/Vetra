import { Package, PlusCircle, Pencil, Store, Tag, Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Stores() {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const IDUser = localStorage.getItem('IDUser');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStores = async () => {
            try {
                const response = await axios.get(`http://localhost:1337/api/users/${IDUser}?populate=boutiques`);
                const storesData = response.data.boutiques;
                
                // Fetch products count for each store
                const storesWithProducts = await Promise.all(
                    storesData.map(async (store) => {
                        try {
                            const productsResponse = await axios.get(
                                `http://localhost:1337/api/products?filters[boutique][id][$eq]=${store.id}`
                            );
                            return {
                                ...store,
                                productsCount: productsResponse.data.meta.pagination.total
                            };
                        } catch (error) {
                            console.error(`Error fetching products for store ${store.id}:`, error);
                            return {
                                ...store,
                                productsCount: 0
                            };
                        }
                    })
                );

                setStores(storesWithProducts);
                setLoading(false);
            } catch (error) {
                setError(`Error fetching stores: ${error.message}`);
                setLoading(false);
            }
        };

        fetchStores();
    }, []);

    if (loading) {
        return (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6D28D9]"></div>
          </div>
        );
      }
      if (error) {
        return (
          <div className="p-6 text-center">
            <div className="bg-red-50 text-red-700 p-4 rounded-md">
              {error}
            </div>
            <button 
              onClick={() => navigate('/login')}
              className="mt-4 px-4 py-2 bg-[#6D28D9] text-white rounded-lg hover:bg-[#6D28D9]/90 transition-colors"
            >
              Se connecter
            </button>
          </div>
        );
      }

    return (
        <div className="p-5 space-y-5">
            <div className="flex justify-between items-center">
                <div className="">
                    <h1 className="text-4xl font-bold">Mes Boutiques</h1>
                    <p className=" text-gray-500">Gérez vos boutiques en ligne</p>
                </div>
                <div className="">
                    <Link to={'/controll/AddStore'}>
                    <button className="bg-[#6D28D9] flex items-center hover:bg-[#6D28D9]/90 transition-all duration-300 gap-4 text-white px-4 py-2 rounded-md">
                        <PlusCircle size={18} />
                        Créer une boutique
                    </button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                 {stores?.map((store, index) => (
                    <div key={store.id} className="bg-white border border-[#c8c2fd] space-y-4 shadow rounded-lg px-5 py-4">
                        <div className="flex justify-between items-start">
                            <div className="">
                                <h1 className="text-2xl font-bold">{store.nom}</h1>
                                <p className="text-sm text-gray-500">{store.description}</p>
                            </div>
                            <p className={`text-sm ${store.statusBoutique === 'active' ? 'text-green-500 bg-green-500/10 px-4 py-0.5 rounded-2xl' : store.statusBoutique === 'suspended' ? 'text-red-500 bg-red-500/10 px-4 py-0.5 rounded-2xl' : 'text-yellow-500 bg-yellow-500/10 px-4 py-0.5 rounded-2xl'}`}>
                                {store.statusBoutique}
                            </p>
                        </div>

                        <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-500 flex items-center gap-2">
                                <Store size={18} /> {index + 1}
                            </p>
                            <p className="text-sm text-gray-500 flex items-center gap-2">
                                <Package size={18} /> Produits: {store.productsCount}
                            </p>
                        </div>

                        <div className="flex justify-between gap-2">
                            <button 
                                onClick={() => navigate(`/controll/stores/${store.id}`)}
                                className="bg-white border border-gray-300 flex items-center hover:bg-[#c8c2fd]/30 hover:text-[#1e3a8a] transition-all duration-300 gap-2 text-gray-500 px-4 py-2 rounded-md"
                            >
                                <Eye size={18} /> Voir
                            </button>
                            <button 
                                onClick={() => navigate(`/controll/edit-store/${store.documentId}`)}
                                className="bg-white border border-gray-300 flex items-center hover:bg-[#c8c2fd]/30 hover:text-[#1e3a8a] transition-all duration-300 gap-2 text-gray-500 px-4 py-2 rounded-md"
                            >
                                <Pencil size={18} /> Modifier
                            </button>
                        </div>
                    </div>
                ))}
             </div>
        </div>
    )
}
