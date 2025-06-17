import React, {useState, useEffect} from 'react';
import './TeacherAvailability.css';
import {useCreateAvailability} from '../../../hooks/useTeacher'; // 1. Import the new hook

const TeacherAvailability = () => {
    // Your original state management
    const [selectedDates, setSelectedDates] = useState([]);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [appointmentDuration, setAppointmentDuration] = useState(15);
    const [notes, setNotes] = useState('');
    const {submitAvailability, loading, error, result} = useCreateAvailability();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation logics
        if (selectedDates.length === 0) {
            alert('Selecteer minimaal één datum');
            return;
        }
        if (!startTime || !endTime || startTime >= endTime) {
            alert('Vul een geldige start- en eindtijd in');
            return;
        }

        const availabilityData = {
            dates: selectedDates,
            timeSlot: {start: startTime, end: endTime},
            appointmentDuration: appointmentDuration,
            notes: notes,
        };

        await submitAvailability(availabilityData);
    };

    useEffect(() => {
        if (result) {
            alert(`Beschikbaarheid voor ${result.successfulSubmissions} van de ${result.total} geselecteerde dagen is succesvol toegevoegd!`);
            // Reset form
            setSelectedDates([]);
            setStartTime('');
            setEndTime('');
        }
        if (error) {
            alert(`Er is een fout opgetreden: ${error}`);
        }
    }, [result, error]);


    // --- All your helper functions and JSX are preserved below ---

    const generateTimeOptions = () => {
        const options = [];
        for (let hour = 8; hour <= 18; hour++) {
            for (let minute = 0; minute < 60; minute += appointmentDuration) {
                if (hour === 18 && minute > 0) break;
                const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                options.push({value: timeString, label: timeString});
            }
        }
        return options;
    };

    const handleDateChange = (e) => {
        const date = e.target.value;
        if (date && !selectedDates.includes(date)) {
            setSelectedDates([...selectedDates, date]);
        }
    };

    const removeDateFromSelection = (dateToRemove) => {
        setSelectedDates(selectedDates.filter(date => date !== dateToRemove));
    };

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('nl-NL', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const handleDurationChange = (newDuration) => setAppointmentDuration(newDuration);

    return (
        <div className="app-container">
            <div className="main-content">
                <div className="container">
                    <h1 className="page-title text-center">Beschikbaarheid doorgeven</h1>
                    <div className="availability-form-container">
                        <div className="availability-form">
                            <div className="form-group">
                                <label htmlFor="date-input" className="form-label">Selecteer datum(s) *</label>
                                <input type="date" id="date-input" className="form-input" onChange={handleDateChange}
                                       min={new Date().toISOString().split('T')[0]}/>
                                {selectedDates.length > 0 && (
                                    <div className="selected-dates">
                                        <h4>Geselecteerde data:</h4>
                                        <div className="date-tags">
                                            {selectedDates.map((date, index) => (
                                                <div key={index} className="date-tag">
                                                    <span>{formatDate(date)}</span>
                                                    <button type="button" onClick={() => removeDateFromSelection(date)}
                                                            className="remove-date-btn">×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Tijdslot *</label>
                                <p className="form-description">Deze tijden gelden voor alle geselecteerde dagen</p>
                                <div className="time-input-group">
                                    <div className="time-input-wrapper">
                                        <label htmlFor="start-time">Van:</label>
                                        <select id="start-time" className="form-select" value={startTime}
                                                onChange={(e) => setStartTime(e.target.value)} required>
                                            <option value="">Selecteer starttijd</option>
                                            {generateTimeOptions().map((option) => (<option key={option.value}
                                                                                            value={option.value}>{option.label}</option>))}
                                        </select>
                                    </div>
                                    <div className="time-input-wrapper">
                                        <label htmlFor="end-time">Tot:</label>
                                        <select id="end-time" className="form-select" value={endTime}
                                                onChange={(e) => setEndTime(e.target.value)} required>
                                            <option value="">Selecteer eindtijd</option>
                                            {generateTimeOptions().map((option) => (<option key={option.value}
                                                                                            value={option.value}>{option.label}</option>))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Duur afspraak (minuten) *</label>
                                <select id="duration" className="form-select" value={appointmentDuration}
                                        onChange={(e) => handleDurationChange(Number(e.target.value))} required>
                                    <option value={10}>10 minuten</option>
                                    <option value={15}>15 minuten</option>
                                    <option value={20}>20 minuten</option>
                                    <option value={25}>25 minuten</option>
                                    <option value={30}>30 minuten</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="notes" className="form-label">
                                    Notities (optioneel)
                                </label>
                                <textarea
                                    id="notes"
                                    className="form-textarea"
                                    rows="3"
                                    placeholder="Bijv. 'Alleen voor rapportgesprekken'"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                ></textarea>
                            </div>
                            <div className="form-actions">
                                {/* Disable button while loading */}
                                <button onClick={handleSubmit} className="btn btn-primary submit-btn"
                                        disabled={loading}>
                                    {loading ? 'Bezig met toevoegen...' : 'Beschikbaarheid toevoegen'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherAvailability;