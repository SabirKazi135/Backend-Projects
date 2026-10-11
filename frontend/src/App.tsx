function App() {
  return (
    <div className="min-h-screen bg-gray-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold">My Diary</h1>
        <p className="mt-2 text-gray-400">A quiet place for your thoughts.</p>

        <button className="mt-6 rounded-lg bg-blue-600 px-5 py-3 font-medium hover:bg-blue-500">
          + Add Entry
        </button>

        <div className="mt-10 rounded-xl border border-gray-800 bg-gray-900 p-8 text-center">
          <h2 className="text-xl font-semibold">No entries yet</h2>
          <p className="mt-2 text-gray-400">
            Start your diary by creating your first entry.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
