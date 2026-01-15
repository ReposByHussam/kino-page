import fs from 'fs/promises'; //fs-module from Node.js library for reading files

const MENU = [
    {
        label: 'Home page',
        link: '/',
        id: 'index',
    },
    {
        label: 'About us',
        link: '/about',
        id: 'about-us',
    },
    {
        label: 'Contact us',
        link: '/contact',
        id: 'contact',
    },
    {
        label: 'Events',
        link: '/eventPage',
        id: 'eventPage',
    },
    {
        label: 'Bistro',
        link: '/bistro',
        id: 'bistro',
    }

];

export default async function renderPage(page) {
  
    const templateBuf = await fs.readFile('./templates/page.html');
    const contentText = contentBuf.toString();

    const headerMenuHtml = generateMenu(MENU, page, 'header__menu-item');
    const footerMenuHtml = generateMenu(MENU, page, 'footer__submenu-item');

    function generateMenu(menuArray, page, itemClass) { //checks each menu-item to change the class to 'active' for css and generates menu-items for header and footer
        return menuArray.map(item => {
            const className = item.id === page ? 'active' : 'inactive';
            return `<li class="${itemClass} ${className}"><a href="${item.link}">${item.label}</a></li>`;
        }).join('\n');
    }
/*
 const htmlMenuItems = MENU.map((item) => { //checks each menu-item to change the class to 'active' for css
    const isActivePage = item.id == page;
    const className = isActivePage? 'active' : 'inactive';
    return `<li class="menu-item ${className}"><a href="${item.link}">${item.label}</a></li>`;
  });

    const menuText = htmlMenuItems.join('\n');
*/


    const htmlText = contentText
        .replace('::page::', contentText)
        .replace('//menu//', menuText);

    return htmlText; // retuns HTML-page
}