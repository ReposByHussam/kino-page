import fs from 'fs/promises'; //fs-module from Node.js library for reading files
import Handlebars from 'handlebars'; //Handlebars-module from npm-library for using helpers in .hbs
import path from 'path'; // path-module from Node.js library for working with paths

Handlebars.registerHelper('eq', (a, b) => a === b); //helper-method in Handlebars for comparing

// function to load partials from folder templates/partials/
async function registerPartials() {
    // 1. Create path to the folder with partials templates/partials/
    const partialsDir = path.resolve('templates/partials');
    // .resolve() automatically starts from project root (process.cwd()) 

    try {
        // 2. get the list of files from folder templates/partials/
        const files = await fs.readdir(partialsDir);
        //fs.readdir() reads the content of the directory and returns array of files' names

        // 3. iterate  over each file in templates/partials
        for (const file of files) {
            // 4. check if extenstion is .hbs
            if (file.endsWith('.hbs')) {
                // 5. remove .hbs-extenstion to get the partial's name
                // e.g. "head.hbs" -> "head" to write {{> head}} in page.hbs template
                const partialName = path.basename(file, '.hbs');

                // 6. Create full path to the partial file by joining directory with the file's name
                // path.join() safely joins path segments, using the correct separator for the OS (e.g. C:\Users\Val\Desktop\LERNIA\4-Agile\Kino-page-GBUpp2\templates\partials)
                const partialPath = path.join(partialsDir, file);

                // 7. Read the content of the partial file
                // 'utf-8' = .toString() and converts the file buffer in raw bytes to html
                const partialContent = await fs.readFile(partialPath, 'utf-8');

                // 8. register partial in Handlebars (-> can be used in Handlebars like e.g. {{> head}})
                Handlebars.registerPartial(partialName, partialContent);
            }
        }
    } catch (err) {
        // 9. in case of problems with folder templates/partials/
        // In Node.js fs operations, the Error object (err) has properties:
        //  - message: description of what went wrong (string)
        //  - code: error type code (string, e.g. 'ENOENT' = file/folder not found)
        //  - syscall: system call that failed (string, e.g. 'scandir', 'open', 'stat')
        //  - path: path that caused the error (string)
        //  - errno: numeric error code (number, platform-specific)
        console.log('Note: Partials not loaded:', err.message); //err.message - description of the error
    }
}

//HEADER-MENU
export const HEADER_MENU = [
    {
        type: 'dropdown',
        label: 'Filmer idag',
        classes: 'menu-desktop movies',
        btnClass: 'btn-menu--one',
        items: [
            {
                label: 'Alla filmer',
                link: '/movies',
                dataRoute: '/movies',
                id: 'movies'  //for all films
            },
            { label: 'För över 18 år', link: '#', id: 'over-18' },
            { label: 'För hela familjen', link: '#', id: 'family' },
        ],
    },
    {
        type: 'dropdown',
        label: 'Kommande',
        classes: 'menu-desktop',
        btnClass: 'btn-menu--one',
        items: [
            { label: 'För över 18 år', link: '#', id: 'upcoming-18' },
            { label: 'För hela familjen', link: '#', id: 'upcoming-family' },
        ],
    },
    {
        type: 'dropdown',
        label: 'På bio',
        classes: 'menu-desktop',
        btnClass: 'btn-menu--one',
        items: [
            { label: 'Bistro och mat', link: '/bistro', dataRoute: '/bistro', id: 'bistro' },
            { label: 'Evenemang', link: '/eventPage', dataRoute: '/eventPage', id: 'eventPage' },
        ],
    },
    {
        type: 'dropdown',
        label: 'Mer...',
        classes: 'menu-desktop-xlarge',
        btnClass: 'btn-menu--one',
        items: [
            { label: 'Om oss', link: '/about-us', dataRoute: '/about-us', id: 'about-us' },
            { label: 'Boka salen', link: '#', dataRoute: '#', id: 'book-hall' },
            { label: 'Jobba hos oss', link: '#', dataRoute: '#', id: 'jobs' },
            { label: 'Köpa presentkort', link: '#', dataRoute: '#', id: 'gift-cards' },
        ],
    },
    {
        type: 'button',
        label: 'Kontakta oss',
        link: '/contact',
        dataRoute: '/contact',
        classes: 'menu-desktop menu-contact',
        btnClass: 'btn-menu--one',
        id: 'contact',
    },
    {
        type: 'button',
        label: 'Logga in',
        link: null,     //for future modals
        classes: 'menu-medium login',
        btnClass: 'btn-menu--two',
    },
    {
        type: 'button',
        label: 'Bli medlem',
        link: null,     //for future modals
        classes: 'menu-hide-medium',
        btnClass: 'btn-menu--two',
    },
    {
        type: 'dropdown',
        label: 'Språk',
        classes: 'menu-medium language',
        btnClass: 'btn-menu--language',
        items: [
            { label: 'Svenska', link: '#' },
            { label: 'Engelska', link: '#' },
        ],
    },
];

//FOOTER MENU
//each object {} in the array is a <section>
export const FOOTER_MENU = [
    {
        heading: 'Filmer idag',
        sectionClasses: 'footer__submenu-section',
        items: [
            {
                label: 'Alla filmer',
                link: '/movies',
                dataRoute: '/movies',
                id: 'movies'
            },
            { label: 'För över 18 år', link: '#', id: 'over-18' },
            { label: 'För hela familjen', link: '#', id: 'family' },
        ],
    },
    {
        heading: 'Kommande',
        sectionClasses: 'footer__submenu-section',
        items: [
            { label: 'För över 18 år', link: '#', id: 'upcoming-18' },
            { label: 'För hela familjen', link: '#', id: 'upcoming-family' },
        ],
    },
    {
        heading: 'På bio',
        sectionClasses: 'footer__submenu-section',
        items: [
            { label: 'Bistro och mat', link: '/bistro', dataRoute: '/bistro', id: 'bistro' },
            { label: 'Evenemang', link: '/eventPage', dataRoute: '/eventPage', id: 'eventPage' },
        ],
    },
    {
        heading: 'Mer',
        sectionClasses: 'footer__submenu-section',
        items: [
            { label: 'Om oss', link: '/about-us', dataRoute: '/about-us', id: 'about-us' },
            { label: 'Boka salen', link: '#', dataRoute: '#', id: 'book-hall' },
            { label: 'Jobba hos oss', link: '#', dataRoute: '#', id: 'jobs' },
            { label: 'Köpa presentkort', link: '#', dataRoute: '#', id: 'gift-cards' },
        ],
    },
];

//META for all pages
export const META = {
    index: {
        title: 'Kino - Uppsala',
        description: 'Kino biograf i Uppsala - filmer idag,kommande filmer, bistro och evenemang, Av filmälskare för filmälskare',
        og: {
            title: 'Kino - Uppsala',
            description: 'Kino biograf i Uppsala - filmer idag,kommande filmer, bistro och evenemang, Av filmälskare för filmälskare',
            locale: 'sv_SE',
            url: '/',
            image: '/src/pics/KINO-logo.png',
            imageAlt: 'Kino logo',
        },
        lang: 'sv',
    },
    'about-us': {
        title: 'Kino - Om oss',
        description: 'Lär kännas Kino i Uppsala - vår historia, vision och vad som gör oss till en biograf för filmälskare.',
        og: {
            title: 'Kino - Om oss',
            description: 'Lär kännas Kino i Uppsala - vår historia, vision och vad som gör oss till en biograf för filmälskare.',
            locale: 'sv_SE',
            url: '/about-us',
            image: '/src/pics/KINO-about-us-hero.png',
            imageAlt: 'Insidan av en filmprojektor',
        },
        lang: 'sv',
    },
    bistro: {
        title: 'Bistro - Kino Uppsala',
        description: 'Välkommen till Kinos Bistro i Uppsala. En plats där filmälskare kan njuta av utsökt mat och dryck före eller efter filmen. Se menyn och njut.',
        og: {
            title: 'Bistro - Kino Uppsala',
            description: 'Välkommen till Kinos Bistro i Uppsala. En plats där filmälskare kan njuta av utsökt mat och dryck före eller efter filmen. Se menyn och njut.',
            locale: 'sv_SE',
            url: '/bistro',
            image: '/src/pics/KINO-bistro.webp',
            imageAlt: 'interiörbild från Kinos bistro',
        },
        lang: 'sv',
    },
    contact: {
        title: 'Kino - Kontakt',
        description: 'Kontakta Kino biograf i Uppsala. Hitta våra kontaktuppgifter och skicka ett meddelande till oss.',
        og: {
            title: 'Kino - Kontakt',
            description: 'Kontakta Kino biograf i Uppsala. Hitta våra kontaktuppgifter och skicka ett meddelande till oss.',
            locale: 'sv_SE',
            url: '/contact',
            image: '/src/pics/KINO-arc.webp',
            imageAlt: 'Kino entré med upplyst KINO-skylt.',
        },
        lang: 'sv',
    },
    eventPage: {
        title: 'Evenemang - Kino Uppsala',
        description: 'Upptäck kommande evenemang på Kino i Uppsala. Föreläsningar, opera och talks. Se vad som händer och boka din plats.',
        og: {
            title: 'Evenemang - Kino Uppsala',
            description: 'Upptäck kommande evenemang på Kino i Uppsala. Föreläsningar, opera och talks. Se vad som händer och boka din plats.',
            locale: 'sv_SE',
            url: '/eventPage',
            image: '/src/pics/KINO-event.png',
            imageAlt: 'En person i en biosalong som håller i en dödskalle.',
        },
        lang: 'sv',
    },
    //rendered films
    movies: {
        title: 'Alla filmer - Kino Uppsala',
        description: 'Se alla filmer som visas på Kino biograf i Uppsala',
        og: {
            title: 'Alla filmer - Kino Uppsala',
            description: 'Se alla filmer som visas på Kino biograf i Uppsala',
            locale: 'sv_SE',
            url: '/movies',
            image: '/src/pics/KINO-logo.png',
            imageAlt: 'Kino logo',
        },
        lang: 'sv',
    },
    movie: {
        title: 'Film - Kino Uppsala',
        description: 'Information om filmen på Kino biograf i Uppsala',
        og: {
            title: 'Film - Kino Uppsala',
            description: 'Information om filmen på Kino biograf i Uppsala',
            locale: 'sv_SE',
            url: '/movies',
            image: '/src/pics/KINO-logo.png',
            imageAlt: 'Film poster',
        },
        lang: 'sv',
    }
}

export default async function renderPage(page, extraData = {}) { //extraData = {} - object rendered by API
    //register partials before compiling the template
    await registerPartials();

    //read Habdlbars page-template
    const templateBuf = await fs.readFile('./templates/page.hbs');
    const templateText = templateBuf.toString();
    const template = Handlebars.compile(templateText);

    //read content of the page (<main>)
    let mainContent = '';
    try {
        const contentBuf = await fs.readFile(`./content/${page}.hbs`, 'utf-8'); //utf-8 instead of .toString()
        mainContent = contentBuf;
    } catch (err) {
        throw new Error(`Page "${page}" is not found`);
    }

      //Compile content/movies.hbs with extraData from API
    const contentTemplate = Handlebars.compile(mainContent);
    const compiledMainContent = contentTemplate({
        ...extraData,  
    });

    //HEADER MENU processing
    const headerMenu = HEADER_MENU.map(block => {
        //create a copy of main <li>-item (=block object from HEADER_MENU)
        const processedBlock = { ...block }; //... spread operator - copy all properties of object <li>-block from HEADER_MENU

        //create a copy of <ul>-dropdown list
        if (processedBlock.type === 'dropdown') {
            const items = processedBlock.items.map(item => ({
                ...item,    //copy all properties of the menu sub-item
                active: item.id === page,   //add 'active: true' 
            }));

            //if at least one sub-item in the dropdown list is active, the whole <li>-item is active
            const hasActive = items.some(i => i.active);

            return {
                ...processedBlock,
                items,
                active: hasActive,
            };
        }

        //corresponds <button>-items of menu
        if (processedBlock.type === 'button') {
            return {
                ...processedBlock,
                active: processedBlock.id === page, //add 'active: true' for current page
            };
        }

        return processedBlock;
    });

    //FOOTER MENU processing
    const footerMenu = FOOTER_MENU.map(section => { //'section' - param of a callback .map(), corresponds here to <section>, represents one object from FOOTER_MENU array
        const items = section.items.map(item => ({ //'item' - param of inner .map() callback, correspons to <li>, returns object ({item})+active, represents one menu item
            ...item,    //spread operator ... - copy all properties from original 'item' object 
            active: item.id === page,  // add property active: true/false
        }));

        return {
            ...section, // ... - copy all properties from original 'section' object (heading, sectionClasses)
            items, //replace old 'items' array with new processed one (including property active)
        };
    });

    //processing META-data for a page
    const meta = META[page] || META['index']; //[] search dynamically for the variable's 'page' keys, otherwise show meta-data for index-page

    //gather all data for page-template, render html
    const templateData = {
        headerMenu,
        footerMenu,
        main: compiledMainContent,
        title: meta.title,
        description: meta.description,
        og: meta.og,
        lang: meta.lang,
        ...extraData  // // unpacking { movies: [...] }
    };

    const htmlText = template(templateData);
    
    return htmlText;
}