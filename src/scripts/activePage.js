// script for showing active pages (adding class 'active')

export function activateCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
    
    // 1.for all links (header and footer)
    document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        
        //remove (#) from the link to compare
        const cleanHref = href.split('#')[0];
        
        //compare path
        if (cleanHref.includes(currentPage) || 
            (currentPage === 'index' && (href === '/' || href === './' || href === 'index.html'))) {
            
            //find parent <li> (for header and footer)
            const parentLi = link.closest('li');
            if (parentLi) {
                parentLi.classList.add('active');
                
                //if header - make the parent element active
                if (parentLi.classList.contains('header__dropdown-item')) {
                    parentLi.closest('.header__menu-item')?.classList.add('active');
                }
                
                //if footer - just add class active
                if (parentLi.classList.contains('footer__submenu-item')) {
                }
            }
        }
    });
    
    // 2.for buttons with data-route (header only)
    document.querySelectorAll('[data-route]').forEach(button => {
        const dataRoute = button.getAttribute('data-route');
        if (dataRoute.includes(currentPage)) {
            button.closest('.header__menu-item')?.classList.add('active');
        }
    });
}
//auto calling when html-page loaded
document.addEventListener('DOMContentLoaded', activateCurrentPage);