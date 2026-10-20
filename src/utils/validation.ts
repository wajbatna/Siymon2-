export interface FieldErrors {
  [field: string]: string | undefined;
}

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

export function isPhone(value: string): boolean {
  return /^[+]?[\d\s-]{9,15}$/.test(value.trim());
}

export function required(value: string, label: string): string | undefined {
  return value.trim() ? undefined : `${label} is required`;
}

export function minLen(value: string, len: number, label: string): string | undefined {
  return value.trim().length >= len ? undefined : `${label} must be at least ${len} characters`;
}
