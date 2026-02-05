import { setupRouting } from "./routing.js";
import { setupContactForm } from "./contactForm.js";
import { setupBookTableModal } from "./bookTableModal.js";
import { setupHamburgerMenu } from "./hamburgerMenu.js";
import { activateCurrentPage } from "./activePage.js";
import { setupReviewForm } from "./reviewForm.js";
import { setupMovieScreenings } from "./moviePageScreenings.js";
import { setupMovieRating } from "./ratings.js";

setupReviewForm();
setupRouting();
setupContactForm();
setupBookTableModal();
setupHamburgerMenu();
activateCurrentPage();
setupMovieScreenings();
setupMovieRating();

