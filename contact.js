document.addEventListener('DOMContentLoaded', () => {
    // --- DATA ---
    const availability = "Tersedia untuk proyek baru";
    const processSteps = [
        { title: "1. Discovery & Briefing", description: "Kita mendengarkan ide Anda, memahami tujuan, dan mendefinisikan lingkup proyek." },
        { title: "2. Konsep & Desain", description: "Membuat wireframe dan desain visual (UI/UX) untuk memvisualisasikan tampilan akhir." },
        { title: "3. Pengembangan", description: "Mengubah desain menjadi kode yang fungsional, responsif, dan dioptimalkan." },
        { title: "4. Review & Luncurkan", description: "Proses QA, revisi akhir, dan peluncuran proyek ke dunia." },
    ];
    const faqItems = [
        { question: "Berapa lama waktu yang dibutuhkan untuk menyelesaikan proyek?", answer: "Waktu pengerjaan sangat bervariasi. Landing page sederhana (2-4 minggu), aplikasi web kompleks (3-6 bulan). Saya akan memberikan estimasi detail setelah mendapatkan brief." },
        { question: "Apakah Anda bekerja dengan tim atau sendirian?", answer: "Saya adalah freelancer profesional, namun saya memiliki jaringan ahli (backend, content writer, dll) dan akan berkolaborasi jika proyek membutuhkannya." },
        { question: "Bagaimana proses pembayaran dan harganya?", answer: "Saya meminta DP 30-50% untuk memulai. Pembayaran selanjutnya sesuai milestone. Harga disesuaikan dengan ruang lingkup pekerjaan dan akan dijelaskan dalam penawaran resmi." },
        { question: "Apakah Anda menyediakan layanan perawatan (maintenance)?", answer: "Tentu. Saya menawarkan paket maintenance bulanan/tahunan yang mencakup update keamanan, backup, dan perbaikan bug kecil untuk menjaga website Anda berjalan optimal." },
        { question: "Bagaimana dengan kekayaan intelektual (hak cipta)?", answer: "Setelah pembayaran akhir lunas, seluruh hak cipta atas karya desain dan kode yang dibuat khusus untuk proyek Anda akan menjadi milik Anda sepenuhnya." },
    ];
    const clientLogos = ['TechCorp', 'StartupKu', 'InnovateID', 'CreativeHub', 'DigitalMinds', 'NextGen'];

    // --- STATE ---
    let isLoading = true;
    let isTouchDevice = false;
    let isSubmitting = false;
    let submissionStatus = null; // 'success' or 'error'
    let activeFaq = null;
    const formData = {
        name: '', email: '', phone: '', subject: '', budget: '', message: '', attachment: null
    };
    const errors = {};

    // --- DOM ELEMENTS ---
    const loaderWrapper = document.getElementById('loader-wrapper');
    const cursor = document.getElementById('cursor');
    const cursorFollower = document.getElementById('cursor-follower');
    const availabilityEl = document.getElementById('availability');
    const processGrid = document.getElementById('process-grid');
    const faqList = document.getElementById('faq-list');
    const logosGrid = document.getElementById('logos-grid');
    const contactForm = document.getElementById('contact-form-element');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const btnSpinner = document.getElementById('btn-spinner');
    const submissionMessage = document.getElementById('submission-message');
    const submissionText = document.getElementById('submission-text');
    const messageLengthEl = document.getElementById('message-length');
    const fileNameEl = document.getElementById('file-name');

    // --- METHODS ---
    const init = () => {
        document.body.classList.add('contact-page-active');
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
            setupIntersectionObserver();
        }, 1500);
    };

    const renderAllContent = () => {
        availabilityEl.textContent = availability;
        renderProcessSteps();
        renderFaqItems();
        renderClientLogos();
    };

    const renderProcessSteps = () => {
        processGrid.innerHTML = processSteps.map(step => `
            <div class="process-item">
                <div class="process-number">${step.title.split('.')[0]}</div>
                <h3>${step.title}</h3>
                <p>${step.description}</p>
            </div>
        `).join('');
    };

    const renderFaqItems = () => {
        faqList.innerHTML = faqItems.map((item, index) => `
            <div class="faq-item" data-index="${index}">
                <div class="faq-question">
                    <h4>${item.question}</h4>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="faq-answer">
                    <p>${item.answer}</p>
                </div>
            </div>
        `).join('');
    };

    const renderClientLogos = () => {
        logosGrid.innerHTML = clientLogos.map(logo => `
            <div class="logo-item">
                <img src="https://picsum.photos/seed/${logo}/150/80" alt="${logo}">
            </div>
        `).join('');
    };

    const setupEventListeners = () => {
        // Form submission
        contactForm.addEventListener('submit', handleSubmit);

        // FAQ toggles
        faqList.addEventListener('click', (e) => {
            const questionEl = e.target.closest('.faq-question');
            if (questionEl) {
                const faqItem = questionEl.parentElement;
                const index = parseInt(faqItem.dataset.index);
                toggleFaq(index);
            }
        });

        // Message character count
        const messageTextarea = document.getElementById('message');
        messageTextarea.addEventListener('input', updateCharCount);

        // File input change
        const fileInput = document.getElementById('attachment');
        fileInput.addEventListener('change', handleFileChange);
    };

    const validateForm = () => {
        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        errors.name = '';
        errors.email = '';
        errors.message = '';

        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');

        if (!name.value.trim()) {
            errors.name = 'Nama wajib diisi.';
            name.classList.add('error');
        }
        if (!email.value.trim()) {
            errors.email = 'Email wajib diisi.';
            email.classList.add('error');
        } else if (!/^\S+@\S+\.\S+$/.test(email.value)) {
            errors.email = 'Format email tidak valid.';
            email.classList.add('error');
        }
        if (!message.value.trim()) {
            errors.message = 'Pesan wajib diisi.';
            message.classList.add('error');
        } else if (message.value.length < 20) {
            errors.message = 'Pesan terlalu singkat, minimal 20 karakter.';
            message.classList.add('error');
        }

        // Display errors
        document.getElementById('name-error').textContent = errors.name;
        document.getElementById('email-error').textContent = errors.email;
        document.getElementById('message-error').textContent = errors.message;

        return !errors.name && !errors.email && !errors.message;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        isSubmitting = true;
        submissionStatus = null;
        updateSubmitButton();

        // Simulasi pengiriman (ganti dengan logika pengiriman asli)
        setTimeout(() => {
            submissionStatus = 'success';
            showSubmissionMessage();
            contactForm.reset();
            updateCharCount();
            fileNameEl.textContent = '';
            isSubmitting = false;
            updateSubmitButton();
            setTimeout(() => { hideSubmissionMessage(); }, 5000);
        }, 2000);
    };

    const updateSubmitButton = () => {
        if (isSubmitting) {
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnSpinner.style.display = 'block';
        } else {
            submitBtn.disabled = false;
            btnText.style.display = 'flex';
            btnSpinner.style.display = 'none';
        }
    };

    const showSubmissionMessage = () => {
        submissionMessage.style.display = 'block';
        submissionMessage.className = `submission-message ${submissionStatus}`;
        if (submissionStatus === 'success') {
            submissionText.textContent = '✅ Pesan Anda berhasil terkirim! Saya akan segera menghubungi Anda.';
        } else {
            submissionText.textContent = '❌ Oops! Terjadi kesalahan. Silakan coba lagi.';
        }
    };

    const hideSubmissionMessage = () => {
        submissionMessage.style.display = 'none';
    };

    const updateCharCount = () => {
        const messageTextarea = document.getElementById('message');
        let currentLength = messageTextarea.value.length;
        if (currentLength > 500) {
            messageTextarea.value = messageTextarea.value.substring(0, 500);
            currentLength = 500;
        }
        messageLengthEl.textContent = currentLength;
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            fileNameEl.textContent = file.name;
        } else {
            fileNameEl.textContent = '';
        }
    };

    const toggleFaq = (index) => {
        const allFaqItems = document.querySelectorAll('.faq-item');
        const clickedItem = allFaqItems[index];

        if (activeFaq === index) {
            clickedItem.classList.remove('active');
            activeFaq = null;
        } else {
            allFaqItems.forEach(item => item.classList.remove('active'));
            clickedItem.classList.add('active');
            activeFaq = index;
        }
    };

    const setupIntersectionObserver = () => {
        const sections = document.querySelectorAll('.fade-down, .fade-left, .fade-right, .fade-up');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        sections.forEach(section => observer.observe(section));
    };

    const setupCustomCursor = () => {
        const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, .faq-question');
        const moveCursor = (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
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
        document.body.classList.remove("contact-page-active");
    });
});
