document.addEventListener("DOMContentLoaded", () => {
    const TASK_STORAGE_KEY = "devboard_tasks_v1";
    const PROFILE_STORAGE_KEY = "devboard_profile_v1";
    const ACTIVITY_STORAGE_KEY = "devboard_activity_v1";

    const taskList = document.getElementById("taskList");
    const addTaskButton = document.getElementById("addTaskButton");
    const addTaskLink = document.getElementById("addTaskLink");
    const clearCompletedButton = document.getElementById("clearCompleted");

    const taskModal = document.getElementById("taskModal");
    const modalOverlay = document.getElementById("modalOverlay");
    const modalClose = document.getElementById("modalClose");
    const taskForm = document.getElementById("taskForm");
    const taskInput = document.getElementById("taskInput");
    const taskPriority = document.getElementById("taskPriority");

    const projectCount = document.getElementById("projectCount");
    const taskCount = document.getElementById("taskCount");
    const completedCount = document.getElementById("completedCount");
    const productivity = document.getElementById("productivity");

    const progressLabel = document.querySelector(".progress-label");
    const progressBar = document.querySelector(".progress-bar span");

    const menuToggle = document.getElementById("menuToggle");
    const mainNavigation = document.getElementById("mainNavigation");

    let tasks = [];
    let profile = {
        username: "",
        company: ""
    };

    let activities = [];

    /* =========================================
       LOCAL STORAGE HELPERS
    ========================================= */

    function saveTasks() {
        localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(tasks));
    }

    function loadTasks() {
        const savedTasks = localStorage.getItem(TASK_STORAGE_KEY);

        if (savedTasks) {
            try {
                const parsedTasks = JSON.parse(savedTasks);

                if (Array.isArray(parsedTasks)) {
                    tasks = parsedTasks;
                    return;
                }
            } catch (error) {
                console.error("Could not load saved tasks:", error);
            }
        }

        tasks = readTasksFromHTML();
        saveTasks();
    }

    function readTasksFromHTML() {
        if (!taskList) {
            return [];
        }

        const existingItems = Array.from(
            taskList.querySelectorAll(".task-item")
        );

        return existingItems.map((item, index) => {
            const checkbox = item.querySelector('input[type="checkbox"]');
            const textElement = item.querySelector(".task-text");
            const priorityElement = item.querySelector(".task-tag");

            let priority = "medium";

            if (priorityElement) {
                const priorityText = priorityElement.textContent
                    .trim()
                    .toLowerCase();

                if (priorityText.includes("high")) {
                    priority = "high";
                } else if (priorityText.includes("low")) {
                    priority = "low";
                }
            }

            return {
                id: `task_${Date.now()}_${index}`,
                text: textElement
                    ? textElement.textContent.trim()
                    : "Untitled task",
                priority: priority,
                completed: checkbox ? checkbox.checked : false,
                createdAt: Date.now()
            };
        });
    }

    function saveProfile() {
        localStorage.setItem(
            PROFILE_STORAGE_KEY,
            JSON.stringify(profile)
        );
    }

    function loadProfile() {
        const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);

        if (!savedProfile) {
            return;
        }

        try {
            const parsedProfile = JSON.parse(savedProfile);

            if (parsedProfile && typeof parsedProfile === "object") {
                profile.username = parsedProfile.username || "";
                profile.company = parsedProfile.company || "";
            }
        } catch (error) {
            console.error("Could not load profile:", error);
        }
    }

    function saveActivities() {
        localStorage.setItem(
            ACTIVITY_STORAGE_KEY,
            JSON.stringify(activities)
        );
    }

    function loadActivities() {
        const savedActivities = localStorage.getItem(
            ACTIVITY_STORAGE_KEY
        );

        if (savedActivities) {
            try {
                const parsedActivities = JSON.parse(savedActivities);

                if (Array.isArray(parsedActivities)) {
                    activities = parsedActivities;
                    return;
                }
            } catch (error) {
                console.error("Could not load activities:", error);
            }
        }

        activities = [];
        saveActivities();
    }

    /* =========================================
       TASK FUNCTIONS
    ========================================= */

    function getPriorityLabel(priority) {
        if (priority === "high") {
            return "High";
        }

        if (priority === "low") {
            return "Low";
        }

        return "Medium";
    }

    function renderTasks() {
        if (!taskList) {
            return;
        }

        taskList.innerHTML = "";

        if (tasks.length === 0) {
            const emptyState = document.createElement("div");

            emptyState.className = "empty-task-state";
            emptyState.textContent =
                "No tasks yet. Add your first task to get started.";

            taskList.appendChild(emptyState);

            updateStats();
            return;
        }

        tasks.forEach((task) => {
            const taskItem = document.createElement("label");

            taskItem.className = "task-item";

            if (task.completed) {
                taskItem.classList.add("completed-task");
            }

            const checkbox = document.createElement("input");

            checkbox.type = "checkbox";
            checkbox.checked = task.completed;

            const checkmark = document.createElement("span");

            checkmark.className = "checkmark";

            const taskContent = document.createElement("span");

            taskContent.className = "task-content";

            const taskText = document.createElement("span");

            taskText.className = "task-text";
            taskText.textContent = task.text;

            const taskTag = document.createElement("span");

            taskTag.className = "task-tag";
            taskTag.textContent = getPriorityLabel(task.priority);

            taskContent.appendChild(taskText);
            taskContent.appendChild(taskTag);

            taskItem.appendChild(checkbox);
            taskItem.appendChild(checkmark);
            taskItem.appendChild(taskContent);

            checkbox.addEventListener("change", () => {
                const targetTask = tasks.find(
                    (item) => item.id === task.id
                );

                if (!targetTask) {
                    return;
                }

                targetTask.completed = checkbox.checked;

                if (targetTask.completed) {
                    taskItem.classList.add("completed-task");

                    addActivity(
                        "✓",
                        "green-bg",
                        "Task completed",
                        `"${targetTask.text}" was completed.`
                    );
                } else {
                    taskItem.classList.remove("completed-task");

                    addActivity(
                        "↻",
                        "blue-bg",
                        "Task reopened",
                        `"${targetTask.text}" was marked as incomplete.`
                    );
                }

                saveTasks();
                updateStats();
            });

            taskList.appendChild(taskItem);
        });

        updateStats();
    }

    function addTask(text, priority) {
        const cleanText = text.trim();

        if (!cleanText) {
            return;
        }

        const newTask = {
            id: `task_${Date.now()}_${Math.random()
                .toString(36)
                .slice(2, 8)}`,
            text: cleanText,
            priority: priority || "medium",
            completed: false,
            createdAt: Date.now()
        };

        tasks.push(newTask);

        saveTasks();
        renderTasks();

        addActivity(
            "+",
            "blue-bg",
            "New task added",
            `"${cleanText}" was added to your task list.`
        );
    }

    function updateStats() {
        const totalTasks = tasks.length;

        const completedTasks = tasks.filter(
            (task) => task.completed
        ).length;

        let completionPercentage = 0;

        if (totalTasks > 0) {
            completionPercentage = Math.round(
                (completedTasks / totalTasks) * 100
            );
        }

        if (taskCount) {
            taskCount.textContent = totalTasks;
        }

        if (completedCount) {
            completedCount.textContent = completedTasks;
        }

        if (productivity) {
            productivity.textContent = `${completionPercentage}%`;
        }

        if (progressBar) {
            progressBar.style.width = `${completionPercentage}%`;
        }

        if (progressLabel) {
            progressLabel.textContent =
                `${completedTasks} of ${totalTasks} tasks completed`;
        }
    }

    /* =========================================
       TASK MODAL
    ========================================= */

    function openTaskModal() {
        if (!taskModal) {
            return;
        }

        taskModal.setAttribute("aria-hidden", "false");
        taskModal.classList.add("active");

        if (taskInput) {
            setTimeout(() => {
                taskInput.focus();
            }, 100);
        }
    }

    function closeTaskModal() {
        if (!taskModal) {
            return;
        }

        taskModal.setAttribute("aria-hidden", "true");
        taskModal.classList.remove("active");

        if (taskForm) {
            taskForm.reset();
        }
    }

    if (addTaskButton) {
        addTaskButton.addEventListener("click", openTaskModal);
    }

    if (addTaskLink) {
        addTaskLink.addEventListener("click", openTaskModal);
    }

    if (modalClose) {
        modalClose.addEventListener("click", closeTaskModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener("click", closeTaskModal);
    }

    if (taskForm) {
        taskForm.addEventListener("submit", (event) => {
            event.preventDefault();

            if (!taskInput) {
                return;
            }

            const text = taskInput.value.trim();

            if (!text) {
                taskInput.focus();
                return;
            }

            addTask(
                text,
                taskPriority ? taskPriority.value : "medium"
            );

            closeTaskModal();
        });
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeTaskModal();
            closeProfileModal();
        }
    });

    /* =========================================
       CLEAR COMPLETED TASKS
    ========================================= */

    if (clearCompletedButton) {
        clearCompletedButton.addEventListener("click", () => {
            const completedTasks = tasks.filter(
                (task) => task.completed
            );

            if (completedTasks.length === 0) {
                return;
            }

            tasks = tasks.filter(
                (task) => !task.completed
            );

            saveTasks();
            renderTasks();

            addActivity(
                "✓",
                "green-bg",
                "Completed tasks cleared",
                `${completedTasks.length} completed task${
                    completedTasks.length === 1 ? "" : "s"
                } removed from the dashboard.`
            );
        });
    }

    /* =========================================
       MOBILE NAVIGATION
    ========================================= */

    if (menuToggle && mainNavigation) {
        menuToggle.addEventListener("click", () => {
            mainNavigation.classList.toggle("active");
            menuToggle.classList.toggle("active");
        });

        const navigationLinks =
            mainNavigation.querySelectorAll("a");

        navigationLinks.forEach((link) => {
            link.addEventListener("click", () => {
                mainNavigation.classList.remove("active");
                menuToggle.classList.remove("active");
            });
        });
    }

    /* =========================================
       PROFILE UI
    ========================================= */

    function createProfileUI() {
        const headerActions =
            document.querySelector(".header-actions");

        if (!headerActions) {
            return;
        }

        if (document.getElementById("profileButton")) {
            return;
        }

        const profileButton = document.createElement("button");

        profileButton.type = "button";
        profileButton.id = "profileButton";
        profileButton.className = "profile-button";
        profileButton.innerHTML = `
            <span class="profile-avatar">U</span>
            <span class="profile-name">Profile</span>
        `;

        headerActions.insertBefore(
            profileButton,
            headerActions.firstChild
        );

        profileButton.addEventListener(
            "click",
            openProfileModal
        );

        updateProfileDisplay();

        createProfileModal();
    }

    function createProfileModal() {
        if (document.getElementById("profileModal")) {
            return;
        }

        const modal = document.createElement("div");

        modal.id = "profileModal";
        modal.className = "profile-modal";
        modal.setAttribute("aria-hidden", "true");

        modal.innerHTML = `
            <div class="profile-modal-overlay" id="profileModalOverlay"></div>

            <div class="profile-modal-content" role="dialog" aria-modal="true">
                <button
                    type="button"
                    class="profile-modal-close"
                    id="profileModalClose"
                    aria-label="Close profile"
                >
                    ×
                </button>

                <div class="profile-heading">
                    <div class="large-profile-avatar" id="profileAvatarPreview">
                        U
                    </div>

                    <div>
                        <h2>Your Profile</h2>
                        <p>Set your developer workspace identity.</p>
                    </div>
                </div>

                <form id="profileForm">
                    <div class="profile-field">
                        <label for="profileUsername">
                            Username
                        </label>

                        <input
                            type="text"
                            id="profileUsername"
                            placeholder="e.g. Areeba"
                            maxlength="50"
                            autocomplete="name"
                        />
                    </div>

                    <div class="profile-field">
                        <label for="profileCompany">
                            Company / Organization
                        </label>

                        <input
                            type="text"
                            id="profileCompany"
                            placeholder="e.g. My Development Team"
                            maxlength="80"
                            autocomplete="organization"
                        />
                    </div>

                    <button
                        type="submit"
                        class="profile-save-button"
                    >
                        Save Profile
                    </button>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        addProfileStyles();

        const profileForm =
            document.getElementById("profileForm");

        const profileModalClose =
            document.getElementById("profileModalClose");

        const profileModalOverlay =
            document.getElementById("profileModalOverlay");

        if (profileForm) {
            profileForm.addEventListener("submit", (event) => {
                event.preventDefault();

                const usernameInput =
                    document.getElementById("profileUsername");

                const companyInput =
                    document.getElementById("profileCompany");

                profile.username = usernameInput
                    ? usernameInput.value.trim()
                    : "";

                profile.company = companyInput
                    ? companyInput.value.trim()
                    : "";

                saveProfile();
                updateProfileDisplay();

                addActivity(
                    "👤",
                    "purple-bg",
                    "Profile updated",
                    profile.username
                        ? `Profile saved for ${profile.username}.`
                        : "Your developer profile was updated."
                );

                closeProfileModal();
            });
        }

        if (profileModalClose) {
            profileModalClose.addEventListener(
                "click",
                closeProfileModal
            );
        }

        if (profileModalOverlay) {
            profileModalOverlay.addEventListener(
                "click",
                closeProfileModal
            );
        }
    }

    function openProfileModal() {
        const modal =
            document.getElementById("profileModal");

        if (!modal) {
            return;
        }

        const usernameInput =
            document.getElementById("profileUsername");

        const companyInput =
            document.getElementById("profileCompany");

        if (usernameInput) {
            usernameInput.value = profile.username;
        }

        if (companyInput) {
            companyInput.value = profile.company;
        }

        updateProfileAvatar();

        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");

        if (usernameInput) {
            setTimeout(() => {
                usernameInput.focus();
            }, 100);
        }
    }

    function closeProfileModal() {
        const modal =
            document.getElementById("profileModal");

        if (!modal) {
            return;
        }

        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");
    }

    function updateProfileDisplay() {
        const profileButton =
            document.getElementById("profileButton");

        if (!profileButton) {
            return;
        }

        const avatar =
            profileButton.querySelector(".profile-avatar");

        const name =
            profileButton.querySelector(".profile-name");

        const displayName =
            profile.username || "Profile";

        if (name) {
            name.textContent = displayName;
        }

        if (avatar) {
            avatar.textContent =
                profile.username
                    ? profile.username
                        .charAt(0)
                        .toUpperCase()
                    : "U";
        }

        updateProfileAvatar();
    }

    function updateProfileAvatar() {
        const avatar =
            document.getElementById("profileAvatarPreview");

        if (!avatar) {
            return;
        }

        avatar.textContent =
            profile.username
                ? profile.username
                    .charAt(0)
                    .toUpperCase()
                : "U";
    }

    /* =========================================
       PROFILE STYLES
    ========================================= */

    function addProfileStyles() {
        if (document.getElementById("devboardProfileStyles")) {
            return;
        }

        const style = document.createElement("style");

        style.id = "devboardProfileStyles";

        style.textContent = `
            .profile-button {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                border: 1px solid rgba(255,255,255,0.12);
                background: rgba(255,255,255,0.04);
                color: inherit;
                padding: 7px 11px;
                border-radius: 10px;
                cursor: pointer;
                font: inherit;
            }

            .profile-button:hover {
                background: rgba(255,255,255,0.08);
            }

            .profile-avatar,
            .large-profile-avatar {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                font-weight: 700;
            }

            .profile-avatar {
                width: 30px;
                height: 30px;
                font-size: 13px;
                background: rgba(255,255,255,0.12);
            }

            .profile-modal {
                position: fixed;
                inset: 0;
                display: none;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                padding: 20px;
            }

            .profile-modal.active {
                display: flex;
            }

            .profile-modal-overlay {
                position: absolute;
                inset: 0;
                background: rgba(0,0,0,0.65);
                backdrop-filter: blur(5px);
            }

            .profile-modal-content {
                position: relative;
                width: min(440px, 100%);
                padding: 28px;
                border-radius: 18px;
                background: #151515;
                border: 1px solid rgba(255,255,255,0.12);
                box-shadow: 0 24px 70px rgba(0,0,0,0.45);
                z-index: 1;
            }

            .profile-modal-close {
                position: absolute;
                top: 12px;
                right: 14px;
                border: 0;
                background: transparent;
                color: inherit;
                font-size: 28px;
                cursor: pointer;
                opacity: 0.75;
            }

            .profile-heading {
                display: flex;
                align-items: center;
                gap: 14px;
                margin-bottom: 24px;
            }

            .large-profile-avatar {
                width: 52px;
                height: 52px;
                flex-shrink: 0;
                font-size: 20px;
                background: rgba(255,255,255,0.10);
            }

            .profile-heading h2 {
                margin: 0 0 4px;
            }

            .profile-heading p {
                margin: 0;
                opacity: 0.65;
                font-size: 14px;
            }

            .profile-field {
                margin-bottom: 18px;
            }

            .profile-field label {
                display: block;
                margin-bottom: 7px;
                font-size: 14px;
                font-weight: 600;
            }

            .profile-field input {
                width: 100%;
                box-sizing: border-box;
                padding: 12px 13px;
                border-radius: 10px;
                border: 1px solid rgba(255,255,255,0.12);
                background: rgba(255,255,255,0.05);
                color: inherit;
                outline: none;
                font: inherit;
            }

            .profile-field input:focus {
                border-color: rgba(255,255,255,0.35);
            }

            .profile-save-button {
                width: 100%;
                padding: 12px 16px;
                border: 0;
                border-radius: 10px;
                cursor: pointer;
                font: inherit;
                font-weight: 700;
                background: rgba(255,255,255,0.12);
                color: inherit;
            }

            .profile-save-button:hover {
                background: rgba(255,255,255,0.18);
            }

            .empty-task-state {
                padding: 25px 10px;
                text-align: center;
                opacity: 0.6;
            }

            @media (max-width: 600px) {
                .profile-name {
                    display: none;
                }

                .profile-modal-content {
                    padding: 22px;
                }
            }
        `;

        document.head.appendChild(style);
    }

    /* =========================================
       ACTIVITY
    ========================================= */

    function addActivity(
        icon,
        iconClass,
        title,
        description
    ) {
        const activity = {
            id: `activity_${Date.now()}_${Math.random()
                .toString(36)
                .slice(2, 7)}`,
            icon: icon,
            iconClass: iconClass,
            title: title,
            description: description,
            timestamp: Date.now()
        };

        activities.unshift(activity);

        if (activities.length > 20) {
            activities = activities.slice(0, 20);
        }

        saveActivities();
        renderActivities();
    }

    function formatActivityTime(timestamp) {
        const difference =
            Date.now() - timestamp;

        const seconds =
            Math.floor(difference / 1000);

        if (seconds < 60) {
            return "Just now";
        }

        const minutes =
            Math.floor(seconds / 60);

        if (minutes < 60) {
            return `${minutes} minute${
                minutes === 1 ? "" : "s"
            } ago`;
        }

        const hours =
            Math.floor(minutes / 60);

        if (hours < 24) {
            return `${hours} hour${
                hours === 1 ? "" : "s"
            } ago`;
        }

        const days =
            Math.floor(hours / 24);

        if (days === 1) {
            return "Yesterday";
        }

        return new Date(timestamp).toLocaleDateString();
    }

    function renderActivities() {
        const activityGrid =
            document.querySelector(".activity-grid");

        if (!activityGrid) {
            return;
        }

        activityGrid.innerHTML = "";

        if (activities.length === 0) {
            const emptyActivity =
                document.createElement("div");

            emptyActivity.className = "activity-card";

            emptyActivity.innerHTML = `
                <div class="activity-icon blue-bg">i</div>
                <div>
                    <h3>No activity yet</h3>
                    <p>Your recent DevBoard activity will appear here.</p>
                    <span>Just now</span>
                </div>
            `;

            activityGrid.appendChild(emptyActivity);
            return;
        }

        activities.forEach((activity) => {
            const card =
                document.createElement("div");

            card.className = "activity-card";

            card.innerHTML = `
                <div class="activity-icon ${activity.iconClass}">
                    ${activity.icon}
                </div>

                <div>
                    <h3>${escapeHTML(activity.title)}</h3>
                    <p>${escapeHTML(activity.description)}</p>
                    <span>${formatActivityTime(
                        activity.timestamp
                    )}</span>
                </div>
            `;

            activityGrid.appendChild(card);
        });
    }

    function escapeHTML(value) {
        const div = document.createElement("div");

        div.textContent = value;

        return div.innerHTML;
    }

    /* =========================================
       INITIALIZATION
    ========================================= */

    loadTasks();
    loadProfile();
    loadActivities();

    renderTasks();
    createProfileUI();
    renderActivities();
    updateStats();
});