import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Search, Users } from 'lucide-react';
import { useUserManagement } from '../../../hooks/useAdmin';
import './UserManagement.css';

const UserManagement = () => {
    const navigate = useNavigate();
    const { users, classes, loading, error, addUser, editUser, removeUser } = useUserManagement();

    const [searchTerm, setSearchTerm] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const initialFormData = {
        fullName: '',
        email: '',
        abbreviation: '',
        password: '',
        classId: '',
        phone: '',
        notes: ''
    };

    const [formData, setFormData] = useState(initialFormData);

    const usersWithClassName = useMemo(() => {
        if (!users) return []; // Prevents crash before data is loaded
        return users.map(user => {
            const userClass = user.classes && user.classes[0] ? user.classes[0] : null;
            return {
                ...user,
                id: user.user_id,
                fullName: user.name,
                classId: userClass ? userClass.class_id : '',
                className: userClass ? `${userClass.class_name} - ${userClass.level.name}` : 'Niet toegewezen'
            };
        });
    }, [users]);

    const filteredUsers = usersWithClassName.filter(user =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.abbreviation && user.abbreviation.toLowerCase().includes(searchTerm.toLowerCase())) ||
        user.className.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const resetForm = () => {
        setFormData(initialFormData);
        setEditingUser(null);
        setShowAddForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const apiData = {
            name: formData.fullName,
            email: formData.email,
            abbreviation: formData.abbreviation,
            classId: formData.classId,
            phone: formData.phone,
            notes: formData.notes,
            roles: ['TeacherSubject']
        };
        // Only include the password if the user typed one in
        if (formData.password) {
            apiData.password = formData.password;
        }

        if (editingUser) {
            await editUser(editingUser.id, apiData);
        } else {
            await addUser(apiData);
        }
        resetForm();
    };

    const handleEdit = (user) => {
        setFormData({
            fullName: user.fullName,
            abbreviation: user.abbreviation || '',
            password: '', // Always clear password field on edit
            classId: user.classId,
            email: user.email,
            phone: user.phone || '',
            notes: user.notes || ''
        });
        setEditingUser(user);
        setShowAddForm(true);
    };

    const handleDelete = async (userId) => {
        if (window.confirm('Weet u zeker dat u deze gebruiker wilt verwijderen?')) {
            await removeUser(userId);
        }
    };

    if (loading) return <div className="admin-container"><h2>Loading...</h2></div>;
    if (error) return <div className="admin-container"><h2 style={{ color: 'red' }}>Error: {error}</h2></div>;

    return (
        <div className="admin-container">
            {/* This UI is your original component structure, unchanged */}
            <div className="admin-header">
                <div className="admin-header-content">
                    <div className="header-navigation">
                        <button className="back-button" onClick={() => navigate('/admin/dashboard')}><ArrowLeft size={20} />Terug naar Dashboard</button>
                    </div>
                    <h1 className="admin-title"><Users className="title-icon" />Gebruikers beheren</h1>
                    <p className="admin-subtitle">Beheer mentoren, decanen en teamleiders in het systeem</p>
                </div>
            </div>

            <div className="admin-content">
                <div className="controls-section">
                    <div className="search-container">
                        <Search className="search-icon" />
                        <input type="text" placeholder="Zoek gebruikers..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
                    </div>
                    <button className="btn btn-primary" onClick={() => { resetForm(); setShowAddForm(true); }}><Plus size={20} />Nieuwe gebruiker</button>
                </div>

                {showAddForm && (
                    <div className="form-section">
                        <div className="form-header"><h2 className="form-title">{editingUser ? 'Gebruiker bewerken' : 'Nieuwe gebruiker toevoegen'}</h2></div>
                        <form onSubmit={handleSubmit} className="user-form">
                            <div className="form-grid">
                                <div className="form-group"><label htmlFor="fullName" className="form-label">Volledige naam *</label><input type="text" id="fullName" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="form-input" required /></div>
                                <div className="form-group"><label htmlFor="email" className="form-label">Email *</label><input type="email" id="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="form-input" required /></div>
                                <div className="form-group"><label htmlFor="abbreviation" className="form-label">3-letterige afkorting *</label><input type="text" id="abbreviation" value={formData.abbreviation} onChange={(e) => setFormData({...formData, abbreviation: e.target.value.toUpperCase()})} className="form-input" maxLength="3" required /></div>
                                <div className="form-group"><label htmlFor="password" className="form-label">{editingUser ? 'Nieuw wachtwoord (laat leeg om niet te wijzigen)' : 'Wachtwoord *'}</label><input type="password" id="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="form-input" required={!editingUser} /></div>
                                <div className="form-group"><label htmlFor="classId" className="form-label">Klas *</label>
                                    <select id="classId" value={formData.classId} onChange={(e) => setFormData({...formData, classId: e.target.value})} className="form-select" required>
                                        <option value="">Selecteer een klas</option>
                                        {classes.map(cls => (<option key={cls.class_id} value={cls.class_id}>{cls.class_name} - {cls.level.name}</option>))}
                                    </select>
                                </div>
                                <div className="form-group"><label htmlFor="phone" className="form-label">Telefoonnummer</label><input type="tel" id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="form-input" /></div>
                            </div>
                            <div className="form-group form-group-full"><label htmlFor="notes" className="form-label">Notities</label><textarea id="notes" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="form-textarea"></textarea></div>
                            <div className="form-buttons">
                                <button type="button" onClick={resetForm} className="btn btn-outline">Annuleren</button>
                                <button type="submit" className="btn btn-primary">{editingUser ? 'Bijwerken' : 'Toevoegen'}</button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="table-section">
                    <div className="table-header"><h2 className="table-title">Alle gebruikers ({filteredUsers.length})</h2></div>
                    <div className="table-container">
                        <table className="users-table">
                            <thead><tr><th>Naam</th><th>Afkorting</th><th>Klas</th><th>Acties</th></tr></thead>
                            <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id}>
                                    <td className="user-name">{user.fullName}</td>
                                    <td className="user-abbreviation">{user.abbreviation}</td>
                                    <td className="user-class">{user.className}</td>
                                    <td className="user-actions">
                                        <button onClick={() => handleEdit(user)} className="action-btn edit-btn" title="Bewerken"><Edit size={16} /></button>
                                        <button onClick={() => handleDelete(user.id)} className="delete-button" title="Verwijderen"><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;