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

    // Change the state of the buttons
    const buttons = document.querySelectorAll('nav button');
    buttons.forEach(button => {
        button.classList.remove('active-button');
    });

    // Add the active class to the corresponding button
    const activeButton = Array.from(buttons).find(button => button.onclick.toString().includes(sectionId));
    if (activeButton) {
        activeButton.classList.add('active-button');
    } else {
        console.error(`No se encontró un botón correspondiente para la sección: ${sectionId}`);
    }
}

// Initialize the page by showing the home section and highlighting the corresponding button
showSection('inicio');
