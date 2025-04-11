import Header from "./Home/Header";
import Home from "./page/Home";
import Footer from "./Home/Footer";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Login from "./page/login";
import Register from "./page/register";
import Controll from "./page/Controll";
import Middle from "./page/Controll/middle";

function AppContent() {
  const location = useLocation();
  return (
    <>
      {!location.pathname.startsWith('/controll') && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/controll/*" element={<Controll />}>
          <Route index element={<Middle />} />
          <Route path="Profil" element={<Middle />} />
          <Route path="Modification" element={<Middle />} />
        </Route>
      </Routes>
      {!location.pathname.startsWith('/controll') && <Footer />}
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


