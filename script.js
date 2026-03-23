document.addEventListener('DOMContentLoaded', () => {
    // Reveal Animations (Apple Style fade-in and slide-up)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Stop observing once it has revealed
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    // Tab switching logic for Services section
    const tabBtns = document.querySelectorAll('.tab-btn');
    const serviceContents = document.querySelectorAll('.service-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            serviceContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');

            // Find matching content and display it
            // Assuming matching data-tab maps to id
            const tabId = btn.getAttribute('data-tab');
            const targetContent = document.getElementById(tabId);
            
            if(targetContent) {
                targetContent.classList.add('active');
            } else {
                // Fallback to default block for demo
                const fallback = document.getElementById('influencer');
                if(fallback) fallback.classList.add('active');
            }
        });
    });

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link, .btn, .footer-col a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            // Only handle internal # links
            if (href && href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 52, // Account for Apple-style 52px fixed header
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Header scroll effect & Dark section detection
    const header = document.querySelector('.header');
    const darkSections = document.querySelectorAll('.advantages-section'); // Add other dark sections if any

    window.addEventListener('scroll', () => {
        let isDark = false;
        
        // Add subtle shadow when scrolled
        if (window.scrollY > 10) {
            header.style.borderBottom = '1px solid rgba(0,0,0,0.05)';
        } else {
            header.style.borderBottom = 'none';
        }

        // Check if header is over a dark section
        darkSections.forEach(section => {
            const rect = section.getBoundingClientRect();
            // If the top of the section is above the bottom of the header
            // AND the bottom of the section is below the top of the header
            if (rect.top <= 52 && rect.bottom >= 0) {
                isDark = true;
            }
        });

        if (isDark) {
            header.classList.add('dark-mode');
        } else {
            header.classList.remove('dark-mode');
        }
    });

    // Trigger initial scroll event to set correct header state
    window.dispatchEvent(new Event('scroll'));

    // Contact form submission - Email Client Integration
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const inputs = contactForm.querySelectorAll('input');
            const textarea = contactForm.querySelector('textarea');
            
            const company = inputs[0].value;
            const position = inputs[1].value;
            const name = inputs[2].value;
            const phone = inputs[3].value;
            const requirements = textarea.value;

            // Email details
            const emailTo = "xenoqianchuan@gmail.com";
            const subject = encodeURIComponent(`TikTok 美区出海合作咨询 - ${company}`);
            
            // Construct structured body
            const bodyContent = `
您好，

我想咨询关于 TikTok 美区出海的合作事宜。以下是我的联系信息：

公司名称: ${company}
职位: ${position}
姓名: ${name}
手机号码: ${phone}

具体需求描述:
${requirements}

期待您的回复。
            `.trim();

            const mailtoUrl = `mailto:${emailTo}?subject=${subject}&body=${encodeURIComponent(bodyContent)}`;

            // Trigger email client
            window.location.href = mailtoUrl;

            // Optional: reset form or show a small feedback
            // contactForm.reset();
        });
    }
});
