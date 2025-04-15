import { Package, PlusCircle, Pencil, Store, Tag, Eye } from "lucide-react";
import { Link } from "react-router-dom";

export default function Stores() {
    const stores = [
        {
            name: "Boutique 1",
            description: "Description de la boutique 1",
            status: "active",
            products: 10,
            orders: 100
        },
        {
            name: "Boutique 2",
            description: "Description de la boutique 2",
            status: "inactive",
            products: 10,
            orders: 100
        },
        {
            name: "Boutique 3",
            description: "Description de la boutique 3",
            status: "en attente",
            products: 10,
            orders: 100
        },
        {
            name: "Boutique 4",
            description: "Description de la boutique 4",
            status: "en attente",
            products: 10,
            orders: 100
        },
        {
            name: "Boutique 5",
            description: "Description de la boutique 5",
            status: "inactive",
            products: 10,
            orders: 100
        },
    ]
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
                    <div key={index} className="bg-white border border-[#c8c2fd] space-y-4 shadow rounded-lg px-5 py-4">

                        <div className="flex justify-between items-start">
                            <div className="">
                                <h1 className="text-2xl font-bold">{store.name}</h1>
                                <p className="text-sm text-gray-500">{store.description}</p>
                            </div>
                            <p className={`text-sm ${store.status === 'active' ? 'text-green-500     bg-green-500/10 px-4 py-0.5 rounded-2xl' : store.status === 'inactive' ? 'text-red-500 bg-red-500/10 px-4 py-0.5 rounded-2xl' : 'text-yellow-500 bg-yellow-500/10 px-4 py-0.5 rounded-2xl'}`}>{store.status}</p>
                        </div>

                        <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-500 flex items-center gap-2"> <Store size={18} /> {index + 1}</p>
                            <p className="text-sm text-gray-500 flex items-center gap-2"> <Tag size={18} /> produits : {store.products}</p>
                            <p className="text-sm text-gray-500 flex items-center gap-2"> <Package size={18} /> commandes : {store.orders}</p>
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
