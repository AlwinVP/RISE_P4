let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "All";

const taskInput = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");
const filterButtons = document.querySelectorAll(".filter-btn");

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks.filter(task => {
    if (currentFilter === "All") return true;
    if (currentFilter === "Completed") return task.completed;
    if (currentFilter === "Pending") return !task.completed;
  });

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = `task-item ${task.completed ? "completed" : ""}`;

    li.innerHTML = `
      <span class="task-text">${task.text} <small>(${task.timestamp})</small></span>
      <div class="task-actions">
        <button onclick="toggleComplete(${index})">${task.completed ? "Undo" : "Done"}</button>
        <button class="edit-btn" onclick="editTask(${index})">Edit</button>
        <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
      </div>
    `;

    taskList.appendChild(li);
  });
}

function addTask() {
  const text = taskInput.value.trim();
  if (text === "") return;

  const task = {
    text,
    completed: false,
    timestamp: new Date().toLocaleString()
  };

  tasks.push(task);
  saveTasks();
  renderTasks();
  taskInput.value = "";
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function editTask(index) {
  const newText = prompt("Edit your task:", tasks[index].text);
  if (newText !== null && newText.trim() !== "") {
    tasks[index].text = newText.trim();
    saveTasks();
    renderTasks();
  }
}

function deleteTask(index) {
  if (confirm("Delete this task?")) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }
}

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

renderTasks();
