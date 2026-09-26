document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menuToggle");
    const mainNavigation = document.getElementById("mainNavigation");

    const addTaskButton = document.getElementById("addTaskButton");
    const addTaskLink = document.getElementById("addTaskLink");

    const taskModal = document.getElementById("taskModal");
    const modalOverlay = document.getElementById("modalOverlay");
    const modalClose = document.getElementById("modalClose");

    const taskForm = document.getElementById("taskForm");
    const taskInput = document.getElementById("taskInput");
    const taskPriority = document.getElementById("taskPriority");

    const taskList = document.getElementById("taskList");
    const clearCompleted = document.getElementById("clearCompleted");

    const taskCount = document.getElementById("taskCount");
    const completedCount = document.getElementById("completedCount");

    const progressBar = document.querySelector(".progress-bar span");
    const progressLabel = document.querySelector(".progress-label");
    const heroProgress = document.querySelector(".hero-card strong");


    // MOBILE MENU
    if (menuToggle && mainNavigation) {
        menuToggle.addEventListener("click", () => {
            const isOpen = mainNavigation.classList.toggle("open");

            menuToggle.setAttribute("aria-expanded", String(isOpen));
            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Close navigation menu" : "Open navigation menu"
            );
        });

        mainNavigation.querySelectorAll(".nav-link").forEach((link) => {
            link.addEventListener("click", () => {
                mainNavigation.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute("aria-label", "Open navigation menu");
            });
        });
    }


    // MODAL
    function openModal() {
        if (!taskModal) return;

        taskModal.classList.add("active");
        taskModal.setAttribute("aria-hidden", "false");

        setTimeout(() => {
            if (taskInput) taskInput.focus();
        }, 100);
    }

    function closeModal() {
        if (!taskModal) return;

        taskModal.classList.remove("active");
        taskModal.setAttribute("aria-hidden", "true");

        if (taskForm) taskForm.reset();
        if (taskPriority) taskPriority.value = "medium";
    }

    if (addTaskButton) {
        addTaskButton.addEventListener("click", openModal);
    }

    if (addTaskLink) {
        addTaskLink.addEventListener("click", openModal);
    }

    if (modalClose) {
        modalClose.addEventListener("click", closeModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener("click", closeModal);
    }

    document.addEventListener("keydown", (event) => {
        if (
            event.key === "Escape" &&
            taskModal &&
            taskModal.classList.contains("active")
        ) {
            closeModal();
        }
    });


    // CREATE TASK
    if (taskForm) {
        taskForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const taskName = taskInput.value.trim();
            const priority = taskPriority.value;

            if (!taskName) return;

            createTask(taskName, priority);
            closeModal();
            updateStats();
        });
    }


    function createTask(taskName, priority) {
        const taskItem = document.createElement("label");

        taskItem.className = "task-item";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";

        const customCheckbox = document.createElement("span");
        customCheckbox.className = "custom-checkbox";

        const taskText = document.createElement("span");
        taskText.className = "task-text";
        taskText.textContent = taskName;

        const taskTag = document.createElement("span");
        taskTag.className = `task-tag ${priority}`;
        taskTag.textContent = capitalize(priority);

        taskItem.appendChild(checkbox);
        taskItem.appendChild(customCheckbox);
        taskItem.appendChild(taskText);
        taskItem.appendChild(taskTag);

        taskList.appendChild(taskItem);

        setupTaskCheckbox(taskItem);
    }


    // TASK COMPLETION
    function setupTaskCheckbox(taskItem) {
        const checkbox = taskItem.querySelector(
            'input[type="checkbox"]'
        );

        if (!checkbox) return;

        taskItem.classList.toggle(
            "completed-task",
            checkbox.checked
        );

        checkbox.addEventListener("change", () => {
            taskItem.classList.toggle(
                "completed-task",
                checkbox.checked
            );

            updateStats();
        });
    }


    // EXISTING TASKS
    if (taskList) {
        taskList.querySelectorAll(".task-item").forEach((taskItem) => {
            setupTaskCheckbox(taskItem);
        });
    }


    // CLEAR COMPLETED
    if (clearCompleted) {
        clearCompleted.addEventListener("click", () => {
            if (!taskList) return;

            taskList
                .querySelectorAll(".task-item.completed-task")
                .forEach((task) => {
                    task.remove();
                });

            updateStats();
        });
    }


    // UPDATE STATS
    function updateStats() {
        if (!taskList) return;

        const tasks = taskList.querySelectorAll(".task-item");
        const completedTasks = taskList.querySelectorAll(
            ".task-item.completed-task"
        );

        const total = tasks.length;
        const completed = completedTasks.length;

        const percentage =
            total === 0
                ? 0
                : Math.round((completed / total) * 100);

        if (taskCount) {
            taskCount.textContent = total;
        }

        if (completedCount) {
            completedCount.textContent = completed;
        }

        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }

        if (heroProgress) {
            heroProgress.textContent = `${percentage}%`;
        }

        if (progressLabel) {
            progressLabel.textContent =
                `${completed} of ${total} tasks completed`;
        }
    }


    // HELPER
    function capitalize(value) {
        return value.charAt(0).toUpperCase() + value.slice(1);
    }


    // INITIAL UPDATE
    updateStats();
});
