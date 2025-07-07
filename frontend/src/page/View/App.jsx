import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ProductPage from "./pages/product-page";
import CategoryPage from "./pages/category";
import HomeView from "./pages/Home";
import Contact from "./pages/Contact";

export default function ViewRoute() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path=":id" element={<HomeView />} />
          <Route path="categories/:category" element={<CategoryPage />} />
          <Route path="products/:id" element={<ProductPage />} />
          <Route path="contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}