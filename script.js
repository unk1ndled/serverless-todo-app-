document.addEventListener("DOMContentLoaded", () => {
  const colors = ["color-0", "color-1", "color-2", "color-3", "color-4"];
  const addButton = document.querySelector(".add-button");
  const todoWrapper = document.querySelector(".wrapper");
  const todosSection = document.querySelector(".todos");
  const currentSection = document.querySelector(".current");

  const toggleVisibility = () => {
    if (todoWrapper.children.length === 0) {

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

  const initializeTodo = (todo, index) => {
    const colorIndex = index % colors.length;
    todo.classList.add(colors[colorIndex]);

    todo.addEventListener("click", () => {
      document.querySelectorAll(".todo").forEach((t) => t.classList.remove("clicked"));
      todo.classList.toggle("clicked");
    });
  };

  const addNewTodo = () => {
    const titleInput = document.getElementById("todo-title");
    const descriptionInput = document.getElementById("todo-description");
    const todos = document.querySelectorAll(".todo");

    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();

    const newTodo = document.createElement("div");
    newTodo.classList.add("todo");

    const todoTitle = document.createElement("div");

    todoTitle.textContent = title;
    if (title === "") {
      todoTitle.textContent = todos.length+1
    }
    todoTitle.classList.add("todoTitle")
    const todoDescription = document.createElement("p");
    todoDescription.textContent = description;
    newTodo.appendChild(todoTitle);

    todoWrapper.appendChild(newTodo);
    initializeTodo(newTodo, todos.length);

    // reset
    titleInput.value = "";
    descriptionInput.value = "";

    toggleVisibility();
  };

  addButton.addEventListener("click", addNewTodo);

  document.querySelectorAll(".todo").forEach(initializeTodo);

  // Initial visibility check
  toggleVisibility();
});

