import Header from "./Home/Header";
import Home from "./page/Home";
import Footer from "./Home/Footer";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Login from "./page/login";
import Register from "./page/register";
import Controll from "./page/Controll";
import Middle from "./page/Controll/middle";
import ViewRoute from "./page/View/App";
import HomeView from "./page/View/pages/Home";
import Owner from "./page/Owner";

// Protected Route component for Owner registration
const ProtectedOwnerRoute = () => {
  const userRole = localStorage.getItem('role');
  return userRole === 'Owner' ? <Navigate to="/" replace /> : <Owner />;
};

// Protected Route component for Controll panel
const ProtectedControllRoute = () => {
  const userRole = localStorage.getItem('role');
  const location = useLocation();
  
  // Check if user is logged in
  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  // List of restricted routes that only Owners can access
  const restrictedRoutes = [
    '/controll/',
    '/controll/Stores',
    '/controll/Products',
    '/controll/Orders',
    '/controll/Stats',
    '/controll/Payment',
    '/controll/AddStore',
    '/controll/AddProduct'
  ];

  // Check if the current path matches any restricted patterns
  const isRestrictedRoute = () => {
    // Check exact matches
    if (restrictedRoutes.includes(location.pathname)) {
      return true;
    }

    // Check dynamic routes for edit product and store
    const editProductPattern = /^\/controll\/edit-product\/\d+$/;
    const editStorePattern = /^\/controll\/edit-store\/\d+$/;

    return editProductPattern.test(location.pathname) || 
           editStorePattern.test(location.pathname);
  };

  // If trying to access a restricted route and not an Owner, redirect to Profile
  if (isRestrictedRoute() && userRole !== 'Owner') {
    return <Navigate to="/controll/Profil" replace />;
  }

  return <Controll />;
};

function AppContent() {
  const location = useLocation();
  return (
    <>
      {!location.pathname.startsWith('/controll') && !location.pathname.startsWith('/view') && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/to-owner" element={<ProtectedOwnerRoute />} />
        <Route path="/controll/*" element={<ProtectedControllRoute />}>
          <Route index element={<Middle />} />
          <Route path="Profil" element={<Middle />} />
          <Route path="Modification" element={<Middle />} />
          <Route path="Stores" element={<Middle />} />
          <Route path="Products" element={<Middle />} />
          <Route path="Orders" element={<Middle />} />
          <Route path="Stats" element={<Middle />} />
          <Route path="Payment" element={<Middle />} />
          <Route path="Settings" element={<Middle />} />
          <Route path="Help" element={<Middle />} />
          <Route path="Security" element={<Middle />} />
          <Route path="edit-product/:id" element={<Middle />} />
          <Route path="edit-store/:id" element={<Middle />} />
        </Route>
        <Route path="/view/*" element={<ViewRoute />} >
          <Route index element={<HomeView />} />
          <Route path=":id" element={<HomeView />} />
          <Route path="categories/:category" element={<HomeView />} />
          <Route path="products/:id" element={<HomeView />} />
        </Route>
      </Routes>
      {!location.pathname.startsWith('/controll') && !location.pathname.startsWith('/view') && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
