import React, { useState, useEffect } from 'react';
import { Trash2, Users } from 'lucide-react';
import './AppointmentManagement.css';

const dummyAppointments = [
    {
        id: 1,
        studentName: 'Jan Jansen',
        staffName: 'Mevr. De Boer',
        role: 'mentor',
        date: '13-06-2025',
        time: '10:00',
    },
    {
        id: 2,
        studentName: 'Pietje Puk',
        staffName: 'Dhr. Visser',
        role: 'decaan',
        date: '14-06-2025',
        time: '11:00',
    },
    {
        id: 3,
        studentName: 'Sanne Smit',
        staffName: 'Mevr. Peters',
        role: 'teamleider',
        date: '15-06-2025',
        time: '09:30',
    },
    {
        id: 4,
        studentName: 'Tom de Groot',
        staffName: 'Dhr. Bakker',
        role: 'mentor',
        date: '15-06-2025',
        time: '13:00',
    },
    {
        id: 5,
        studentName: 'Lisa van Dijk',
        staffName: 'Mevr. De Boer',
        role: 'mentor',
        date: '16-06-2025',
        time: '10:15',
    },
    {
        id: 6,
        studentName: 'Ahmed El Idrissi',
        staffName: 'Dhr. Visser',
        role: 'decaan',
        date: '16-06-2025',
        time: '14:45',
    },
    {
        id: 7,
        studentName: 'Nina Janssens',
        staffName: 'Mevr. Peters',
        role: 'teamleider',
        date: '17-06-2025',
        time: '11:30',
    },
    {
        id: 8,
        studentName: 'Bram Willems',
        staffName: 'Dhr. Bakker',
        role: 'mentor',
        date: '17-06-2025',
        time: '08:45',
    },
    {
        id: 9,
        studentName: 'Sophie Kramer',
        staffName: 'Mevr. De Boer',
        role: 'mentor',
        date: '18-06-2025',
        time: '09:00',
    },
    {
        id: 10,
        studentName: 'Lars van Leeuwen',
        staffName: 'Dhr. Visser',
        role: 'decaan',
        date: '18-06-2025',
        time: '13:30',
    },
    {
        id: 11,
        studentName: 'Emma Bos',
        staffName: 'Mevr. Peters',
        role: 'teamleider',
        date: '19-06-2025',
        time: '10:45',
    },
    {
        id: 12,
        studentName: 'Koen Meijer',
        staffName: 'Dhr. Bakker',
        role: 'mentor',
        date: '19-06-2025',
        time: '14:00',
    },
    {
        id: 13,
        studentName: 'Julia van Vliet',
        staffName: 'Mevr. De Boer',
        role: 'mentor',
        date: '20-06-2025',
        time: '11:15',
    },
    {
        id: 14,
        studentName: 'Timo van den Berg',
        staffName: 'Dhr. Visser',
        role: 'decaan',
        date: '20-06-2025',
        time: '15:00',
    },
    {
        id: 15,
        studentName: 'Yasmin El Khayari',
        staffName: 'Mevr. Peters',
        role: 'teamleider',
        date: '21-06-2025',
        time: '12:00',
    },
    {
        id: 16,
        studentName: 'Max de Wit',
        staffName: 'Dhr. Bakker',
        role: 'mentor',
        date: '21-06-2025',
        time: '09:30',
    },
    {
        id: 17,
        studentName: 'Tess Verhoeven',
        staffName: 'Mevr. De Boer',
        role: 'mentor',
        date: '22-06-2025',
        time: '10:30',
    },
];


const AppointmentsManagement = () => {
    const [appointments, setAppointments] = useState(dummyAppointments);
    const [staffFilter, setStaffFilter] = useState('');

    // Unieke medewerkers ophalen uit de afspraken
    const uniqueStaffNames = [...new Set(appointments.map(a => a.staffName))];

    // Filteren op medewerkernaam
    const filteredAppointments = staffFilter
        ? appointments.filter(a => a.staffName === staffFilter)
        : appointments;

    const handleDelete = (id) => {
        setAppointments(prev => prev.filter(a => a.id !== id));
    };

    const handleDeleteByStaff = () => {
        if (staffFilter) {
            setAppointments(prev => prev.filter(a => a.staffName !== staffFilter));
            setStaffFilter(''); // optioneel: filter resetten na verwijderen
        }
    };

    const handleDeleteAll = () => {
        setAppointments([]);
    };

    return (
        <div className="page-container">
            <div className="header-navigation">
                <h1>Afsprakenbeheer</h1>
            </div>

            <div className="controls-section" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div>
                    <label htmlFor="staffFilter">Filter op medewerker:</label>
                    <select
                        id="staffFilter"
                        className="form-select"
                        value={staffFilter}
                        onChange={(e) => setStaffFilter(e.target.value)}
                    >
                        <option value="">Alle medewerkers</option>
                        {uniqueStaffNames.map(name => (
                            <option key={name} value={name}>{name}</option>
                        ))}
                    </select>
                </div>

                <div className="form-buttons" style={{ marginLeft: 'auto', display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                    {staffFilter && (
                        <button
                            className="btn delete-button"
                            onClick={handleDeleteByStaff}
                        >
                            Verwijder afspraken van deze medewerker
                        </button>
                    )}
                    {appointments.length > 0 && (
                        <button
                            className="btn delete-button"
                            onClick={handleDeleteAll}
                        >
                            Verwijder alle afspraken
                        </button>
                    )}
                </div>
            </div>

            <div className="table-section">
                <div className="table-header">
                    <h2 className="table-title">
                        Alle afspraken ({filteredAppointments.length})
                    </h2>
                </div>
                <div className="table-container">
                    <table className="users-table">
                        <thead>
                        <tr>
                            <th>Leerling</th>
                            <th>Personeel</th>
                            <th>Rol</th>
                            <th>Datum</th>
                            <th>Tijd</th>
                            <th className="align-right">Acties</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredAppointments.map((a) => (
                            <tr key={a.id}>
                                <td>{a.studentName}</td>
                                <td>{a.staffName}</td>
                                <td>{a.role}</td>
                                <td>{a.date}</td>
                                <td>{a.time}</td>
                                <td className="user-actions">
                                    <button
                                        onClick={() => handleDelete(a.id)}
                                        className="action-btn delete-btn"
                                        title="Verwijderen"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {filteredAppointments.length === 0 && (
                        <div className="empty-state">
                            <Users size={48} />
                            <p>Geen afspraken gevonden</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AppointmentsManagement;