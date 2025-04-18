///////////////////////////////////////////////////////////////////////////////
let tasks = [];
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function updateCalendar() {
  const calendar = document.getElementById("calendar");
  calendar.innerHTML = "";
  document.getElementById("currentMonth").textContent = new Date(
    currentYear,
    currentMonth
  ).toLocaleString("default", { month: "long", year: "numeric" });

  let daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  for (let i = 1; i <= daysInMonth; i++) {
    const date = `${currentYear}-${(currentMonth + 1)
      .toString()
      .padStart(2, "0")}-${i.toString().padStart(2, "0")}`;
    const day = document.createElement("div");
    day.classList.add("day");
    // noinspection JSValidateTypes
    day.textContent = i;
    tasks
      .filter((t) => t.date === date)
      .forEach((t) => {
        const taskElement = document.createElement("div");
        taskElement.classList.add("task");
        taskElement.textContent = t.title;
        day.appendChild(taskElement);
      });
    calendar.appendChild(day);
  }
}

function changeMonth(direction) {
  currentMonth += direction;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  } else if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  updateCalendar();
}

///////////////////////////////////////////////////////////////////////////////

function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("hidden");
  document.getElementById("mainContent").classList.toggle("full-width");
}

function switchView(view) {
  document.getElementById("task-list-view").style.display =
    view === "task-list" ? "block" : "none";
  document.getElementById("calendar-view").style.display =
    view === "calendar" ? "block" : "none";
  updateCalendar();
}

///////////////////////////////////////////////////////////////////////////////

function toggleTheme() {
  document.body.classList.toggle("dark-mode");

  document.getElementById("accountDropdown").classList.toggle("dark-mode");
  document.querySelector(".close-popup").classList.toggle("dark-mode");
  document.getElementById("theme-button").classList.toggle("dark-mode");
  document.getElementById("settings-button").classList.toggle("dark-mode");



}

///////////////////////////////////////////////////////////////////////////////

function toggleAccountMenu(action) {
  const accountDropdown = document.getElementById("accountDropdown");
  const overlay = document.querySelector(".overlay");

  if (action === "display") {
    accountDropdown.classList.add("show");
    overlay.classList.add("show");
  } else if (action === "hide") {
    accountDropdown.classList.remove("show");
    overlay.classList.remove("show");
  }
}

document
  .querySelector(".close-popup")
  .addEventListener("click", function (event) {
    event.stopPropagation();
    toggleAccountMenu("hide");
  });

///////////////////////////////////////////////////////////////////////////////

// var chatButton = document.getElementById("chat-button");
// var iaChatBotButton = document.getElementById("iaChatbot-button");

// chatButton.addEventListener("click", swapButtons);
// iaChatBotButton.addEventListener("click", swapButtons);

// function swapButtons() {
//     chatButton.classList.toggle("swapped");
//     iaChatBotButton.classList.toggle("swapped");
// }

function toggleChat() {
  document.getElementById("chatBox").classList.toggle("show");
}
function sendMessage() {
  let chatInput = document.getElementById("chatInput");
  let chatBody = document.getElementById("chatBody");
  let message = chatInput.value.trim();

  if (message !== "") {
    let msgElement = document.createElement("div");
    msgElement.className = "message user";
    msgElement.textContent = message;
    chatBody.appendChild(msgElement);
    chatInput.value = "";
    chatBody.scrollTop = chatBody.scrollHeight;
  }
}

///////////////////////////////////////////////////////////////////////////////

function addTask() {
  const taskInput = document.getElementById("newTask");
  const taskDate = document.getElementById("taskDate").value;
  if (taskInput.value.trim() !== "" && taskDate) {
    tasks.push({ title: taskInput.value, date: taskDate });
    updateCalendar();
    updateTasks();
    taskInput.value = "";
  }
}

///////////////////////////////////////////////////////////////////////////////

function updateTasks() {
  const taskContainer = document.querySelector(".task-list");

  while (taskContainer.children.length > 2) {
    // del tasks but l'entête
    taskContainer.removeChild(taskContainer.lastChild);
  }

  tasks.forEach((task, index) => {
    const taskLine = document.createElement("div");
    taskLine.className = "task-line";

    const idDiv = document.createElement("div");
    idDiv.style.color = "gray";
    idDiv.textContent = `TSK-${index}`;

    const titleDiv = document.createElement("div");
    titleDiv.textContent = task.title;

    const projectWrapper = document.createElement("div");
    projectWrapper.style.display = "flex";

    const projectBadge = document.createElement("div");
    projectBadge.style.border = "1px solid gray";
    projectBadge.style.borderRadius = "20px";
    projectBadge.style.padding = "0px 4px";
    projectBadge.textContent = "Project 1";

    projectWrapper.appendChild(projectBadge);

    const priorityDiv = document.createElement("img");
    const flagColor = document.querySelector('input[type="radio"]:checked').value;    
    switch (flagColor) {
      case "#4CAF50":
        priorityDiv.src = "../img/greenFlag.png";
        priorityDiv.width = 30;
        break;
      case "#FFEB3B":
        priorityDiv.src = "../img/yellowFlag.png";
        priorityDiv.width = 30;
        break;
      case "#F44336":
        priorityDiv.src = "../img/redFlag.png";
        priorityDiv.width = 30;
        break;
    }

    const dateDiv = document.createElement("div");
    dateDiv.style.color = "gray";
    const date = new Date(task.date);
    dateDiv.textContent = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    const ownerDiv = document.createElement("img");
    ownerDiv.src = "../img/BFF.jpg"; // ADD IMAGE
    ownerDiv.style.borderRadius = "100%";
    ownerDiv.width = 30;
    ownerDiv.height = 30;

    const moreDiv = document.createElement("div");
    moreDiv.textContent = "...";

    taskLine.appendChild(idDiv);
    taskLine.appendChild(titleDiv);
    taskLine.appendChild(projectWrapper);
    taskLine.appendChild(priorityDiv);
    taskLine.appendChild(dateDiv);
    taskLine.appendChild(ownerDiv);
    taskLine.appendChild(moreDiv);

    taskContainer.appendChild(taskLine);
    taskContainer.appendChild(document.createElement("hr"));
  });
}

///////////////////////////////////////////////////////////////////////////////

(function () {
  if (!window.chatbase || window.chatbase("getState") !== "initialized") {
    window.chatbase = (...arguments) => {
      if (!window.chatbase.q) {
        window.chatbase.q = [];
      }
      window.chatbase.q.push(arguments);
    };
    window.chatbase = new Proxy(window.chatbase, {
      get(target, prop) {
        if (prop === "q") {
          return target.q;
        }
        return (...args) => target(prop, ...args);
      },
    });
  }
  const onLoad = function () {
    const script = document.createElement("script");
    script.src = "https://www.chatbase.co/embed.min.js";
    script.id = "EW7k6gW4a3UODn12zFtBF";
    script.domain = "www.chatbase.co";
    document.body.appendChild(script);
  };
  if (document.readyState === "complete") {
    onLoad();
  } else {
    window.addEventListener("load", onLoad);
  }
})();
