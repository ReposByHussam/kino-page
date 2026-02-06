import fs from "fs/promises";
import Handlebars from "handlebars";
import path from "path";

// liten helper som kan vara bra i templates
Handlebars.registerHelper("eq", (a, b) => a === b);

// vi vill inte läsa in partials om och om igen på varje request
let partialsLoaded = false;

async function registerPartials() {
  if (partialsLoaded) return;

  const partialsDir = path.resolve("templates/partials");

  try {
    const files = await fs.readdir(partialsDir);

    for (const file of files) {
      if (!file.endsWith(".hbs")) continue;

      const partialName = path.basename(file, ".hbs");
      const partialPath = path.join(partialsDir, file);
      const partialContent = await fs.readFile(partialPath, "utf-8");

      Handlebars.registerPartial(partialName, partialContent);
    }

    partialsLoaded = true;
  } catch (err) {
    console.log("Kunde inte ladda partials:", err.message);
  }
}

// HEADER-MENU
export const HEADER_MENU = [
  {
    type: "dropdown",
    label: "Aktuella filmer",
    classes: "menu-desktop movies",
    btnClass: "btn-menu--one",
    items: [
      { label: "Alla filmer", link: "/movies", dataRoute: "/movies", id: "movies" },
      { label: "För över 18 år", link: "#", id: "over-18" },
      { label: "För hela familjen", link: "#", id: "family" },
    ],
  },
  {
    type: "dropdown",
    label: "Kommande",
    classes: "menu-desktop",
    btnClass: "btn-menu--one",
    items: [
      { label: "För över 18 år", link: "#", id: "upcoming-18" },
      { label: "För hela familjen", link: "#", id: "upcoming-family" },
    ],
  },
  {
    type: "dropdown",
    label: "På bio",
    classes: "menu-desktop",
    btnClass: "btn-menu--one",
    items: [
      { label: "Bistro och mat", link: "/bistro", dataRoute: "/bistro", id: "bistro" },
      { label: "Evenemang", link: "/eventPage", dataRoute: "/eventPage", id: "eventPage" },
    ],
  },
  {
    type: "dropdown",
    label: "Mer...",
    classes: "menu-desktop-xlarge",
    btnClass: "btn-menu--one",
    items: [
      { label: "Om oss", link: "/about-us", dataRoute: "/about-us", id: "about-us" },
      { label: "Boka salen", link: "#", dataRoute: "#", id: "book-hall" },
      { label: "Jobba hos oss", link: "#", dataRoute: "#", id: "jobs" },
      { label: "Köpa presentkort", link: "#", dataRoute: "#", id: "gift-cards" },
    ],
  },
  {
    type: "button",
    label: "Kontakta oss",
    link: "/contact",
    dataRoute: "/contact",
    classes: "menu-desktop menu-contact",
    btnClass: "btn-menu--one",
    id: "contact",
  },
  { type: "button", label: "Logga in", link: null, classes: "menu-medium login", btnClass: "btn-menu--two" },
  { type: "button", label: "Bli medlem", link: null, classes: "menu-hide-medium", btnClass: "btn-menu--two" },
  {
    type: "dropdown",
    label: "Språk",
    classes: "menu-medium language",
    btnClass: "btn-menu--language",
    items: [
      { label: "Svenska", link: "#" },
      { label: "Engelska", link: "#" },
    ],
  },
];

// FOOTER MENU
export const FOOTER_MENU = [
  {
    heading: "Filmer idag",
    sectionClasses: "footer__submenu-section",
    items: [
      { label: "Alla filmer", link: "/movies", dataRoute: "/movies", id: "movies" },
      { label: "För över 18 år", link: "#", id: "over-18" },
      { label: "För hela familjen", link: "#", id: "family" },
    ],
  },
  {
    heading: "Kommande",
    sectionClasses: "footer__submenu-section",
    items: [
      { label: "För över 18 år", link: "#", id: "upcoming-18" },
      { label: "För hela familjen", link: "#", id: "upcoming-family" },
    ],
  },
  {
    heading: "På bio",
    sectionClasses: "footer__submenu-section",
    items: [
      { label: "Bistro och mat", link: "/bistro", dataRoute: "/bistro", id: "bistro" },
      { label: "Evenemang", link: "/eventPage", dataRoute: "/eventPage", id: "eventPage" },
    ],
  },
  {
    heading: "Mer",
    sectionClasses: "footer__submenu-section",
    items: [
      { label: "Om oss", link: "/about-us", dataRoute: "/about-us", id: "about-us" },
      { label: "Boka salen", link: "#", dataRoute: "#", id: "book-hall" },
      { label: "Jobba hos oss", link: "#", dataRoute: "#", id: "jobs" },
      { label: "Köpa presentkort", link: "#", dataRoute: "#", id: "gift-cards" },
    ],
  },
];

// META
export const META = {
  index: {
    title: "Kino - Uppsala",
    description: "Kino biograf i Uppsala - filmer idag,kommande filmer, bistro och evenemang, Av filmälskare för filmälskare",
    og: {
      title: "Kino - Uppsala",
      description: "Kino biograf i Uppsala - filmer idag,kommande filmer, bistro och evenemang, Av filmälskare för filmälskare",
      locale: "sv_SE",
      url: "/",
      image: "/src/pics/KINO-logo.png",
      imageAlt: "Kino logo",
    },
    lang: "sv",
  },
  "about-us": {
    title: "Kino - Om oss",
    description: "Lär kännas Kino i Uppsala - vår historia, vision och vad som gör oss till en biograf för filmälskare.",
    og: {
      title: "Kino - Om oss",
      description: "Lär kännas Kino i Uppsala - vår historia, vision och vad som gör oss till en biograf för filmälskare.",
      locale: "sv_SE",
      url: "/about-us",
      image: "/src/pics/KINO-about-us-hero.png",
      imageAlt: "Insidan av en filmprojektor",
    },
    lang: "sv",
  },
  bistro: {
    title: "Bistro - Kino Uppsala",
    description: "Välkommen till Kinos Bistro i Uppsala. En plats där filmälskare kan njuta av utsökt mat och dryck före eller efter filmen. Se menyn och njut.",
    og: {
      title: "Bistro - Kino Uppsala",
      description: "Välkommen till Kinos Bistro i Uppsala. En plats där filmälskare kan njuta av utsökt mat och dryck före eller efter filmen. Se menyn och njut.",
      locale: "sv_SE",
      url: "/bistro",
      image: "/src/pics/KINO-bistro.webp",
      imageAlt: "interiörbild från Kinos bistro",
    },
    lang: "sv",
  },
  contact: {
    title: "Kino - Kontakt",
    description: "Kontakta Kino biograf i Uppsala. Hitta våra kontaktuppgifter och skicka ett meddelande till oss.",
    og: {
      title: "Kino - Kontakt",
      description: "Kontakta Kino biograf i Uppsala. Hitta våra kontaktuppgifter och skicka ett meddelande till oss.",
      locale: "sv_SE",
      url: "/contact",
      image: "/src/pics/KINO-arc.webp",
      imageAlt: "Kino entré med upplyst KINO-skylt.",
    },
    lang: "sv",
  },
  eventPage: {
    title: "Evenemang - Kino Uppsala",
    description: "Upptäck kommande evenemang på Kino i Uppsala. Föreläsningar, opera och talks. Se vad som händer och boka din plats.",
    og: {
      title: "Evenemang - Kino Uppsala",
      description: "Upptäck kommande evenemang på Kino i Uppsala. Föreläsningar, opera och talks. Se vad som händer och boka din plats.",
      locale: "sv_SE",
      url: "/eventPage",
      image: "/src/pics/KINO-event.png",
      imageAlt: "En person i en biosalong som håller i en dödskalle.",
    },
    lang: "sv",
  },
  movies: {
    title: "Alla filmer - Kino Uppsala",
    description: "Se alla filmer som visas på Kino biograf i Uppsala",
    og: {
      title: "Alla filmer - Kino Uppsala",
      description: "Se alla filmer som visas på Kino biograf i Uppsala",
      locale: "sv_SE",
      url: "/movies",
      image: "/src/pics/KINO-logo.png",
      imageAlt: "Kino logo",
    },
    lang: "sv",
  },
  movie: {
    title: "Film - Kino Uppsala",
    description: "Information om filmen på Kino biograf i Uppsala",
    og: {
      title: "Film - Kino Uppsala",
      description: "Information om filmen på Kino biograf i Uppsala",
      locale: "sv_SE",
      url: "/movies",
      image: "/src/pics/KINO-logo.png",
      imageAlt: "Film poster",
    },
    lang: "sv",
  },
};

// läser HTML för "main" (först content/, annars templates/partials/)
async function loadMainTemplate(page) {
  // 1) först: content/page.hbs
  try {
    return await fs.readFile(`./content/${page}.hbs`, "utf-8");
  } catch (e) {
    // ignore
  }

  // 2) annars: templates/partials/page.hbs (bra för t.ex movie.hbs som du har nu)
  try {
    return await fs.readFile(`./templates/partials/${page}.hbs`, "utf-8");
  } catch (e) {
    // ignore
  }

  // 3) om inget finns -> tydligt fel
  throw new Error(`Hittar ingen template för "${page}". Testade content/${page}.hbs och templates/partials/${page}.hbs`);
}

export default async function renderPage(page, extraData = {}) {
  await registerPartials();

  // layout-filen (den som innehåller {{{main}}})
  const templateText = await fs.readFile("./templates/page.hbs", "utf-8");
  const template = Handlebars.compile(templateText);

  // själva sidans innehåll (det som hamnar i {{{main}}})
  const mainContent = await loadMainTemplate(page);

  // vi kompilerar main-innehållet separat, så det kan använda data (movies/movie osv)
  const contentTemplate = Handlebars.compile(mainContent);
  const compiledMainContent = contentTemplate({ ...extraData });

  // markerar aktiv meny
  const headerMenu = HEADER_MENU.map((block) => {
    const processedBlock = { ...block };

    if (processedBlock.type === "dropdown") {
      const items = processedBlock.items.map((item) => ({
        ...item,
        active: item.id === page,
      }));

      const hasActive = items.some((i) => i.active);

      return { ...processedBlock, items, active: hasActive };
    }

    if (processedBlock.type === "button") {
      return { ...processedBlock, active: processedBlock.id === page };
    }

    return processedBlock;
  });

  const footerMenu = FOOTER_MENU.map((section) => {
    const items = section.items.map((item) => ({
      ...item,
      active: item.id === page,
    }));

    return { ...section, items };
  });

  // meta (fallback till index om sidan saknar meta)
  const meta = META[page] || META.index;

  // allt som layouten behöver
  const templateData = {
    headerMenu,
    footerMenu,
    main: compiledMainContent,
    title: meta.title,
    description: meta.description,
    og: meta.og,
    lang: meta.lang,
    ...extraData,
  };

  return template(templateData);
}
