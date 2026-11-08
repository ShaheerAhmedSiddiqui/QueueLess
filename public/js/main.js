document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.needs-validation').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      event.stopPropagation();

      const password = form.querySelector('#regPassword');
      const confirmation = form.querySelector('#confirmPassword');
      if (password && confirmation) {
        confirmation.setCustomValidity(password.value === confirmation.value ? '' : 'Passwords do not match.');
      }

      form.classList.add('was-validated');
      if (!form.checkValidity()) return;

      const feedback = form.querySelector('[data-form-feedback]');
      if (feedback) {
        feedback.textContent = form.hasAttribute('data-demo-form')
          ? 'Form validation passed. Backend submission will be connected in a later phase.'
          : '';
      }
    });
  });

  document.querySelectorAll('[data-password-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      const input = document.getElementById(button.dataset.passwordToggle);
      if (!input) return;
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      button.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
      button.innerHTML = `<i class="bi ${show ? 'bi-eye-slash' : 'bi-eye'}"></i>`;
    });
  });
});
