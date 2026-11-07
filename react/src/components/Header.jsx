import { NavLink } from "react-router-dom";

function Header() {
  // NavLink agrega la clase "active" al link de la ruta actual
  const claseLink = ({ isActive }) => (isActive ? "nav-btn active" : "nav-btn");

  return (
    <header className="header">
      <div className="container">
        <div className="header-brand">
          <h1 className="logo">🌍 Atlas Digital</h1>
          <p className="slogan">Explorador Mundial</p>
        </div>
        <nav className="nav">
          <NavLink to="/" end className={claseLink}>
            Inicio
          </NavLink>
          <NavLink to="/recientes" className={claseLink}>
            Recientes
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Header;
