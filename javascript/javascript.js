
// Constants
const NAV_BUTTONS = document.querySelectorAll('nav button');
const PARALLAX_METEOR = document.querySelector('.parallax-meteor');
const MAX_RANGE_PIXELS = 100;

// Global product list
let productList = [];

// Load products from localStorage
function loadProducts() {
  const stored = localStorage.getItem('productList');
  if (stored) {
    productList = JSON.parse(stored);
  }
}

// Save products to localStorage
function saveProducts() {
  localStorage.setItem('productList', JSON.stringify(productList));
}

// Show section and handle navigation
function showSection(sectionId) {
  const sections = document.querySelectorAll('.content-section');
  sections.forEach(section => {
    section.style.display = 'none';
  });

  const selectedSection = document.getElementById(sectionId);
  if (selectedSection) {
    selectedSection.style.display = 'block';
  } else {
    console.error(`Section with ID not found: ${sectionId}`);
    return;
  }

  NAV_BUTTONS.forEach(button => {
    button.classList.remove('active-button');
  });

  const activeButton = Array.from(NAV_BUTTONS).find(button => button.dataset.target === sectionId);
  if (activeButton) {
    activeButton.classList.add('active-button');
  } else {
    const fallbackButton = Array.from(NAV_BUTTONS).find(button => button.getAttribute('onclick').includes(`'${sectionId}'`));
    if (fallbackButton) {
      fallbackButton.classList.add('active-button');
    } else {
      console.error(`Corresponding button for section not found: ${sectionId}`);
    }
  }

  if (sectionId === 'juegos') {
    loadProducts();
    renderProducts();
  }

  if (sectionId === 'gestionar') {
    loadProducts();
    renderManageProducts();
  }
}

// Render products in juegos section
function renderProducts() {
  const productsListDiv = document.getElementById('products-list');
  productsListDiv.innerHTML = '';

  productList.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'game-card';
    productCard.innerHTML = `
    <img src="${product.image || './img/no-image.png'}" alt="${product.name}" class="game-image">
    <h3>${product.name}</h3>
    <p><strong>Precio:</strong> $${product.price}</p>
    <p><strong>Descripción:</strong> ${product.description}</p>
  `;
    productsListDiv.appendChild(productCard);
  });
}

// Add new product
function addProduct(event) {
  event.preventDefault();

  const name = document.getElementById('productName').value.trim();
  const price = parseFloat(document.getElementById('productPrice').value);
  const description = document.getElementById('productDescription').value.trim();
  const image = document.getElementById('productImage').value.trim();

  if (name && !isNaN(price) && description) {
    const newProduct = { name: name, price: price, description: description, image: image };
    productList.push(newProduct);
    saveProducts();
    renderProducts();
    document.getElementById('productForm').reset();
  }
}

// Validate product form
function validateProductForm(event) {
  event.preventDefault();

  let isValid = true;

  document.getElementById('productNameError').textContent = '';
  document.getElementById('productPriceError').textContent = '';
  document.getElementById('productDescriptionError').textContent = '';
  document.getElementById('productImageError').textContent = '';

  const name = document.getElementById('productName').value.trim();
  const priceValue = document.getElementById('productPrice').value.trim();
  const price = parseFloat(priceValue);
  const description = document.getElementById('productDescription').value.trim();
  const image = document.getElementById('productImage').value.trim();

  if (name === '') {
    document.getElementById('productNameError').textContent = 'El nombre del producto es requerido.';
    isValid = false;
  } else if (name.length < 3) {
    document.getElementById('productNameError').textContent = 'El nombre del producto debe tener al menos 3 caracteres.';
    isValid = false;
  }

  if (priceValue === '') {
    document.getElementById('productPriceError').textContent = 'El precio es requerido.';
    isValid = false;
  } else if (isNaN(price) || price <= 0) {
    document.getElementById('productPriceError').textContent = 'El precio debe ser un número positivo.';
    isValid = false;
  }

  if (description === '') {
    document.getElementById('productDescriptionError').textContent = 'La descripción es requerida.';
    isValid = false;
  } else if (description.length < 10) {
    document.getElementById('productDescriptionError').textContent = 'La descripción debe tener al menos 10 caracteres.';
    isValid = false;
  }

  const imageRegex = /\.(png|jpg|jpeg|gif|webp)$/i;
  if (image && !imageRegex.test(image)) {
    document.getElementById('productImageError').textContent = 'La URL debe ser una imagen válida (png, jpg, etc.).';
    isValid = false;
  }

  if (isValid) {
    addProduct(event);
  }
}

// Render products in manage section
function renderManageProducts() {
  const productsListDiv = document.getElementById('products-manage-list');
  productsListDiv.innerHTML = '';

  productList.forEach((product, index) => {
    const productCard = document.createElement('div');
    productCard.className = 'game-card';
    productCard.innerHTML = `
    <img src="${product.image || './img/no-image.png'}" alt="${product.name}" class="game-image">
    <h3>${product.name}</h3>
    <p><strong>Precio:</strong> $${product.price}</p>
    <p><strong>Descripción:</strong> ${product.description}</p>
    <button onclick="editProduct(${index})">Editar</button>
    <button onclick="deleteProduct(${index})">Eliminar</button>
  `;
    productsListDiv.appendChild(productCard);
  });
}

// Edit product
function editProduct(index) {
  const product = productList[index];
  document.getElementById('editIndex').value = index;
  document.getElementById('editProductName').value = product.name;
  document.getElementById('editProductPrice').value = product.price;
  document.getElementById('editProductDescription').value = product.description;
  document.getElementById('editProductImage').value = product.image || '';
  document.getElementById('editFormContainer').style.display = 'block';
}

// Delete product
function deleteProduct(index) {
  productList.splice(index, 1);
  saveProducts();
  renderManageProducts();
}

// Update product
function updateProduct(event) {
  event.preventDefault();

  const index = document.getElementById('editIndex').value;
  const name = document.getElementById('editProductName').value.trim();
  const price = parseFloat(document.getElementById('editProductPrice').value);
  const description = document.getElementById('editProductDescription').value.trim();
  const image = document.getElementById('editProductImage').value.trim();

  document.getElementById('editProductNameError').textContent = '';
  document.getElementById('editProductPriceError').textContent = '';
  document.getElementById('editProductDescriptionError').textContent = '';
  document.getElementById('editProductImageError').textContent = '';

  let isValid = true;

  if (name === '') {
    document.getElementById('editProductNameError').textContent = 'El nombre del producto es requerido.';
    isValid = false;
  } else if (name.length < 3) {
    document.getElementById('editProductNameError').textContent = 'El nombre del producto debe tener al menos 3 caracteres.';
    isValid = false;
  }

  if (isNaN(price) || price <= 0) {
    document.getElementById('editProductPriceError').textContent = 'El precio debe ser un número positivo.';
    isValid = false;
  }

  if (description === '') {
    document.getElementById('editProductDescriptionError').textContent = 'La descripción es requerida.';
    isValid = false;
  } else if (description.length < 10) {
    document.getElementById('editProductDescriptionError').textContent = 'La descripción debe tener al menos 10 caracteres.';
    isValid = false;
  }

  const imageRegex = /\.(png|jpg|jpeg|gif|webp)$/i;
  if (image && !imageRegex.test(image)) {
    document.getElementById('editProductImageError').textContent = 'La URL debe ser una imagen válida (png, jpg, etc.).';
    isValid = false;
  }

  if (isValid) {
    productList[index] = { name: name, price: price, description: description, image: image };
    saveProducts();
    renderManageProducts();
    cancelEdit();
  }
}

// Cancel edit
function cancelEdit() {
  document.getElementById('editFormContainer').style.display = 'none';
  document.getElementById('editProductForm').reset();
}

// Initialize
showSection('inicio');

// Scroll progress bar animation
function updateScrollProgressBar() {
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;

  const progressBar = document.getElementById('scroll-progress-bar');
  if (progressBar) {
    progressBar.style.width = scrollPercent + '%';

    // Change shades of red based on scroll percentage
    const redStart = [255, 204, 204];
    const redEnd = [153, 0, 0];

    const r = Math.round(redStart[0] + (redEnd[0] - redStart[0]) * (scrollPercent / 100));
    const g = Math.round(redStart[1] + (redEnd[1] - redStart[1]) * (scrollPercent / 100));
    const b = Math.round(redStart[2] + (redEnd[2] - redStart[2]) * (scrollPercent / 100));

    progressBar.style.background = `linear-gradient(to right, rgb(${r}, ${g}, ${b}), #990000)`;
  }
}

window.addEventListener('scroll', updateScrollProgressBar);


let ticking = false;

// Parallax scrolling effect for feedback section
const feedbacksBackground = document.querySelector('.feedbacks-background');
const feedbacksMeteor = document.querySelector('.feedbacks-parallax-meteor');

function onScroll() {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const scrollY = window.scrollY;

      // Adjust the multiplier to control the intensity of the parallax
      const backgroundTranslateY = scrollY * 0.3;
      const meteorTranslateY = scrollY * 0.6;

      if (feedbacksBackground) {
        feedbacksBackground.style.transform = `translateY(${backgroundTranslateY}px)`;
      }

      if (feedbacksMeteor) {
        feedbacksMeteor.style.transform = `translateX(-50%) translateY(${meteorTranslateY}px)`;
      }
      ticking = false;
    });

    ticking = true;
  }
}

window.addEventListener('scroll', onScroll);



function validateForm(event) {
  event.preventDefault();

  let isValid = true;

  // Utility functions to manage error messages on the page.
  const clearError = (id) => document.getElementById(id).textContent = '';

  const displayError = (id, message) => {
    document.getElementById(id).textContent = message;
    isValid = false;
  };

  const fullName = document.getElementById('fullName').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  clearError('fullNameError');
  clearError('emailError');
  clearError('subjectError');
  clearError('messageError');

  // JavaScript Validations (4 Controls)

  if (fullName === '') {
    displayError('fullNameError', 'Se requiere poner un nombre y apellidos.');
  } else if (fullName.length < 5) {
    displayError('fullNameError', 'Debe de tener mas de 5 caracteres.');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email === '') {
    displayError('emailError', 'Se requiere el Gmail.');
  } else if (!emailRegex.test(email)) {
    displayError('emailError', 'Usa un formato valido (Ejemplo: user@domain.com).');
  }

  if (subject === '') {
    displayError('subjectError', 'Se requiere un asunto.');
  } else if (subject.length < 5) {
    displayError('subjectError', 'El asunto debe de tener mas de 5 caracteres.');
  }

  if (message === '') {
    displayError('messageError', 'Se requiere el mensaje.');
  } else if (message.length < 15) {
    displayError('messageError', 'El mensaje debe de tener mas de 15 caracteres.');
  }

  if (isValid) {
    document.getElementById('contactForm').reset();

    return true;
  } else {
    return false;
  }
}
