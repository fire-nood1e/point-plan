// ChatBot.js
export const ChatBot = (userMessage) => {
    const botResponses = {
      hello: "Hi there! How can I help you today?",
      help: "Sure, I'm here to help. What do you need assistance with?",
      goodbye: "Goodbye! Have a great day!",
    };
  
    const defaultResponse = "Sorry, I didn't understand that. Can you please rephrase?";
  
    const messageLowerCase = userMessage.toLowerCase();
    return botResponses[messageLowerCase] || defaultResponse;
  };
  