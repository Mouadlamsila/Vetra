import axios from "axios";
import { Lock, MailIcon, PenIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function Profile() {
    console.log(localStorage.getItem("token"))
    const [user, setUser] = useState()
    useEffect(() => {
        axios.get("http://localhost:1337/api/users/me", {
            headers: {

                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }).then((res) => {
            setUser(res.data);
        })
    }, []);
    return (
        <div className="py-10 px-10">
            <h1 className="text-3xl font-bold">Mon Profil</h1>
            <p className="text-sm text-gray-500">Gérez vos informations personnelles</p>
            <div className="pt-5  w-auto">
                <p className="py-1 w-30 text-center bg-gray-100 px-2 hover:bg-white rounded-sm text-gray-500 hover:text-black transition-all duration-300 ease-in-out cursor-pointer   " >Informations</p>
            </div>
            <div className="border mt-5 space-y-4 px-10 py-5 rounded-sm border-gray-500">
                <div className="">
                    <h1 className="text-2xl font-bold">Informations personnelles</h1>
                    <p className="text-sm text-gray-500">Mettez à jour vos informations personnelles</p>
                </div>
                <div className="flex gap-5">
                    <div className="">
                        <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="" className="w-20 h-20 rounded-[50%] bg-gray-100 bg-cover bg-center" />
                    </div>
                    <div className="grid w-full grid-cols-2 gap-5">
                        <div className="flex items-center gap-2">
                            <PenIcon className="w-5 h-5 text-gray-500" />
                            <input type="text" defaultValue={user?.username} className="w-full outline-none px-2 border-b-2 border-gray-500" placeholder="Nom" />
                        </div>
                        <div className="flex items-center gap-2">
                            <MailIcon className="w-5 h-5 text-gray-500" />
                            <input type="email" defaultValue={user?.email} className="w-full outline-none px-2 border-b-2 border-gray-500" placeholder="Email" />
                        </div>
                        <div className="flex items-center gap-2">
                            <Lock className="w-5 h-5 text-gray-500" />
                            <input type="password" className="w-full outline-none px-2 border-b-2 border-gray-500" placeholder="Mot de passe" />
                        </div>
                        <div className="flex items-center gap-2">
                            <Lock className="w-5 h-5 text-gray-500" />
                            <input type="password" className="w-full outline-none px-2 border-b-2 border-gray-500" placeholder="Confirmation du mot de passe" />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Mettre à jour</button>
                </div>
            </div>

        </div>
    )
}
