import Header from "./Home/Header";
import Home from "./page/Home";
import Footer from "./Home/Footer";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Login from "./page/login";
import Register from "./page/register";
import Controll from "./page/Controll";
import Middle from "./page/Controll/middle";
import ViewRoute from "./page/View/App";
import HomeView from "./page/View/pages/Home";

function AppContent() {
  const location = useLocation();
  return (
    <>
      {!location.pathname.startsWith('/controll') && !location.pathname.startsWith('/view') && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/controll/*" element={<Controll />}>
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
