const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]{10}$/;
const fieldextensions = {
    field: {
        email: {
            set(value) {
                console.log("Inside Email validation");
                if (!emailRegex.test(value)) {
                    throw new Error('Invalid email format');
                }
                return value;
            },
        },
        phone: {
            set(value) {
                console.log("Inside Phone validation");
                if (!phoneRegex.test(value)) {
                    throw new Error('Invalid phone number');
                }
                return value;
            },
        },
        
    }
};

export default fieldextensions;
