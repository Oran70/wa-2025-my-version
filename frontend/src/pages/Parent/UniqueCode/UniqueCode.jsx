import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UniqueCode.css";

export default function UniqueCode() {
    const [code, setCode] = useState("");
    const [showError, setShowError] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`/api/validate-code/${code}`);
            const result = await response.json();

            if (result.valid) {
                navigate("/afspraak-plannen", { state: { code } });
            } else {
                setShowError(true);
            }
        } catch (err) {
            setShowError(true);
        } finally {
            setLoading(false);
        }
    };


    const closeModal = () => {
        setShowError(false);
        setCode("");
    };

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") closeModal();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, []);

    return (
        <div className="unique-code-page">
            <div className="unique-form-container">
                <h2>Welkom!</h2>
                <p>
                    Vul hier de unieke toegangscode in die u heeft ontvangen per brief of e-mail:
                </p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Toegangscode"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                        disabled={loading}
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? "Een moment geduld..." : "Ga verder"}
                    </button>
                </form>
            </div>

            {showError && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Unieke code niet herkend</h3>
                        <p>Er is iets misgegaan met het invoeren van uw unieke code</p>
                        <div className="modal-buttons">
                            <button onClick={() => navigate("/contact")}>Neem contact op</button>
                            <button onClick={closeModal}>Probeer opnieuw</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
