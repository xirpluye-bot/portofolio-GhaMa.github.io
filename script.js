document.addEventListener('DOMContentLoaded', () => {
    // --- DATA ---
    const name = "M.Ghausil Ma'mun";
    const taglines = ["Web Developer", "UI/UX Designer", "Creative Technologist"];
    const services = [
        { id: 1, icon: '<i class="fas fa-code"></i>', title: "Pengembangan Web", description: "Membangun website yang cepat, responsif, dan SEO-friendly dari awal hingga selesai." },
        { id: 2, icon: '<i class="fas fa-paint-brush"></i>', title: "UI/UX Design", description: "Merancang antarmuka yang intuitif dan pengalaman pengguna yang menyenangkan." },
        { id: 3, icon: '<i class="fas fa-mobile-alt"></i>', title: "Aplikasi Mobile", description: "Mengembangkan aplikasi mobile hybrid yang berjalan di iOS dan Android." },
        { id: 4, icon: '<i class="fas fa-rocket"></i>', title: "Optimasi & Performa", description: "Meningkatkan kecepatan dan performa website Anda untuk hasil terbaik." },
    ];
    const skills = [
        { name: "HTML / CSS / SASS", level: 95 },
        { name: "JavaScript (ES6+) / TypeScript", level: 90 },
        { name: "React / Vue.js", level: 85 },
        { name: "Node.js / Express", level: 75 },
        { name: "UI/UX Design (Figma)", level: 80 },
        { name: "Git / Version Control", level: 88 },
    ];
    const tools = [
        { name: "VS Code", icon: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Visual_Studio_Code_1.35.1_icons.svg" },
        { name: "Figma", icon: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg" },
        { name: "Git", icon: "https://upload.wikimedia.org/wikipedia/commons/3/3f/Git_icon.svg" },
        { name: "npm", icon: "https://upload.wikimedia.org/wikipedia/commons/d/db/Npm-logo.svg" },
        { name: "Chrome DevTools", icon: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Chrome_icon_%28September_2014%29.svg" },
    ];
    const timeline = [
        { type: "education", title: "MI Mihas", company: "Reguler", period: "2015 - 2020", highlights: ["Fokus Kepada Pendidikan Agama Dan Pendidikan Nasional"] },
        { type: "education", title: "MTS Mihas", company: "Reguler", period: "2021 - 2023", highlights: ["Fokus Kepada Pendidikan Nasional"] },
        { type: "education", title: "SMK Nj", institution: "Rekayasa Perangkat Lunak", period: "2024 - 2026", description: "Fokus pada rekayasa perangkat lunak dan kecerdasan buatan." },
    ];
    const portfolioFilters = ["all", "web", "design", "mobile"];
    const portfolioItems = [
        { id: 1, title: "E-Commerce Platform", description: "Aplikasi belanja online dengan fitur lengkap.", image: "https://picsum.photos/id/10/400/300", category: "web" },
        { id: 2, title: "Banking App UI", description: "Desain antarmuka untuk aplikasi perbankan mobile.", image: "https://picsum.photos/id/20/400/300", category: "design" },
        { id: 3, title: "SaaS Dashboard", description: "Dashboard analitik untuk bisnis.", image: "https://picsum.photos/id/30/400/300", category: "web" },
        { id: 4, title: "Brand Identity", description: "Desain logo dan identitas merek.", image: "https://picsum.photos/id/40/400/300", category: "design" },
        { id: 5, title: "Food Delivery App", description: "Aplikasi mobile untuk pesan antar makanan.", image: "https://picsum.photos/id/50/400/300", category: "mobile" },
        { id: 6, title: "Portfolio Website", description: "Website portfolio untuk seorang fotografer.", image: "https://picsum.photos/id/60/400/300", category: "web" },
    ];
    const testimonials = [
        { text: "Bekerja dengan [Nama Anda] adalah pengalaman yang luar biasa. Ia sangat profesional dan menghasilkan karya yang melampaui ekspektasi.", author: "P.Rahmat", role: "waka kurikulum", logo: "https://picsum.photos/id/100/80/40" },
        { text: "Desain yang dibuat sangat intuitif dan kode-nya sangat bersih. Sangat direkomendasikan!", author: "P.Ilham", role: "kajur RPL", logo: "https://picsum.photos/id/101/80/40" },
        { text: "Ia berhasil meningkatkan konversi website kami secara signifikan. Hasil yang nyata dan proses yang kolaboratif.", author: "P.Hadi", role: "UI/UX", logo: "https://picsum.photos/id/102/80/40" },
    ];
    const hobbies = [
        { name: "Fotografi", icon: '<i class="fas fa-camera-retro"></i>' },
        { name: "Musik", icon: '<i class="fas fa-headphones"></i>' },
        { name: "Perjalanan", icon: '<i class="fas fa-plane"></i>' },
        { name: "Game", icon: '<i class="fas fa-gamepad"></i>' },
    ];

    // --- STATE ---
    let isLoading = true;
    let isTouchDevice = false;
    let activeFilter = "all";
    let currentSlide = 0;
    let currentTaglineIndex = 0;
    let animatedStats = { years: 0, projects: 0 };

    // --- DOM ELEMENTS ---
    const loaderWrapper = document.getElementById('loader-wrapper');
    const cursor = document.getElementById('cursor');
    const cursorFollower = document.getElementById('cursor-follower');
    const typedNameEl = document.getElementById('typed-name');
    const currentTaglineEl = document.getElementById('current-tagline');
    const yearsStatEl = document.getElementById('years-stat');
    const projectsStatEl = document.getElementById('projects-stat');
    const servicesGrid = document.getElementById('services-grid');
    const skillsContainer = document.getElementById('skills-container');
    const toolsGrid = document.getElementById('tools-grid');
    const timelineEl = document.getElementById('timeline');
    const portfolioFiltersEl = document.getElementById('portfolio-filters');
    const portfolioGrid = document.getElementById('portfolio-grid');
    const testimonialWrapper = document.getElementById('testimonial-wrapper');
    const sliderDots = document.getElementById('slider-dots');
    const hobbiesGrid = document.getElementById('hobbies-grid');

    // --- METHODS ---
    const init = () => {
        document.body.classList.add("about-page-active");
        isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouchDevice) {
            cursor.style.display = 'none';
            cursorFollower.style.display = 'none';
        }

        renderAllContent();
        setupEventListeners();

        setTimeout(() => {
            isLoading = false;
            loaderWrapper.classList.add('fade-out');
            if (!isTouchDevice) setupCustomCursor();
            typeName();
            rotateTagline();
            setupIntersectionObserver();
        }, 1500);

        setInterval(() => {
            currentSlide = (currentSlide + 1) % testimonials.length;
            updateTestimonialSlider();
        }, 5000);
    };

    const renderAllContent = () => {
        renderServices();
        renderSkills();
        renderTools();
        renderTimeline();
        renderPortfolioFilters();
        renderPortfolio();
        renderTestimonials();
        renderHobbies();
    };

    const renderServices = () => {
        servicesGrid.innerHTML = services.map(service => `
            <div class="service-card">
                <div class="service-icon">${service.icon}</div>
                <h3>${service.title}</h3>
                <p>${service.description}</p>
            </div>
        `).join('');
    };

    const renderSkills = () => {
        skillsContainer.innerHTML = skills.map(skill => `
            <div class="skill-item">
                <h4>${skill.name}</h4>
                <div class="skill-bar">
                    <div class="skill-level" data-level="${skill.level}"></div>
                </div>
            </div>
        `).join('');
    };

    const renderTools = () => {
        toolsGrid.innerHTML = tools.map(tool => `
            <div class="tool-item">
                <img src="${tool.icon}" alt="${tool.name}" />
                <span>${tool.name}</span>
            </div>
        `).join('');
    };

    const renderTimeline = () => {
        timelineEl.innerHTML = timeline.map(item => `
            <div class="timeline-item ${item.type}">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <span class="timeline-type">${item.type === "work" ? "Pekerjaan" : "Pendidikan"}</span>
                    <h3>${item.title}</h3>
                    <h4>${item.company || item.institution}</h4>
                    <span class="timeline-date">${item.period}</span>
                    ${item.highlights ? `<ul>${item.highlights.map(h => `<li>${h}</li>`).join('')}</ul>` : `<p>${item.description}</p>`}
                </div>
            </div>
        `).join('');
    };

    const renderPortfolioFilters = () => {
        portfolioFiltersEl.innerHTML = portfolioFilters.map(filter => `
            <button class="filter-btn ${activeFilter === filter ? 'active' : ''}" data-filter="${filter}">${filter}</button>
        `).join('');
    };

    const renderPortfolio = () => {
        const filteredItems = activeFilter === "all" ? portfolioItems : portfolioItems.filter(item => item.category === activeFilter);
        portfolioGrid.innerHTML = filteredItems.map(item => `
            <div class="portfolio-item">
                <img src="${item.image}" alt="${item.title}" />
                <div class="portfolio-info">
                    <h4>${item.title}</h4>
                    <p>${item.description}</p>
                    <a href="#" class="portfolio-link">Lihat Studi Kasus <i class="fas fa-arrow-right"></i></a>
                </div>
            </div>
        `).join('');
    };

    const renderTestimonials = () => {
        testimonialWrapper.innerHTML = testimonials.map(t => `
            <div class="testimonial-item">
                <img src="${t.logo}" alt="${t.company}" class="client-logo" />
                <p>"${t.text}"</p>
                <h4>${t.author}</h4>
                <span>${t.role}, ${t.company}</span>
            </div>
        `).join('');
        sliderDots.innerHTML = testimonials.map((_, i) => `
            <span class="dot ${currentSlide === i ? 'active' : ''}" data-slide="${i}"></span>
        `).join('');
    };

    const renderHobbies = () => {
        hobbiesGrid.innerHTML = hobbies.map(hobby => `
            <div class="hobby-card">
                <div class="hobby-icon">${hobby.icon}</div>
                <h4>${hobby.name}</h4>
            </div>
        `).join('');
    };

    const setupEventListeners = () => {
        // Portfolio Filters
        portfolioFiltersEl.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                activeFilter = e.target.dataset.filter;
                document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                renderPortfolio();
            }
        });

        // Testimonial Dots
        sliderDots.addEventListener('click', (e) => {
            if (e.target.classList.contains('dot')) {
                currentSlide = parseInt(e.target.dataset.slide);
                updateTestimonialSlider();
            }
        });
    };

    const updateTestimonialSlider = () => {
        testimonialWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
        document.querySelectorAll('.dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    };

    const typeName = () => {
        let nameIndex = 0;
        const typeInterval = setInterval(() => {
            if (nameIndex < name.length) {
                typedNameEl.textContent += name.charAt(nameIndex);
                nameIndex++;
            } else {
                clearInterval(typeInterval);
            }
        }, 150);
    };

    const rotateTagline = () => {
        setInterval(() => {
            currentTaglineIndex = (currentTaglineIndex + 1) % taglines.length;
            currentTaglineEl.textContent = taglines[currentTaglineIndex];
        }, 3000);
    };

    const animateCounters = () => {
        const targetYears = 1;
        const targetProjects = 10;
        const timer = setInterval(() => {
            if (animatedStats.years < targetYears) {
                animatedStats.years++;
                yearsStatEl.textContent = animatedStats.years + '+';
            }
            if (animatedStats.projects < targetProjects) {
                animatedStats.projects += 5;
                projectsStatEl.textContent = animatedStats.projects + '+';
            }
            if (animatedStats.years >= targetYears && animatedStats.projects >= targetProjects) {
                clearInterval(timer);
            }
        }, 50);
    };

    const setupIntersectionObserver = () => {
        const sections = document.querySelectorAll(".content-section");
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    if (entry.target.id === "skills") animateSkillBars();
                    if (entry.target.id === "about") animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        sections.forEach(section => observer.observe(section));
    };

    const animateSkillBars = () => {
        const skillLevels = document.querySelectorAll(".skill-level");
        skillLevels.forEach(skill => {
            const width = skill.dataset.level + '%';
            skill.style.width = "0";
            setTimeout(() => skill.style.width = width, 200);
        });
    };

    const setupCustomCursor = () => {
        const interactiveElements = document.querySelectorAll("a, button, .filter-btn, .dot, .timeline-item, .service-card");
        const moveCursor = (e) => {
            cursor.style.left = e.clientX + "px";
            cursor.style.top = e.clientY + "px";
            cursorFollower.style.left = e.clientX + "px";
            cursorFollower.style.top = e.clientY + "px";
        };
        document.addEventListener("mousemove", moveCursor);
        interactiveElements.forEach(el => {
            el.addEventListener("mouseover", () => cursor.classList.add("hover"));
            el.addEventListener("mouseout", () => cursor.classList.remove("hover"));
        });
    };

    // --- LIFECYCLE ---
    init();
    window.addEventListener('beforeunload', () => {
        document.body.classList.remove("about-page-active");
    });
});
