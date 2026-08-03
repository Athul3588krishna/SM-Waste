/**
 * Safe local storage helper module with fallback for private browsing mode
 */

export const getStorageItem = (key, defaultValue = null) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  } catch (err) {
    console.error(`Error reading key ${key} from localStorage:`, err);
    return defaultValue;
  }
};

export const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error setting key ${key} in localStorage:`, err);
  }
};

export const removeStorageItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error(`Error removing key ${key} from localStorage:`, err);
  }
};
