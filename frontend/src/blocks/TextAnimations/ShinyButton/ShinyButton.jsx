"use client"

import React from "react"

const ShinyButton = ({ children, disabled = false, speed = 5, className = "", onClick }) => {
  // Styles CSS en ligne
  const styles = {
    button: {
      position: "relative",
      overflow: "hidden",
      borderRadius: "6px",
      padding: "12px 24px",
      fontWeight: "500",
      color: "white",
      backgroundColor: disabled ? "#a0a0a0" : "#6D28D9",
      border: "none",
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "background-color 0.3s ease",
      fontSize: "16px",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    content: {
      position: "relative",
      zIndex: 10,
      display:"flex",
      gap:"8px",
    },
    shine: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background:
        "linear-gradient(120deg, rgba(200, 194, 253, 0) 40%, rgba(200, 194, 253, 0.5) 50%, rgba(200, 194, 253, 0) 60%)",
      backgroundSize: "200% 100%",
      animation: disabled ? "none" : `shine ${speed}s linear infinite`,
    },
    "@keyframes shine": {
      "0%": {
        backgroundPosition: "200% 0",
      },
      "100%": {
        backgroundPosition: "-200% 0",
      },
    },
  }

  // Création d'une feuille de style pour l'animation keyframes
  React.useEffect(() => {
    const styleSheet = document.createElement("style")
    styleSheet.type = "text/css"
    styleSheet.innerText = `
      @keyframes shine {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `
    document.head.appendChild(styleSheet)

    return () => {
      document.head.removeChild(styleSheet)
    }
  }, [])

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ ...styles.button, ...(className ? {} : {}) }}
      className={className}
    >
      <span style={styles.content}>{children}</span>
      <span style={styles.shine}></span>
    </button>
  )
}

export default ShinyButton

