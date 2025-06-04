export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePassword(password) {
  // Example: at least 6 characters
  return password.length >= 6;
}

export function validateName(name) {
  return name.trim().length > 0;
}

export function validateRole(role) {
  return role && role !== "";
}
