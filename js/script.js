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
            // Ho aggiornato questa sezione per includere tutti i media (immagini e video)
            media: [
                { type: 'image', src: 'assets/progetto1/1hiv-1hvr_image1.png' },
                { type: 'image', src: 'assets/progetto1/1hiv-1hvr_image2.png' },
                { type: 'image', src: 'assets/progetto1/1hiv-1hvr_image3.png' },
                { type: 'image', src: 'assets/progetto1/1hiv-1hvr_label_image4.png' },
                { type: 'video', src: 'assets/progetto1/1hiv-1hvr_movie1.mp4' }
            ],
            description: "Struttura dell'HIV-1 Proteasi comparata con una sua versione mutata. Ottimo per osservare l'asimmetria in Angstrom, e osservare come una mutazione puntiforme missenso si traduca in un cambio di amminoacido.",
            techniques: "Manipolazione 3D tramite ChimeraX",
            relevance: "Fondamentale per lo studio della resistenza ai farmaci antiretrovirali."
        },
        hba1c: {
            name: "Modello HIV-1 Proteasi interazione con Inibitore",
            pdb: "1hpv",
            media: [
                { type: 'image', src: 'assets/progetto2/1hpv-HIV-1+Amprenavir_image1.png' },
                { type: 'image', src: 'assets/progetto2/1hpv-HIV-1+Amprenavir_image2.png'},
                { type: 'image', src: 'assets/progetto2/1hpv-HIV-1+Amprenavir_image3.png' },
                { type: 'image', src: 'assets/progetto2/1hpv-HIV-1+Amprenavir_image4.png' },
                { type: 'video', src: 'assets/progetto2/1hpv-HIV-1-PROTEASI+Amprenavir_movie1.mp4' },
                { type: 'video', src: 'assets/progetto2/1hpv-HIV-1-PROTEASI+Amprenavir_movie2.mp4' },
                { type: 'video', src: 'assets/progetto2/1hpv-HIV-1-PROTEASI+Amprenavir_movie3.mp4' }
            ], 
            description: "Struttura della HIV-1 Proteasi con Amprenavir (Inibitore competitivo) farmaco antiretrovirale che inibisce questo enzima necessario alla replicazione del virus, formando un complesso enzima-inibitore (E-I)",
            techniques: "Manipolazione 3D tramite ChimeraX",
            relevance: "Fondamentale per lo studio delle interazioni Enzima-Inibitore."
        },
        ana: {
            name: "HIV-1 Proteasi",
            pdb: "1hpx e 1hvl",
            media: [
                { type: 'image', src: 'assets/progetto3/1hpx_image1.png' },
                { type: 'image', src: 'assets/progetto3/1hvl-1hpx_residues_48.png' },
                { type: 'image', src: 'assets/progetto3/1hpx_mutazione_balland_stick.png' },
                { type: 'image', src: 'assets/progetto3/Ballandstick_A48G.png'},
                { type: 'image', src: 'assets/progetto3/Distanze_tra_Atomi_ballandstick.png' },
                { type: 'image', src: 'assets/progetto3/stick_A48G.png' },
                { type: 'video', src: 'assets/progetto3/1hvl-1hpx_bfactor_movie1.mp4' },
                { type: 'video', src: 'assets/progetto3/mutazione_1hpx_ALA48GLY.mp4' }
            ], 
            description: "Struttura dell'HIV-1 Proteasi comparata ad una sua versione mutata (ALA48GLY), con PDB ID differnte per il richiamo su ChimeraX.",
            techniques: "Manipolazione 3D tramite ChimeraX",
            relevance: "Fondamentale per lo studio delle mutazioni puntiformi missenso del DNA che si traducono in un cambio di amminoacido nella catena proteica."
        },
        ana_immunofluorescence: {
            name: "Anticorpi Anti-Nucleo (ANA)",
            media: [
                { type: 'image', src: 'assets/foto_tirocinio/ana_pos_pz.jpg' },
                { type: 'image', src: 'assets/foto_tirocinio/centromerico.jpg' },
                { type: 'image', src: 'assets/foto_tirocinio/dfs_70.jpg' },
                { type: 'image', src: 'assets/foto_tirocinio/nuc._dots.jpg' },
                { type: 'image', src: 'assets/foto_tirocinio/omogeneo.jpg' },
                { type: 'image', src: 'assets/foto_tirocinio/speckled.jpg'},
                
               
            ], 
            description: "Immagine rappresentativa dell'analisi di immunofluorescenza indiretta (IFI) per la rilevazione di Anticorpi Anti-Nucleo (ANA). Questa tecnica è fondamentale nella diagnosi di malattie autoimmuni sistemiche. L'immagine mostra la fluorescenza caratteristica dei pattern nucleari riconosciuti dagli autoanticorpi presenti nel siero del paziente.",
            techniques: "Immunofluorescenza Indiretta",
            relevance: "Indagini per la ricerca di malattie autoimmuni"
        },
        asma_immunofluorescence: {
            name: "Anticorpi Anti-Muscolo Liscio",
            media: [
                { type: 'image', src: 'assets/foto_tirocinio/fegato.jpg' },
                { type: 'image', src: 'assets/foto_tirocinio/muscolaris.jpg' },
                { type: 'image', src: 'assets/foto_tirocinio/tessuto_asma-1.jpg' },
                { type: 'image', src: 'assets/foto_tirocinio/tessuto_asma-2.jpg'},
                { type: 'image', src: 'assets/foto_tirocinio/tessuto_asma-3.jpg' },
                
            ], 
            description: "Immagine IFI che illustra la rilevazione di Anticorpi Anti Muscolo Liscio (ASMA) e Anticorpi Anti Mitocondrio (AMA), marcatori importanti per la diagnosi di epatiti autoimmuni come la cirrosi biliare primitiva, e altre patologie autoimmuni. Si possono osservare i pattern di fluorescenza specifici sul substrato cellulare che indicano la presenza di questi autoanticorpi.",
            techniques: "Immunofluorescenza Indiretta",
            relevance: "Indagini per la ricerca di malattie autoimmuni"
        }
    };

    let currentMediaIndex = 0; // Variabile globale per tracciare l'indice del media corrente

    // --- Funzione per la visualizzazione delle proteine nel modal (galleria) ---
    window.showProteinInfo = function(proteinType) { 
        const protein = proteinData[proteinType];
        if (!protein) { 
            console.error('Tipo di proteina non trovato:', proteinType);
            return;
        }

        // Resetta l'indice del media all'apertura del modal
        currentMediaIndex = 0; 

        // Genera il contenuto HTML iniziale per la galleria
        const galleryContentHtml = `
            <div class="gallery-modal-header" style="text-align: center; margin-bottom: 1rem;">
                <h3 style="color: #5b76ecff; margin-bottom: 0.5rem; font-size: 1.5rem;">${protein.name}</h3>
                <p style="color: #666; font-weight: 600;">PDB ID: ${protein.pdb}</p>
            </div>
            <div class="media-viewer-container">
                <button class="modal-nav-arrow left-arrow" aria-label="Media precedente">&#10094;</button>
                <div class="current-media-display">
                    </div>
                <button class="modal-nav-arrow right-arrow" aria-label="Media successiva">&#10095;</button>
            </div>
            <div class="gallery-description" style="margin-top: 1.5rem;">
                <h4 style="color: #2b3547ff; margin-bottom: 0.5rem;">Descrizione:</h4>
                <p style="color: #4a5568; line-height: 1.6;">${protein.description}</p>
                <h4 style="color: #2d3748; margin-bottom: 0.5rem;">Tecniche Utilizzate:</h4>
                <p style="color: #4a5568; line-height: 1.6;">${protein.techniques}</p>
                <h4 style="color: #2d3748; margin-bottom: 0.5rem;">Rilevanza Clinica:</h4>
                <p style="color: #4a5568; line-height: 1.6;">${protein.relevance}</p>
            </div>
        `;
        
        openModal(galleryContentHtml);

        // Aggiungi listener per la navigazione
        const leftArrow = modalContentContainer.querySelector('.left-arrow');
        const rightArrow = modalContentContainer.querySelector('.right-arrow');
        const currentMediaDisplay = modalContentContainer.querySelector('.current-media-display');

        if (leftArrow && rightArrow && currentMediaDisplay) {
            leftArrow.addEventListener('click', () => {
                currentMediaIndex = (currentMediaIndex === 0) ? protein.media.length - 1 : currentMediaIndex - 1;
                updateModalMedia(protein, currentMediaIndex, currentMediaDisplay);
            });
            rightArrow.addEventListener('click', () => {
                currentMediaIndex = (currentMediaIndex === protein.media.length - 1) ? 0 : currentMediaIndex + 1;
                updateModalMedia(protein, currentMediaIndex, currentMediaDisplay);
            });

            // Gestione dei click sull'area del media
            currentMediaDisplay.addEventListener('click', (e) => {
                const mediaElement = currentMediaDisplay.querySelector('img, video');
                if (!mediaElement) return;

                const mediaRect = mediaElement.getBoundingClientRect();
                const clickX = e.clientX - mediaRect.left;

                // Clicca al centro per ingrandire/avviare video
                if (clickX > mediaRect.width * 0.2 && clickX < mediaRect.width * 0.8) {
                    if (mediaElement.tagName === 'IMG') {
                        mediaElement.classList.toggle('enlarged'); // Ingrandisce l'immagine
                        modalContentContainer.classList.toggle('image-enlarged'); // Per permettere overflow per immagine ingrandita
                    } else if (mediaElement.tagName === 'VIDEO') {
                        if (mediaElement.paused) {
                            mediaElement.play();
                        } else {
                            mediaElement.pause();
                        }
                    }
                } else if (clickX <= mediaRect.width * 0.2) { // Clicca a sinistra per precedente
                    leftArrow.click();
                } else if (clickX >= mediaRect.width * 0.8) { // Clicca a destra per successivo
                    rightArrow.click();
                }
            });

            // Carica il primo media
            updateModalMedia(protein, currentMediaIndex, currentMediaDisplay);
        }
    }

    // --- Funzione per aggiornare il media visualizzato nel modal ---
    function updateModalMedia(protein, index, containerElement) {
        containerElement.innerHTML = ''; // Pulisce il contenuto precedente
        const media = protein.media[index];

        if (media.type === 'image') {
            const img = document.createElement('img');
            img.src = media.src;
            img.alt = protein.name;
            img.classList.add('modal-media');
            containerElement.appendChild(img);
        } else if (media.type === 'video') {
            const video = document.createElement('video');
            video.src = media.src;
            video.alt = protein.name;
            video.classList.add('modal-media');
            video.controls = false; // Controlli personalizzati
            video.loop = true; // Video in loop
            video.muted = true; // Muto di default per autoplay
            video.playsInline = true; // Per riproduzione su iOS
            // Aggiungi un div per i controlli custom video
            const videoControls = document.createElement('div');
            videoControls.classList.add('video-controls');

            // Icona Play/Pause (visibile al centro)
            const playPauseIcon = document.createElement('div');
            playPauseIcon.classList.add('play-pause-overlay');
            playPauseIcon.innerHTML = '&#9654;'; // Triangolo "play"
            video.addEventListener('play', () => playPauseIcon.style.display = 'none');
            video.addEventListener('pause', () => playPauseIcon.style.display = 'flex');
            containerElement.appendChild(playPauseIcon);
            
            // Bottone Fullscreen
            const fullscreenButton = document.createElement('button');
            fullscreenButton.classList.add('video-fullscreen-btn');
            fullscreenButton.innerHTML = '&#x26F6;'; // Icona fullscreen
            fullscreenButton.title = 'Toggle Fullscreen';
            fullscreenButton.addEventListener('click', (e) => {
                e.stopPropagation(); // Evita che il click si propaghi al container
                if (video.requestFullscreen) {
                    if (!document.fullscreenElement) {
                        video.requestFullscreen();
                    } else {
                        document.exitFullscreen();
                    }
                } else if (video.webkitEnterFullscreen) { // Safari
                    video.webkitEnterFullscreen();
                } else if (video.msRequestFullscreen) { // IE11
                    video.msRequestFullscreen();
                } else {
                    // Fallback per browser senza supporto nativo o toggle CSS
                    video.classList.toggle('modal-video-fullscreen');
                    containerElement.classList.toggle('modal-video-container-fullscreen');
                    modalContentContainer.classList.toggle('modal-video-content-fullscreen');
                }
            });
            videoControls.appendChild(fullscreenButton);
            
            containerElement.appendChild(video);
            containerElement.appendChild(videoControls); // Aggiungi i controlli

            // Autoplay the video silently
            video.play().catch(error => {
                console.log('Autoplay blocked:', error);
                // Handle cases where autoplay is blocked (e.g., show a play button)
                playPauseIcon.style.display = 'flex'; // Mostra il bottone play
            });
        }
    }
});