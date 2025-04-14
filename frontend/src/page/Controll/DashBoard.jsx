import { ChartColumn, CircleHelp, CirclePlus, CreditCard, Home, Lock, LogOut, Package, PackagePlus, Settings, Shield, ShoppingBag, Store, User, UserPen } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";


export default function DashBoard() {
    const location = useLocation();
    const navigate = useNavigate();
    return (
        <div className="w-full bg-[#1e3a8a] pt-4 grid grid-rows-[10%_90%] ">
            <Link to={'/'}>
            <div className="flex justify-start px-4 border-b-[0.1px] border-gray-300  w-full h-full items-start">
                <img src="/public/img/logo/logo.png" className="h-[48px] w-[145px]" alt="" />
            </div>
            </Link>
            <div className="flex h-full items-center w-full">
                <ul className="grid  w-full h-full flex-col  text-white ">

                    <Link to={'/controll/'} className={`hover:bg-[#c8c2fd] hover:text-[#6D28D9] transition-all  py-2 flex items-center duration-300 w-full ${location.pathname === '/controll/' ?  'bg-[#c8c2fd] text-[#6D28D9] pl-6 pr-4' : 'px-4'}`}>
                        <li className="flex items-center gap-2">
                            <Home />
                            <p>Tableau de bord</p>
                        </li>
                    </Link>
                    <Link to={'/controll/Profil'} className={`hover:bg-[#c8c2fd] hover:text-[#6D28D9] transition-all  py-2 flex items-center duration-300 w-full ${location.pathname === '/controll/Profil' ? 'bg-[#c8c2fd] text-[#6D28D9] pl-6 pr-4' : 'px-4'}`}>
                        <li className="flex items-center gap-2">
                            <User />
                            <p>Profil</p>
                        </li>
                    </Link>
                    <Link to={'/controll/Modification'} className={`hover:bg-[#c8c2fd] hover:text-[#6D28D9] transition-all  py-2 flex items-center duration-300 w-full ${location.pathname === '/controll/Modification' ? 'bg-[#c8c2fd] text-[#6D28D9] pl-6 pr-4' : 'px-4'}`}>
                        <li className="flex   items-center gap-2">
                            <Store />
                            <p>Mes Boutiques</p>
                        </li>
                    </Link>
                    <Link to={'/controll/Modification'} className={`hover:bg-[#c8c2fd] hover:text-[#6D28D9] transition-all  py-2 flex items-center duration-300 w-full ${location.pathname === '/controll/Modification' ? 'bg-[#c8c2fd] text-[#6D28D9] pl-6 pr-4' : 'px-4'}`}>
                        <li className="flex items-center gap-2">
                            <CirclePlus />
                            <p>Créer une Boutique</p>
                            </li>
                    </Link>
                    <Link to={'/controll/Modification'} className={`hover:bg-[#c8c2fd] hover:text-[#6D28D9] transition-all  py-2 flex items-center duration-300 w-full ${location.pathname === '/controll/Modification' ? 'bg-[#c8c2fd] text-[#6D28D9] pl-6 pr-4' : 'px-4'}`}>
                        <li className="flex items-center gap-2">
                            <Package />
                            <p>Mes Produits</p>
                        </li>
                    </Link>
                    <Link to={'/controll/Modification'} className={`hover:bg-[#c8c2fd] hover:text-[#6D28D9] transition-all  py-2 flex items-center duration-300 w-full ${location.pathname === '/controll/Modification' ? 'bg-[#c8c2fd] text-[#6D28D9] pl-6 pr-4' : 'px-4'}`}>
                        <li className="flex items-center gap-2">
                            <PackagePlus />
                            <p>Ajouter un Produit</p>
                        </li>
                    </Link>
                    <Link to={'/controll/Modification'} className={`hover:bg-[#c8c2fd] hover:text-[#6D28D9] transition-all  py-2 flex items-center duration-300 w-full ${location.pathname === '/controll/Modification' ? 'bg-[#c8c2fd] text-[#6D28D9] pl-6 pr-4' : 'px-4'}`}>
                        <li className="flex items-center gap-2">
                            <ShoppingBag />
                            <p>Commandes</p>
                        </li>
                    </Link>
                    <Link to={'/controll/Modification'} className={`hover:bg-[#c8c2fd] hover:text-[#6D28D9] transition-all  py-2 flex items-center duration-300 w-full ${location.pathname === '/controll/Modification' ? 'bg-[#c8c2fd] text-[#6D28D9] pl-6 pr-4' : 'px-4'}`}>
                        <li className="flex items-center gap-2">
                            <ChartColumn />
                            <p>Statistiques</p>
                        </li>
                    </Link>
                    <Link to={'/controll/Modification'} className={`hover:bg-[#c8c2fd] hover:text-[#6D28D9] transition-all  py-2 flex items-center duration-300 w-full ${location.pathname === '/controll/Modification' ? 'bg-[#c8c2fd] text-[#6D28D9] pl-6 pr-4' : 'px-4'}`}>
                        <li className="flex items-center gap-2">
                            <CreditCard />
                            <p>Paiements</p>
                        </li>
                    </Link>
                    <Link to={'/controll/Modification'} className={`hover:bg-[#c8c2fd] hover:text-[#6D28D9] transition-all  py-2 flex items-center duration-300 w-full ${location.pathname === '/controll/Modification' ? 'bg-[#c8c2fd] text-[#6D28D9] pl-6 pr-4' : 'px-4'}`}>
                        <li className="flex items-center gap-2">
                            <Settings />
                            <p>Paramètres</p>
                                </li>
                    </Link>
                    <Link to={'/controll/Modification'} className={`hover:bg-[#c8c2fd] hover:text-[#6D28D9] transition-all  py-2 flex items-center duration-300 w-full ${location.pathname === '/controll/Modification' ? 'bg-[#c8c2fd] text-[#6D28D9] pl-6 pr-4' : 'px-4'}`}>
                        <li className="flex   items-center gap-2">
                            <CircleHelp />
                            <p>Aide</p>
                        </li>
                    </Link>
                    <Link to={'/controll/Modification'} className={`hover:bg-[#c8c2fd] hover:text-[#6D28D9] transition-all  py-2 flex items-center duration-300 w-full ${location.pathname === '/controll/Modification' ? 'bg-[#c8c2fd] text-[#6D28D9] pl-6 pr-4' : 'px-4'}`}>
                        <li className="flex   items-center gap-2">
                            <Shield />
                            <p>Sécurité</p>
                        </li>
                    </Link>
                    <div onClick={() => {
                        localStorage.removeItem("user");
                        localStorage.removeItem("token");
                        navigate("/login");
                    }} className={`hover:bg-[#c8c2fd] hover:text-[#6D28D9] transition-all  py-2 flex items-center duration-300 w-full ${location.pathname === '/controll/Modification' ? 'bg-[#c8c2fd] text-[#6D28D9] pl-6 pr-4' : 'px-4'}`}>
                        <li className="flex   items-center gap-2">
                            <LogOut />
                            <p>Déconnexion</p>
                        </li>
                    </div>
                    

                </ul>
            </div>


        </div>
    )
}
