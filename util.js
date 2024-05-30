const apiUrl =
  "https://azkx7gi14f.execute-api.us-east-1.amazonaws.com/v1/Todos";

//GET
export const getTodo = async (id) => {
  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const todo = await response.json();
    console.log(todo);
    return todo;
  } catch (error) {
    console.error("Error fetching todo:", error);
  }
};

//POST
export const postTodo = async (title, description) => {
  const task = {
    title: title,
    description: description,
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Task: task }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    // Fetch only the newly added todo by its ID

    return responseData.id;
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("response").innerText = `Error: ${error.message}`;
  }
};

//GET (all)
export const getTodos = async () => {
  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const todolist = await response.json();

    return todolist;
  } catch (error) {
    console.error("Error fetching todos:", error);
  }
};

//DELETE 
export const deleteTodo = async (id) => {
  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: "Delete",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const res = await response.json();
  } catch (error) {
    console.error("Error Deleting todos:", error);
  }
};