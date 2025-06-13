import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Appointment.css";

export default function Appointment() {
    const location = useLocation();
    const navigate = useNavigate();
    const code = location.state?.code ?? "";

    const [form, setForm] = useState({
        studentName: "",
        studentNumber: "",
        level: "",
        mentor: "",
        class: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        remarks: ""
    });

    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitted:", form);
        // TODO: call backend here to save appointment
        setShowConfirmation(true);
    };

    const closeConfirmation = () => {
        setShowConfirmation(false);
        navigate("/");
    };

    return (
        <div className="app-container">
            <div className="main-content">
                <div className="container">
                    <h1 className="page-title text-center">Plan een afspraak</h1>

                    <div className="appointment-form-container">
                        <form className="appointment-form" onSubmit={handleSubmit}>

                            {/* Student Information - Read Only */}
                            <div className="form-group">
                                <label className="form-label">Leerlinggegevens</label>
                                <p className="form-description">
                                    Deze informatie wordt automatisch ingevuld
                                </p>
                                <div className="student-info-group">
                                    <div className="info-input-wrapper">
                                        <label htmlFor="student-name">Naam leerling:</label>
                                        <input
                                            id="student-name"
                                            className="form-input"
                                            value={form.studentName}
                                            disabled
                                        />
                                    </div>
                                    <div className="info-input-wrapper">
                                        <label htmlFor="student-number">Leerlingnummer:</label>
                                        <input
                                            id="student-number"
                                            className="form-input"
                                            value={form.studentNumber}
                                            disabled
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Level and Class Information */}
                            <div className="form-group">
                                <label className="form-label">Klasinformatie</label>
                                <div className="student-info-group">
                                    <div className="info-input-wrapper">
                                        <label htmlFor="level">Niveau:</label>
                                        <input
                                            id="level"
                                            className="form-input"
                                            value={form.level}
                                            disabled
                                        />
                                    </div>
                                    <div className="info-input-wrapper">
                                        <label htmlFor="class">Klas:</label>
                                        <input
                                            id="class"
                                            className="form-input"
                                            value={form.class}
                                            disabled
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Mentor Information */}
                            <div className="form-group">
                                <label className="form-label">Mentor</label>
                                <input
                                    className="form-input"
                                    value={form.mentor}
                                    disabled
                                />
                            </div>

                            {/* Contact Information */}
                            <div className="form-group">
                                <label className="form-label">Contactgegevens *</label>
                                <p className="form-description">
                                    Vul uw contactgegevens in voor de afspraak
                                </p>
                                <div className="contact-info-group">
                                    <div className="info-input-wrapper">
                                        <label htmlFor="email">E-mail:</label>
                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            className="form-input"
                                            value={form.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="info-input-wrapper">
                                        <label htmlFor="phone">Telefoonnummer:</label>
                                        <input
                                            id="phone"
                                            type="tel"
                                            name="phone"
                                            className="form-input"
                                            value={form.phone}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Date and Time Selection */}
                            <div className="form-group">
                                <label className="form-label">Datum en tijd *</label>
                                <p className="form-description">
                                    Selecteer de gewenste datum en tijd voor uw afspraak
                                </p>
                                <div className="datetime-group">
                                    <div className="datetime-input-wrapper">
                                        <label htmlFor="date">Dag:</label>
                                        <select
                                            id="date"
                                            name="date"
                                            className="form-select"
                                            value={form.date}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">-- Selecteer --</option>
                                            <option value="2025-05-17">17-05-2025</option>
                                            <option value="2025-05-18">18-05-2025</option>
                                        </select>
                                    </div>
                                    <div className="datetime-input-wrapper">
                                        <label htmlFor="time">Tijdstip:</label>
                                        <select
                                            id="time"
                                            name="time"
                                            className="form-select"
                                            value={form.time}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">-- Selecteer --</option>
                                            <option value="18:00">18:00</option>
                                            <option value="18:30">18:30</option>
                                            <option value="19:00">19:00</option>
                                            <option value="19:30">19:30</option>
                                            <option value="20:00">20:00</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Remarks */}
                            <div className="form-group">
                                <label htmlFor="remarks" className="form-label">
                                    (Eventuele) opmerkingen
                                </label>
                                <p className="form-description">
                                    Voeg eventuele opmerkingen of specifieke vragen toe
                                </p>
                                <textarea
                                    id="remarks"
                                    name="remarks"
                                    className="form-textarea"
                                    value={form.remarks}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="Typ hier uw opmerkingen..."
                                />
                            </div>

                            {/* Form Actions */}
                            <div className="form-actions">
                                <button
                                    type="button"
                                    onClick={() => navigate("/")}
                                    className="btn btn-secondary cancel-btn"
                                >
                                    Annuleer
                                </button>
                                <button type="submit" className="btn btn-primary submit-btn">
                                    Plan afspraak
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Confirmation Popup */}
            {showConfirmation && (
                <div className="confirmation-overlay">
                    <div className="confirmation-card">
                        <div className="confirmation-header">
                            <div className="confirmation-icon">✓</div>
                            <h2>Afspraak bevestigd!</h2>
                        </div>
                        <div className="confirmation-content">
                            <p className="confirmation-message">
                                Uw afspraak is succesvol ingepland.
                            </p>
                            <p className="confirmation-email-info">
                                U ontvangt binnen enkele minuten een e-mail met alle details van uw afspraak.
                            </p>
                        </div>
                        <div className="confirmation-actions">
                            <button
                                onClick={closeConfirmation}
                                className="btn btn-primary confirmation-btn"
                            >
                                Sluiten
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}