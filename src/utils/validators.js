
export const validateRequired = (value, fieldName = 'Field') => {
    if (value === null || value === undefined || value === '') {
        return `${fieldName} wajib diisi`;
    }
    return null;
};


export const validateEmail = (email) => {
    if (!email) return 'Email wajib diisi';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'Format email tidak valid';
    }
    return null;
};


export const validateUsername = (username) => {
    if (!username) return 'Username wajib diisi';

    if (username.length < 3) {
        return 'Username minimal 3 karakter';
    }

    if (username.length > 20) {
        return 'Username maksimal 20 karakter';
    }

    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
        return 'Username hanya boleh mengandung huruf, angka, dan underscore';
    }

    return null;
};


export const validatePassword = (password) => {
    if (!password) return 'Password wajib diisi';

    if (password.length < 6) {
        return 'Password minimal 6 karakter';
    }

    return null;
};


export const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) return 'Konfirmasi password wajib diisi';

    if (password !== confirmPassword) {
        return 'Konfirmasi password tidak sesuai';
    }

    return null;
};


export const validateNumber = (value, fieldName = 'Field', options = {}) => {
    const { min, max, required = true } = options;

    if (required && (value === null || value === undefined || value === '')) {
        return `${fieldName} wajib diisi`;
    }

    if (value !== null && value !== undefined && value !== '') {
        const numValue = Number(value);

        if (isNaN(numValue)) {
            return `${fieldName} harus berupa angka`;
        }

        if (min !== undefined && numValue < min) {
            return `${fieldName} minimal ${min}`;
        }

        if (max !== undefined && numValue > max) {
            return `${fieldName} maksimal ${max}`;
        }
    }

    return null;
};


export const validatePositiveInteger = (value, fieldName = 'Field') => {
    if (!value) return `${fieldName} wajib diisi`;

    const numValue = Number(value);
    if (isNaN(numValue)) {
        return `${fieldName} harus berupa angka`;
    }

    if (!Number.isInteger(numValue)) {
        return `${fieldName} harus berupa bilangan bulat`;
    }

    if (numValue <= 0) {
        return `${fieldName} harus lebih dari 0`;
    }

    return null;
};


export const validateDate = (date, fieldName = 'Tanggal') => {
    if (!date) return `${fieldName} wajib diisi`;

    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
        return `${fieldName} tidak valid`;
    }

    return null;
};


export const validateDateRange = (startDate, endDate) => {
    const startError = validateDate(startDate, 'Tanggal mulai');
    if (startError) return startError;

    const endError = validateDate(endDate, 'Tanggal akhir');
    if (endError) return endError;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
        return 'Tanggal mulai tidak boleh lebih dari tanggal akhir';
    }

    return null;
};


export const validateStringLength = (value, fieldName = 'Field', options = {}) => {
    const { min = 0, max, required = true } = options;

    if (required && (!value || value.trim() === '')) {
        return `${fieldName} wajib diisi`;
    }

    if (value) {
        const trimmedValue = value.trim();

        if (trimmedValue.length < min) {
            return `${fieldName} minimal ${min} karakter`;
        }

        if (max && trimmedValue.length > max) {
            return `${fieldName} maksimal ${max} karakter`;
        }
    }

    return null;
};


export const validateSelect = (value, options, fieldName = 'Field') => {
    if (!value) return `${fieldName} wajib dipilih`;

    if (Array.isArray(options)) {
        const validValues = options.map(opt =>
            typeof opt === 'object' ? opt.value : opt
        );

        if (!validValues.includes(value)) {
            return `${fieldName} tidak valid`;
        }
    }

    return null;
};


export const validatePhoneNumber = (phone) => {
    if (!phone) return 'Nomor telepon wajib diisi';

 
    const cleanPhone = phone.replace(/\D/g, '');

 
    const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;

    if (!phoneRegex.test(cleanPhone)) {
        return 'Format nomor telepon tidak valid';
    }

    return null;
};


export const validateFileType = (file, allowedTypes) => {
    if (!file) return 'File wajib dipilih';

    if (allowedTypes && !allowedTypes.includes(file.type)) {
        return `Tipe file tidak didukung. Hanya ${allowedTypes.join(', ')} yang diizinkan`;
    }

    return null;
};


export const validateFileSize = (file, maxSizeInMB) => {
    if (!file) return 'File wajib dipilih';

    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    if (file.size > maxSizeInBytes) {
        return `Ukuran file tidak boleh lebih dari ${maxSizeInMB}MB`;
    }

    return null;
};


export const validateForm = (data, rules) => {
    const errors = {};

    for (const [field, rule] of Object.entries(rules)) {
        const value = data[field];
        let error = null;

        if (typeof rule === 'function') {
            error = rule(value);
        } else if (Array.isArray(rule)) {
          
            for (const r of rule) {
                error = r(value);
                if (error) break;
            }
        }

        if (error) {
            errors[field] = error;
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

export const validateLoginForm = (data) => {
    return validateForm(data, {
        username: validateUsername,
        password: validatePassword
    });
};

export const validateGerbangForm = (data) => {
    return validateForm(data, {
        NamaGerbang: (value) => validateStringLength(value, 'Nama Gerbang', { min: 2, max: 100 }),
        NamaCabang: (value) => validateStringLength(value, 'Nama Cabang', { min: 2, max: 100 }),
        IdCabang: (value) => validatePositiveInteger(value, 'ID Cabang')
    });
};

export const validationRules = {
    required: (fieldName) => (value) => validateRequired(value, fieldName),
    email: validateEmail,
    username: validateUsername,
    password: validatePassword,
    number: (fieldName, options) => (value) => validateNumber(value, fieldName, options),
    positiveInteger: (fieldName) => (value) => validatePositiveInteger(value, fieldName),
    stringLength: (fieldName, options) => (value) => validateStringLength(value, fieldName, options),
    date: (fieldName) => (value) => validateDate(value, fieldName),
    select: (options, fieldName) => (value) => validateSelect(value, options, fieldName)
};