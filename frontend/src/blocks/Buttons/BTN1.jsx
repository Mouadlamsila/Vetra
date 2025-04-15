import { LogOut } from "lucide-react";
import "./BTN1.css";
import { useTranslation } from "react-i18next";

export default function BTN1({ 
    icon = <LogOut className="icon" />, 
    onClick, 
    variant = "primary",
    className = "",
    disabled = false
}) {
    const { t } = useTranslation();
    return (
        <button 
            className={`button ${variant} ${className} ${disabled ? 'disabled' : ''}`} 
            type="button"
            onClick={onClick}
            disabled={disabled}
        >
            <span className="button__text">{t('dashboard.logout')}</span>
            <span className="button__icon">{icon}</span>
        </button>
    );
}
