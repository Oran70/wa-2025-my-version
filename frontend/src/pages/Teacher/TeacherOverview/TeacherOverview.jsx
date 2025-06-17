import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Phone, Mail, MapPin, Monitor, Users, Filter, X, User } from 'lucide-react';
import './TeacherOverview.css';
import { useTeacherAppointments } from '../../../hooks/useTeacher';
import teacherApiService from '../../../services/TeacherApiServices';

const TeacherAppointments = () => {
    const navigate = useNavigate();

    // --- Filter States ---
    const [dateFilter, setDateFilter] = useState('');
    const [classFilter, setClassFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [nameFilter, setNameFilter] = useState(''); // 1. REPLACED locationFilter with nameFilter

    // Hook to get live data
    const { appointments, loading, error, fetchAppointments, refreshAppointments } = useTeacherAppointments();

    // Fetch data when date or status filters change
    useEffect(() => {
        const filters = {
            startDate: dateFilter,
            status: statusFilter,
        };
        fetchAppointments(filters);
    }, [dateFilter, statusFilter, fetchAppointments]);

    const handleCancelAppointment = async (appointmentId, studentName) => {
        const reason = window.prompt(`Voer een reden in voor het annuleren van de afspraak met ${studentName}:`);
        if (reason) {
            try {
                await teacherApiService.cancelAppointment(appointmentId, reason);
                alert('Afspraak succesvol geannuleerd.');
                refreshAppointments({ startDate: dateFilter, status: statusFilter });
            } catch (err) {
                alert(`Fout bij annuleren: ${err.response?.data?.error || 'Onbekende fout'}`);
            }
        }
    };

    const clearFilters = () => {
        setDateFilter('');
        setClassFilter('');
        setStatusFilter('all');
        setNameFilter(''); // 2. REPLACED locationFilter with nameFilter
    };

    const uniqueClasses = [...new Set(appointments.map(app => app.student?.class_name))].filter(Boolean).sort();

    // 3. UPDATED client-side filtering logic to include the new name filter
    const filteredAppointments = appointments.filter(app => {
        if (classFilter && app.student?.class_name !== classFilter) {
            return false;
        }
        if (nameFilter && !app.student?.name.toLowerCase().includes(nameFilter.toLowerCase())) {
            return false;
        }
        return true;
    });

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('nl-NL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const activeFiltersCount = [dateFilter, classFilter, statusFilter !== 'all', nameFilter].filter(Boolean).length;

    if (loading) {
        return <div className="appointments-container"><div className="appointments-content"><p>Afspraken laden...</p></div></div>;
    }

    return (
        <div className="appointments-container">
            <div className="appointments-header">
                <button onClick={() => navigate('/teacher/dashboard')} className="back-button"><ArrowLeft className="back-icon" />Terug naar dashboard</button>
                <div className="appointments-header-content"><h1 className="appointments-title">Afspraken overzicht</h1><p className="appointments-subtitle">Beheer hier al uw geplande gesprekken</p></div>
            </div>
            <div className="appointments-content">
                <div className="filters-container">
                    <div className="filters-header">
                        <div className="filters-title-section"><Filter className="filter-icon" /><h2 className="filters-title">Filter afspraken</h2>{activeFiltersCount > 0 && <span className="active-filters-badge">{activeFiltersCount}</span>}</div>
                        {activeFiltersCount > 0 && <button onClick={clearFilters} className="clear-filters-btn"><X className="clear-icon" />Wis filters</button>}
                    </div>
                    <div className="filters-grid">
                        <div className="filter-group"><label htmlFor="date-filter" className="filter-label"><Calendar className="filter-label-icon" />Datum</label><input type="date" id="date-filter" className="filter-input" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} /></div>
                        <div className="filter-group"><label htmlFor="class-filter" className="filter-label"><Users className="filter-label-icon" />Klas</label><select id="class-filter" className="filter-select" value={classFilter} onChange={(e) => setClassFilter(e.target.value)}><option value="">Alle klassen</option>{uniqueClasses.map(className => (<option key={className} value={className}>{className}</option>))}</select></div>
                        <div className="filter-group"><label htmlFor="status-filter" className="filter-label"><Calendar className="filter-label-icon" />Status</label><select id="status-filter" className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}><option value="all">Alle afspraken</option><option value="Scheduled">Ingepland</option><option value="Cancelled">Geannuleerd</option></select></div>

                        {/* 4. REPLACED the 'Locatie' dropdown with a text input for student name */}
                        <div className="filter-group">
                            <label htmlFor="name-filter" className="filter-label"><User className="filter-label-icon" />Leerling</label>
                            <input
                                type="text"
                                id="name-filter"
                                className="filter-input"
                                placeholder="Zoek op naam..."
                                value={nameFilter}
                                onChange={(e) => setNameFilter(e.target.value)}
                            />
                        </div>

                    </div>
                </div>
                <div className="appointments-summary">
                    <div className="appointments-count"><span className="count-number">{filteredAppointments.length}</span><span className="count-text"> afspra{filteredAppointments.length !== 1 ? 'ken' : 'ak'} gevonden</span></div>
                    <div className="appointments-stats"><div className="stat-item"><span className="stat-value">{filteredAppointments.filter(app => app.status === 'Scheduled').length}</span><span className="stat-label">Ingepland</span></div><div className="stat-item"><span className="stat-value">{filteredAppointments.filter(app => app.status === 'Cancelled').length}</span><span className="stat-label">Geannuleerd</span></div></div>
                </div>
                <div className="appointments-list">
                    {filteredAppointments.length === 0 ? (
                        <div className="no-appointments"><Calendar className="no-appointments-icon" /><h3>Geen afspraken gevonden</h3><p>Er zijn geen afspraken die voldoen aan de geselecteerde filters.</p></div>
                    ) : (
                        filteredAppointments.map((appointment) => (
                            <div key={appointment.appointment_id} className={`appointment-card ${appointment.status.toLowerCase() === 'cancelled' ? 'cancelled' : ''}`}>
                                <div className="appointment-main">
                                    <div className="appointment-datetime"><div className="appointment-date">{formatDate(appointment.date)}</div><div className="appointment-time">{appointment.start_time} - {appointment.end_time}</div></div>
                                    <div className="appointment-details">
                                        <div className="student-section"><h3 className="student-name">{appointment.student.name}</h3><div className="student-class">Klas {appointment.student.class_name}</div><div className="appointment-location"><Users className="location-icon" />Naar keuze ouder</div></div>
                                        <div className="contact-section">
                                            <div className="contact-item"><Phone className="contact-icon" /><a href={`tel:${appointment.parent.phone}`} className="contact-link">{appointment.parent.phone}</a></div>
                                            <div className="contact-item"><Mail className="contact-icon" /><a href={`mailto:${appointment.parent.email}`} className="contact-link">{appointment.parent.email}</a></div>
                                        </div>
                                    </div>
                                    <div className="appointment-status-section"><span className={`status-badge ${appointment.status.toLowerCase()}`}>{appointment.status}</span></div>
                                </div>
                                {appointment.cancellation_reason && (<div className="appointment-notes"><strong>Notities:</strong> {appointment.cancellation_reason}</div>)}
                                {appointment.status === 'Scheduled' && (
                                    <div className="appointment-actions"><button onClick={() => handleCancelAppointment(appointment.appointment_id, appointment.student.name)} className="btn-cancel">Afspraak annuleren</button></div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeacherAppointments;