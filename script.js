const apiUrl = "https://js1-todo-api.vercel.app/api/todos";
const apiKey = "06d6f9bb-1532-4469-83b4-5b1abb158fec";
const inputElement = document.getElementById("inputText");
const btnElement = document.getElementById("btn");
const contentElement = document.querySelector(".content");
const errorElement = document.querySelector("#error");
const taskListConatiner = document.querySelector(".task-list-container");

// input validation
btnElement.addEventListener("click", function (e) {
  e.preventDefault();
  const task = inputElement.value.trim();
  if (task === "") {
    errorElement.style.display = "block";
    setTimeout(function () {
      errorElement.style.display = "none";
    }, 1000);
    return;
  }
  addTaskToDatabase(task);
  inputElement.value = "";
});

// Function for new task
function createTaskElement(task) {
  const newTask = document.createElement("li");
  newTask.classList.add("task");
  newTask.innerText = task.title.trim();
  taskListConatiner.appendChild(newTask);

  // Delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete");
  deleteBtn.innerHTML =
    '<i class="fa-solid fa-delete-left" style="color: #ff6b6b;"></i>';
  newTask.appendChild(deleteBtn);

  // Function to create a modal box
  deleteBtn.addEventListener("click", function () {
    if (!newTask.classList.contains("completed")) {
      const modal = document.querySelector(".modal");
      if (modal) {
        return;
      }

      const modalElement = document.createElement("div");
      modalElement.classList.add("modal");
      modalElement.innerHTML = `
        <div class="modal-content">
          <span class="close">&times;</span>
          <div>You cannot delete unfinished task!</div>
        </div>
      `;
      contentElement.appendChild(modalElement);

      const closeBtn = modalElement.querySelector(".close");
      closeBtn.addEventListener("click", function () {
        modalElement.remove();
      });

      setTimeout(function () {
        modalElement.remove();
      }, 2000);

      return;
    }

    newTask.remove();
    // DELETE request to api server
    fetch(`${apiUrl}/${task._id}?apikey=${apiKey}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

  // Create span to check completed task
  const completedBtn = document.createElement("span");
  completedBtn.classList.add("completed");
  completedBtn.innerHTML =
    '<i class="fa-regular fa-circle-check" style="color:#747474;"></i>';
  newTask.appendChild(completedBtn);

  completedBtn.addEventListener("click", function () {
    if (newTask.classList.contains("completed")) {
      newTask.classList.remove("completed");
      completedBtn.querySelector("i").style.color = "#747474";
      updateTaskStatus(task._id, false);
    } else {
      newTask.classList.add("completed");
      completedBtn.querySelector("i").style.color = "#127f10";
      updateTaskStatus(task._id, true);
    }
  });

  // Check if the task is completed and change the icon color
  if (task.completed) {
    newTask.classList.add("completed");
    completedBtn.querySelector("i").style.color = "#127f10";
  }

  return newTask;
}

// GET request to api server
fetch(`${apiUrl}?apikey=${apiKey}`)
  .then((response) => response.json())
  .then((data) => {
    data.forEach((element) => {
      const newTask = createTaskElement(element);
      taskListConatiner.appendChild(newTask);
    });
  });

// POST request to api server
function addTaskToDatabase(task) {
  fetch(`${apiUrl}?apikey=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: task }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      const newTask = createTaskElement(data);
      taskListConatiner.appendChild(newTask);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// PUT request to api server
function updateTaskStatus(taskId, completed) {
  fetch(`${apiUrl}/${taskId}?apikey=${apiKey}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ completed: completed }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
