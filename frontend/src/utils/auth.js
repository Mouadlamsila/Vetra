// Secure authentication utility
// Only stores the JWT token in localStorage, all other data is extracted from the token

/**
 * Decode JWT token to get user information
 * @param {string} token - JWT token
 * @returns {object|null} Decoded token payload or null if invalid
 */
export const decodeToken = (token) => {
    try {
        if (!token) return null;
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) return null;
        
        const payload = JSON.parse(atob(tokenParts[1]));
        return payload;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

/**
 * Get user information from stored token
 * @returns {object|null} User information or null if not authenticated
 */
export const getUserInfo = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    const payload = decodeToken(token);
    if (!payload) return null;
    
    return {
        id: payload.id,
        email: payload.email,
        username: payload.username,
        role: payload.role?.name || 'user',
        documentId: payload.documentId
    };
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user is authenticated
 */
export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    const payload = decodeToken(token);
    if (!payload) return false;
    
    // Check if token is expired
    const currentTime = Date.now() / 1000;
    if (payload.exp && payload.exp < currentTime) {
        // Token expired, remove it
        localStorage.removeItem('token');
        return false;
    }
    
    return true;
};

/**
 * Get user ID from token
 * @returns {string|null} User ID or null
 */
export const getUserId = () => {
    const userInfo = getUserInfo();
    return userInfo?.id || null;
};

/**
 * Get user role from token
 * @returns {string|null} User role or null
 */
export const getUserRole = () => {
    const userInfo = getUserInfo();
    return userInfo?.role || null;
};

/**
 * Get user email from token
 * @returns {string|null} User email or null
 */
export const getUserEmail = () => {
    const userInfo = getUserInfo();
    return userInfo?.email || null;
};

/**
 * Get username from token
 * @returns {string|null} Username or null
 */
export const getUsername = () => {
    const userInfo = getUserInfo();
    return userInfo?.username || null;
};

/**
 * Store authentication token securely
 * @param {string} token - JWT token
 */
export const setAuthToken = (token) => {
    if (token) {
        localStorage.setItem('token', token);
    }
};

/**
 * Clear authentication data
 */
export const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('auth_intent');
    // Keep language preference
    const lang = localStorage.getItem('lang');
    localStorage.clear();
    if (lang) {
        localStorage.setItem('lang', lang);
    }
};

/**
 * Get authentication token
 * @returns {string|null} JWT token or null
 */
export const getAuthToken = () => {
    return localStorage.getItem('token');
};

/**
 * Set temporary auth intent (for Google OAuth)
 * @param {string} intent - 'login' or 'register'
 */
export const setAuthIntent = (intent) => {
    localStorage.setItem('auth_intent', intent);
};

/**
 * Get and clear auth intent
 * @returns {string|null} Auth intent or null
 */
export const getAndClearAuthIntent = () => {
    const intent = localStorage.getItem('auth_intent');
    localStorage.removeItem('auth_intent');
    return intent;
};

/**
 * Store store-related data (non-sensitive)
 * @param {string} storeId - Store ID
 * @param {string} ownerId - Owner ID
 */
export const setStoreData = (storeId, ownerId) => {
    if (storeId) localStorage.setItem('IDBoutique', storeId);
    if (ownerId) localStorage.setItem('idOwner', ownerId);
};

/**
 * Get store ID
 * @returns {string|null} Store ID or null
 */
export const getStoreId = () => {
    return localStorage.getItem('IDBoutique');
};

/**
 * Get owner ID
 * @returns {string|null} Owner ID or null
 */
export const getOwnerId = () => {
    return localStorage.getItem('idOwner');
};

/**
 * Clear store data
 */
export const clearStoreData = () => {
    localStorage.removeItem('IDBoutique');
    localStorage.removeItem('idOwner');
};

/**
 * Set language preference
 * @param {string} lang - Language code
 */
export const setLanguage = (lang) => {
    localStorage.setItem('lang', lang);
};

/**
 * Get language preference
 * @returns {string} Language code (defaults to 'en')
 */
export const getLanguage = () => {
    return localStorage.getItem('lang') || 'en';
};

/**
 * Set navigation location
 * @param {string} location - Location identifier
 */
export const setLocation = (location) => {
    localStorage.setItem('location', location);
};

/**
 * Get navigation location
 * @returns {string|null} Location or null
 */
export const getLocation = () => {
    return localStorage.getItem('location');
}; 