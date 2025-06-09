import { Route, Routes } from "react-router-dom";
import BoardTable from "./components/BoardTable";
import Profile from "./components/Profile";

import AddStorePage from "./components/AddStore";
import ProductsPage from "./components/Product";
import AddProductPage from "./components/AddProduct";
import OrdersPage from "./components/Orders";
import StatsPage from "./components/stats";
import PaymentPage from "./components/Payment";
import SettingsPage from "./components/Settings";
import HelpPage from "./components/Help";
import Stores from "./components/Stores";
import EditProduct from "./components/EditProduct";
import EditStore from "./components/EditStore";
import DesignStore from "./components/designStore";

export default function Middle() {
    return (
        <div className="">
            <Routes>
                <Route path="/" element={<BoardTable />} />
                <Route path="/Profil" element={<Profile />} />
                <Route path="/Stores" element={<Stores />} />
                <Route path="/AddStore" element={<AddStorePage />} />
                <Route path="/Products" element={<ProductsPage />} />
                <Route path="/AddProduct" element={<AddProductPage />} />
                <Route path="/Orders" element={<OrdersPage />} />
                <Route path="/Stats" element={<StatsPage />} />
                <Route path="/Payment" element={<PaymentPage />} />
                <Route path="/Settings" element={<SettingsPage />} />
                <Route path="/Help" element={<HelpPage />} />
                <Route path="/edit-product/:id" element={<EditProduct />} />
                <Route path="/edit-store/:id" element={<EditStore />} />
                <Route path="/design/:id" element={<DesignStore />} />
            </Routes>

        </div>
    )
}
