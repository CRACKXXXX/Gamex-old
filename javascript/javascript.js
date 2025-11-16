// Constant definition using SCREAMING_SNAKE_CASE_CASE notation
const NAV_BUTTONS = document.querySelectorAll('nav button');
const PARALLAX_METEOR = document.querySelector('.parallax-meteor');
const MAX_RANGE_PIXELS = 100; // Maximum displacement in pixels

// Global array for product list
let productList = [];

function showSection(sectionId) {
    // Get all sections
    const sections = document.querySelectorAll('.content-section');

    // Hide all sections
    sections.forEach(section => {
        section.style.display = 'none';
    });

    // Show the selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    } else {
        console.error(`No se encontró la sección con ID: ${sectionId}`);
        return; // Salir de la función si no se encuentra la sección
    }

    // Change the state of the buttons using the global constant
    NAV_BUTTONS.forEach(button => {
        button.classList.remove('active-button');
    });

    // Add the active class to the corresponding button
    // Note: This requires your HTML buttons to have 'data-target' attributes 
    // matching the section ID (e.g., <button data-target="inicio" onclick="showSection('inicio')">)
    const activeButton = Array.from(NAV_BUTTONS).find(button => button.dataset.target === sectionId);

    if (activeButton) {
        activeButton.classList.add('active-button');
    } else {
        // Fallback: If data-target is not used, try finding the button based on the onclick content
        const fallbackButton = Array.from(NAV_BUTTONS).find(button => button.getAttribute('onclick').includes(`'${sectionId}'`));
        if (fallbackButton) {
            fallbackButton.classList.add('active-button');
        } else {
            console.error(`No se encontró un botón correspondiente para la sección: ${sectionId}`);
        }
    }

    // Call renderProducts if section is 'juegos'
    if (sectionId === 'juegos') {
        renderProducts();
    }
}

// Function to render products in the products-list div
function renderProducts() {
    const productsListDiv = document.getElementById('products-list');
    productsListDiv.innerHTML = ''; // Clear existing content

    productList.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'game-card';
        productCard.innerHTML = `
            <h3>${product.name}</h3>
            <p><strong>Precio:</strong> $${product.price}</p>
            <p><strong>Descripción:</strong> ${product.description}</p>
        `;
        productsListDiv.appendChild(productCard);
    });
}

// Function to add a new product
function addProduct(event) {
    event.preventDefault(); // Prevent form submission

    const name = document.getElementById('productName').value.trim();
    const price = parseFloat(document.getElementById('productPrice').value);
    const description = document.getElementById('productDescription').value.trim();

    if (name && !isNaN(price) && description) {
        const newProduct = { name, price, description };
        productList.push(newProduct);
        renderProducts();
        document.getElementById('productForm').reset(); // Clear the form
    }
}

// Initialize the page by showing the home section and highlighting the corresponding button
showSection('inicio');

// Function to handle parallax effect
function handleParallax(event) {
    if (PARALLAX_METEOR) {
        const container = document.querySelector('.parallax-container');
        const containerRect = container.getBoundingClientRect();
        const mouseX = event.clientX;

        // Calculate the relative position within the container
        const relativeX = mouseX - containerRect.left;
        const containerWidth = containerRect.width;

        // Normalize to a value between -1 and 1
        const normalizedX = (relativeX / containerWidth) * 2 - 1;

        // Calculate displacement
        const displacement = normalizedX * MAX_RANGE_PIXELS;

        // Apply transform to the img inside the meteor layer
        const meteorImg = PARALLAX_METEOR.querySelector('img');
        if (meteorImg) {
            meteorImg.style.transform = `translateX(${displacement}px)`;
        }
    }
}

// Add event listener for mousemove
document.addEventListener('mousemove', handleParallax);

function validateForm(event) {
    // 1. Prevent the default form submission to handle it entirely with JS.
    event.preventDefault();

    let isValid = true;

    // Utility functions to manage error messages on the page.
    const clearError = (id) => document.getElementById(id).textContent = '';

    // Displays an error message and sets the global 'isValid' flag to false.
    const displayError = (id, message) => {
        document.getElementById(id).textContent = message;
        isValid = false;
    };

    // 2. Get trimmed values for all 4 controls and clear previous errors.
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    clearError('fullNameError');
    clearError('emailError');
    clearError('subjectError');
    clearError('messageError');

    // 3. JavaScript Validations (4 Controls)

    // Control 1: Full Name (Required, Minimum 5 characters for 'Nombre y apellidos')
    if (fullName === '') {
        displayError('fullNameError', 'Se requiere poner un nombre y apellidos.');
    } else if (fullName.length < 5) {
        displayError('fullNameError', 'Debe de tener mas de 5 caracteres.');
    }

    // Control 2: Email Address (Required and basic format check)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === '') {
        displayError('emailError', 'Se requiere el Gmail.');
    } else if (!emailRegex.test(email)) {
        displayError('emailError', 'Usa un formato valido (Ejemplo: user@domain.com).');
    }

    // Control 3: Subject (Required, Minimum 5 characters)
    if (subject === '') {
        displayError('subjectError', 'Se requiere un asunto.');
    } else if (subject.length < 5) {
        displayError('subjectError', 'El asunto debe de tener mas de 5 caracteres.');
    }

    // Control 4: Message (Required, Minimum 15 characters)
    if (message === '') {
        displayError('messageError', 'Se requiere el mensaje.');
    } else if (message.length < 15) {
        displayError('messageError', 'El mensaje debe de tener mas de 15 caracteres.');
    }

    // 4. Final Result and Action (NO ALERTS)
    if (isValid) {
        document.getElementById('contactForm').reset();

        return true;
    } else {
        return false;
    }
}