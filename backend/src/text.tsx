import { useState, useEffect } from "react";

type Todo = {
  _id: string;
  title: string;
  completed: boolean;
};

function App() {
  const [title, setTitle] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTodos() {
      try {
        const response = await fetch("http://localhost:5000/todo");

        if (!response.ok) {
          throw new Error("Failed to fetch todos");
        }

        const data: Todo[] = await response.json();
        setTodos(data);
      } catch (error) {
        console.error("Error: ", error);
      }
    }

    fetchTodos();
  }, []);

  function handleEdit(todo: Todo) {
    setTitle(todo.title);
    setEditingId(todo._id);
  }

  async function handleupdate() {
    if (!title.trim() || !editingId) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/todo/${editingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      if (!res.ok) {
        throw new Error("Failed to update todo");
      }

      const updatedTodo: Todo = await res.json();

      setTodos((currentTodos) =>
        currentTodos.map((todo) =>
          todo._id === updatedTodo._id ? updatedTodo : todo,
        ),
      );

      setTitle("");
      setEditingId(null);
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  }
  async function handleAdd(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (!title.trim()) {
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/todo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ title }),
      });

      if (!res.ok) {
        throw new Error("Failed to add todo");
      }

      const newTodo: Todo = await res.json();

      setTodos((currentTodos) => [...currentTodos, newTodo]);
      setTitle("");
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function handleComplete(_id: string) {
    const res = await fetch(`http://localhost:5000/todo/${_id}`, {
      method: "PATCH",
    });

    if (!res.ok) {
      return;
    }
    const updatedTodo: Todo = await res.json();
    console.log("Updated todo:", updatedTodo);
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo._id === updatedTodo._id ? updatedTodo : todo,
      ),
    );
  }


  async function handleDelete(_id: string) {
    const res = await fetch(`http://localhost:5000/todo/${_id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Failed to delete todo");
    }

    setTodos((currentTodos) => currentTodos.filter((todo) => todo._id !== _id));
  }



  app.delete("/todo/:id", async (req, res) => {
    const deletedTodo = await TodoModel.findByIdAndDelete(req.params.id);
    if (!deletedTodo) {
      res.status(404).json({
        message: "Todo not found",
      });
      return;
    }

    res.json(deletedTodo);
  });
  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-3xl font-bold">Todo App</h1>
        <p className="mb-8 text-gray-400">Manage your tasks</p>

        {/* Add Todo */}
        <div className="mb-8 flex gap-3">
          <input
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 rounded-lg border border-gray-800 bg-gray-900 px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-blue-500"
          />

          <button
            className="rounded-lg bg-blue-600 px-5 py-3 font-medium hover:bg-blue-500"
            onClick={(e) => {
              if (editingId) {
                handleupdate();
              } else {
                handleAdd(e);
              }
            }}
          >
            {editingId ? "Update" : "Add"}
          </button>
        </div>

        {/* Todo List */}
        <div className="space-y-3">
          {todos.map((todo) => (
            <div
              key={todo._id}
              className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900 p-4"
            >
              <div>
                <p
                  className={`font-medium ${
                    todo.completed
                      ? "text-gray-500 line-through"
                      : "text-gray-100"
                  }`}
                >
                  {todo.title}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  {todo.completed ? "Completed" : "Pending"}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(todo)}
                  className="rounded-md bg-blue-500/10 px-3 py-2 text-sm text-blue-400 hover:bg-blue-500/20"
                >
                  Edit
                </button>
                <button
                  className="rounded-md bg-green-500/10 px-3 py-2 text-sm text-green-400 hover:bg-green-500/20"
                  onClick={() => handleComplete(todo._id)}
                >
                  Complete
                </button>

                <button
                  onClick={() => handleDelete(todo._id)}
                  className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-400 hover:bg-red-500/20"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
