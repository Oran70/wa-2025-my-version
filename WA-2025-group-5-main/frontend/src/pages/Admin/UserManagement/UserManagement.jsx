import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Search, Users } from 'lucide-react';
import './UserManagement.css';

const UserManagement = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        abbreviation: '',
        password: '',
        classId: ''
    });

    // Mock data - in real app this would come from API
    const [users, setUsers] = useState([
        { id: 1, fullName: 'Jan de Vries', abbreviation: 'JDV', classId: '3HV2', className: '3HV2 - HAVO' },
        { id: 2, fullName: 'Maria Jansen', abbreviation: 'MJA', classId: '4VW1', className: '4VW1 - VWO' },
        { id: 3, fullName: 'Piet Bakker', abbreviation: 'PBK', classId: '2MV3', className: '2MV3 - MAVO' },
        { id: 4, fullName: 'Lisa van der Berg', abbreviation: 'LVB', classId: '5VW2', className: '5VW2 - VWO' }
    ]);

    const classes = [
        { id: '3HV2', name: '3HV2 - HAVO' },
        { id: '4VW1', name: '4VW1 - VWO' },
        { id: '2MV3', name: '2MV3 - MAVO' },
        { id: '5VW2', name: '5VW2 - VWO' },
        { id: '1HV1', name: '1HV1 - HAVO' }
    ];

    const filteredUsers = users.filter(user =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.abbreviation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.className.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const resetForm = () => {
        setFormData({
            fullName: '',
            abbreviation: '',
            password: '',
            classId: ''
        });
        setEditingUser(null);
        setShowAddForm(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingUser) {
            // Update existing user
            setUsers(users.map(user =>
                user.id === editingUser.id
                    ? {
                        ...user,
                        ...formData,
                        className: classes.find(c => c.id === formData.classId)?.name || ''
                    }
                    : user
            ));
        } else {
            // Add new user
            const newUser = {
                id: Date.now(),
                ...formData,
                className: classes.find(c => c.id === formData.classId)?.name || ''
            };
            setUsers([...users, newUser]);
        }
        resetForm();
    };

    const handleEdit = (user) => {
        setFormData({
            fullName: user.fullName,
            abbreviation: user.abbreviation,
            password: '',
            classId: user.classId
        });
        setEditingUser(user);
        setShowAddForm(true);
    };

    const handleDelete = (userId) => {
        if (window.confirm('Weet u zeker dat u deze gebruiker wilt verwijderen?')) {
            setUsers(users.filter(user => user.id !== userId));
        }
    };

    return (
        <div className="admin-container">
            <div className="admin-header">
                <div className="admin-header-content">
                    <div className="header-navigation">
                        <button
                            className="back-button"
                            onClick={() => navigate('/admin/dashboard')}
                        >
                            <ArrowLeft size={20} />
                            Terug naar Dashboard
                        </button>
                    </div>
                    <h1 className="admin-title">
                        <Users className="title-icon" />
                        Gebruikers beheren
                    </h1>
                    <p className="admin-subtitle">
                        Beheer mentoren, decanen en teamleiders in het systeem
                    </p>
                </div>
            </div>

            <div className="admin-content">
                {/* Controls */}
                <div className="controls-section">
                    <div className="search-container">
                        <Search className="search-icon" />
                        <input
                            type="text"
                            placeholder="Zoek gebruikers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowAddForm(true)}
                    >
                        <Plus size={20} />
                        Nieuwe gebruiker
                    </button>
                </div>

                {/* Add/Edit Form */}
                {showAddForm && (
                    <div className="form-section">
                        <div className="form-header">
                            <h2 className="form-title">
                                {editingUser ? 'Gebruiker bewerken' : 'Nieuwe gebruiker toevoegen'}
                            </h2>
                        </div>
                        <form onSubmit={handleSubmit} className="user-form">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label htmlFor="fullName" className="form-label">
                                        Volledige naam *
                                    </label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                        className="form-input"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="abbreviation" className="form-label">
                                        3-letterige afkorting *
                                    </label>
                                    <input
                                        type="text"
                                        id="abbreviation"
                                        value={formData.abbreviation}
                                        onChange={(e) => setFormData({...formData, abbreviation: e.target.value.toUpperCase()})}
                                        className="form-input"
                                        maxLength="3"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password" className="form-label">
                                        {editingUser ? 'Nieuw wachtwoord (laat leeg om niet te wijzigen)' : 'Wachtwoord *'}
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                        className="form-input"
                                        required={!editingUser}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="classId" className="form-label">
                                        Klas *
                                    </label>
                                    <select
                                        id="classId"
                                        value={formData.classId}
                                        onChange={(e) => setFormData({...formData, classId: e.target.value})}
                                        className="form-select"
                                        required
                                    >
                                        <option value="">Selecteer een klas</option>
                                        {classes.map(cls => (
                                            <option key={cls.id} value={cls.id}>
                                                {cls.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="form-buttons">
                                <button type="button" onClick={resetForm} className="btn btn-outline">
                                    Annuleren
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingUser ? 'Bijwerken' : 'Toevoegen'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Users Table */}
                <div className="table-section">
                    <div className="table-header">
                        <h2 className="table-title">
                            Alle gebruikers ({filteredUsers.length})
                        </h2>
                    </div>
                    <div className="table-container">
                        <table className="users-table">
                            <thead>
                            <tr>
                                <th>Naam</th>
                                <th>Afkorting</th>
                                <th>Klas</th>
                                <th>Acties</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id}>
                                    <td className="user-name">{user.fullName}</td>
                                    <td className="user-abbreviation">{user.abbreviation}</td>
                                    <td className="user-class">{user.className}</td>
                                    <td className="user-actions">
                                        <button
                                            onClick={() => handleEdit(user)}
                                            className="action-btn edit-btn"
                                            title="Bewerken"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="delete-button"
                                            title="Verwijderen"
                                        >
                                            <Trash2 size={16} />
                                        </button>

                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        {filteredUsers.length === 0 && (
                            <div className="empty-state">
                                <Users size={48} />
                                <p>Geen gebruikers gevonden</p>
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="btn btn-outline"
                                    >
                                        Wis zoekopdracht
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;