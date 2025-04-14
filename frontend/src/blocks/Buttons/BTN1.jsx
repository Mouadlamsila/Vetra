import { LogOut } from "lucide-react";
import "./BTN1.css";

export default function BTN1({ 
    text = "Déconnexion", 
    icon = <LogOut className="icon" />, 
    onClick, 
    variant = "primary",
    className = "",
    disabled = false
}) {
    return (
        <button 
            className={`button ${variant} ${className} ${disabled ? 'disabled' : ''}`} 
            type="button"
            onClick={onClick}
            disabled={disabled}
        >
            <span className="button__text">{text}</span>
            <span className="button__icon">{icon}</span>
        </button>
    );
}
