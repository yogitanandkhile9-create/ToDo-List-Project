
// Get HTML elements
const form = document.getElementById("form");
const input = document.getElementById("text");
const list = document.getElementById("list");

const count = document.getElementById("count");
const totalCount = document.getElementById("totalCount");
const activeCount = document.getElementById("activeCount");
const doneCount = document.getElementById("doneCount");

const clearBtn = document.getElementById("clearBtn");
const filterButtons = document.querySelectorAll(".filter");

// Store all tasks in one array
let tasks = [];
let currentFilter = "all";

// Load saved tasks
function load() {
    try {
        return JSON.parse(localStorage.getItem("tasks")) || [];
    } catch (error) {
        return [];
    }
}

// Save tasks in browser
function save() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Update task counter
function updateStats() {
    const active = tasks.filter(task => !task.done).length;
    const completed = tasks.filter(task => task.done).length;

    totalCount.textContent = tasks.length;
    activeCount.textContent = active;
    doneCount.textContent = completed;

    count.textContent = active + " tasks left";
}

// Display tasks
function render() {
    list.innerHTML = "";

    const filteredTasks = tasks.filter(task => {
        if (currentFilter === "active") return !task.done;
        if (currentFilter === "done") return task.done;
        return true;
    });

    if (filteredTasks.length === 0) {
        const empty = document.createElement("li");
        empty.className = "empty";
        empty.textContent = "No tasks found. Add a new task!";
        list.append(empty);
    }

    filteredTasks.forEach(task => {
        const li = document.createElement("li");

        if (task.done) {
            li.classList.add("done");
        }

        li.dataset.id = task.id;

        const label = document.createElement("span");
        label.className = "task-text";
        label.textContent = task.text;

        const actions = document.createElement("div");
        actions.className = "task-actions";

        const toggleBtn = document.createElement("button");
        toggleBtn.textContent = task.done ? "Undo" : "Done";
        toggleBtn.className = "toggle-btn";
        toggleBtn.dataset.action = "toggle";

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";
        deleteBtn.dataset.action = "delete";

        actions.append(toggleBtn, deleteBtn);
        li.append(label, actions);

        list.append(li);
    });

    updateStats();
}

// Add new task
form.addEventListener("submit", function(event) {
    event.preventDefault();

    const text = input.value.trim();

    if (text === "") {
        alert("Please enter a task!");
        return;
    }
    const newTask = {
        id: Date.now(),
        text: text,
        done: false
    };
    tasks.push(newTask);

    input.value = "";

    save();
    render();
});
// Complete or delete task
list.addEventListener("click", function(event) {
    const action = event.target.dataset.action;

    if (!action) return;

    const li = event.target.closest("li");

    if (!li) return;

    const id = Number(li.dataset.id);

    if (action === "delete") {
        tasks = tasks.filter(task => task.id !== id);
    }

    if (action === "toggle") {
        tasks.forEach(task => {
            if (task.id === id) {
                task.done = !task.done;
            }
        });
    }

    save();
    render();
});

// Filter tasks
filterButtons.forEach(button => {
    button.addEventListener("click", function() {
        currentFilter = button.dataset.filter;

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        render();
    });
});

// Clear completed tasks
clearBtn.addEventListener("click", function() {
    tasks = tasks.filter(task => !task.done);

    save();
    render();
});

// Start application
tasks = load();
render();
