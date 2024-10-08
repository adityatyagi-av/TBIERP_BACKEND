import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const fieldextensions = {
    field: {
        email: {
            validate: (email) => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email);
            },
            message: "Invalid email format."
        },
        phone: {
            validate: (phone) => {
                const phoneRegex = /^[0-9]{10}$/;
                return phoneRegex.test(phone);
            },
            message: "Phone number must be 10 digits."
        },
        
    }
};

export default fieldextensions;
