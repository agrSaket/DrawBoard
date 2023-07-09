function submitForm(event) {
    event.preventDefault();

    // Reset error messages
    document.getElementById('nameError').textContent = '';
    document.getElementById('emailError').textContent = '';
    document.getElementById('messageError').textContent = '';

    // Get form inputs
    var nameInput = document.getElementById('name');
    var emailInput = document.getElementById('email');
    var messageInput = document.getElementById('message');

    // Validate inputs
    var isValid = true;
    if (nameInput.value.trim() === '') {
        document.getElementById('nameError').textContent = 'Please enter your name';
        isValid = false;
    }
    if (emailInput.value.trim() === '') {
        document.getElementById('emailError').textContent = 'Please enter your email';
        isValid = false;
    } else if (!validateEmail(emailInput.value)) {
        document.getElementById('emailError').textContent = 'Please enter a valid email address';
        isValid = false;
    }
    if (messageInput.value.trim() === '') {
        document.getElementById('messageError').textContent = 'Please enter your message';
        isValid = false;
    }

    // Display success message in a pop-up window if form is valid
    if (isValid) {
        window.alert('Message sent successfully!');
        document.getElementById('contactForm').reset();
    }
}

// Email validation function
function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}