// Generate the HTML template
window.generateHTML = function(data) {
    // Function to convert hex to rgb
    function hexToRgb(hex) {
        if (!hex) return null;
        
        // Remove the hash if it exists
        hex = hex.replace('#', '');
        
        // Parse the hex values
        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);
        
        // Return as comma-separated string for CSS variables
        return `${r}, ${g}, ${b}`;
    }

    // Generate services HTML
    let servicesHTML = '';
    data.services.forEach(service => {
        servicesHTML += `
        <div class="feature">
            <i class="${service.icon}"></i>
            <h3>${service.title}</h3>
            <p>${service.description}</p>
        </div>`;
    });
    
    // Logo source - use a transparent pixel as the default if no logo provided
    const logoSrc = data.logoData || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
    
    // Logo scale (default to 70% if not provided)
    const logoScale = data.logoScale || '70';
    
    // Page background color (default to white if not provided)
    const pageBgColor = data.pageBgColor || '#ffffff';
    
    // Section gradient settings (with defaults)
    const sectionGradientStart = data.sectionGradientStart || '#0a0a19';
    const sectionGradientEnd = data.sectionGradientEnd || '#1a1a2e';
    const gradientAngle = data.gradientAngle || '135';
    
    // Escape any special characters in text fields
    const escapedLawFirmName = data.lawFirmName.replace(/'/g, "\\'");
    const escapedTagline = data.tagline.replace(/'/g, "\\'");
    const escapedContactName = data.contactName.replace(/'/g, "\\'");
    const escapedContactAddress = data.contactAddress.replace(/'/g, "\\'");
    
    // Generate a unique ID for this card if not provided
    const cardId = data.cardId || generateUniqueId();
    
    return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapedLawFirmName}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" integrity="sha512-9usAa10IRO0HhonpyAIVpjrylPvoDwiPUiKdWk5t3PyolY1cOd4DSE0Ga+ri4AuTroPR5aQvXU9xC6qOPnzFeg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"/>
    <style>
        :root {
            --primary: ${data.primaryColor};
            --secondary: ${data.secondaryColor};
            --accent: ${data.accentColor};
            --dark: ${data.backgroundColor};
            --light: ${data.textColor};
            --page-bg: ${pageBgColor};
            --glass: rgba(255, 255, 255, 0.1);
            --page-bg-rgb: ${hexToRgb(pageBgColor) || '255, 255, 255'};
            /* Extract RGB components from hex color for use in rgba() */
            --primary-rgb: ${hexToRgb(data.primaryColor) || '139, 0, 0'};
            --secondary-rgb: ${hexToRgb(data.secondaryColor) || '75, 54, 33'};
            --accent-rgb: ${hexToRgb(data.accentColor) || '212, 175, 55'};
            /* Section gradient */
            --section-gradient: linear-gradient(${gradientAngle}deg, ${sectionGradientStart}, ${sectionGradientEnd});
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            transition: all 0.3s ease;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background-color: var(--dark);
            color: var(--light);
            overflow-x: hidden;
            background: linear-gradient(to bottom right, #0f0c29, #302b63, #24243e);
            background-attachment: fixed;
            position: relative; /* Ensure positioning context for particles */
        }

        /* Particles container - ensure it shows in all sections */
        #particles {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            pointer-events: none;
            z-index: 0; /* Below content */
        }

        /* Section-specific particle containers */
        #hero-particles, #features-particles, #contact-particles {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            pointer-events: none;
            z-index: 0;
        }

        .particle {
            position: fixed;
            border-radius: 50%;
            pointer-events: none;
            background: radial-gradient(circle at center, var(--primary), transparent);
            z-index: 0;
            opacity: 0.5;
            box-shadow: 0 0 15px rgba(var(--primary-rgb), 0.8);
        }

        /* Content containers with page background color */
        .page-bg-container {
            background-color: var(--page-bg);
            margin: 20px;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            position: relative;
            overflow: hidden;
            z-index: 1; /* Place above particles */
        }

        /* Hero specific styling for page-bg-container */
        #hero .page-bg-container {
            max-width: 1200px;
            margin: 0 auto;
            margin-top: 20px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        /* Add a subtle pattern overlay */
        .page-bg-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: radial-gradient(var(--primary) 1px, transparent 1px);
            background-size: 20px 20px;
            opacity: 0.05;
            pointer-events: none;
        }

        .navbar {
            position: fixed;
            top: 0;
            width: 100%;
            background: rgba(10, 10, 25, 0.8);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            z-index: 1000;
            padding: 15px 5%;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .navbar .logo {
            font-size: 1.5rem;
            font-weight: bold;
            letter-spacing: 2px;
            color: var(--primary);
            text-transform: uppercase;
        }

        .navbar .nav-links {
            display: flex;
            gap: 30px;
        }

        .navbar .nav-links a {
            color: var(--light);
            text-decoration: none;
            position: relative;
            padding: 5px 0;
        }

        .navbar .nav-links a::after {
            content: '';
            position: absolute;
            width: 0;
            height: 2px;
            bottom: 0;
            left: 0;
            background-color: var(--primary);
            transition: width 0.3s;
        }

        .navbar .nav-links a:hover::after {
            width: 100%;
        }

        #hero {
            min-height: 100vh;
            padding: 150px 5% 100px;
            position: relative;
            overflow: hidden;
            z-index: 1; /* Ensure this is above particles */
        }

        .hero-background {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--section-gradient);
            z-index: -1;
            overflow: hidden;
        }
        
        /* Add a subtle radial gradient overlay */
        .hero-background::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(
                circle at center,
                transparent 30%,
                rgba(var(--primary-rgb), 0.05) 70%,
                rgba(var(--secondary-rgb), 0.1) 100%
            );
            z-index: -1;
        }
        
        /* Add subtle dot pattern */
        .hero-background::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: radial-gradient(var(--primary) 1px, transparent 1px);
            background-size: 30px 30px;
            opacity: 0.05;
            pointer-events: none;
            z-index: -1;
        }

        .hero-content {
            max-width: 600px;
            padding-right: 20px;
            animation: fadeInLeft 1s ease-out;
        }

        .hero-content h2 {
            font-size: 3em;
            font-weight: 700;
            margin-bottom: 20px;
            background: linear-gradient(to right, var(--primary), var(--accent));
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            line-height: 1.2;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .hero-content p {
            font-size: 1.2em;
            line-height: 1.6;
            margin-bottom: 30px;
            color: var(--dark);
            text-shadow: 0 1px 2px rgba(255, 255, 255, 0.2);
        }

        .hero-image-container {
            position: relative;
            width: 300px;
            height: 300px;
            margin-left: 50px;
            z-index: 2;
            animation: float-subtle 6s ease-in-out infinite, fadeIn 1.5s;
        }

        @keyframes float-subtle {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes fadeInLeft {
            from {
                opacity: 0;
                transform: translateX(-50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        .circle-container {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: var(--page-bg);
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            box-shadow: 0 0 15px rgba(0, 188, 212, 0.5);
            transform: translateZ(0);
            padding: 0;
        }

        .circle-image {
            width: ${logoScale}% !important;
            height: auto;
            object-fit: contain;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            max-width: none !important;
            max-height: none !important;
        }

        .circle-overlay {
            position: absolute;
            width: 110%;
            height: 110%;
            border-radius: 50%;
            background: linear-gradient(45deg, transparent, rgba(0, 188, 212, 0.2), transparent);
            animation: rotate 8s linear infinite;
        }

        @keyframes rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .circle-pulse {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: transparent;
            border: 1px solid var(--primary);
            animation: pulse 2s ease-out infinite;
        }

        @keyframes pulse {
            0% { transform: scale(0.95); opacity: 1; }
            70% { transform: scale(1.1); opacity: 0; }
            100% { transform: scale(0.95); opacity: 0; }
        }

        .futuristic-button {
            background-color: transparent;
            color: var(--dark);
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 50px;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            border: 1px solid var(--primary);
            font-size: 1rem;
            text-transform: uppercase;
            letter-spacing: 2px;
            position: relative;
            overflow: hidden;
            z-index: 1;
            cursor: pointer;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
        }

        .futuristic-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 0%;
            height: 100%;
            background: linear-gradient(to right, var(--primary), var(--secondary));
            transition: width 0.3s ease;
            z-index: -1;
        }

        .futuristic-button:hover::before {
            width: 100%;
        }

        .futuristic-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 0 25px rgba(0, 0, 0, 0.3);
            color: var(--light);
        }

        .futuristic-button i {
            transition: transform 0.3s ease;
        }

        .futuristic-button:hover i {
            transform: translateX(5px);
        }

        #features {
            padding: 100px 5%;
            text-align: center;
            position: relative;
            background: var(--section-gradient);
            position: relative; /* Ensure positioning context */
            z-index: 1; /* Ensure this is above particles */
        }

        /* Add a specific semi-transparent background for features to show particles */
        #features::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--section-gradient);
            opacity: 0.95; /* Make more opaque to hide background bleed */
            z-index: -1; /* Below content but above particles */
        }

        .section-title {
            font-size: 2.5em;
            margin-bottom: 50px;
            color: var(--light);
            position: relative;
            display: inline-block;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }

        .section-title::after {
            content: '';
            position: absolute;
            width: 80px;
            height: 3px;
            background: linear-gradient(to right, var(--primary), var(--secondary));
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
        }

        .features-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 40px;
        }

        .feature {
            position: relative;
            width: 300px;
            padding: 30px;
            border-radius: 15px;
            background: rgba(10, 10, 25, 0.9);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            cursor: pointer;
            overflow: hidden;
            transition: transform 0.3s, box-shadow 0.3s;
            color: var(--light);
        }

        .feature::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, transparent, rgba(0, 188, 212, 0.1), transparent);
            transform: translateY(100%);
            transition: transform 0.6s;
        }

        .feature:hover::before {
            transform: translateY(-100%);
        }

        .feature:hover {
            transform: translateY(-10px);
            box-shadow: 0 10px 30px rgba(0, 188, 212, 0.2);
        }

        .feature i {
            font-size: 3em;
            background: linear-gradient(to right, var(--primary), var(--secondary));
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 20px;
        }

        .feature h3 {
            font-size: 1.5em;
            margin-bottom: 15px;
            color: var(--light);
        }

        .feature p {
            color: var(--light);
            line-height: 1.6;
        }

        #contact {
            padding: 100px 5%;
            text-align: center;
            position: relative;
            background: var(--section-gradient);
            background-attachment: fixed;
            z-index: 1; /* Ensure this is above particles */
        }

        .contact-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            border-radius: 8px;
            background: transparent;
        }

        .contact-info {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 30px;
            margin-top: 30px;
        }

        .contact-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
            width: 200px;
            border-radius: 10px;
            background: rgba(10, 10, 25, 0.9);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            transition: transform 0.3s, box-shadow 0.3s;
            border: 1px solid rgba(var(--primary-rgb), 0.2);
            color: var(--light);
        }

        .contact-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }

        .contact-item i {
            font-size: 2em;
            color: var(--primary);
            margin-bottom: 15px;
            transition: transform 0.3s;
        }

        .contact-item:hover i {
            transform: scale(1.2);
        }

        .contact-item a {
            color: var(--light);
            text-decoration: none;
            font-size: 1.1em;
            transition: color 0.3s;
            word-break: break-word;
        }

        .contact-item a:hover {
            color: var(--primary);
        }

        footer {
            background-color: rgba(10, 10, 25, 0.9);
            color: var(--light);
            text-align: center;
            padding: 30px 0;
            position: relative;
            overflow: hidden;
        }

        footer p {
            position: relative;
            z-index: 1;
        }

        footer::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 1px;
            background: linear-gradient(to right, transparent, var(--primary), transparent);
        }

        /* Make sure images are visible on all browsers/devices */
        @media (max-width: 768px) {
            html, body {
                width: 100vw;
                overflow-x: hidden !important;
            }
            .editor-container,
            .sidebar,
            .preview-container,
            .preview-frame,
            .page-bg-container,
            #hero,
            #features,
            #contact {
                max-width: 100vw !important;
                overflow-x: hidden !important;
            }
            .navbar {
                padding: 10px 15px;
            }

            .navbar .logo {
                font-size: 1rem;
                letter-spacing: 1px;
                max-width: 70%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .navbar .nav-links {
                display: none;
            }

            #hero {
                padding: 170px 10px 50px;
            }

            #hero .page-bg-container {
                flex-direction: column;
                margin: 10px;
                padding: 20px;
            }

            .page-bg-container {
                margin: 10px;
                padding: 20px;
            }

            .hero-content {
                max-width: 100%;
                margin-right: 0;
                margin-bottom: 50px;
                padding-right: 0;
            }

            .hero-content h2 {
                font-size: 2.3em;
            }

            .hero-image-container {
                width: 280px;
                height: 280px;
                margin-left: 0;
            }
            
            .circle-image {
                width: ${logoScale}% !important;
                max-width: none !important;
                max-height: none !important;
            }
            
            .circle-container {
                position: relative;
                background: var(--page-bg);
                border-radius: 50%;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .features-container {
                flex-direction: column;
                align-items: center;
            }

            .feature {
                width: 100%;
                max-width: 320px;
            }

            .contact-info {
                flex-direction: column;
                align-items: center;
            }

            .contact-item {
                width: 100%;
                max-width: 280px;
            }

            .contact-item a {
                font-size: 0.9em;
            }
        }

        /* Make particles visible across all sections */
        #features, #contact, #hero {
            position: relative;
            z-index: 1; /* Ensure content is above particles */
        }
    </style>
    
    <!-- Highest priority styles to ensure logo scaling works in all views including inspector -->
    <style id="critical-logo-styles">
        .circle-image {
            width: ${logoScale}% !important;
            max-width: none !important;
            max-height: none !important;
        }
    </style>
</head>
<body>
    <!-- Hidden tracking data -->
    <input type="hidden" id="card-id" value="${cardId}">
    <input type="hidden" id="business-name" value="${escapedLawFirmName}">

    <!-- Animated particles in background -->
    <div id="particles"></div>

    <!-- Navigation bar -->
    <nav class="navbar">
        <div class="logo">${escapedLawFirmName}</div>
        <div class="nav-links">
            <a href="#hero">Accueil</a>
            <a href="#features">Services</a>
            <a href="#contact">Contact</a>
        </div>
    </nav>

    <section id="hero">
        <div id="hero-particles"></div>
        <div class="hero-background"></div>
        <div class="page-bg-container">
            <div class="hero-content">
                <h2>${escapedLawFirmName}</h2>
                <p>${escapedTagline}</p>
                <a href="#" id="downloadVCard" class="futuristic-button" onclick="window.parent.downloadVCardFromEditor && window.parent.downloadVCardFromEditor(); return false;">
                    <i class="fas fa-address-card"></i> Ajouter aux Contacts
                </a>
            </div>
            <div class="hero-image-container">
                <div class="circle-container">
                    <img src="${logoSrc}" 
                        alt="${escapedLawFirmName}" 
                        class="circle-image" 
                        style="width: ${logoScale}%; max-width: none !important; max-height: none !important;"
                        onerror="this.onerror=null;this.src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';this.alt='${escapedLawFirmName.toUpperCase()}';">
                    <div class="circle-overlay"></div>
                    <div class="circle-pulse"></div>
                </div>
            </div>
        </div>
    </section>

    <section id="features">
        <div id="features-particles"></div>
        <h2 class="section-title">${data.servicesTitle}</h2>
        <div class="page-bg-container">
            <div class="features-container">
                ${servicesHTML}
            </div>
        </div>
    </section>

    <section id="contact">
        <div id="contact-particles"></div>
        <h2 class="section-title">${data.contactTitle}</h2>
        <div class="page-bg-container">
            <div class="contact-container">
                <p>${data.contactSubtitle}</p>
                <div class="contact-info">
                    <div class="contact-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <a href="https://www.google.com/maps" target="_blank">
                            ${escapedContactAddress}
                        </a>
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-phone-alt"></i>
                        <a href="tel:${data.contactPhone}">${data.contactPhone}</a>
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-envelope"></i>
                        <a href="mailto:${data.contactEmail}">${data.contactEmail}</a>
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-globe"></i>
                        <a href="https://${data.contactWebsite}" target="_blank">${data.contactWebsite}</a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <footer>
        <p>${data.footerText}</p>
    </footer>

    <script>
        // Immediate logo scaling as soon as script loads
        (function initLogoScale() {
            const scale = ${logoScale};
            const logoImg = document.querySelector('.circle-image');
            if (logoImg) {
                logoImg.style.width = scale + '%';
                logoImg.style.maxWidth = 'none';
                logoImg.style.maxHeight = 'none';
            }
        })();
        
        // Create static particles for the whole page
        function createParticles() {
            var particlesContainer = document.getElementById('particles');
            if (!particlesContainer) return;
            particlesContainer.innerHTML = '';
            
            // Fewer particles with static positioning to reduce performance issues
            var numParticles = 40;
            var rootStyle = getComputedStyle(document.documentElement);
            var particleColor = rootStyle.getPropertyValue('--primary');
            var secondaryColor = rootStyle.getPropertyValue('--secondary');
            var accentColor = rootStyle.getPropertyValue('--accent');
            
            // Create static background particles
            for (var i = 0; i < numParticles; i++) {
                var particle = document.createElement('div');
                particle.classList.add('particle');
                
                // Fixed random position
                var posX = Math.random() * 100;
                var posY = Math.random() * 100;
                
                // Smaller sizes to reduce visual glitches
                var size = Math.random() * 80 + 30;
                
                // Random colors from theme
                var colors = [particleColor, secondaryColor, accentColor];
                var randomColor = colors[Math.floor(Math.random() * colors.length)];
                
                // Apply static styles
                particle.style.position = 'fixed';
                particle.style.left = posX + '%';
                particle.style.top = posY + '%';
                particle.style.width = size + 'px';
                particle.style.height = size + 'px';
                particle.style.borderRadius = '50%';
                particle.style.background = 'radial-gradient(circle at center, ' + randomColor + ', transparent)';
                particle.style.boxShadow = '0 0 15px ' + randomColor;
                particle.style.opacity = '0.3'; // Lower opacity to reduce visual impact
                particle.style.zIndex = '0';
                
                // No animation to avoid performance issues
                particle.style.animation = 'none';
                particle.style.transform = 'scale(' + (Math.random() * 0.5 + 0.5) + ')';
                
                particlesContainer.appendChild(particle);
            }
            
            // Fewer section-specific particles to avoid visual glitches
            createSectionParticles('hero-particles', particleColor, 10);
            createSectionParticles('features-particles', secondaryColor, 8);
            createSectionParticles('contact-particles', accentColor, 6);
        }
        
        // Create static particles for specific sections
        function createSectionParticles(containerId, color, count) {
            var container = document.getElementById(containerId);
            if (!container) return;
            
            container.innerHTML = '';
            
            for (var i = 0; i < count; i++) {
                var particle = document.createElement('div');
                
                // Fixed random position within section
                var posX = Math.random() * 100;
                var posY = Math.random() * 100;
                
                // Smaller sizes for section particles
                var size = Math.random() * 60 + 20;
                
                // Apply static styles for section particles
                particle.style.position = 'absolute'; // Use absolute instead of fixed
                particle.style.left = posX + '%';
                particle.style.top = posY + '%';
                particle.style.width = size + 'px';
                particle.style.height = size + 'px';
                particle.style.borderRadius = '50%';
                particle.style.background = 'radial-gradient(circle at center, ' + color + ', transparent)';
                particle.style.boxShadow = '0 0 10px ' + color;
                particle.style.opacity = '0.3'; // Lower opacity
                particle.style.transform = 'scale(' + (Math.random() * 0.4 + 0.6) + ')';
                
                container.appendChild(particle);
            }
        }
        
        // Animate on scroll
        function animateOnScroll() {
            const elements = document.querySelectorAll('.feature, .contact-item');
            // Only animate fade-in for content elements, no particle regeneration
            elements.forEach(element => {
                element.style.opacity = 0;
                element.style.transform = 'translateY(20px)';
                element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                // Simple fade-in on scroll
                const observer = new IntersectionObserver((entries, obs) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.style.opacity = 1;
                            entry.target.style.transform = 'translateY(0)';
                            obs.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.1 });
                observer.observe(element);
            });
        }
        
        // Initialize everything when the page loads
        window.addEventListener('load', () => {
            // Create the static particles once
            createParticles();
            
            // Debug CSS variables
            console.log('Primary color:', getComputedStyle(document.documentElement).getPropertyValue('--primary'));
            
            animateOnScroll();
            // Make sure logo is properly displayed
            ensureLogoDisplay();
            // Handle window resize for responsive behavior
            handleResponsive();
            window.addEventListener('resize', handleResponsive);
            
            // Smooth scroll for navigation links
            document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    if(this.getAttribute('href') === "#") return;
                    e.preventDefault();
                    const targetElement = document.querySelector(this.getAttribute('href'));
                    if(targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth'
                        });
                    }
                });
            });
            
            // Track the visit when page loads
            setTimeout(trackVisit, 1500);
        });
        
        // Ensure logo is properly displayed
        function ensureLogoDisplay() {
            const logoImg = document.querySelector('.circle-image');
            if (logoImg) {
                const scale = ${logoScale};
                logoImg.style.width = scale + '%';
                logoImg.style.maxWidth = 'none';
                logoImg.style.maxHeight = 'none';
            }
        }
        
        // Handle responsive adjustments
        function handleResponsive() {
            const logoImg = document.querySelector('.circle-image');
            if (logoImg) {
                const scale = ${logoScale};
                logoImg.style.width = scale + '%';
                logoImg.style.maxWidth = 'none';
                logoImg.style.maxHeight = 'none';
            }
        }
        // Standalone vCard download for generated HTML
        document.addEventListener('DOMContentLoaded', function() {
            var vCardBtn = document.getElementById('downloadVCard');
            if (vCardBtn) {
                vCardBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    var lawFirmName = ${JSON.stringify(escapedLawFirmName)};
                    var contactName = ${JSON.stringify(escapedContactName)};
                    var contactPhone = ${JSON.stringify(data.contactPhone)};
                    var contactEmail = ${JSON.stringify(data.contactEmail)};
                    var contactAddress = ${JSON.stringify(escapedContactAddress)};
                    var contactWebsite = ${JSON.stringify(data.contactWebsite)};
                    var logoData = ${JSON.stringify(logoSrc)};
                    
                    var nameParts = contactName.split(' ');
                    var lastName = nameParts.length > 1 ? nameParts.pop() : contactName;
                    var firstName = nameParts.join(' ');
                    var organization = lawFirmName;
                    
                    var vCardData = "BEGIN:VCARD\\n" +
                        "VERSION:3.0\\n" +
                        "N:" + lastName + ";" + firstName + ";;;\\n" +
                        "FN:" + contactName + "\\n" +
                        "ORG:" + organization + "\\n" +
                        "TEL:" + contactPhone + "\\n" +
                        "ADR:;;" + contactAddress + ";;;\\n" +
                        "EMAIL:" + contactEmail + "\\n" +
                        "URL:" + contactWebsite + "\\n";
                    
                    if (logoData && logoData.startsWith('data:image')) {
                        var base64Data = logoData.split(',')[1];
                        vCardData += "PHOTO;ENCODING=b;TYPE=JPEG:" + base64Data + "\\n";
                    }
                    
                    vCardData += "END:VCARD";
                    
                    var blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8' });
                    var url = URL.createObjectURL(blob);
                    var link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', firstName + '-' + lastName + '-Contact.vcf');
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);                    
                });
            }
        });

        // Analytics tracking function
        function trackVisit() {
            try {
                // Get card identification
                const cardId = document.getElementById('card-id').value;
                const businessName = document.getElementById('business-name').value;
                
                // Get visitor information
                const userAgent = navigator.userAgent;
                const language = navigator.language;
                const screenSize = window.innerWidth + 'x' + window.innerHeight;
                const timestamp = new Date().toISOString();
                const referrer = document.referrer || 'direct';
                
                // Get geolocation if available
                let locationData = 'unavailable';
                
                // Prepare tracking data
                const trackingData = {
                    cardId,
                    businessName,
                    userAgent,
                    language,
                    screenSize,
                    timestamp,
                    referrer,
                    locationData
                };
                
                // Send tracking data to server
                fetch('/api/track', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(trackingData),
                })
                .then(response => console.log('Tracking data sent'))
                .catch(error => console.error('Error sending tracking data:', error));
                
                // Store in local storage as backup
                const visits = JSON.parse(localStorage.getItem('card_visits') || '[]');
                visits.push(trackingData);
                localStorage.setItem('card_visits', JSON.stringify(visits));
                
            } catch (e) {
                console.error('Tracking error:', e);
            }
        }
        
        // Generate a unique ID for this card
        function generateUniqueId() {
            return 'card_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
        }
    </script>
</body>
</html>`;
}

// Helper function to generate unique IDs for cards
function generateUniqueId() {
    return 'card_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
} 