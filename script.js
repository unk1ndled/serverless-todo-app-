import { postTodo, getTodos, getTodo } from "./util.js";

document.addEventListener("DOMContentLoaded", async () => {
  // test
  const colors = ["color-0", "color-1", "color-2", "color-3", "color-4"];
  const addButton = document.querySelector(".add-button");
  const todoWrapper = document.querySelector(".wrapper");
  const todosSection = document.querySelector(".todos");
  const currentSection = document.querySelector(".current");

  let todolist = new Array(0);
  let current

  //init todos with css classes
  const initializeTodo = (todo, index) => {
    const colorIndex = index % colors.length;
    todo.classList.add(colors[colorIndex]);

    todo.addEventListener("click", () => {
      document
        .querySelectorAll(".todo")
        .forEach((t) => t.classList.remove("clicked"));
      todo.classList.toggle("clicked");
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

    const todoDescription = document.createElement("p");
    todoDescription.textContent = todo.description;
    newTodo.appendChild(todoTitle);
    todoWrapper.appendChild(newTodo);

    initializeTodo(newTodo, index);
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
      title = todos.length + 1;
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

  const selectTodo = ()=>{
    
  }

  //init button
  addButton.addEventListener("click", addNewTodo);
  todolist = await getTodos();

  todolist.map((todo, index) => {
    showTodo(todo, index);
  });

  document.querySelectorAll(".todo").forEach(initializeTodo);

  // Initial visibility check
  toggleVisibility(todoWrapper, todolist.length === 0);
  toggleVisibility(currentSection, todolist.length === 0);
  toggleVisibility(todosSection, todolist.length === 0);
});

const toggleVisibility = (element, hide) => {
  if (hide) {
    element.classList.remove("todos");
    element.classList.add("hidden");
  } else {
    element.classList.remove("hidden");
    element.classList.add("todos");
  }
};
