'use strict';

const form = document.querySelector('#registration-form');
const formMessage = document.querySelector('#form-message');
const passwordInput = document.querySelector('#password');
const confirmPasswordInput = document.querySelector('#confirm-password');
const strengthBar = document.querySelector('#strength-bar');
const strengthLabel = document.querySelector('#strength-label');
const togglePasswordButton = document.querySelector('.toggle-password');

const fields = {
  name: document.querySelector('#full-name'),
  email: document.querySelector('#email'),
  phone: document.querySelector('#phone'),
  password: passwordInput,
  confirmPassword: confirmPasswordInput
};

const validators = {
  name(value) {
    if (!value.trim()) return 'Please enter your full name.';
    if (value.trim().length < 2) return 'Name must contain at least 2 characters.';
    if (!/[\p{L}]/u.test(value)) return 'Please enter a valid name.';
    return '';
  },
  email(value) {
    if (!value.trim()) return 'Please enter your email address.';
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailPattern.test(value.trim()) ? '' : 'Enter a valid email address, such as you@example.com.';
  },
  phone(value) {
    if (!value.trim()) return 'Please enter your phone number.';
    const digits = value.replace(/\D/g, '');
    if (!/^[+\d\s().-]+$/.test(value.trim()) || digits.length < 10 || digits.length > 15) {
      return 'Enter a valid phone number with 10 to 15 digits.';
    }
    return '';
  },
  password(value) {
    if (!value) return 'Please create a password.';
    if (value.length < 8) return 'Password must be at least 8 characters long.';
    if (!/[A-Z]/.test(value)) return 'Add at least one uppercase letter.';
    if (!/[a-z]/.test(value)) return 'Add at least one lowercase letter.';
    if (!/\d/.test(value)) return 'Add at least one number.';
    return '';
  },
  confirmPassword(value) {
    if (!value) return 'Please confirm your password.';
    return value === passwordInput.value ? '' : 'Passwords do not match.';
  }
};

function setFieldState(key, message) {
  const input = fields[key];
  const group = input.closest('.field-group');
  const errorElement = document.querySelector(`#${key === 'confirmPassword' ? 'confirmPassword' : key}-error`);
  group.classList.toggle('invalid', Boolean(message));
  group.classList.toggle('valid', !message && input.value.trim().length > 0);
  input.setAttribute('aria-invalid', message ? 'true' : 'false');
  errorElement.textContent = message;
}

function validateField(key) {
  const message = validators[key](fields[key].value);
  setFieldState(key, message);
  return !message;
}

function updatePasswordStrength(value) {
  let score = 0;
  if (value.length >= 8) score++;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
  if (/\d/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;

  const labels = ['Not entered', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['#29283a', '#fb7185', '#fbbf24', '#a78bfa', '#6ee7b7'];
  strengthBar.style.width = `${score * 25}%`;
  strengthBar.style.background = colors[score];
  strengthLabel.textContent = `Password strength: ${value ? labels[score] : 'not entered'}`;
}

Object.entries(fields).forEach(([key, input]) => {
  input.addEventListener('blur', () => validateField(key));
  input.addEventListener('input', () => {
    if (input.getAttribute('aria-invalid') === 'true' || input.value.length > 0) validateField(key);
    if (key === 'password') {
      updatePasswordStrength(input.value);
      if (confirmPasswordInput.value) validateField('confirmPassword');
    }
    formMessage.className = 'form-message';
    formMessage.textContent = '';
  });
  input.addEventListener('focus', () => {
    formMessage.className = 'form-message';
    formMessage.textContent = '';
  });
});

togglePasswordButton.addEventListener('click', () => {
  const shouldShow = passwordInput.type === 'password';
  passwordInput.type = shouldShow ? 'text' : 'password';
  confirmPasswordInput.type = shouldShow ? 'text' : 'password';
  togglePasswordButton.textContent = shouldShow ? 'Hide' : 'Show';
  togglePasswordButton.setAttribute('aria-label', shouldShow ? 'Hide password' : 'Show password');
  togglePasswordButton.setAttribute('aria-pressed', String(shouldShow));
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const valid = Object.keys(fields).map(validateField).every(Boolean);
  if (!valid) {
    formMessage.className = 'form-message show failure';
    formMessage.textContent = 'Please correct the highlighted fields and try again.';
    const firstInvalid = form.querySelector('[aria-invalid="true"]');
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  formMessage.className = 'form-message show success';
  formMessage.textContent = `Success! Your form has been validated, ${fields.name.value.trim()}. This demo does not send your information to a server.`;
  formMessage.focus();
});

updatePasswordStrength('');
