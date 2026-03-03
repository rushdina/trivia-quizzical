import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Questions from "../components/Questions.jsx";

// Mock the imported API functions
vi.mock("../api/triviaAPI.js", () => ({
  fetchToken: vi.fn(),
  fetchQuestions: vi.fn(),
  resetToken: vi.fn(),
}));

// Mock formatter
vi.mock("../utils/formatQuestionObj.js", () => ({
  formatQuestionObj: vi.fn((q) => ({
    id: "mockQ1",
    question: q.question,
    answers: [
      { id: "a1", text: q.correct_answer, isCorrect: true },
      { id: "a2", text: q.incorrect_answers[0], isCorrect: false },
    ],
    selectedAnswerId: null,
  })),
}));

import * as api from "../api/triviaAPI.js";
// import * as formatUtil from "../utils/formatQuestionObj.js";

describe("Questions Component - Unit Tests", () => {
  // Mock data returned by fetchQuestions
  const sampleAPIResponse = {
    response_code: 0,
    results: [
      {
        question: "What is 2+2?",
        correct_answer: "4",
        incorrect_answers: ["3"],
      },
    ],
  };

  beforeEach(() => {
    // Reset all mocks before each test
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers(); // restore real timers
  });

  // Test 1: Loading spinner shows initially
  it("renders loading spinner on initial render", async () => {
    // sets mock return value for fetchToken
    api.fetchToken.mockResolvedValue("mock-token"); // returns a resolved promise
    render(<Questions />);
    expect(screen.getByText(/loading questions/i)).toBeInTheDocument();
  });

  // Test 2: Renders error message if error state occurs
  it("renders error message when error exists", async () => {
    // Mock API before rendering
    // Force error by mocking fetchQuestions to throw
    api.fetchToken.mockResolvedValue("mock-token");
    api.fetchQuestions.mockRejectedValueOnce(new Error("API error")); // throw error

    render(<Questions />); // now component calls loadQuiz and fetchQuestions rejects

    // Wait for async effect, waitFor runs the callback until the text appear in DOM
    await waitFor(() =>
      expect(
        screen.getByText(
          /something went wrong\. please try again after a few seconds/i,
        ),
      ).toBeInTheDocument(),
    );

    // Retry button exists
    expect(screen.getByText("Retry")).toBeInTheDocument();
  });

  // Test 3: Renders question after loading and successful fetch
  it("renders questions after loading", async () => {
    api.fetchToken.mockResolvedValue("mock-token");
    api.fetchQuestions.mockResolvedValue(sampleAPIResponse); // simulate successful fetch

    render(<Questions />);

    // Waits for component to finish async fetching and DOM question to appear
    await waitFor(() =>
      expect(screen.getByText("What is 2+2?")).toBeInTheDocument(),
    );

    // Check that answers are rendered
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  // Test 4: Check that "Check answers" button is disabled until all answers selected
  it("disables 'Check answers' button until all answers selected", async () => {
    api.fetchToken.mockResolvedValue("mock-token");
    api.fetchQuestions.mockResolvedValue(sampleAPIResponse);

    render(<Questions />);

    await waitFor(() =>
      expect(screen.getByText("What is 2+2?")).toBeInTheDocument(),
    );

    // Checks that user can’t check answers before selecting all questions
    const checkButton = screen.getByText("Check answers");
    expect(checkButton).toBeDisabled();
  });

  // Test 5: Shows score message when checkedAns is true
  it("renders score message after checking answers", async () => {
    api.fetchToken.mockResolvedValue("mock-token");
    api.fetchQuestions.mockResolvedValue(sampleAPIResponse);

    render(<Questions />);

    // Wait for question to appear after async fetch
    await waitFor(() =>
      expect(screen.getByText("What is 2+2?")).toBeInTheDocument(),
    );

    // Simulate selecting correct answer by calling handleSelectAnswer through the button
    const answerButton = screen.getByText("4");
    fireEvent.click(answerButton);

    // Click check answers button
    const checkButton = screen.getByText("Check answers");
    fireEvent.click(checkButton);

    // Wait for state update and DOM rendering (score message appears)
    await waitFor(() =>
      expect(
        screen.getByText(/You scored 1\/1 correct answers!/i),
      ).toBeInTheDocument(),
    ); // checks score message shows correct number of correct answers
  });

  // Test 6: "New Quiz" button calls loadQuiz (mocked)
  it("renders 'New Quiz' button when checkedAns is false", async () => {
    api.fetchToken.mockResolvedValue("mock-token");
    api.fetchQuestions.mockResolvedValue(sampleAPIResponse);

    render(<Questions />);

    await waitFor(() =>
      expect(screen.getByText("What is 2+2?")).toBeInTheDocument(),
    );

    // Check that New Quiz button renders and is enabled
    const newQuizButton = screen.getByText("New Quiz");
    expect(newQuizButton).toBeInTheDocument();
    expect(newQuizButton).not.toBeDisabled();
  });
});
