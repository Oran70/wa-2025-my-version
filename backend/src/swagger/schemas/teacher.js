module.exports = {
    TeacherUser: {
        type: 'object',
        properties: {
            user_id: {
                type: 'string',
                format: 'uuid',
                description: 'Unique identifier for the teacher',
                example: '123e4567-e89b-12d3-a456-426614174000'
            },
            email: {
                type: 'string',
                format: 'email',
                description: 'Teacher email address',
                example: 'j.Janelenen@school.edu'
            },
            name: {
                type: 'string',
                description: 'Full name of the teacher',
                example: 'Jane Smith'
            },
            abbreviation: {
                type: 'string',
                description: 'Teacher abbreviation',
                example: 'JSM'
            },
            roles: {
                type: 'array',
                items: {
                    type: 'string'
                },
                description: 'Teacher roles',
                example: ['Teacher', 'Mentor']
            }
        },
        required: ['user_id', 'email', 'name', 'roles']
    },
    TeacherDashboard: {
        type: 'object',
        properties: {
            teacher: { $ref: '#/components/schemas/TeacherUser' },
            upcomingAppointments: {
                type: 'array',
                items: { $ref: '#/components/schemas/TeacherAppointment' }
            },
            todaysAppointments: {
                type: 'array',
                items: { $ref: '#/components/schemas/TeacherAppointment' }
            },
            stats: {
                type: 'object',
                properties: {
                    totalClasses: { type: 'integer' },
                    totalStudents: { type: 'integer' },
                    upcomingCount: { type: 'integer' }
                }
            }
        }
    },
    TeacherClass: {
        type: 'object',
        properties: {
            class_id: {
                type: 'string',
                format: 'uuid',
                description: 'Unique identifier for the class',
                example: '123e4567-e89b-12d3-a456-426614174000'
            },
            class_name: {
                type: 'string',
                description: 'Name of the class',
                example: 'Mathematics 5A'
            },
            level_name: {
                type: 'string',
                description: 'Grade level name',
                example: 'Grade 5'
            },
            school_year: {
                type: 'string',
                description: 'Academic year',
                example: '2024-2025'
            },
            is_primary_mentor: {
                type: 'boolean',
                description: 'Whether teacher is primary mentor for this class',
                example: true
            },
            teacher_class_id: {
                type: 'string',
                format: 'uuid',
                description: 'Unique identifier for teacher-class relationship',
                example: '987fcdeb-51a2-43d1-9f6e-8c7b5a4d3e2f'
            }
        },
        required: ['class_id', 'class_name', 'level_name', 'school_year', 'is_primary_mentor']
    },

    TeacherStudent: {
        type: 'object',
        properties: {
            student_id: {
                type: 'string',
                format: 'uuid',
                description: 'Unique identifier for the student',
                example: '123e4567-e89b-12d3-a456-426614174000'
            },
            name: {
                type: 'string',
                description: 'Full name of the student',
                example: 'John Doe'
            },
            student_number: {
                type: 'string',
                description: 'Student identification number',
                example: 'ST2024001'
            },
            class_id: {
                type: 'string',
                format: 'uuid',
                description: 'Class identifier',
                example: '987fcdeb-51a2-43d1-9f6e-8c7b5a4d3e2f'
            },
            class_name: {
                type: 'string',
                description: 'Name of the class',
                example: 'Mathematics 5A'
            },
            level_name: {
                type: 'string',
                description: 'Grade level name',
                example: 'Grade 5'
            },
            school_year: {
                type: 'string',
                description: 'Academic year',
                example: '2024-2025'
            },
            is_mentored_by_me: {
                type: 'boolean',
                description: 'Whether this teacher is the primary mentor for this student',
                example: false
            },
            parent_access_code: {
                type: 'string',
                description: 'Access code for parent to book appointments',
                example: 'B3Y6N1Q5R9'
            }
        },
        required: ['student_id', 'name', 'student_number', 'class_name', 'level_name']
    },

    AvailabilitySlot: {
        type: 'object',
        properties: {
            availability_id: { $ref: '#/components/schemas/UUID' },
            date: { $ref: '#/components/schemas/Date' },
            start_time: { $ref: '#/components/schemas/Time' },
            end_time: { $ref: '#/components/schemas/Time' },
            slot_duration: {
                type: 'integer',
                description: 'Duration of the slot in minutes',
                example: 30,
                minimum: 10,
                maximum: 30
            },
            notes: {
                type: 'string',
                description: 'Additional notes about the availability',
                example: 'Office hours for parent consultations'
            },
            is_visible: {
                type: 'boolean',
                description: 'Whether the slot is visible to parents',
                example: true
            },
            is_booked: {
                type: 'boolean',
                description: 'Whether the slot is already booked',
                example: false
            }
        },
        required: ['availability_id', 'date', 'start_time', 'end_time', 'slot_duration']
    },

    TeacherAppointment: {
        type: 'object',
        properties: {
            appointment_id: {
                type: 'string',
                format: 'uuid',
                description: 'Unique identifier for the appointment',
                example: '123e4567-e89b-12d3-a456-426614174000'
            },
            availability_id: {
                type: 'string',
                format: 'uuid',
                description: 'Availability slot identifier',
                example: '987fcdeb-51a2-43d1-9f6e-8c7b5a4d3e2f'
            },
            date: { $ref: '#/components/schemas/Date' },
            startTime: { $ref: '#/components/schemas/Time' },
            endTime: { $ref: '#/components/schemas/Time' },
            parent_name: {
                type: 'string',
                description: 'Name of the parent booking the appointment',
                example: 'Alice Doe'
            },
            parent_email: {
                type: 'string',
                format: 'email',
                description: 'Email of the parent booking the appointment',
                example: 'blabla@bla.nl',
            },
            parent_phone: {
                type: 'string',
                description: 'Phone number of the parent booking the appointment',
                example: '+31 6 12345678'
            },
            status: {
                type: 'string',
                enum: ['Scheduled', 'Cancelled'],
                description: 'Status of the appointment',
                example: 'Scheduled'
            },
            cancellation_reason: {
                type: 'string',
                description: 'Reason for cancellation if applicable',
                example: 'Parent requested to reschedule'
            },
            cancellation_datetime: {
                type: 'string',
                format: 'date-time',
                description: 'Date and time when the appointment was cancelled',
                example: '2024-02-15T12:00:00Z'
            },
            cancelled_by: {
                type: 'string',
                enum: ['Parent', 'Teacher'],
                description: 'Who cancelled the appointment',
                example: 'Parent'
            }
        },
        required: ['appointment_id', 'availability_id', 'date', 'start_time', 'end_time', 'parent_name', 'parent_email']
    },
}
