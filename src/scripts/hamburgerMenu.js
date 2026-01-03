export function setupHamburgerMenu() {
    const menuButton = document.querySelector(".header__hamburger-menu");
    const navMenu = document.querySelector(".header__nav");

    menuButton.addEventListener("click", () => {
        const isOpen = navMenu.classList.toggle("open");

        menuButton.classList.toggle("is-open", isOpen);
    });
}
