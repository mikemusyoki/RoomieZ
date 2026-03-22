import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.nav} aria-label="Main navigation">
      <div style={styles.container}>
        <button
          style={styles.logo}
          onClick={() => navigate("/")}
          aria-label="RoomieZ home"
        >
          🏠 RoomieZ
        </button>

        <div style={styles.links}>
          <button
            onClick={() => navigate("/")}
            style={{ ...styles.link, ...(isActive("/") ? styles.activeLink : {}) }}
          >
            Home
          </button>
          {token && (
            <>
              <button
                onClick={() => navigate("/matches")}
                style={{ ...styles.link, ...(isActive("/matches") ? styles.activeLink : {}) }}
              >
                Matches
              </button>
              <button
                onClick={() => navigate("/chat")}
                style={{ ...styles.link, ...(isActive("/chat") ? styles.activeLink : {}) }}
              >
                Chat
              </button>
              <button
                onClick={() => navigate("/profile")}
                style={{ ...styles.link, ...(isActive("/profile") ? styles.activeLink : {}) }}
              >
                Profile
              </button>
              {user?.email === "admin@ku.ac.ke" && (
                <button
                  onClick={() => navigate("/admin")}
                  style={{ ...styles.link, ...(isActive("/admin") ? styles.activeLink : {}) }}
                >
                  ⚙️ Admin
                </button>
              )}
            </>
          )}
        </div>

        <div style={styles.actions}>
          {token ? (
            <div style={styles.userArea}>
              <span style={styles.userEmail}>{user?.email}</span>
              <button style={styles.btnSecondary} onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div style={styles.userArea}>
              <button
                style={styles.btnSecondary}
                onClick={() => navigate("/login")}
              >
                Login
              </button>
              <button
                style={styles.btnPrimary}
                onClick={() => navigate("/login")}
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    position: "sticky",
    top: 0,
    background: "white",
    borderBottom: "1px solid #E5E7EB",
    zIndex: 100,
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "70px",
  },
  logo: {
    fontWeight: "800",
    fontSize: "20px",
    cursor: "pointer",
    color: "#1A1A1A",
    background: "none",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
  },
  links: {
    display: "flex",
    gap: "8px",
    flex: 1,
    marginLeft: "40px",
  },
  link: {
    color: "#666666",
    background: "none",
    border: "none",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    padding: "8px 14px",
    borderRadius: "6px",
    transition: "all 0.2s",
  },
  activeLink: {
    color: "#FF6B6B",
    background: "#FFF0F0",
    fontWeight: "600",
  },
  actions: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },
  userArea: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },
  userEmail: {
    fontSize: "13px",
    color: "#999",
    maxWidth: "150px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  btnSecondary: {
    background: "transparent",
    border: "2px solid #E5E7EB",
    color: "#1A1A1A",
    padding: "8px 20px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.3s",
  },
  btnPrimary: {
    background: "#FF6B6B",
    border: "none",
    color: "white",
    padding: "8px 20px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.3s",
  },
};

export default Navbar;