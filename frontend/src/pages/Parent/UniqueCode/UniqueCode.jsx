import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// 1. Import the new custom hook from the file in the Canvas
import { useAccessCodeValidation } from "../../../hooks/useParent";
import "./UniqueCode.css";

export default function UniqueCode() {
    const [code, setCode] = useState("");
    const navigate = useNavigate();

    // 2. Use the hook to get all the state and functions you need.
    // This replaces multiple useState calls for loading, error, etc.
    const { loading, error, validateAccessCode, reset } = useAccessCodeValidation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 3. Call the validation function from the hook.
            const result = await validateAccessCode(code);

            // If the call is successful, navigate to the next page.
            // The hook handles setting all the data.
            if (result.success) {
                navigate("/afspraak-plannen", { state: { apiResponse: result.data } });
            }
        } catch (err) {
            // The hook's error state is already set, so we just log the error here.
            console.error("Validation failed:", err.message);
        }
    };

    const closeModal = () => {
        reset(); // Use the reset function from the hook to clear the error.
        setCode("");
    };

    // Effect to close the modal when the user presses the Escape key.
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape" && error) {
                closeModal();
            }
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [error, closeModal]); // Dependency array ensures this runs only when 'error' or 'closeModal' changes.

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
                    {/* The button is disabled based on the 'loading' state from the hook */}
                    <button type="submit" disabled={loading}>
                        {loading ? "Een moment geduld..." : "Ga verder"}
                    </button>
                </form>
            </div>

            {/* The error modal is displayed based on the 'error' state from the hook */}
            {error && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Code niet herkend</h3>
                        <p>{error}</p>
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
