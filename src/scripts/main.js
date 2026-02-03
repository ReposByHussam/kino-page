import { setupRouting } from "./routing.js";
import { setupContactForm } from "./contactForm.js";
import { setupBookTableModal } from "./bookTableModal.js";
import { setupHamburgerMenu } from "./hamburgerMenu.js";
import { activateCurrentPage } from "./activePage.js";
import { setupMovieScreenings } from "./moviePageScreenings.js";

setupRouting();
setupContactForm();
setupBookTableModal();
setupHamburgerMenu();
activateCurrentPage();
setupMovieScreenings();