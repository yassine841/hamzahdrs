// Function to toggle the sidebar visibility
const toggleSidebar = () => {
  const sidebar = document.querySelector('.sidebar');
  const openMenu = document.querySelector('.open-menu');
  
  sidebar.classList.toggle('active');
  openMenu.classList.toggle('hidden');
};

// Initialize Swiper for the car slider
new Swiper('.dacia-logan', {
  loop: true,
  spaceBetween: 30,

  // Pagination bullets
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    dynamicBullets: true,
  },

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  // Responsive breakpoints
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    1000: {
      slidesPerView: 2,
    },
  },
});

// Function to change the button style on click
const toggleButtonStyle = (button) => {
  button.style.backgroundColor = '#000'; // Button background color
  button.style.color = '#ffc700'; // Button text color
  button.style.boxShadow = 'none'; // Remove shadow
  button.style.border = '2px solid #ffc700'; // Add a border
};

// Function to send a WhatsApp message
const sendWhatsAppMessage = (carName) => {
  const phoneNumber = '212762027551'; // WhatsApp phone number in international format
  const message = `Hello, I would like to reserve the car "${carName}". Please provide me with the details.`;
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  // Open WhatsApp link in a new tab
  window.open(url, '_blank');
};

// Add event listeners to all reservation buttons
document.querySelectorAll('.button-reserve').forEach((button) => {
  button.addEventListener('click', (event) => {
    // Get the car name
    const carName = event.target.closest('.card-link').querySelector('.voiture-name').textContent;

    // Change button style
    toggleButtonStyle(button);

    // Send WhatsApp message
    sendWhatsAppMessage(carName);
  });
});

// Function to submit the contact form
const submitContactForm = () => {
  const name = document.querySelector('#contact-name').value;
  const email = document.querySelector('#contact-email').value;
  const message = document.querySelector('#contact-message').value;

  if (!name || !email || !message) {
    alert('Please fill out all fields.');
    return;
  }

  const formattedMessage = `Hello,\n\nMy name is ${name}.\nMy email: ${email}.\nMy message:\n${message}`;
  alert(`Your message was sent successfully:\n\n${formattedMessage}`);
};

// Add event listener to the contact form
document.querySelector('#contact-form').addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent page reload
  submitContactForm();
});