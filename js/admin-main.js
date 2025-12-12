/* ========================================
   RIZIQ ADMIN - MAIN CONTROL
   ======================================== */

const RiziqAdmin = {
    // Current Page Detection
    currentPage: window.location.pathname.split("/").pop(),

    // Init
    init: function () {
        this.checkAuth();
        this.seedData(); // Ensure data is populated on load
        this.setupSidebar();
        this.setupLogout();
        this.renderPageContent();
    },

    // 1. Auth Check (Simulated)
    checkAuth: function () {
        const isAuth = localStorage.getItem('riziq_admin_auth');
        const isLoginPage = this.currentPage === 'login.html' || this.currentPage === '';

        if (!isAuth && !isLoginPage) {
            window.location.href = 'login.html';
        } else if (isAuth && isLoginPage) {
            window.location.href = 'index.html';
        }
    },

    // 2. Login Function
    login: function (username, password) {
        // Simple hardcoded check for demo
        if (username === 'admin' && password === 'admin123') {
            localStorage.setItem('riziq_admin_auth', 'true');
            // Set default data if empty
            if (!localStorage.getItem('riziq_jobs')) this.seedData();
            window.location.href = 'index.html';
            return true;
        }
        return false;
    },

    // 3. Logout
    setupLogout: function () {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('riziq_admin_auth');
                window.location.href = 'login.html';
            });
        }
    },

    // 4. Sidebar Toggle Mobile
    setupSidebar: function () {
        const toggle = document.querySelector('.mobile-toggle');
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.createElement('div');

        if (toggle && sidebar) {
            // Create Overlay
            overlay.className = 'sidebar-overlay';
            overlay.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.5); z-index: 40; display: none;
                backdrop-filter: blur(2px);
            `;
            document.body.appendChild(overlay);

            toggle.addEventListener('click', () => {
                sidebar.classList.toggle('active');
                overlay.style.display = sidebar.classList.contains('active') ? 'block' : 'none';
            });

            overlay.addEventListener('click', () => {
                sidebar.classList.remove('active');
                overlay.style.display = 'none';
            });
        }
    },

    // 5. Seed Initial Data (Rich Demo Data)
    seedData: function () {
        // Jobs
        const jobs = JSON.parse(localStorage.getItem('riziq_jobs') || '[]');
        if (jobs.length < 2) {
            const initialJobs = [
                { id: 1, title: 'Heavy Driver', location: 'Riyadh, Saudi Arabia', salary: '2500 SAR + OT', status: 'Active' },
                { id: 2, title: 'Civil Engineer', location: 'Dubai, UAE', salary: '5000 AED', status: 'Active' },
                { id: 3, title: 'Home Nurse (Female)', location: 'Kuwait City', salary: '450 KD', status: 'Closed' },
                { id: 4, title: 'Electrician', location: 'Doha, Qatar', salary: '1800 QAR + Food', status: 'Active' },
                { id: 5, title: 'Restaurant Manager', location: 'Manama, Bahrain', salary: '350 BD', status: 'Active' }
            ];
            localStorage.setItem('riziq_jobs', JSON.stringify(initialJobs));
        }

        // Blogs
        const blogs = JSON.parse(localStorage.getItem('riziq_blogs') || '[]');
        if (blogs.length < 2) {
            const initialBlogs = [
                { id: 1, title: 'How to Ace Your Gulf Interview', date: '2024-12-10', views: 125, content: 'Tips for interviews...' },
                { id: 2, title: 'Top 5 Skills for Overseas Jobs', date: '2024-12-05', views: 98, content: 'Skills needed...' },
                { id: 3, title: 'Visa Process for UAE Explained', date: '2024-11-20', views: 245, content: 'Visa guide...' }
            ];
            localStorage.setItem('riziq_blogs', JSON.stringify(initialBlogs));
        }

        // Testimonials
        const testims = JSON.parse(localStorage.getItem('riziq_testimonials') || '[]');
        if (testims.length < 2) {
            const initialTestims = [
                { id: 1, name: 'Aamir Khan', role: 'Software Engineer', text: 'Riziq International helped me find my dream job in Dubai. The process was smooth and transparent.', rating: 5, status: 'Active' },
                { id: 2, name: 'Sana Mir', role: 'Nurse, Germany', text: 'Highly professional team. They guided me throughout the visa process.', rating: 5, status: 'Active' },
                { id: 3, name: 'Rahul Sharma', role: 'HVAC Technician', text: 'Got my visa in just 20 days. Best consultancy in Kashmir!', rating: 4, status: 'Active' }
            ];
            localStorage.setItem('riziq_testimonials', JSON.stringify(initialTestims));
        }

        // Applications (Detailed)
        const apps = JSON.parse(localStorage.getItem('riziq_applications') || '[]');
        if (apps.length < 3) {
            const initialApps = [
                {
                    id: 1702371000000,
                    fullName: 'Mohammad Altaf',
                    email: 'altaf.m@example.com',
                    phone: '+91 7001234567',
                    age: 28,
                    height: "5'10\"",
                    gender: 'Male',
                    qualification: 'graduate',
                    experience: '3-5',
                    country: 'Saudi Arabia',
                    jobType: 'Skilled Position',
                    skills: 'Heavy Driving, Vehicle Maintenance, English Basic',
                    appliedAt: '2024-12-12T10:30:00.000Z',
                    status: 'New',
                    cv: 'resume_altaf.pdf'
                },
                {
                    id: 1702372000000,
                    fullName: 'Fatima Zehra',
                    email: 'fatima.z@test.com',
                    phone: '+91 9906123456',
                    age: 24,
                    height: "5'4\"",
                    gender: 'Female',
                    qualification: 'diploma',
                    experience: '1-2',
                    country: 'UAE',
                    jobType: 'Skilled Position',
                    skills: 'Patient Care, ICU Management, First Aid',
                    appliedAt: '2024-12-11T14:20:00.000Z',
                    status: 'Viewed',
                    cv: 'cv_fatima.docx'
                },
                {
                    id: 1702373000000,
                    fullName: 'Ishfaq Ahmad',
                    email: 'ishfaq.c@example.com',
                    phone: '+91 7889123456',
                    age: 32,
                    height: "6'0\"",
                    gender: 'Male',
                    qualification: 'professional',
                    experience: '6-10',
                    country: 'Qatar',
                    jobType: 'Skilled Position',
                    skills: 'Civil Engineering, AutoCAD, Project Management',
                    appliedAt: '2024-12-10T09:15:00.000Z',
                    status: 'Pending',
                    cv: 'portfolio_ishfaq.pdf'
                },
                {
                    id: 1702374000000,
                    fullName: 'Bilal Wani',
                    email: 'bilal.w@example.com',
                    phone: '+91 6005123456',
                    age: 22,
                    height: "5'8\"",
                    gender: 'Male',
                    qualification: '12th',
                    experience: 'fresher',
                    country: 'Any Country',
                    jobType: 'Unskilled Position',
                    skills: 'Hardworking, Quick Learner',
                    appliedAt: '2024-12-09T16:45:00.000Z',
                    status: 'New',
                    cv: null
                }
            ];
            localStorage.setItem('riziq_applications', JSON.stringify(initialApps));
        }

        // Messages
        const msgs = JSON.parse(localStorage.getItem('riziq_messages') || '[]');
        if (msgs.length < 2) {
            const initialMsgs = [
                { id: 1, name: 'Zahoor Ahmad', email: 'zahoor@gmail.com', phone: '+91 9999999999', subject: 'Visa Enquiry', message: 'I want to know about the current visa processing time for Saudi Arabia.', receivedAt: '2024-12-12T11:00:00.000Z', status: 'Unread' },
                { id: 2, name: 'Priya Sethi', email: 'priya@yahoo.com', phone: '+91 8888888888', subject: 'Partnership', message: 'We are a recruitment agency in Delhi, looking to partner with you.', receivedAt: '2024-12-10T14:30:00.000Z', status: 'Read' }
            ];
            localStorage.setItem('riziq_messages', JSON.stringify(initialMsgs));
        }
    },

    // 6. Page Specific Rendering
    renderPageContent: function () {
        if (this.currentPage.includes('jobs')) {
            this.renderJobs();
            this.setupJobModal();
        } else if (this.currentPage.includes('blogs')) {
            this.renderBlogs();
            this.setupBlogModal();
        } else if (this.currentPage.includes('testimonials')) {
            this.renderTestimonials();
            this.setupTestimonialModal();
        } else if (this.currentPage.includes('notifications')) {
            this.renderNotifications();
            this.setupNotificationModal();
        } else if (this.currentPage.includes('messages')) {
            this.renderMessages();
        } else if (this.currentPage.includes('applications')) {
            this.renderApplications();
            this.setupApplicationModal();
        } else if (this.currentPage === 'index.html' || this.currentPage === '') {
            this.renderDashboardStats();
        }
    },

    // --- APPLICATIONS FUNCTIONS ---
    renderApplications: function () {
        const tbody = document.getElementById('applicationsTableBody');
        if (!tbody) return;

        const apps = JSON.parse(localStorage.getItem('riziq_applications') || '[]');
        apps.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));

        if (apps.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 2rem;">No applications received yet.</td></tr>`;
            return;
        }

        tbody.innerHTML = apps.map(app => `
            <tr>
                <td>
                    <strong>${app.fullName}</strong>
                    <div style="font-size:0.8rem; color:var(--text-muted)">${app.email}</div>
                </td>
                <td>
                    ${app.jobType} <br/>
                    <small style="color:var(--secondary-color)">${app.country}</small>
                </td>
                <td>${app.experience}</td>
                <td>${new Date(app.appliedAt).toLocaleDateString()}</td>
                <td><span class="status-badge ${app.status === 'Pending' ? 'status-pending' : 'status-active'}">${app.status}</span></td>
                <td>
                    <button class="action-btn btn-edit" title="View Details" onclick="RiziqAdmin.viewApplication(${app.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn btn-delete" title="Delete" onclick="RiziqAdmin.deleteItem('riziq_applications', ${app.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    },

    viewApplication: function (id) {
        const apps = JSON.parse(localStorage.getItem('riziq_applications') || '[]');
        const app = apps.find(a => a.id === id);
        if (!app) return;

        this.currentViewApp = app; // Store for PDF generation

        const container = document.querySelector('.detail-grid');
        const cvElem = document.getElementById('cvFilename');
        const modal = document.getElementById('applicationModal');

        if (container) {
            // Using Table for better PDF structure
            container.innerHTML = `
                <table style="width: 100%; border-collapse: collapse; font-family: 'Inter', sans-serif;">
                    <tr style="background-color: #f9fafb;">
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; width: 40%; font-weight: 600; color: #374151;">Full Name</td>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #111827;">${app.fullName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151;">Contact Email</td>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #111827;">${app.email}</td>
                    </tr>
                    <tr style="background-color: #f9fafb;">
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151;">WhatsApp Number</td>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #111827;">${app.phone}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151;">Age</td>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #111827;">${app.age || 'N/A'}</td>
                    </tr>
                    <tr style="background-color: #f9fafb;">
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151;">Height</td>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #111827;">${app.height || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151;">Gender</td>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #111827;">${app.gender || 'N/A'}</td>
                    </tr>
                    <tr style="background-color: #f9fafb;">
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151;">Qualification</td>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #111827;">${app.qualification ? app.qualification.toUpperCase() : 'N/A'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151;">Experience</td>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #111827;">${app.experience}</td>
                    </tr>
                    <tr style="background-color: #f9fafb;">
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151;">Preferred Country</td>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #111827;">${app.country ? app.country.toUpperCase() : 'N/A'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151;">Applying For</td>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #111827;">${app.jobType}</td>
                    </tr>
                    <tr style="background-color: #f9fafb;">
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151; vertical-align: top;">Skills / Notes</td>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #111827;">${app.skills || 'None listed'}</td>
                    </tr>
                </table>
            `;

            // Override grid display for table
            container.style.display = 'block';
        }

        if (cvElem) {
            cvElem.innerHTML = app.cv ?
                `<span style="display:flex; align-items:center; gap:8px;"><i class="fas fa-file-pdf" style="color:#ef4444"></i> ${app.cv}</span>` :
                'No CV Uploaded';
        }

        // Show modal
        if (modal) modal.classList.add('active');

        // Update status to Viewed locally if it's new
        if (app.status === 'Pending' || app.status === 'New') {
            app.status = 'Viewed';
            localStorage.setItem('riziq_applications', JSON.stringify(apps));
            this.renderApplications();
        }
    },

    setupApplicationModal: function () {
        const modal = document.getElementById('applicationModal');
        if (modal) {
            modal.querySelectorAll('.close-modal, .close-modal-btn').forEach(btn => {
                btn.addEventListener('click', () => modal.classList.remove('active'));
            });
        }
    },

    downloadPDF: function () {
        if (!this.currentViewApp) return;

        const element = document.getElementById('applicationContent');
        const opt = {
            margin: 0.5,
            filename: `Application_${this.currentViewApp.fullName.replace(/\s+/g, '_')}_Riziq.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        // Use html2pdf library
        if (typeof html2pdf !== 'undefined') {
            html2pdf().set(opt).from(element).save();
        } else {
            alert('PDF Library not loaded. Please try again.');
        }
    },

    // --- MESSAGES / APPLICATIONS FUNCTIONS ---
    currentMsgFilter: 'all',

    filterMessages: function (type, btnElement) {
        this.currentMsgFilter = type;

        // Update UI
        document.querySelectorAll('.msg-filter-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.style.background = 'rgba(255,255,255,0.1)';
        });

        if (btnElement) {
            btnElement.classList.add('active');
            btnElement.style.background = 'var(--primary-color)';
        }

        this.renderMessages();
    },

    cycleStatus: function (type, id) {
        let key = '';
        let statuses = [];

        if (type === 'Application') {
            key = 'riziq_applications';
            statuses = ['New', 'Viewed', 'Shortlisted', 'Rejected'];
        } else {
            key = 'riziq_messages';
            statuses = ['Unread', 'Read', 'Replied'];
        }

        const items = JSON.parse(localStorage.getItem(key) || '[]');
        const item = items.find(x => x.id === id);

        if (item) {
            const currentIndex = statuses.indexOf(item.status);
            const nextIndex = (currentIndex + 1) % statuses.length;
            item.status = statuses[nextIndex];

            localStorage.setItem(key, JSON.stringify(items));

            // Re-render
            if (window.location.pathname.includes('applications')) {
                this.renderApplications();
            } else {
                this.renderMessages();
            }

            this.showToast(`Status updated to ${item.status}`);
        }
    },

    renderMessages: function () {
        const tbody = document.getElementById('messagesTableBody');
        if (!tbody) return;

        const apps = JSON.parse(localStorage.getItem('riziq_applications') || '[]');
        const msgs = JSON.parse(localStorage.getItem('riziq_messages') || '[]');

        // Normalize data for display
        let allItems = [
            ...apps.map(a => ({ ...a, type: 'Application', dateObs: new Date(a.appliedAt) })),
            ...msgs.map(m => ({ ...m, type: 'Contact', jobType: m.subject || 'Inquiry', cv: null, dateObs: new Date(m.receivedAt), fullName: m.name }))
        ].sort((a, b) => b.dateObs - a.dateObs);

        // Apply Filter
        if (this.currentMsgFilter !== 'all') {
            allItems = allItems.filter(item => item.type === this.currentMsgFilter);
        }

        if (allItems.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 2rem;">No items found for this filter.</td></tr>`;
            return;
        }

        tbody.innerHTML = allItems.map(item => `
            <tr>
                <td>
                    <strong>${item.fullName}</strong>
                    <div style="font-size:0.75rem;"><span class="status-badge" style="padding: 2px 6px; font-size: 0.7rem; background:${item.type === 'Application' ? 'var(--primary-color)' : 'var(--secondary-color)'}">${item.type}</span></div>
                </td>
                <td>
                    <div style="font-size:0.9rem">${item.email}</div>
                    <div style="font-size:0.8rem; color:var(--text-muted)">${item.phone}</div>
                </td>
                <td>
                    ${item.jobType || item.subject || 'General'}
                    <div style="font-size:0.8rem; color:var(--text-muted)">${item.country || '-'}</div>
                </td>
                <td>${item.dateObs.toLocaleDateString()}</td>
                <td>
                    <span 
                        class="status-badge ${item.status === 'New' || item.status === 'Unread' ? 'status-active' : 'status-pending'}" 
                        style="cursor:pointer; user-select:none;"
                        title="Click to change status"
                        onclick="RiziqAdmin.cycleStatus('${item.type}', ${item.id})"
                    >
                        ${item.status} <i class="fas fa-sync-alt" style="font-size:0.7em; margin-left:4px; opacity:0.7;"></i>
                    </span>
                </td>
                <td>
                    ${item.cv ?
                `<div style="font-size:0.85rem; display:flex; align-items:center; gap:5px;">
                            <i class="fas fa-file-pdf" style="color:var(--important)"></i> 
                            ${item.cv}
                        </div>` :
                '<span style="color:var(--text-muted); font-size:0.8rem;">-</span>'
            }
                </td>
                <td>
                    ${item.type === 'Application' ?
                `<button class="action-btn btn-edit" onclick="RiziqAdmin.viewApplication(${item.id})"><i class="fas fa-eye"></i></button>` :
                `<button class="action-btn btn-edit" onclick="alert('Message from ${item.fullName}:\\n${item.message}')"><i class="fas fa-eye"></i></button>`
            }
                    <button class="action-btn btn-delete" onclick="RiziqAdmin.deleteItem('${item.type === 'Application' ? 'riziq_applications' : 'riziq_messages'}', ${item.id})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `).join('');
    },

    // --- JOB FUNCTIONS ---
    renderJobs: function () {
        const tbody = document.getElementById('jobsTableBody');
        if (!tbody) return;

        const jobs = JSON.parse(localStorage.getItem('riziq_jobs') || '[]');
        tbody.innerHTML = jobs.map(job => `
            <tr>
                <td><strong>${job.title}</strong></td>
                <td>${job.location}</td>
                <td>${job.salary}</td>
                <td><span class="status-badge ${job.status === 'Active' ? 'status-active' : 'status-pending'}">${job.status}</span></td>
                <td>
                    <button class="action-btn btn-delete" onclick="RiziqAdmin.deleteItem('riziq_jobs', ${job.id})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `).join('');
    },

    setupJobModal: function () {
        const btn = document.querySelector('.btn-add');
        const modal = document.getElementById('addJobModal');
        const form = document.getElementById('addJobForm');

        if (btn && modal) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                modal.classList.add('active');
            });

            modal.querySelector('.close-modal').addEventListener('click', () => {
                modal.classList.remove('active');
            });
        }

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = {
                    title: form.title.value,
                    location: form.location.value,
                    salary: form.salary.value
                };
                this.addItem('riziq_jobs', formData);
                form.reset();
                this.closeModal('addJobModal');
            });
        }
    },

    // --- BLOG FUNCTIONS ---
    renderBlogs: function () {
        const tbody = document.getElementById('blogsTableBody');
        if (!tbody) return;

        const blogs = JSON.parse(localStorage.getItem('riziq_blogs') || '[]');
        tbody.innerHTML = blogs.map(blog => `
            <tr>
                <td><strong>${blog.title}</strong></td>
                <td>${blog.date}</td>
                <td>${blog.views || 0}</td>
                <td>
                    <button class="action-btn btn-delete" onclick="RiziqAdmin.deleteItem('riziq_blogs', ${blog.id})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `).join('');
    },

    setupBlogModal: function () {
        const form = document.getElementById('addBlogForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = {
                    title: form.title.value,
                    date: form.date.value,
                    content: form.content.value,
                    views: 0
                };
                this.addItem('riziq_blogs', formData);
                form.reset();
                this.closeModal('addBlogModal');
            });
        }
    },

    // --- TESTIMONIAL FUNCTIONS ---
    renderTestimonials: function () {
        const tbody = document.getElementById('testimonialsTableBody');
        if (!tbody) return;

        const testims = JSON.parse(localStorage.getItem('riziq_testimonials') || '[]');
        tbody.innerHTML = testims.map(t => `
            <tr>
                <td><strong>${t.name}</strong></td>
                <td>${t.role}</td>
                <td>${t.text.substring(0, 30)}...</td>
                <td style="color: var(--warning);">${'★'.repeat(t.rating)}</td>
                <td>
                    <button class="action-btn btn-delete" onclick="RiziqAdmin.deleteItem('riziq_testimonials', ${t.id})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `).join('');
    },

    setupTestimonialModal: function () {
        const form = document.getElementById('addTestimonialForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = {
                    name: form.name.value,
                    role: form.role.value,
                    text: form.text.value,
                    rating: parseInt(form.rating.value)
                };
                this.addItem('riziq_testimonials', formData);
                form.reset();
                this.closeModal('addTestimonialModal');
            });
        }
    },

    // --- NOTIFICATION FUNCTIONS ---
    renderNotifications: function () {
        const tbody = document.getElementById('notifTableBody');
        if (!tbody) return;

        const notifs = JSON.parse(localStorage.getItem('riziq_notifications') || '[]');
        tbody.innerHTML = notifs.map(n => `
            <tr>
                <td><strong>${n.title}</strong></td>
                <td>${n.message.substring(0, 30)}...</td>
                <td>${new Date(n.id).toLocaleDateString()}</td>
                <td><span class="status-badge status-active">Sent</span></td>
                <td>
                    <button class="action-btn btn-delete" onclick="RiziqAdmin.deleteItem('riziq_notifications', ${n.id})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `).join('');
    },

    setupNotificationModal: function () {
        const form = document.getElementById('addNotifForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = {
                    title: form.title.value,
                    message: form.message.value,
                    type: form.type.value
                };
                this.addItem('riziq_notifications', formData);
                form.reset();
                this.closeModal('addNotifModal');
            });
        }
    },

    // --- GENERIC CRUD ---
    addItem: function (key, data) {
        const items = JSON.parse(localStorage.getItem(key) || '[]');
        const newItem = {
            id: Date.now(),
            ...data
        };
        items.push(newItem);
        localStorage.setItem(key, JSON.stringify(items));

        // Re-render based on key
        if (key === 'riziq_jobs') this.renderJobs();
        if (key === 'riziq_blogs') this.renderBlogs();
        if (key === 'riziq_testimonials') this.renderTestimonials();
        if (key === 'riziq_notifications') this.renderNotifications();
        if (key === 'riziq_applications') this.renderMessages();

        this.showToast('Item added successfully!');
    },

    deleteItem: function (key, id) {
        if (confirm('Are you sure you want to delete this?')) {
            let items = JSON.parse(localStorage.getItem(key) || '[]');
            items = items.filter(x => x.id !== id);
            localStorage.setItem(key, JSON.stringify(items));

            // Re-render based on key
            if (key === 'riziq_jobs') this.renderJobs();
            if (key === 'riziq_blogs') this.renderBlogs();
            if (key === 'riziq_testimonials') this.renderTestimonials();
            if (key === 'riziq_notifications') this.renderNotifications();
            if (key === 'riziq_applications') this.renderMessages();

            this.showToast('Item deleted!');
        }
    },

    closeModal: function (id) {
        const m = document.getElementById(id);
        if (m) m.classList.remove('active');
    },

    // --- DASHBOARD FUNCTIONS ---
    renderDashboardStats: function () {
        // Update mock numbers based on data
        const jobs = JSON.parse(localStorage.getItem('riziq_jobs') || '[]');
        const blogs = JSON.parse(localStorage.getItem('riziq_blogs') || '[]');
        const el = document.getElementById('totalJobsCount');
        if (el) el.textContent = jobs.length;
    },

    // --- UTILS ---
    showToast: function (msg) {
        alert(msg);
    }
};

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
    RiziqAdmin.init();

    // Real-time update simulation
    window.addEventListener('storage', (e) => {
        if (e.key === 'riziq_applications' && window.location.pathname.includes('applications')) {
            RiziqAdmin.renderApplications();
            RiziqAdmin.showToast('New application received!');
        } else if (e.key === 'riziq_messages' && window.location.pathname.includes('messages')) {
            RiziqAdmin.renderMessages();
            RiziqAdmin.showToast('New message received!');
        }
    });
});

// Expose to window for inline onclicks
window.RiziqAdmin = RiziqAdmin;
