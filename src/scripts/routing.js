
//function to turn static routes to dynamic routes (enables client-side navigation for elements with 'data-route' attributes)
export function setupRouting() {
  document.addEventListener("click", (e) => {
    //'e.target' - when the element is clicked '.closest()' searches up in DOM for the closest ancestor with attribute 'data-route' (e.g.button)
    const el = e.target.closest("[data-route]");
    if (!el) return; //if 'data-route'=null -> no such elements found -> return (exit)
    //'el.dataset' the element with all 'data-*' attributes 'dataset.route' in JS = 'data-route' in HTML (kebab-case)
    const route = el.dataset.route;
    if (!route) return; //if 'data-route' attribute is empty -> return (exit)
    //'window.location' manages URL in browser, '.href' changes it to the specified route
    window.location.href = route; 
  });
} 