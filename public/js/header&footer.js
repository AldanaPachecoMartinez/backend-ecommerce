let currentUser = JSON.parse(localStorage.getItem('currentUser'));
const URL = 'https://decotienda.onrender.com'

document.addEventListener('DOMContentLoaded', renderizarHeader('header'))
document.addEventListener('DOMContentLoaded', renderizarFooter('footer'));


function renderizarHeader(id){
    document.getElementById(id).innerHTML = ` <nav class="navbar">
    <a href="/" class="navbar__nav-link">
        <img src="/assets/images/logo-marca-large.png" alt="Logo del E-commerce"  class="navbar__logo">
    </a>

    <div class="user-navbar">
        <button class="user-navbar__cart-icon-container" onclick='handleOrders()' id='cart-btn-header'>
            <i class="fa-solid fa-cart-shopping"></i>
            <p id='cart-count' class='cart-count'>0</p>
        </button>
        <div class="user-navbar__user-avatar-container">
            <img src="${userImage()}" alt="imagen de usuario" class="user-navbar__user-avatar" onclick="menuUser()">
            <div class="menu-user"></div>
        </div>
    </div>
    
    <input type="checkbox" class="navbar__menu-btn" id="menu-btn">
    <label for="menu-btn" class="navbar__menu-label">
        <span class="navbar__menu-icon"></span>
    </label>


    <ul class="navbar__nav-links-container" id="navbar-list">
        <li class="navbar__nav-item">
            <a href="/" class="navbar__nav-link">Inicio</a></li>
        <li class="navbar__nav-item">
            <a href="/contact" class="navbar__nav-link">Contacto</a></li>
        <li class="navbar__nav-item">
            <a href="/about-us" class="navbar__nav-link">Nosotros</a></li>
        <li class="navbar__nav-item">
            <a href="/register" class="navbar__nav-link">Registrarse</a></li>
        <li class="navbar__nav-item" id="sign-in">
                <a href="/login" class="navbar__nav-link">Login</a></li>
    </ul>
</nav>

`
}

function renderizarFooter(id){
    document.getElementById(id).innerHTML = `<div class= 'footer'> <div class="footer__column">
    <ul class="footer__social-media-container">
        <li class="footer__contact-item">
            <a href="#" class="footer__contact-link">
            <i class="fa-brands fa-facebook-f footer__contact-icon
            footer__contact-icon--facebook"></i>
                DE&CO Diseño
            </a>
        </li>
        <li class="footer__contact-item">
            <a href="#" class="footer__contact-link">
            <i class="fa-brands fa-instagram footer__contact-icon footer__contact-icon--instagram"></i>
                @decotienda
            </a>
        </li>
        <li class="footer__contact-item">
            <a href="#" class="footer__contact-link">
            <i class="fa-brands fa-linkedin footer__contact-icon footer__contact-icon--linkedin"></i>
            DE&CO Diseño
            </a>
        </li>    
    </ul>
</div>
<div class="footer__column">
    <img src="/assets/images/logo-marca.png" alt="Company Logo" class="footer__logo" width="120px">
    <h2 class="footer__company-name">
        DE&CO <em>design</em>
    </h2>
    <p class="footer__copyrigth">
        Todos los derechos reservados a DE&CO
    </p>
</div>
<div class="footer__column">
    <ul class="footer__contact-container">
        <li class="footer__contact-item">
            <a href="#" class="footer__contact-link">
                <i class="fa-solid fa-phone footer__contact-icon"></i>
                +54 9 351 1111111
            </a>
        </li>
        <li class="footer__contact-item">
            <a href="#" class="footer__contact-link">
                <i class="fa-solid fa-location-dot footer__contact-icon"></i>
                Córdoba, Argentina
            </a>
        </li>
        <li class="footer__contact-item">
            <a href="#" class="footer__contact-link">
                <i class="fa-solid fa-envelope footer__contact-icon"></i>
                deco@tienda.com
            </a>
        </li>    
    </ul>
</div>

</div>`
}

function userImage() {
    if(currentUser?.image) {
        return `${URL}/upload/users/${currentUser.image}` 
    } else {
        return `/assets/images/user-defaultjpg.jpg`
    }
}
