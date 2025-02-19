
import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/flashcard";

function App() {
  const [flashcards, setFlashcards] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [showUnknown, setShowUnknown] = useState(true);
  const [editingCard, setEditingCard] = useState(null);

  // ✅ Fetch Flashcards on Load
  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const res = await axios.get(API_URL);
        setFlashcards(res.data);
      } catch (error) {
        console.error("Error fetching flashcards:", error);
      }
    };
    fetchFlashcards();
  }, []);

  // ✅ Add Flashcard Function
  const addFlashCard = async () => {
    if (question.trim() && answer.trim()) {
      try {
        const newCard = { question, answer };
        const res = await axios.post(API_URL, newCard);
        setFlashcards([...flashcards, res.data]); // Update state
        setQuestion(""); // Clear input
        setAnswer("");
      } catch (error) {
        console.error("Error adding flashcard:", error);
      }
    }
  };
  const totalCards = flashcards.length;
  const knownCards = flashcards.filter((card) => card.known).length;

  const editFlashCard = async (id, updatedQuestion, updatedAnswer) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, {
        question: updatedQuestion,
        answer: updatedAnswer,
      });

      setFlashcards((prevFlashcards) =>
        prevFlashcards.map((card) => (card._id === id ? res.data : card))
      );
      setEditingCard(null);
    } catch (error) {
      console.error("Error updating flashcard:", error);
    }
  };

  const deleteFlashCard = async (id) => {
    try {
      const res = await axios.delete(`${API_URL}/${id}`);

      setFlashcards(flashcards.filter((card) => card._id !== id));
    } catch (error) {
      console.error("Error deleting flashcard:", error);
    }
  };
  const toggleKnown = async (id, known) => {
    const res = await axios.put(`${API_URL}/${id}`, { known: !known });
    setFlashcards(
      flashcards.map((card) => (card._id === id ? res.data : card))
    );
  };

  const fetchFlashcards = async (showUnknown) => {
    try {
      const endpoint = showUnknown ? `${API_URL}/unknown` : API_URL;
      const res = await axios.get(endpoint);
      setFlashcards(res.data);
    } catch (error) {
      console.error("Error fetching flashcards:", error);
    }
  };

  // Call fetchFlashcards on load
  useEffect(() => {
    fetchFlashcards(showUnknown);
  }, [showUnknown]); // Re-fetch when showUnknown state changes

  return (
    <>
      <div className="min-h-screen bg-grey-100 flex">
        <div className="w-1/3 bg-white p-6 shadow">
          <h2 className="text-xl font-bold mb-4 text-green">Flashcard</h2>
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            type="text"
            placeholder="Question"
            className="w-full mb-4 p-2 border border-gray-500"
          ></input>
          <input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            type="text"
            placeholder="Answer"
            className="w-full mb-4 p-3 border border-gray-500"
          ></input>
          <button
            onClick={addFlashCard}
            className="w-full bg-red-500 border-r-2 text-white rounded hover:bg-red-700"
          >
            Add Flashcard
          </button>
        </div>
        <div className="w-2/3 p-6 bg-gray-100">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-gray-700">
                Total Costs:
                <span className="font-bold">{totalCards}</span>
              </p>

              <p className="text-gray-700">
                Known:
                <span className="font-bold">{knownCards}</span>
              </p>

              <p className="text-gray-700">
                Unknown:{" "}
                <span className="font-bold">{totalCards - knownCards}</span>
              </p>
            </div>
            <button
              onClick={() => setShowUnknown(!showUnknown)}
              className="bg-gray-200 rounded px-4 py-2 text-xl hover:bg-gray-300 "
            >
              {showUnknown ? "show All Cards " : "show Unknown Cards"}
            </button>
          </div>
          <div>
            <div>
              {flashcards.map((card, index) => (
                <div key={index} className="p-4 border mb-2 rounded">
                  {editingCard === card._id ? (
                    <>
                      <input
                        value={card.question}
                        onChange={(e) =>
                          setFlashcards(
                            flashcards.map((c) =>
                              c._id === card._id
                                ? { ...c, question: e.target.value }
                                : c
                            )
                          )
                        }
                        className="w-full mb-2 p-2 border-gray-300 rounded"
                      />
                      <input
                        value={card.answer}
                        onChange={(e) =>
                          setFlashcards(
                            flashcards.map((c) =>
                              c._id === card._id
                                ? { ...c, answer: e.target.value }
                                : c
                            )
                          )
                        }
                        className="w-full mb-2 p-2 border-gray-300 rounded"
                      />
                      <button
                        onClick={() =>
                          editFlashCard(card._id, card.question, card.answer)
                        }
                        className="bg-red-400 rounded mr-4 px-4 py-2 text-xl hover:bg-red-500 "
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingCard(null)}
                        className="bg-gray-200 rounded px-4 py-2 text-xl hover:bg-gray-300 "
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <h2 className="font-semibold text-lg">{card.question}</h2>
                      <p className="text-gray-600">{card.answer}</p>
                      <div className="mt-2 flex justify-between items-center">
                        <button
                          onClick={() => toggleKnown(card._id, card.known)}
                          className={`text-sm px-3 py-2 rounded bg-red-500 text-white ${
                            card.known
                              ? "bg-gray-400 text-white "
                              : "bg-red-500 text-white"
                          }`}
                        >
                          {card.known ? "Mark as Unknown" : " Known"}
                        </button>
                        <button
                          onClick={() => setEditingCard(card._id)}
                          className="text-sm px-3 py-2 rounded bg-blue-500 text-white"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteFlashCard(card._id)}
                          className="text-sm px-3 py-2 rounded bg-red-500 text-white"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App
