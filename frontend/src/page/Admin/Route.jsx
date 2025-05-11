import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Users from "./Users";
import Support from "./Support";
import Settings from "./Settings";
import Produits from "./Produits";
import Categories from "./Categories";
import Boutiques from "./Boutiques";
import TopBar from "./components/TopBar";
import Sidebar from "./components/Sidebar";
import ProfileAdmin from "./Profile";

export default function RouteAdmin() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* TopBar */}
                <TopBar onMenuClick={toggleSidebar} />
                
                {/* Page Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/users" element={<Users />} />
                        <Route path="/support" element={<Support />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/products" element={<Produits />} />
                        <Route path="/categories" element={<Categories />} />
                        <Route path="/stores" element={<Boutiques />} />
                        <Route path="/Profile" element={<ProfileAdmin/>}/>
                    </Routes>
                </main>
            </div>
        </div>
    );
}