
import Header from "./Home/Header";
import Home from "./page/Home";
import Footer from "./Home/Footer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./page/Login";


function App() {
  return (
    <BrowserRouter>
   
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes> 
      <Footer />
    
    </BrowserRouter>

  );
}

export default App;


