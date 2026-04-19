/**
 * DNTRNG™ ACTIVITY LOG PROTOCOL
 * 
 * Manages the forensic trail of administrative actions.
 * Logs are persisted in localStorage for immediate oversight.
 */

export interface AdminLog {
  action: string;
  target: string;
  timestamp: number;
}

const STORAGE_KEY = 'dntrng_admin_activity';
const MAX_ENTRIES = 50;

export function logActivity(action: string, target: string) {
  if (typeof window === 'undefined') return;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const logs: AdminLog[] = raw ? JSON.parse(raw) : [];
    
    const newEntry: AdminLog = {
      action,
      target,
      timestamp: Date.now(),
    };

    const updatedLogs = [newEntry, ...logs].slice(0, MAX_ENTRIES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLogs));
    
    // Trigger a storage event for same-tab synchronization
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    // Background logging failure does not interrupt the admin workflow
  }
}

export function getAdminLogs(): AdminLog[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function clearAdminLogs() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
