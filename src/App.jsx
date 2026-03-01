import { useState } from "react";
import Start from "./components/Start.jsx";
import Questions from "./components/Questions.jsx";
import "./App.css";

function App() {
  const [page, setPage] = useState("start");

  return (
    <>
      {page === "questions" && (
        <header className="questions-header">
          <h1>Quizzical</h1>
        </header>
      )}

      <main className={page === "questions" ? "questions-main" : ""}>
        {page === "start" && (
          <Start goToQuestions={() => setPage("questions")} />
        )}
        {page === "questions" && <Questions />}
      </main>

      {page === "questions" && <footer>Scrimba Solo Project Quizzical</footer>}
    </>
  );
}

export default App;
