import { Package, PlusCircle, Pencil, Store, Tag, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Stores() {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const IDUser = localStorage.getItem('IDUser');
    useEffect(() => {
        const fetchStores = async () => {
            try {
                const response = await axios.get(`http://localhost:1337/api/users/${IDUser}?populate=boutiques`);
                setStores(response.data.boutiques);
                setLoading(false);
            } catch (error) {
                setError(`Error fetching stores: ${error.message}`);
                setLoading(false);
            }
        };

        fetchStores();
    }, []);


    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

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
                            <p className={`text-sm ${store.statusBoutique === 'active' ? 'text-green-500     bg-green-500/10 px-4 py-0.5 rounded-2xl' : store.statusBoutique === 'suspended' ? 'text-red-500 bg-red-500/10 px-4 py-0.5 rounded-2xl' : 'text-yellow-500 bg-yellow-500/10 px-4 py-0.5 rounded-2xl'}`}>{store.statusBoutique}</p>
                        </div>

                        <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-500 flex items-center gap-2"> <Store size={18} /> {index + 1}</p>
                            {/* <p className="text-sm text-gray-500 flex items-center gap-2"> <Tag size={18} /> produits : {store.products || 0}</p>
                            <p className="text-sm text-gray-500 flex items-center gap-2"> <Package size={18} /> commandes : {store.attributes.orders || 0}</p> */}
                        </div>
                        <div className="flex justify-between gap-2">
                            <button className="bg-white border border-gray-300 flex items-center hover:bg-[#c8c2fd]/30 hover:text-[#1e3a8a] transition-all duration-300 gap-2 text-gray-500 px-4 py-2 rounded-md">
                                <Eye size={18} /> Voir
                            </button>
                            <button className="bg-white border border-gray-300 flex items-center hover:bg-[#c8c2fd]/30 hover:text-[#1e3a8a] transition-all duration-300 gap-2 text-gray-500 px-4 py-2 rounded-md">
                                <Pencil size={18} /> Modifier
                            </button>
                        </div>
                    </div>
                ))}
             </div>
        </div>
    )
}
