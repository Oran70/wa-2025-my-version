import {useState, useEffect, useCallback} from 'react';
import adminApiService from '../services/AdminApiServices';

// export const useAdminDashboard = () => {
//     const [dashboardData, setDashboardData] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//
//     useEffect(() => {
//         const fetchDashboardData = async () => {
//             try {
//                 const response = await adminApiService.getDashboardData();
//                 if (response.success) {
//                     setDashboardData(response.data);
//                 }
//             } catch (err) {
//                 setError(err.response?.data?.message || 'Failed to load dashboard data.');
//             } finally {
//                 setLoading(false);
//             }
//         };
//
//         fetchDashboardData();
//     }, []); // The empty array means this effect runs once when the component mounts.
//
//     return { dashboardData, loading, error };
// };

export const useDashboardStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const response = await adminApiService.getDashboardStats();
                if (response.success) {
                    setStats(response.data);
                }
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to fetch dashboard stats');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return { stats, loading, error };
};

export const useUserManagement = () => {
    const [users, setUsers] = useState([]);
    const [classes, setClasses] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const usersResponse = await adminApiService.getUsers();
            const classesResponse = await adminApiService.getClasses();
            const rolesResponse = await adminApiService.getRoles();

            if (usersResponse.success) {
                setUsers(usersResponse.data);
            }
            if (classesResponse.success) {
                setClasses(classesResponse.data);
            }
            if (rolesResponse.success) {
                setRoles(rolesResponse.data);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const addUser = async (userData) => {
        await adminApiService.createUser(userData);
        await fetchData(); // Refetch all data to show the new user
    };

    const editUser = async (userId, userData) => {
        await adminApiService.updateUser(userId, userData);
        await fetchData(); // Refetch to show changes
    };

    const removeUser = async (userId) => {
        await adminApiService.deleteUser(userId);
        setUsers(prevUsers => prevUsers.filter(u => u.user_id !== userId)); // Faster UI update
    };

    return { users, classes, roles, loading, error, addUser, editUser, removeUser };
};


export const useClassManagement = () => {
    const [classes, setClasses] = useState([]);
    const [levels, setLevels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [classesRes, levelsRes] = await Promise.all([
                adminApiService.getClasses(),
                adminApiService.getLevels()
            ]);
            if (classesRes.success) setClasses(classesRes.data);
            if (levelsRes.success) setLevels(levelsRes.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const addClass = async (classData) => {
        await adminApiService.createClass(classData);
        fetchData();
    };

    const editClass = async (classId, classData) => {
        await adminApiService.updateClass(classId, classData);
        fetchData();
    };

    const removeClass = async (classId) => {
        await adminApiService.deleteClass(classId);
        setClasses(prev => prev.filter(c => c.class_id !== classId));
    };

    return { classes, levels, loading, error, addClass, editClass, removeClass };
};


export const useStudentManagement = () => {
    const [students, setStudents] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [classes, setClasses] = useState([]);
    const [levels, setLevels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Using useCallback to prevent re-creating the function on every render
    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            // Fetch students, classes, and levels at the same time
            const [studentsRes, classesRes, levelsRes] = await Promise.all([
                adminApiService.getStudents(),
                adminApiService.getClasses(),
                adminApiService.getLevels()
            ]);

            if (Array.isArray(studentsRes)) {
                setStudents(studentsRes);
                setPagination(studentsRes);
            }
            if (classesRes.success) setClasses(classesRes.data);
            if (levelsRes.success) setLevels(levelsRes.data);

        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch student data');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const addStudent = async (studentData) => {
        await adminApiService.createStudent(studentData);
        fetchData(); // Refetch data to show the new student
    };

    const editStudent = async (studentId, studentData) => {
        await adminApiService.updateStudent(studentId, studentData);
        fetchData(); // Refetch to show changes
    };

    const removeStudent = async (studentId) => {
        try {
            await adminApiService.deleteStudent(studentId);
        } catch (err) {
            if (err.response?.status !== 404) {
                console.error("Failed to delete student:", err);
            }
        } finally {
            setStudents(prev => prev.filter(s => s.student_id !== studentId));
        }
    };


    return { students, pagination, classes, levels, loading, error, addStudent, editStudent, removeStudent };
};