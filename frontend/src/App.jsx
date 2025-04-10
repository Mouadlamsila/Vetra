
import Header from "./Home/Header";
import Home from "./page/Home";
import Footer from "./Home/Footer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./page/Login";
import Register from "./page/Register";
import Controll from "./page/Controll";


function App() {
  return (
    <BrowserRouter>
   
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/controll" element={<Controll />} />
      </Routes> 
      <Footer />
    
    </BrowserRouter>

  );
}

export default App;


