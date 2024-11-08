// Function to show error messages
function showError(input, message) {
    const errorSpan = document.getElementById(`${input.id}-error`);
    errorSpan.textContent = message;
    errorSpan.style.display = 'block';
    input.style.borderColor = 'red'
}

// Function to clear error messages
function clearError(input) {
    const errorSpan = document.getElementById(`${input.id}-error`);
    errorSpan.textContent = '';
    errorSpan.style.display = 'none';
    input.style.borderColor = 'green'
}

// Validation functions
function validateField(input) {
    console.log(input)
    if (input.validity.valueMissing) {
        showError(input, 'This field is required.');
        return false;
    } else if (input.type === 'email' && !input.validity.valid) {
        showError(input, 'Please enter a valid email address.');
        return false;
    } else if (input.id === 'password' && input.value.length < 6) {
        showError(input, 'Password must be at least 6 characters.');
        return false;
    } else if (input.id === 'confirm-password' && input.value !== document.getElementById('password').value) {
        showError(input, 'Passwords do not match.');
        return false;
    } else {
        clearError(input);
        return true;
    }
}


// Add event listeners for live validation
document.querySelectorAll('input').forEach(input => {
    input.style.borderColor = '#ccc'
    
    // Validate on blur (when the input loses focus)
    input.addEventListener('blur', () => validateField(input));
});

// Final form submission validation
document.querySelector('form').addEventListener('submit', function(event) {
    let formIsValid = true;
    document.querySelectorAll('input').forEach(input => {
        if (!validateField(input)) {
            formIsValid = false;
        }
    });

    if (!formIsValid) {
        event.preventDefault();
        alert('Please correct the errors before submitting.');
    } else {
        alert('High five! Your form is submitted successfully.');
    }
});