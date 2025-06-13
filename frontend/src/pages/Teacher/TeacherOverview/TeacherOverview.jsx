import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Phone, Mail, MapPin, Monitor, Users, Filter, X } from 'lucide-react';
import './TeacherOverview.css';

const TeacherAppointments = () => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter states
    const [dateFilter, setDateFilter] = useState('');
    const [classFilter, setClassFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [locationFilter, setLocationFilter] = useState('all');

    // Mock data - REPLACE with actual API call
    useEffect(() => {
        const mockAppointments = [
            {
                id: 1,
                date: '2025-06-15',
                timeSlot: '09:00 - 09:15',
                studentName: 'Emma van der Berg',
                class: '3A',
                parentPhone: '06-12345678',
                parentEmail: 'e.vandenberg@email.com',
                status: 'scheduled',
                locationType: 'online',
                notes: 'Gesprek over studiekeuze'
            },
            {
                id: 2,
                date: '2025-06-15',
                timeSlot: '09:30 - 09:45',
                studentName: 'Daan Jansen',
                class: '2B',
                parentPhone: '06-87654321',
                parentEmail: 'd.jansen@email.com',
                status: 'scheduled',
                locationType: 'onsite',
                notes: 'Bespreking cijfers'
            },
            {
                id: 3,
                date: '2025-06-16',
                timeSlot: '10:00 - 10:15',
                studentName: 'Sophie Bakker',
                class: '3A',
                parentPhone: '06-11223344',
                parentEmail: 's.bakker@email.com',
                status: 'cancelled',
                locationType: 'choice',
                notes: 'Oudergesprek geannuleerd door ouder'
            },
            {
                id: 4,
                date: '2025-06-16',
                timeSlot: '14:00 - 14:30',
                studentName: 'Lars de Vries',
                class: '1C',
                parentPhone: '06-99887766',
                parentEmail: 'l.devries@email.com',
                status: 'scheduled',
                locationType: 'online',
                notes: 'Instapproblemen bespreken'
            },
            {
                id: 5,
                date: '2025-06-17',
                timeSlot: '11:15 - 11:30',
                studentName: 'Mila Smit',
                class: '2B',
                parentPhone: '06-55443322',
                parentEmail: 'm.smit@email.com',
                status: 'scheduled',
                locationType: 'onsite',
                notes: 'Voortgangsgesprek'
            },
            {
                id: 6,
                date: '2025-06-18',
                timeSlot: '13:00 - 13:15',
                studentName: 'Tom Hendriks',
                class: '3A',
                parentPhone: '06-44556677',
                parentEmail: 't.hendriks@email.com',
                status: 'scheduled',
                locationType: 'choice',
                notes: 'Gedragsgesprek'
            }
        ];

        // Simulate API loading
        setTimeout(() => {
            setAppointments(mockAppointments);
            setFilteredAppointments(mockAppointments);
            setLoading(false);
        }, 1000);
    }, []);

    // Get unique classes for filter dropdown
    const uniqueClasses = [...new Set(appointments.map(app => app.class))].sort();

    // Filter appointments based on selected filters
    useEffect(() => {
        let filtered = appointments;

        if (dateFilter) {
            filtered = filtered.filter(app => app.date === dateFilter);
        }

        if (classFilter) {
            filtered = filtered.filter(app => app.class === classFilter);
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(app => app.status === statusFilter);
        }

        if (locationFilter !== 'all') {
            filtered = filtered.filter(app => app.locationType === locationFilter);
        }

        // Sort by date and time
        filtered.sort((a, b) => {
            if (a.date !== b.date) {
                return new Date(a.date) - new Date(b.date);
            }
            return a.timeSlot.localeCompare(b.timeSlot);
        });

        setFilteredAppointments(filtered);
    }, [appointments, dateFilter, classFilter, statusFilter, locationFilter]);

    const handleCancelAppointment = (appointmentId) => {
        const appointment = appointments.find(app => app.id === appointmentId);
        if (appointment && appointment.status === 'scheduled') {
            const confirmCancel = window.confirm(
                `Weet u zeker dat u de afspraak met ${appointment.studentName} wilt annuleren?`
            );

            if (confirmCancel) {
                setAppointments(prev =>
                    prev.map(app =>
                        app.id === appointmentId
                            ? { ...app, status: 'cancelled' }
                            : app
                    )
                );
                alert('Afspraak geannuleerd');
            }
        }
    };

    const clearFilters = () => {
        setDateFilter('');
        setClassFilter('');
        setStatusFilter('all');
        setLocationFilter('all');
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

    const getLocationIcon = (locationType) => {
        switch (locationType) {
            case 'online': return <Monitor className="location-icon" />;
            case 'onsite': return <MapPin className="location-icon" />;
            case 'choice': return <Users className="location-icon" />;
            default: return <MapPin className="location-icon" />;
        }
    };

    const getLocationText = (locationType) => {
        switch (locationType) {
            case 'online': return 'Online gesprek';
            case 'onsite': return 'Op school';
            case 'choice': return 'Naar keuze ouder';
            default: return 'Onbekend';
        }
    };

    const activeFiltersCount = [dateFilter, classFilter, statusFilter !== 'all', locationFilter !== 'all'].filter(Boolean).length;

    if (loading) {
        return (
            <div className="appointments-container">
                <div className="appointments-content">
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Afspraken laden...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="appointments-container">
            <div className="appointments-header">
                <button
                    onClick={() => navigate('/teacher/dashboard')}
                    className="back-button"
                >
                    <ArrowLeft className="back-icon" />
                    Terug naar dashboard
                </button>
                <div className="appointments-header-content">
                    <h1 className="appointments-title">Afspraken overzicht</h1>
                    <p className="appointments-subtitle">Beheer hier al uw geplande gesprekken</p>
                </div>
            </div>

            <div className="appointments-content">
                {/* Filter Section */}
                <div className="filters-container">
                    <div className="filters-header">
                        <div className="filters-title-section">
                            <Filter className="filter-icon" />
                            <h2 className="filters-title">Filter afspraken</h2>
                            {activeFiltersCount > 0 && (
                                <span className="active-filters-badge">{activeFiltersCount}</span>
                            )}
                        </div>
                        {activeFiltersCount > 0 && (
                            <button onClick={clearFilters} className="clear-filters-btn">
                                <X className="clear-icon" />
                                Wis filters
                            </button>
                        )}
                    </div>

                    <div className="filters-grid">
                        <div className="filter-group">
                            <label htmlFor="date-filter" className="filter-label">
                                <Calendar className="filter-label-icon" />
                                Datum
                            </label>
                            <input
                                type="date"
                                id="date-filter"
                                className="filter-input"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                            />
                        </div>

                        <div className="filter-group">
                            <label htmlFor="class-filter" className="filter-label">
                                <Users className="filter-label-icon" />
                                Klas
                            </label>
                            <select
                                id="class-filter"
                                className="filter-select"
                                value={classFilter}
                                onChange={(e) => setClassFilter(e.target.value)}
                            >
                                <option value="">Alle klassen</option>
                                {uniqueClasses.map(className => (
                                    <option key={className} value={className}>
                                        {className}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <label htmlFor="status-filter" className="filter-label">
                                <Calendar className="filter-label-icon" />
                                Status
                            </label>
                            <select
                                id="status-filter"
                                className="filter-select"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">Alle afspraken</option>
                                <option value="scheduled">Ingepland</option>
                                <option value="cancelled">Geannuleerd</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label htmlFor="location-filter" className="filter-label">
                                <MapPin className="filter-label-icon" />
                                Locatie
                            </label>
                            <select
                                id="location-filter"
                                className="filter-select"
                                value={locationFilter}
                                onChange={(e) => setLocationFilter(e.target.value)}
                            >
                                <option value="all">Alle locaties</option>
                                <option value="online">Online</option>
                                <option value="onsite">Op school</option>
                                <option value="choice">Naar keuze</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Appointments Count */}
                <div className="appointments-summary">
                    <div className="appointments-count">
                        <span className="count-number">{filteredAppointments.length}</span>
                        <span className="count-text">
                            afspra{filteredAppointments.length !== 1 ? 'ken' : 'ak'} gevonden
                        </span>
                    </div>
                    <div className="appointments-stats">
                        <div className="stat-item">
                            <span className="stat-value">{filteredAppointments.filter(app => app.status === 'scheduled').length}</span>
                            <span className="stat-label">Ingepland</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">{filteredAppointments.filter(app => app.status === 'cancelled').length}</span>
                            <span className="stat-label">Geannuleerd</span>
                        </div>
                    </div>
                </div>

                {/* Appointments List */}
                <div className="appointments-list">
                    {filteredAppointments.length === 0 ? (
                        <div className="no-appointments">
                            <Calendar className="no-appointments-icon" />
                            <h3>Geen afspraken gevonden</h3>
                            <p>Er zijn geen afspraken die voldoen aan de geselecteerde filters.</p>
                        </div>
                    ) : (
                        filteredAppointments.map((appointment) => (
                            <div
                                key={appointment.id}
                                className={`appointment-card ${appointment.status === 'cancelled' ? 'cancelled' : ''}`}
                            >
                                <div className="appointment-main">
                                    <div className="appointment-datetime">
                                        <div className="appointment-date">
                                            {formatDate(appointment.date)}
                                        </div>
                                        <div className="appointment-time">
                                            {appointment.timeSlot}
                                        </div>
                                    </div>

                                    <div className="appointment-details">
                                        <div className="student-section">
                                            <h3 className="student-name">{appointment.studentName}</h3>
                                            <div className="student-class">Klas {appointment.class}</div>
                                            <div className="appointment-location">
                                                {getLocationIcon(appointment.locationType)}
                                                {getLocationText(appointment.locationType)}
                                            </div>
                                        </div>

                                        <div className="contact-section">
                                            <div className="contact-item">
                                                <Phone className="contact-icon" />
                                                <a href={`tel:${appointment.parentPhone}`} className="contact-link">
                                                    {appointment.parentPhone}
                                                </a>
                                            </div>
                                            <div className="contact-item">
                                                <Mail className="contact-icon" />
                                                <a href={`mailto:${appointment.parentEmail}`} className="contact-link">
                                                    {appointment.parentEmail}
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="appointment-status-section">
                                        <span className={`status-badge ${appointment.status}`}>
                                            {appointment.status === 'scheduled' ? 'Ingepland' : 'Geannuleerd'}
                                        </span>
                                    </div>
                                </div>

                                {appointment.notes && (
                                    <div className="appointment-notes">
                                        <strong>Notities:</strong> {appointment.notes}
                                    </div>
                                )}

                                {appointment.status === 'scheduled' && (
                                    <div className="appointment-actions">
                                        <button
                                            onClick={() => handleCancelAppointment(appointment.id)}
                                            className="btn-cancel"
                                        >
                                            Afspraak annuleren
                                        </button>
                                    </div>
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