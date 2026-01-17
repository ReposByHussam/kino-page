import fs from 'fs/promises'; //fs-module from Node.js library for reading files
import Handlebars from 'handlebars'; //Handlebars-module from npm-library
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
        items: [
            { label: 'För över 18 år', link: '#' },
            { label: 'För hela familjen', link: '#' },
        ],
    },
    {
        type: 'dropdown',
        label: 'Kommande',
        classes: 'menu-desktop',
        items: [
            { label: 'För över 18 år', link: '#' },
            { label: 'För hela familjen', link: '#' },
        ],
    },
    {
        type: 'dropdown',
        label: 'På bio',
        classes: 'menu-desktop',
        items: [
            { label: 'Bistro och mat', link: '/bistro', id: 'bistro' },
            { label: 'Evenemang', link: '/eventPage', id: 'eventPage' },
        ],
    },
    {
        type: 'dropdown',
        label: 'Mer...',
        classes: 'menu-desktop-xlarge',
        items: [
            { label: 'Om oss', link: '/about-us', id: 'about-us' },
            { label: 'Boka salen', link: '#' },
            { label: 'Jobba hos oss', link: '#' },
            { label: 'Köpa presentkort', link: '#' },
        ],
    },
    {
        type: 'link',
        label: 'Kontakta oss',
        link: '/contact',
        classes: 'menu-desktop menu-contact',
        id: 'contact',
    },
    {
        type: 'link',
        label: 'Logga in',
        link: '#',
        classes: 'menu-medium login',
    },
    {
        type: 'link',
        label: 'Bli medlem',
        link: '#',
        classes: 'menu-hide-medium',
    },
    {
        type: 'dropdown',
        label: 'Språk',
        classes: 'menu-medium language',
        items: [
            { label: 'Svenska', link: '#' },
            { label: 'Engelska', link: '#' },
        ],
    },
];

//FOOTER MENU
export const FOOTER_MENU = [
    {
        heading: 'Filmer idag',
        sectionClasses: 'footer__submenu-section',
        items: [
            { label: 'För över 18 år', link: '#' },
            { label: 'För hela familjen', link: '#' },
        ],
    },
    {
        heading: 'Kommande',
        sectionClasses: 'footer__submenu-section',
        items: [
            { label: 'För över 18 år', link: '#' },
            { label: 'För hela familjen', link: '#' },
        ],
    },
    {
        heading: 'På bio',
        sectionClasses: 'footer__submenu-section',
        items: [
            { label: 'Bistro och mat', link: '/bistro#bistro_viewmenu', id: 'bistro' },
            { label: 'Evenemang', link: '/eventPage', id: 'eventPage' },
        ],
    },
    {
        heading: 'Mer',
        sectionClasses: 'footer__submenu-section',
        items: [
            { label: 'Om oss', link: '/about-us', id: 'about-us' },
            { label: 'Boka salen', link: '#' },
            { label: 'Jobba hos oss', link: '#' },
            { label: 'Köpa presentkort', link: '#' },
        ],
    },
];

//META for all pages
const META = {
    index: {
        title: 'Kino - Uppsala',
        description: 'Kino biograf i Uppsala - filmer idag,kommande filmer, bistro och evenemang, Av filmälskare för filmälskare',
        og: {
            title: 'Kino - Uppsala',
            description: 'Kino biograf i Uppsala - filmer idag,kommande filmer, bistro och evenemang, Av filmälskare för filmälskare',
            locale: 'sv_SE',
            url: 'http://localhost:5080/',
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
            url: 'http://localhost:5080/about-us',
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
            url: 'http://localhost:5080/bistro',
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
            url: 'http://localhost:5080/contact',
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
            url: 'http://localhost:5080/eventPage',
            image: '/src/pics/KINO-event.png',
            imageAlt: 'En person i en biosalong som håller i en dödskalle.',
        },
        lang: 'sv',
    },
}

export default async function renderPage(page) {
    //register partials before compiling the template
    await registerPartials();

    //read Habdlbars page-template
    const templateBuf = await fs.readFile('./templates/page.hbs');
    const templateText = templateBuf.toString();
    const template = Handlebars.compile(templateText);

    //read content of the page (main)
    let mainContent = '';
    try {
        const contentBuf = await fs.readFile(`./content/${page}.hbs`, 'utf-8'); //utf-8 instead of .toString()
        mainContent = contentBuf;
    } catch (err) {
        throw new Error(`Page "${page}" is not found`);
    }

    //HEADER MENU processing
    const headerMenu = HEADER_MENU.map(block => {
        if (block.type === 'dropdown') {
            const items = block.items.map(item => ({
                ...item,
                active: item.id === page,
            }));

            const hasActive = items.some(i => i.active);

            return {
                ...block,
                items,
                active: hasActive,
            };
        }

        if (block.type === 'link') {
            return {
                ...block,
                active: block.id === page,
            };
        }

        return block;
    });


    //FOOTER MENU processing
    const footerMenu = FOOTER_MENU.map(section => {
        const items = section.items.map(item => ({
            ...item,
            active: item.id === page,
        }));

        return {
            ...section,
            items,
        };
    });

    // //render Menu with class Active
    // const headerMenu = MENU.map((item => ({
    //     label: item.label,
    //     link: item.link,
    //     active: item.id === page,
    // })));
    // const footerMenu = MENU.map((item) => ({
    //     label: item.label,
    //     link: item.link,
    //     active: item.id === page,
    // }));

    //processing META-data for a page
    const meta = META[page] || META['index']; //[] search dynamically for the variable's 'page' keys, otherwise show meta-data for index-page

    //gather all data for page-template, render html
    const htmlText = template({
        headerMenu,
        footerMenu,
        main: mainContent,
        title: meta.title,
        description: meta.description,
        og: meta.og,
        lang: meta.lang,
    });

    return htmlText;
}