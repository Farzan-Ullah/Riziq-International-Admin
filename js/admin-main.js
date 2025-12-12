/* ========================================
   RIZIQ ADMIN - MAIN CONTROL
   ======================================== */

const RiziqAdmin = {
    // Current Page Detection
    currentPage: window.location.pathname.split("/").pop(),

    // Init
    init: function () {
        this.checkAuth();
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

    // 5. Seed Initial Data (If Empty)
    seedData: function () {
        if (!localStorage.getItem('riziq_jobs')) {
            const initialJobs = [
                { id: 1, title: 'Heavy Driver', location: 'Saudi Arabia', salary: '2500 SAR', status: 'Active' },
                { id: 2, title: 'Civil Engineer', location: 'Dubai, UAE', salary: '5000 AED', status: 'Active' },
                { id: 3, title: 'Nurse (Female)', location: 'Kuwait', salary: '450 KD', status: 'Closed' }
            ];
            localStorage.setItem('riziq_jobs', JSON.stringify(initialJobs));
        }

        if (!localStorage.getItem('riziq_blogs')) {
            const initialBlogs = [
                { id: 1, title: 'How to Ace Your Gulf Interview', date: '2024-12-10', views: 125 },
                { id: 2, title: 'Top 5 Skills for Overseas Jobs', date: '2024-12-05', views: 98 }
            ];
            localStorage.setItem('riziq_blogs', JSON.stringify(initialBlogs));
        }

        if (!localStorage.getItem('riziq_testimonials')) {
            const initialTestims = [
                { id: 1, name: 'Aamir Khan', role: 'Software Engineer', text: 'Great services...', rating: 5, status: 'Active' },
                { id: 2, name: 'Sana Mir', role: 'Nurse, Germany', text: 'Highly recommended!', rating: 5, status: 'Active' }
            ];
            localStorage.setItem('riziq_testimonials', JSON.stringify(initialTestims));
        }

        if (!localStorage.getItem('riziq_applications')) {
            const initialApps = [
                { id: 1702371000000, fullName: 'John Doe', email: 'john@example.com', phone: '+91 9876543210', country: 'Saudi Arabia', jobType: 'Skilled', appliedAt: '2024-12-12T10:30:00.000Z', status: 'New', cv: 'resume_john.pdf' },
                { id: 1702372000000, fullName: 'Fatima Ali', email: 'fatima@test.com', phone: '+971 501234567', country: 'UAE', jobType: 'Medical', appliedAt: '2024-12-11T14:20:00.000Z', status: 'Viewed', cv: 'cv_fatima.docx' }
            ];
            localStorage.setItem('riziq_applications', JSON.stringify(initialApps));
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
        } else if (this.currentPage === 'index.html' || this.currentPage === '') {
            this.renderDashboardStats();
        }
    },

    // --- MESSAGES / APPLICATIONS FUNCTIONS ---
    renderMessages: function () {
        const tbody = document.getElementById('messagesTableBody');
        if (!tbody) return;

        const apps = JSON.parse(localStorage.getItem('riziq_applications') || '[]');
        const msgs = JSON.parse(localStorage.getItem('riziq_messages') || '[]');

        // Normalize data for display
        const allItems = [
            ...apps.map(a => ({ ...a, type: 'Application', dateObs: new Date(a.appliedAt) })),
            ...msgs.map(m => ({ ...m, type: 'Contact', jobType: m.subject, cv: null, dateObs: new Date(m.receivedAt), fullName: m.name }))
        ].sort((a, b) => b.dateObs - a.dateObs);

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
                <td><span class="status-badge ${item.status === 'New' || item.status === 'Unread' ? 'status-active' : 'status-pending'}">${item.status}</span></td>
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
                    <button class="action-btn btn-edit" onclick="alert('Viewing ${item.type}: ${item.fullName}\\nMessage/CV: ${item.message || item.cv || 'No details'}')"><i class="fas fa-eye"></i></button>
                    <!-- Note: Delete currently requires Key. For unified view, better specific delete or generic ID lookup. 
                         For demo optimization, we will delete from Applications if it has CV, else Messages -->
                    <button class="action-btn btn-delete" onclick="RiziqAdmin.deleteItem('${item.type === 'Application' ? 'riziq_applications' : 'riziq_messages'}', ${item.id})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `).join('');

        if (allItems.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 2rem;">No messages or applications found.</td></tr>`;
        }
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
});

// Expose to window for inline onclicks
window.RiziqAdmin = RiziqAdmin;
