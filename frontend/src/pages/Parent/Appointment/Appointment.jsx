import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTeacherAvailability, useCreateAppointment } from "../../../hooks/useParent";
import "./Appointment.css";

export default function Appointment() {
    const location = useLocation();
    const navigate = useNavigate();

    // CORRECTED: Read the state structure as sent by YOUR UniqueCode.jsx
    const { apiResponse } = location.state || {};
    const { student, teachers, accessCode } = apiResponse || {};

    // Find the primary mentor from the teachers list
    const mentor = teachers?.find(t => t.is_primary_mentor);

    const [form, setForm] = useState({
        studentName: "",
        studentNumber: "",
        level: "",
        mentorName: "",
        class: "",
        parentName: "",
        parentEmail: "",
        parentPhone: "",
        availabilityId: "",
        remarks: ""
    });

    const [showConfirmation, setShowConfirmation] = useState(false);

    // Custom hooks for API calls
    const { availability, loading: availabilityLoading, error: availabilityError } = useTeacherAvailability(mentor?.teacher_id);
    const { createAppointment, loading: appointmentLoading, error: appointmentError } = useCreateAppointment();

    // Populate student and mentor info once data is available
    useEffect(() => {
        if (student && mentor) {
            setForm(prevForm => ({
                ...prevForm,
                studentName: student.student_name || "",
                studentNumber: student.student_number || "",
                level: student.level_name || "",
                class: student.class_name || "",
                mentorName: mentor.teacher_name || ""
            }));
        }
    }, [student, mentor]);


    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const appointmentData = {
            accessCode: accessCode,
            teacherId: mentor.teacher_id,
            availabilityId: form.availabilityId,
            parentName: form.parentName,
            parentEmail: form.parentEmail,
            parentPhone: form.parentPhone
        };

        try {
            const result = await createAppointment(appointmentData);
            if (result) {
                setShowConfirmation(true);
            }
        } catch (error) {
            console.error("Failed to create appointment:", error);
        }
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
                                    value={form.mentorName}
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
                                        <label htmlFor="parentName">Naam Ouder/Verzorger:</label>
                                        <input
                                            id="parentName"
                                            type="text"
                                            name="parentName"
                                            className="form-input"
                                            value={form.parentName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="info-input-wrapper">
                                        <label htmlFor="parentEmail">E-mail:</label>
                                        <input
                                            id="parentEmail"
                                            type="email"
                                            name="parentEmail"
                                            className="form-input"
                                            value={form.parentEmail}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="info-input-wrapper">
                                        <label htmlFor="parentPhone">Telefoonnummer:</label>
                                        <input
                                            id="parentPhone"
                                            type="tel"
                                            name="parentPhone"
                                            className="form-input"
                                            value={form.parentPhone}
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
                                        <label htmlFor="availabilityId">Tijdstip:</label>
                                        <select
                                            id="availabilityId"
                                            name="availabilityId"
                                            className="form-select"
                                            value={form.availabilityId}
                                            onChange={handleChange}
                                            required
                                            disabled={availabilityLoading || !mentor}
                                        >
                                            <option value="">-- Selecteer een tijdstip --</option>
                                            {availabilityLoading && <option>Loading...</option>}
                                            {availabilityError && <option>Error loading times</option>}
                                            {availability?.map(slot => (
                                                <option key={slot.availability_id} value={slot.availability_id}>
                                                    {new Date(slot.date).toLocaleDateString('nl-NL')} - {slot.start_time}
                                                </option>
                                            ))}
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

                            {appointmentError && <p className="error-message">{appointmentError}</p>}

                            {/* Form Actions */}
                            <div className="form-actions">
                                <button
                                    type="button"
                                    onClick={() => navigate("/")}
                                    className="btn btn-secondary cancel-btn"
                                >
                                    Annuleer
                                </button>
                                <button type="submit" className="btn btn-primary submit-btn" disabled={appointmentLoading}>
                                    {appointmentLoading ? 'Bezig met plannen...' : 'Plan afspraak'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

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