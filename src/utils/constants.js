export const API_BASE_URL = 'http://localhost:8081/api';

export const API_ENDPOINTS = {

    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',

    LALINS: '/lalins',

    GERBANGS: '/gerbangs',
};

export const ROUTES = {
    LOGIN: '/login',
    DASHBOARD: '/',
    LALIN_REPORT: '/lalin-report',
    MASTER_GERBANG: '/master-gerbang',
};

export const PAYMENT_METHODS = {
    TUNAI: 'Tunai',
    E_MANDIRI: 'eMandiri',
    E_BRI: 'eBri',
    E_BNI: 'eBni',
    E_BCA: 'eBca',
    E_NOBU: 'eNobu',
    E_DKI: 'eDKI',
    E_MEGA: 'eMega',
    E_FLO: 'eFlo',
};

export const PAYMENT_METHOD_LABELS = {
    Tunai: 'Total Tunai',
    eMandiri: 'Mandiri',
    eBri: 'BRI',
    eBni: 'BNI',
    eBca: 'BCA',
    eNobu: 'Nobu',
    eDKI: 'DKI',
    eMega: 'Mega',
    eFlo: 'Flo',
};

export const SHIFTS = {
    1: 'Shift 1',
    2: 'Shift 2',
    3: 'Shift 3',
};

export const GOLONGAN = {
    1: 'Golongan I',
    2: 'Golongan II',
    3: 'Golongan III',
    4: 'Golongan IV',
    5: 'Golongan V',
};

export const CHART_COLORS = {
    primary: ['#3B82F6', '#1D4ED8', '#1E40AF'],
    secondary: ['#10B981', '#059669', '#047857'],
    tertiary: ['#F59E0B', '#D97706', '#B45309'],
    quaternary: ['#EF4444', '#DC2626', '#B91C1C'],
    palette: [
        '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
        '#8B5CF6', '#06B6D4', '#84CC16', '#F97316',
        '#EC4899', '#6366F1', '#14B8A6', '#F CD34D'
    ]
};

export const TABLE_PAGE_SIZES = [5, 10, 20, 50];

export const DATE_FORMAT = 'yyyy-MM-dd';
export const DISPLAY_DATE_FORMAT = 'dd/MM/yyyy';
export const DATETIME_FORMAT = 'dd/MM/yyyy HH:mm:ss';

export const TOAST_DURATION = 3000;

export const LOADING_STATES = {
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCESS: 'success',
    ERROR: 'error',
};

export const SORT_DIRECTIONS = {
    ASC: 'asc',
    DESC: 'desc',
};

export const DEFAULT_PAGINATION = {
    page: 1,
    limit: 10,
    total_pages: 0,
    count: 0,
};

export const REGEX_PATTERNS = {
    USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
    PASSWORD: /^.{6,}$/,
};

export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Terjadi kesalahan jaringan. Silakan coba lagi.',
    UNAUTHORIZED: 'Sesi Anda telah berakhir. Silakan login kembali.',
    FORBIDDEN: 'Anda tidak memiliki akses untuk melakukan tindakan ini.',
    NOT_FOUND: 'Data tidak ditemukan.',
    VALIDATION_ERROR: 'Data yang Anda masukkan tidak valid.',
    SERVER_ERROR: 'Terjadi kesalahan pada server. Silakan coba lagi nanti.',
};

export const SUCCESS_MESSAGES = {
    LOGIN_SUCCESS: 'Login berhasil!',
    LOGOUT_SUCCESS: 'Logout berhasil!',
    DATA_SAVED: 'Data berhasil disimpan!',
    DATA_UPDATED: 'Data berhasil diperbarui!',
    DATA_DELETED: 'Data berhasil dihapus!',
    EXPORT_SUCCESS: 'Data berhasil diekspor!',
};