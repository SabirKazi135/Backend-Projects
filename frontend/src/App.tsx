import { useState, useEffect } from "react";

type DiaryEntry = {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

function App() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDiary() {
      try {
        const res = await fetch("http://localhost:5000/diary");
        if (!res.ok) {
          throw new Error("Failed to fetch todos");
        }

        const data: DiaryEntry[] = await res.json();

        setEntries(data);
      } catch (error) {
        console.error("Error: ", error);
      }
    }

    fetchDiary();
  }, []);

  function handleAddEntry() {
    setShowForm(true);
  }

  async function handleSaveEntry() {
    if (!title.trim() || !description.trim()) {
      return;
    }

    setShowForm(false);

    try {
      const res = await fetch("http://localhost:5000/diary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      });
      if (!res.ok) {
        throw new Error("Failed to add todo");
      }
      const newDiary: DiaryEntry = await res.json();
      setEntries((c) => [...c, newDiary]);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  function handleCancel() {
    // You implement this
  }

  function handleOpenEntry(entry: DiaryEntry) {
    // You implement this
    setSelectedEntry(entry);
  }

  function handleEditEntry(entry: DiaryEntry) {
    // You implement this
  }

  async function handleDeleteEntry(id: string) {
    // You implement this
    const res = await fetch(`http://localhost:5000/diary/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error("Failed to delete todo");
    }

    setEntries((currentTodos) => currentTodos.filter((todo) => id !== id));
    setSelectedEntry(null);
  }

  return (
    <main className="min-h-screen bg-gray-950 px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-4xl">
        <header className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">My Diary</h1>
            <p className="mt-2 text-gray-400">
              A quiet place for your thoughts.
            </p>
          </div>

          {!showForm && !selectedEntry && (
            <button
              onClick={handleAddEntry}
              className="rounded-lg bg-blue-600 px-4 py-3 font-medium hover:bg-blue-500"
            >
              + Add Entry
            </button>
          )}
        </header>

        {showForm && (
          <section className="mt-8 rounded-xl border border-gray-800 bg-gray-900 p-6">
            <h2 className="text-xl font-semibold">
              {editingId ? "Edit Entry" : "New Entry"}
            </h2>

            <div className="mt-6 space-y-4">
              <input
                type="text"
                placeholder="Entry title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 outline-none focus:border-blue-500"
              />

              <textarea
                placeholder="Write your thoughts..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={8}
                className="w-full resize-y rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 outline-none focus:border-blue-500"
              />

              <div className="flex gap-3">
                <button
                  onClick={handleSaveEntry}
                  className="rounded-lg bg-blue-600 px-5 py-3 font-medium hover:bg-blue-500"
                >
                  Save Entry
                </button>

                <button
                  onClick={handleCancel}
                  className="rounded-lg border border-gray-700 px-5 py-3 hover:bg-gray-800"
                >
                  Cancel
                </button>
              </div>
            </div>
          </section>
        )}

        {selectedEntry && !showForm && (
          <article className="mt-8 rounded-xl border border-gray-800 bg-gray-900 p-6">
            <button
              onClick={() => setSelectedEntry(null)}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              ← Back to diary
            </button>

            <h2 className="mt-6 text-2xl font-bold">{selectedEntry.title}</h2>

            <p className="mt-2 text-sm text-gray-500">
              Created: {new Date(selectedEntry.createdAt).toLocaleDateString()}
            </p>

            <p className="mt-6 whitespace-pre-wrap leading-7 text-gray-300">
              {selectedEntry.description}
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => handleEditEntry(selectedEntry)}
                className="rounded-lg bg-blue-500/10 px-4 py-2 text-blue-400 hover:bg-blue-500/20"
              >
                Edit
              </button>

              <button
                onClick={() => handleDeleteEntry(selectedEntry._id)}
                className="rounded-lg bg-red-500/10 px-4 py-2 text-red-400 hover:bg-red-500/20"
              >
                Delete
              </button>
            </div>
          </article>
        )}

        {!showForm && !selectedEntry && (
          <section className="mt-10">
            {entries.length === 0 ? (
              <div className="rounded-xl border border-gray-800 bg-gray-900 px-6 py-12 text-center">
                <h2 className="text-xl font-semibold">No entries yet</h2>
                <p className="mt-2 text-gray-400">
                  Start your diary by creating your first entry.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {entries.map((entry) => (
                  <article
                    key={entry._id}
                    onClick={() => handleOpenEntry(entry)}
                    className="cursor-pointer rounded-xl border border-gray-800 bg-gray-900 p-5 transition hover:border-gray-600"
                  >
                    <h2 className="text-lg font-semibold">{entry.title}</h2>

                    <p className="mt-2 text-sm text-gray-500">
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </p>

                    <p className="mt-3 whitespace-pre-wrap text-gray-400">
                      {entry.description.length > 120
                        ? `${entry.description.slice(0, 120)}...`
                        : entry.description}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}

export default App;
