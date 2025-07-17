document.addEventListener('DOMContentLoaded', () => {

    // --- Smooth Scrolling per i link di navigazione ---
    const navLinks = document.querySelectorAll('nav ul li a');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Controlla se il link punta a una sezione della stessa pagina (es. #about, #experience, #contact)
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(href);
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            } 
            // Se il link punta a una pagina esterna (es. gallery.html o index.html#section), la navigazione normale è gestita dal browser
        });
    });

    // --- Gestione dell'invio del form di contatto ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            alert('Grazie per il tuo messaggio! Ti risponderò al più presto.');
            
            this.reset();
        });
    }

    // --- Animazioni on scroll ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out';
            }
        });
    }, observerOptions);

    // Osserva le card per le animazioni (solo se presenti sulla pagina corrente)
    document.querySelectorAll('.experience-card, .protein-card').forEach(el => {
        observer.observe(el);
    });

    // --- Effetto parallax leggero per l'hero ---
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.getElementById('hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // --- Evidenziazione del link attivo nella navigazione ---
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('nav ul li a');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            // Calcola la posizione della sezione rispetto alla finestra visibile
            if (scrollY >= (sectionTop - (window.innerHeight / 3))) { 
                currentSectionId = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active'); // Rimuovi 'active' da tutti i link

            const linkHref = item.getAttribute('href');

            // Logica per i link interni (es. #about, #experience, #contact, #chimera-work)
            if (linkHref.startsWith('#') && linkHref.slice(1) === currentSectionId) {
                item.classList.add('active');
            } 
            // Logica per il link "Galleria Proteine" se siamo sulla pagina gallery.html
            else if (linkHref === 'gallery.html' && window.location.pathname.endsWith('gallery.html')) {
                item.classList.add('active');
            }
            // Logica per i link che puntano a index.html da qualsiasi pagina (es. dalla gallery.html)
            // Se siamo sulla index.html e il link punta a una sezione di index.html, lo rendiamo attivo
            else if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') { // Controlla anche la root per index.html
                if (linkHref.startsWith('index.html#')) {
                    const targetSectionId = linkHref.split('#')[1];
                    if (targetSectionId === currentSectionId) {
                        item.classList.add('active');
                    }
                }
            }
             // Specifico per "Il mio lavoro in ChimeraX" sulla index.html
             if (linkHref === 'gallery.html' && (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') && currentSectionId === 'chimera-work') {
                // Questa logica è necessaria se vogliamo che il link "Galleria Proteine"
                // (o "Il mio lavoro in ChimeraX" se lo si vuole attivare quando si è nella sezione)
                // sia attivo sulla home page quando si è nella sezione "Il mio lavoro in ChimeraX".
                // In base a come hai strutturato i link nel nav, il link "Il mio lavoro in ChimeraX"
                // che ora punta a gallery.html non sarà "attivo" quando si è su index.html#chimera-work
                // perché è un link esterno. L'unica che rimane "attiva" è "Galleria Proteine" su gallery.html
                // e le sezioni interne alla index.html.
                // Se vuoi che "Il mio lavoro in ChimeraX" sia attivo sulla home, deve essere un link interno come gli altri,
                // ma poi non porterebbe alla gallery.html.
                // Per come l'abbiamo modificato ora, il link "Il mio lavoro in ChimeraX" nella nav *non diventerà attivo*
                // quando scorri alla sezione relativa, perché punta a un'altra pagina.
                // Sarà attivo solo il link "Galleria Proteine" quando sei sulla gallery.html.
            }
        });
    });


    // --- Funzione per gestire l'apertura e chiusura del modal ---
    const dynamicModal = document.getElementById('dynamic-modal');
    const modalContentContainer = dynamicModal.querySelector('.modal-content');

    function openModal(contentHtml) {
        modalContentContainer.innerHTML = contentHtml; // Inietta il contenuto
        
        const closeButton = document.createElement('button');
        closeButton.classList.add('modal-close-button');
        closeButton.innerHTML = '&times;'; // 'x' icon
        closeButton.onclick = closeModal; // Associa la funzione di chiusura
        modalContentContainer.prepend(closeButton); // Aggiungi il bottone di chiusura in cima

        dynamicModal.classList.add('active'); // Attiva la visibilità del modal
        document.body.style.overflow = 'hidden'; // Impedisce lo scroll della pagina sottostante
    }

    function closeModal() {
        dynamicModal.classList.remove('active');
        document.body.style.overflow = ''; // Ripristina lo scroll
        // Ferma i media se stanno suonando nel modal
        const videoInModal = modalContentContainer.querySelector('video');
        if (videoInModal) {
            videoInModal.pause();
            videoInModal.currentTime = 0; // Riavvolge il video all'inizio
        }
    }

    // Chiudi il modal cliccando fuori dal contenuto
    dynamicModal.addEventListener('click', (e) => {
        if (e.target === dynamicModal) {
            closeModal();
        }
    });

    // --- Data delle proteine e media da visualizzare ---
    const proteinData = {
        hiv_protease: {
            name: "Modello HIV-1 Proteasi",
            pdb: "1hiv",
            imageSrc: "assets/1hiv-1hvr_image1.png", 
            description: "Struttura dell'HIV-1 Proteasi comparata con una sua versione mutata. Ottimo per osservare l'asimmetria in Angstrom, e osservare come una mutazione puntiforme missenso si traduca in un cambio di amminoacido.",
            techniques: "Manipolazione 3D tramite ChimeraX",
            relevance: "Fondamentale per lo studio della resistenza ai farmaci antiretrovirali."
        },
        hba1c: {
            name: "Emoglobina Glicata (HbA1c)",
            pdb: "1HHO",
            imageSrc: "assets/images/placeholder_hemoglobin.jpg", 
            description: "Struttura dell'emoglobina umana con modificazioni glicemiche tipiche del diabete. Le modificazioni post-traduzionali sono evidenti nella struttura.",
            techniques: "Elettroforesi, Dosaggio immunoenzimatico",
            relevance: "Biomarcatore essenziale per il monitoraggio a lungo termine del controllo glicemico nei pazienti diabetici."
        },
        ana: {
            name: "Antigeni Nucleari (ANA)",
            pdb: "1AOI",
            imageSrc: "assets/images/placeholder_hemoglobin.jpg", 
            description: "Proteine nucleari coinvolte nei test ANA per diagnosi autoimmuni. Strutture target degli autoanticorpi nelle malattie sistemiche.",
            techniques: "Immunofluorescenza indiretta su cellule HEp-2",
            relevance: "Screening primario per malattie autoimmuni sistemiche come lupus, sclerodermia e sindrome di Sjögren."
        }
    };

    // --- Funzione per la visualizzazione delle proteine nel modal (solo testo e immagine principale) ---
    window.showProteinInfo = function(proteinType) { 
        const protein = proteinData[proteinType];
        if (!protein) { 
            console.error('Tipo di proteina non trovato:', proteinType);
            return;
        }

        const content = `
            <div style="text-align: center; margin-bottom: 1.5rem;">
                <h3 style="color: #5b76ecff; margin-bottom: 0.5rem; font-size: 1.5rem;">${protein.name}</h3>
                <p style="color: #666; font-weight: 600;">PDB ID: ${protein.pdb}</p>
            </div>
            <img src="${protein.imageSrc}" alt="${protein.name}" style="width: 100%; height: auto; border-radius: 10px; margin-bottom: 1.5rem;">
            <div style="margin-bottom: 1.5rem;">
                <h4 style="color: #2b3547ff; margin-bottom: 0.5rem;">Descrizione:</h4>
                <p style="color: #4a5568; line-height: 1.6;">${protein.description}</p>
            </div>
            <div style="margin-bottom: 1.5rem;">
                <h4 style="color: #2d3748; margin-bottom: 0.5rem;">Tecniche Utilizzate:</h4>
                <p style="color: #4a5568; line-height: 1.6;">${protein.techniques}</p>
            </div>
            <div style="margin-bottom: 1.5rem;">
                <h4 style="color: #2d3748; margin-bottom: 0.5rem;">Rilevanza Clinica:</h4>
                <p style="color: #4a5568; line-height: 1.6;">${protein.relevance}</p>
            </div>
        `;
        openModal(content);
    }
});