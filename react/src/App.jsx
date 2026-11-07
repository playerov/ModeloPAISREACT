import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import PaisDetail from "./pages/PaisDetail";
import Recientes from "./pages/Recientes";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pais/:cca3" element={<PaisDetail />} />
          <Route path="/recientes" element={<Recientes />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
