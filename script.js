import {
  postTodo,
  getTodos,
  getTodo,
  deleteTodo,
  completeTodo,
  patchTodo,
} from "./util.js";

document.addEventListener("DOMContentLoaded", async () => {
  // test
  const colors = ["color-0", "color-1", "color-2", "color-3", "color-4"];

  const addButton = document.querySelector(".add-button");
  const deleteButton = document.querySelector("#delete");
  const updateButton = document.querySelector("#edit");
  const completeButton = document.querySelector("#complete");

  const todoWrapper = document.querySelector(".wrapper");
  const todosSection = document.querySelector(".todos");

  const currentSection = document.querySelector(".current");
  const currentTitle = document.querySelector(".current-title");
  const currentBody = document.querySelector(".current-body");

  let todolist = new Array(0);
  let current = null;

  const toggleVisibility = () => {
    if (todolist.length === 0) {
      todosSection.classList.remove("todos");
      todosSection.classList.add("hidden");

      todoWrapper.classList.remove("wrapper");
      todoWrapper.classList.add("hidden");

      currentSection.classList.remove("current");
      currentSection.classList.add("hidden");
    } else {
      todosSection.classList.remove("hidden");
      todosSection.classList.add("todos");
      todoWrapper.classList.remove("hidden");
      todoWrapper.classList.add("wrapper");
      currentSection.classList.remove("hidden");
      currentSection.classList.add("current");
    }
  };

  //init todos with css classes
  const initializeTodo = (todo, index) => {
    const colorIndex = index % colors.length;
    todo.classList.add(colors[colorIndex]);

    todo.dataset.index = index;

    todo.addEventListener("click", () => {
      document
        .querySelectorAll(".todo")
        .forEach((t) => t.classList.remove("clicked"));
      todo.classList.toggle("clicked");
      selectTodo(todo.dataset.index);
    });
  };

  //visualise each todo and color it depending on its index
  const showTodo = (todo, index) => {
    //
    const newTodo = document.createElement("div");
    newTodo.classList.add("todo");
    const todoTitle = document.createElement("div");
    todoTitle.textContent = todo.title;
    todoTitle.classList.add("todoTitle");

    const todoStatus = document.createElement("div");
    todoStatus.textContent = todo.status == "unfinished" ? "✖" : "✔";
    todoStatus.classList.add("status");

    const todoDescription = document.createElement("p");
    todoDescription.textContent = todo.description;
    newTodo.appendChild(todoTitle);
    newTodo.appendChild(todoStatus);
    todoWrapper.appendChild(newTodo);

    initializeTodo(newTodo, index);
  };

  const refreshTodoList = () => {
    todoWrapper.innerHTML = "";
    console.log(todolist)
    todolist
      .sort((t1, t2) => {
        if (t1.status == "unfinished" && t2.status == "completed") {
          return -1;
        } else if (t2.status == "unfinished" && t1.status == "completed") {
          return 1;
        } else {
          return 0;
        }
      })
      .map((todo, index) => {
        showTodo(todo, index);
      });
  };

  //self explanatory tbh
  const addNewTodo = async () => {
    //
    const titleInput = document.getElementById("todo-title");
    const descriptionInput = document.getElementById("todo-description");
    const todos = document.querySelectorAll(".todo");
    let title = titleInput.value.trim();
    const description = descriptionInput.value.trim();

    if (title === "") {
      return;
    }
    const id = await postTodo(title, description);
    const next = await getTodo(id);
    if (todolist.length == 0) {
      location.reload();
    }
    todolist.push(next);
    showTodo(next, todolist.length - 1);

    // reset
    titleInput.value = "";
    descriptionInput.value = "";
  };

  //select todo
  const selectTodo = (index) => {
    current = todolist[index];
    current.index = index;
    currentTitle.textContent = current.title;
    currentBody.textContent = current.body;
  };

  //init buttons
  addButton.addEventListener("click", addNewTodo);

  deleteButton.addEventListener("click", async () => {
    await deleteTodo(current.id);
    todolist.splice(current.index, 1);
    current = null;
    currentBody.textContent = "";
    currentTitle.textContent = "";
    refreshTodoList();
    toggleVisibility();
  });

  completeButton.addEventListener("click", async () => {
    await completeTodo(current.id);

    const curdiv = document.querySelector(".clicked");
    const status = curdiv.getElementsByClassName("status")[0];
    if (status) {
      status.textContent = "✔";
    }
  });

  updateButton.addEventListener("click", async () => {
    if (current != null) {
      await patchTodo(
        current.id,
        currentTitle.textContent,
        currentBody.textContent
      );

      // alert(`updated todo ${currentTitle.textContent} `);
      todolist[current.index].title = currentTitle.textContent;
      todolist[current.index].body = currentBody.textContent;
      refreshTodoList();
    }
  });

  document.querySelectorAll(".todo").forEach(initializeTodo);

  // Initial visibility check
  todolist = await getTodos();
  refreshTodoList();
  toggleVisibility();
});
