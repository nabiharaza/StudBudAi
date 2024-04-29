// Import necessary modules
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

// Define the model name and API key
const MODEL_NAME = "gemini-1.0-pro";
const API_KEY = "AIzaSyCPyHYwuoKPaUpA3HUo_h8ejIUPJagjDng";
// Define the runChat function
async function runChat(userInput) {
  try {
    // Initialize the generative AI with your API key
    const genAI = new GoogleGenerativeAI(API_KEY);

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    // Configure generation settings and safety settings
    const generationConfig = {
      temperature: 1,
      topK: 0,
      topP: 0.95,
      maxOutputTokens: 8192,
    };

    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    // Start a chat session
    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: [],
    });

    // Send user input to the chat prompt and await response
    console.log("User Input:", userInput);
    const result = await chat.sendMessage(userInput);
    const response = result.response;

    // Process the response (e.g., return the response)
    return response.text();
  } catch (error) {
    console.error("Error running chat:", error);
    // Handle errors appropriately (e.g., throw error)
    throw error;
  }
}

// Export the runChat function for use in other files
module.exports = runChat;
