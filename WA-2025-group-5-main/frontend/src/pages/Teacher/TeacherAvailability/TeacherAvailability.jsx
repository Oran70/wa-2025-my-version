import React, { useState } from 'react';
import './TeacherAvailability.css';

const TeacherAvailability = () => {
    const [selectedDates, setSelectedDates] = useState([]);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [pauseStart, setPauseStart] = useState('');
    const [pauseEnd, setPauseEnd] = useState('');

    // Generate time options based on appointment duration
    const generateTimeOptions = () => {
        const options = [];
        // Start at 8:00, end at 18:00 (6 PM)
        for (let hour = 8; hour <= 18; hour++) {
            for (let minute = 0; minute < 60; minute += appointmentDuration) {
                if (hour === 18 && minute > 0) break; // Don't go past 18:00
                const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                options.push({
                    value: timeString,
                    label: timeString
                });
            }
        }
        return options;
    };
    const [appointmentDuration, setAppointmentDuration] = useState(15);
    const [locationType, setLocationType] = useState('choice');

    const handleDateChange = (e) => {
        const date = e.target.value;
        if (date && !selectedDates.includes(date)) {
            setSelectedDates([...selectedDates, date]);
        }
    };

    const removeDateFromSelection = (dateToRemove) => {
        setSelectedDates(selectedDates.filter(date => date !== dateToRemove));
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('nl-NL', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleDurationChange = (newDuration) => {
        setAppointmentDuration(newDuration);
        // Reset time selections when duration changes
        setStartTime('');
        setEndTime('');
        setPauseStart('');
        setPauseEnd('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (selectedDates.length === 0) {
            alert('Selecteer minimaal één datum');
            return;
        }

        if (!startTime || !endTime) {
            alert('Vul een start- en eindtijd in');
            return;
        }

        if (startTime >= endTime) {
            alert('Eindtijd moet na starttijd liggen');
            return;
        }

        if (pauseStart && pauseEnd && pauseStart >= pauseEnd) {
            alert('Pauze eindtijd moet na pauze starttijd liggen');
            return;
        }

        const availabilityData = {
            dates: selectedDates,
            timeSlot: {
                start: startTime,
                end: endTime
            },
            pause: pauseStart && pauseEnd ? {
                start: pauseStart,
                end: pauseEnd
            } : null,
            appointmentDuration,
            locationType
        };

        console.log('Beschikbaarheid ingediend:', availabilityData);
        alert('Beschikbaarheid succesvol toegevoegd!');

        // Reset form
        setSelectedDates([]);
        setStartTime('');
        setEndTime('');
        setPauseStart('');
        setPauseEnd('');
        setAppointmentDuration(15);
        setLocationType('choice');
    };

    return (
        <div className="app-container">
            <div className="main-content">
                <div className="container">
                    <h1 className="page-title text-center">Beschikbaarheid doorgeven</h1>

                    <div className="availability-form-container">
                        <div className="availability-form">

                            {/* Date Selection */}
                            <div className="form-group">
                                <label htmlFor="date-input" className="form-label">
                                    Selecteer datum(s) *
                                </label>
                                <input
                                    type="date"
                                    id="date-input"
                                    className="form-input"
                                    onChange={handleDateChange}
                                    min={new Date().toISOString().split('T')[0]}
                                />

                                {selectedDates.length > 0 && (
                                    <div className="selected-dates">
                                        <h4>Geselecteerde data:</h4>
                                        <div className="date-tags">
                                            {selectedDates.map((date, index) => (
                                                <div key={index} className="date-tag">
                                                    <span>{formatDate(date)}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeDateFromSelection(date)}
                                                        className="remove-date-btn"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Time Slot */}
                            <div className="form-group">
                                <label className="form-label">Tijdslot *</label>
                                <p className="form-description">
                                    Deze tijden gelden voor alle geselecteerde dagen
                                </p>
                                <div className="time-input-group">
                                    <div className="time-input-wrapper">
                                        <label htmlFor="start-time">Van:</label>
                                        <select
                                            id="start-time"
                                            className="form-select"
                                            value={startTime}
                                            onChange={(e) => setStartTime(e.target.value)}
                                            required
                                        >
                                            <option value="">Selecteer starttijd</option>
                                            {generateTimeOptions().map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="time-input-wrapper">
                                        <label htmlFor="end-time">Tot:</label>
                                        <select
                                            id="end-time"
                                            className="form-select"
                                            value={endTime}
                                            onChange={(e) => setEndTime(e.target.value)}
                                            required
                                        >
                                            <option value="">Selecteer eindtijd</option>
                                            {generateTimeOptions().map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Pause Time */}
                            <div className="form-group">
                                <label className="form-label">Pauze (optioneel)</label>
                                <p className="form-description">
                                    Vul hier een pauze in waarin u niet beschikbaar bent voor afspraken
                                </p>
                                <div className="time-input-group">
                                    <div className="time-input-wrapper">
                                        <label htmlFor="pause-start">Pauze van:</label>
                                        <select
                                            id="pause-start"
                                            className="form-select"
                                            value={pauseStart}
                                            onChange={(e) => setPauseStart(e.target.value)}
                                        >
                                            <option value="">Geen pauze</option>
                                            {generateTimeOptions().map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="time-input-wrapper">
                                        <label htmlFor="pause-end">Pauze tot:</label>
                                        <select
                                            id="pause-end"
                                            className="form-select"
                                            value={pauseEnd}
                                            onChange={(e) => setPauseEnd(e.target.value)}
                                        >
                                            <option value="">Geen pauze</option>
                                            {generateTimeOptions().map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Appointment Duration */}
                            <div className="form-group">
                                <label htmlFor="duration" className="form-label">
                                    Duur afspraak (minuten) *
                                </label>
                                <select
                                    id="duration"
                                    className="form-select"
                                    value={appointmentDuration}
                                    onChange={(e) => handleDurationChange(Number(e.target.value))}
                                    required
                                >
                                    <option value={10}>10 minuten</option>
                                    <option value={15}>15 minuten</option>
                                    <option value={20}>20 minuten</option>
                                    <option value={25}>25 minuten</option>
                                    <option value={30}>30 minuten</option>
                                </select>
                            </div>

                            {/* Location Type */}
                            <div className="form-group">
                                <label className="form-label">Locatie van de afspraak *</label>
                                <div className="radio-group">
                                    <div className="radio-option">
                                        <input
                                            type="radio"
                                            id="location-choice"
                                            name="locationType"
                                            value="choice"
                                            checked={locationType === 'choice'}
                                            onChange={(e) => setLocationType(e.target.value)}
                                        />
                                        <label htmlFor="location-choice">
                                            Ouder mag kiezen (online of op locatie)
                                        </label>
                                    </div>
                                    <div className="radio-option">
                                        <input
                                            type="radio"
                                            id="location-onsite"
                                            name="locationType"
                                            value="onsite"
                                            checked={locationType === 'onsite'}
                                            onChange={(e) => setLocationType(e.target.value)}
                                        />
                                        <label htmlFor="location-onsite">
                                            Alleen op locatie
                                        </label>
                                    </div>
                                    <div className="radio-option">
                                        <input
                                            type="radio"
                                            id="location-online"
                                            name="locationType"
                                            value="online"
                                            checked={locationType === 'online'}
                                            onChange={(e) => setLocationType(e.target.value)}
                                        />
                                        <label htmlFor="location-online">
                                            Alleen online
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="form-actions">
                                <button onClick={handleSubmit} className="btn btn-primary submit-btn">
                                    Beschikbaarheid toevoegen
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