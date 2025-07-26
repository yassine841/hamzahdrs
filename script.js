// Fonction pour basculer le menu mobile
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
}

// Fermer le menu mobile en cliquant à l'extérieur
document.addEventListener('click', function(event) {
    const sidebar = document.querySelector('.sidebar');
    const hamburger = document.querySelector('.hamburger');
    
    if (!sidebar.contains(event.target) && !hamburger.contains(event.target)) {
        sidebar.classList.remove('active');
    }
});

// Initialisation du slider Swiper
document.addEventListener('DOMContentLoaded', function() {
    const swiper = new Swiper('.swiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            640: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 30,
            },
        },
    });
});

// Animation au scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.collection-card, .service-card, .product-card');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Initialiser les animations
document.addEventListener('DOMContentLoaded', function() {
    // Préparer les éléments pour l'animation
    const elements = document.querySelectorAll('.collection-card, .service-card, .product-card');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Lancer l'animation initiale
    animateOnScroll();
});

// Écouter le scroll
window.addEventListener('scroll', animateOnScroll);

// Gestion du panier (simulation)
let cart = [];

function addToCart(productName, price) {
    cart.push({
        name: productName,
        price: price,
        id: Date.now()
    });
    
    updateCartCount();
    showCartNotification(productName);
}

function updateCartCount() {
    const cartIcon = document.querySelector('.nav-icons .material-icons[onclick*="cart"]');
    if (cartIcon) {
        // Ajouter un badge de compteur au panier
        let badge = cartIcon.nextElementSibling;
        if (!badge || !badge.classList.contains('cart-badge')) {
            badge = document.createElement('span');
            badge.classList.add('cart-badge');
            cartIcon.parentNode.insertBefore(badge, cartIcon.nextSibling);
        }
        badge.textContent = cart.length;
        badge.style.cssText = `
            position: absolute;
            top: -5px;
            right: -5px;
            background: #8B4513;
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        `;
    }
}

function showCartNotification(productName) {
    // Créer une notification
    const notification = document.createElement('div');
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 100px;
            right: 20px;
            background: #8B4513;
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
            z-index: 2000;
            animation: slideIn 0.3s ease;
        ">
            <strong>${productName}</strong> ajouté au panier !
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Supprimer la notification après 3 secondes
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Ajouter les écouteurs d'événements pour les boutons "Ajouter au panier"
document.addEventListener('DOMContentLoaded', function() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.product-price').textContent;
            
            addToCart(productName, productPrice);
        });
    });
});

// Animation CSS pour la notification
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .cart-badge {
        position: relative;
    }
`;
document.head.appendChild(style);

// Fonction de recherche (simulation)
function initSearch() {
    const searchIcon = document.querySelector('.nav-icons .material-icons:first-child');
    
    if (searchIcon) {
        searchIcon.addEventListener('click', function() {
            const searchTerm = prompt('Que recherchez-vous ?');
            if (searchTerm) {
                alert(`Recherche pour "${searchTerm}" - Fonctionnalité à implémenter`);
            }
        });
    }
}

// Initialiser la recherche
document.addEventListener('DOMContentLoaded', initSearch);

// Smooth scroll pour les liens internes
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Gestion du scroll pour la navbar
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.background = '#fff';
        navbar.style.backdropFilter = 'none';
    }
});

console.log('Site Traditions Élégantes - JavaScript chargé avec succès!');
