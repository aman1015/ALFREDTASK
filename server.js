const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://superaman200:g0yBLNMKpb5EPLgG@cluster0.qwp5c.mongodb.net/flashcardsDB",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("✅ Connected to MongoDB successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));


const flashcardSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  known: { type: Boolean, default: false },
});

const Flashcard = mongoose.model("Flashcard", flashcardSchema);
app.post('/flashcard', async (req, res) => {
  try {
    const card = await Flashcard.create(req.body);
    res.status(201).json(card);
  } catch (err) {
    res.status(400).json(err.message);
  }
});

app.get("/flashcard", async (req, res) => {
  try {
    const cards = await Flashcard.find();
    res.status(200).json(cards);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching flashcards", error: error.message });
  }
});
app.put('/flashcard/:id',async(req,res)=>{
  try{
    const {id}=req.params;
   const updateCard = await Flashcard.findByIdAndUpdate(id, req.body, {
     new: true,
   });

    res.json(updateCard);
  }catch(e){
    res.status(400).json(e)
  }
})

app.delete("/flashcard/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCard = await Flashcard.findByIdAndDelete(id);

    if (!deletedCard) {
      return res.status(404).json({ error: "Flashcard not found" });
    }

    res.json({ message: "Flashcard deleted successfully", deletedCard });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});


app.get("/flashcard/unknown", async (req, res) => {
  try {
    const unknownCards = await Flashcard.find({ known: false }); // Fetch only unknown cards
    res.json(unknownCards);
  } catch (error) {
    res.status(500).json({ error: "Error fetching unknown flashcards" });
  }
});




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
