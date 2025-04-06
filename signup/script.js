document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.querySelector('.toggle-password');
    const rememberMe = document.getElementById('remember');

    // Toggle password visibility
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePassword.classList.toggle('fa-eye');
        togglePassword.classList.toggle('fa-eye-slash');
    });

    // Add floating label effect
    const inputs = document.querySelectorAll('.form-group input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
    });

    // Form validation
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const showError = (input, message) => {
        const formGroup = input.closest('.form-group');
        const existingError = formGroup.querySelector('.error-message');
        
        if (existingError) {
            existingError.remove();
        }

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = 'var(--error-color)';
        errorDiv.style.fontSize = '0.75rem';
        errorDiv.style.marginTop = '0.5rem';
        errorDiv.textContent = message;
        
        formGroup.appendChild(errorDiv);
        input.style.borderColor = 'var(--error-color)';
    };

    const removeError = (input) => {
        const formGroup = input.closest('.form-group');
        const existingError = formGroup.querySelector('.error-message');
        
        if (existingError) {
            existingError.remove();
        }
        
        input.style.borderColor = 'var(--border-color)';
    };

    // Input validation on blur
    emailInput.addEventListener('blur', () => {
        if (emailInput.value && !validateEmail(emailInput.value)) {
            showError(emailInput, 'Please enter a valid email address');
        }
    });

    emailInput.addEventListener('input', () => {
        removeError(emailInput);
    });

    passwordInput.addEventListener('input', () => {
        removeError(passwordInput);
    });

    // Form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        let isValid = true;

        // Validate email
        if (!emailInput.value) {
            showError(emailInput, 'Email is required');
            isValid = false;
        } else if (!validateEmail(emailInput.value)) {
            showError(emailInput, 'Please enter a valid email address');
            isValid = false;
        }

        // Validate password
        if (!passwordInput.value) {
            showError(passwordInput, 'Password is required');
            isValid = false;
        } else if (passwordInput.value.length < 6) {
            showError(passwordInput, 'Password must be at least 6 characters');
            isValid = false;
        }

        if (isValid) {
            const submitButton = loginForm.querySelector('.sign-in-btn');
            const originalText = submitButton.textContent;
            
            // Show loading state
            submitButton.disabled = true;
            submitButton.textContent = 'Signing in...';

            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Show success state
                submitButton.textContent = 'Success!';
                submitButton.style.backgroundColor = 'var(--success-color)';
                
                // Redirect after success (replace with your dashboard URL)
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 1000);
                
            } catch (error) {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                alert('An error occurred. Please try again.');
            }
        }
    });

    // Social login buttons
    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons.forEach(button => {
        button.addEventListener('click', () => {
            const provider = button.classList.contains('google') ? 'Google' : 'Facebook';
            // Replace with your social login logic
            console.log(`Logging in with ${provider}`);
        });
    });

    // Add some nice animations
    document.querySelectorAll('.form-group, .social-btn').forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.3s ease-out';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100 * (index + 1));
    });
}); 