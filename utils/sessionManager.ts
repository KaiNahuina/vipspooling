import { getCurrentUser } from 'aws-amplify/auth';

// Session timeout in milliseconds (e.g., 30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000;
let sessionTimer: NodeJS.Timeout;

export const checkSession = async () => {
  try {
    const user = await getCurrentUser();
    return !!user;
  } catch (error) {
    return false;
  }
};

export const startSessionTimer = (onTimeout: () => void) => {
  // Clear any existing timer
  if (sessionTimer) {
    clearTimeout(sessionTimer);
  }

  // Set new timer
  sessionTimer = setTimeout(onTimeout, SESSION_TIMEOUT);
};

export const resetSessionTimer = (onTimeout: () => void) => {
  startSessionTimer(onTimeout);
};

export const clearSessionTimer = () => {
  if (sessionTimer) {
    clearTimeout(sessionTimer);
  }
}; 