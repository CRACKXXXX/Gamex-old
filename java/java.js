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
        button.classList.remove('active-button'); // Exit the function if the section is not found
    });

    // Add the active class to the corresponding button
    const activeButton = Array.from(buttons).find(button => button.onclick.toString().includes(sectionId));
    if (activeButton) {
        activeButton.classList.add('active-button');
    } else {
        console.error(`No se encontró un botón correspondiente para la sección: ${sectionId}`);
    }
}

    document.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('.section');
        const navLinks = document.querySelectorAll('nav ul li a');

        sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            if (rect.top >= 0 && rect.top < window.innerHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                navLinks[index].classList.add('active');
            }
        });
    });
