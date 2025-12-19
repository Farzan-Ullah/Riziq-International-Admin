/* ========================================
   RIZIQ ADMIN - MAIN CONTROL
   ======================================== */

   let currentAdminUser = null;

firebase.auth().onAuthStateChanged(async (user) => {
  const isLoginPage = window.location.pathname.includes("login.html");

  if (!user) {
    if (!isLoginPage) window.location.href = "login.html";
    return;
  }

  const token = await user.getIdTokenResult();

  if (!token.claims.admin) {
    alert("Access denied: Not an admin");
    await firebase.auth().signOut();
    window.location.href = "login.html";
    return;
  }

  // ✅ Admin verified
  currentAdminUser = user;

  // If admin is on login page → redirect to dashboard
  if (isLoginPage) {
    window.location.href = "applications.html";
  }
});

const RiziqAdmin = {
    // Current Page Detection
    currentPage: window.location.pathname.split("/").pop(),


    

    // Init
init: function () {
    this.setupSidebar();
    this.setupLogout();

    const page = window.location.pathname;

    if (page.includes("applications")) {
        this.renderApplications();
        this.setupApplicationModal();
    }

  if (page.includes("jobs")) {
    this.renderJobs();
    this.setupJobModal(); // ✅ REQUIRED
}

    if (page.includes("blogs")) {
        this.renderBlogs();
    }

    if (page.includes("testimonials")) {
        this.renderTestimonials();
    }

    if (page.includes("messages")) {
        this.renderMessages();
    }
},
    // 3. Logout
 setupLogout: function () {
    const logoutBtn = document.getElementById("logoutBtn");
    if (!logoutBtn) return;

    logoutBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        try {
            await firebase.auth().signOut();
            window.location.href = "login.html";
        } catch (err) {
            alert("Logout failed");
            console.error(err);
        }
    });
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

   

    // --- APPLICATIONS FUNCTIONS ---
  renderApplications: async function () {
  const tbody = document.getElementById("applicationsTableBody");
  if (!tbody) return;

  try {
    const snap = await db
      .collection("applications")
      .orderBy("createdAt", "desc")
      .get();

    if (snap.empty) {
      tbody.innerHTML = `<tr>
        <td colspan="6" style="text-align:center;padding:2rem;">
          No applications yet
        </td>
      </tr>`;
      return;
    }

    tbody.innerHTML = snap.docs.map(doc => {
      const app = doc.data();
      return `
        <tr>
          <td>
            <strong>${app.fullName}</strong>
            <div style="font-size:0.8rem;color:#888">${app.email}</div>
          </td>
          <td>${app.jobTitle || "-"}<br><small>${app.country}</small></td>
          <td>${app.experience}</td>
          <td>${app.createdAt?.toDate().toLocaleDateString()}</td>
          <td>
            <span class="status-badge status-pending">
              ${app.status}
            </span>
          </td>
          <td>
            <button class="action-btn btn-edit"
              onclick="RiziqAdmin.viewApplication('${doc.id}')">
              <i class="fas fa-eye"></i>
            </button>
          </td>
        </tr>
      `;
    }).join("");

  } catch (err) {
    console.error(err);
    alert("Permission denied or admin not logged in");
  }
},


viewApplication: async function (id) {
  const doc = await db.collection("applications").doc(id).get();
  if (!doc.exists) return;

  const app = doc.data();
  this.currentViewApp = app;

  document.querySelector(".detail-grid").innerHTML = `
    <table style="width:100%">
      <tr><td><b>Name</b></td><td>${app.fullName}</td></tr>
      <tr><td><b>Email</b></td><td>${app.email}</td></tr>
      <tr><td><b>Phone</b></td><td>${app.phone}</td></tr>
      <tr><td><b>Country</b></td><td>${app.country}</td></tr>
      <tr><td><b>Experience</b></td><td>${app.experience}</td></tr>
    </table>
  `;

  document.getElementById("cvFilename").innerHTML =
    app.cvUrl
      ? `<a href="${app.cvUrl}" target="_blank">View CV</a>`
      : "No CV";

  document.getElementById("applicationModal").classList.add("active");
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
   renderJobs: async function () {
    const tbody = document.getElementById("jobsTableBody");
    if (!tbody) return;

    try {
        const snap = await db
            .collection("jobs")
            .orderBy("createdAt", "desc")
            .get();

        if (snap.empty) {
            tbody.innerHTML = `
              <tr>
                <td colspan="5" style="text-align:center;padding:2rem;">
                  No jobs added yet
                </td>
              </tr>`;
            return;
        }

        tbody.innerHTML = snap.docs.map(doc => {
            const job = doc.data();
            return `
              <tr>
                <td><strong>${job.title}</strong></td>
                <td>${job.location}</td>
                <td>${job.salary}</td>
                <td>
                  <span class="status-badge ${
                    job.status === "active" ? "status-active" : "status-pending"
                  }">
                    ${job.status}
                  </span>
                </td>
                <td>
                  <button class="action-btn btn-delete"
                    onclick="RiziqAdmin.deleteJob('${doc.id}')">
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            `;
        }).join("");

    } catch (err) {
        console.error(err);
        alert("Failed to load jobs");
    }
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
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const jobData = {
            title: form.title.value,
            location: form.location.value,
            salary: form.salary.value,
            status: "active",
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        try {
            await db.collection("jobs").add(jobData);
            form.reset();
            this.closeModal("addJobModal");
            this.renderJobs();
            this.showToast("Job published successfully!");
        } catch (err) {
            console.error(err);
            alert("Failed to publish job");
        }
    });
}
    },

    deleteJob: async function (jobId) {
    if (!confirm("Delete this job?")) return;

    try {
        await db.collection("jobs").doc(jobId).delete();
        this.renderJobs();
        this.showToast("Job deleted");
    } catch (err) {
        console.error(err);
        alert("Failed to delete job");
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
