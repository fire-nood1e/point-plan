import React, { useState } from "react";
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonInput,
  IonButtons,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
} from "@ionic/react";
import { ChatBot } from "../components/ChatBot";
import { search, ellipsisHorizontal, ellipsisVertical } from "ionicons/icons";
import "./Chat.css";
import "../theme/tab-bar.css"

function Chat() {

  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [currentMessage, setCurrentMessage] = useState("");

  const handleSendMessage = () => {
    if (currentMessage.trim() === "") return;

    const userMessage = { sender: "user", text: currentMessage };
    setMessages([...messages, userMessage]);

    const botReply = ChatBot(currentMessage);
    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: botReply },
      ]);
    }, 1000);

    setCurrentMessage("");
  };

  return (
    <>
        <IonHeader>
          <IonToolbar>

          <IonButtons slot="secondary">
            <IonButton>
              <IonIcon slot="icon-only" ios={ellipsisHorizontal} md={ellipsisVertical}></IonIcon>
            </IonButton>
          </IonButtons>

            <IonTitle>Chatting</IonTitle>

            <IonButtons slot="primary">
            <IonButton>
              <IonIcon slot="icon-only" icon={search}></IonIcon>
            </IonButton>
          </IonButtons>

          </IonToolbar>
        </IonHeader>
      
        <IonContent className="chatContainer">

          <IonList className="messageList">
          {messages.map((message, index) => (
            <IonItem key={index} className={message.sender}>
              <div
                style={{
                  display: "flex",
                  justifyContent: message.sender === "user" ? "flex-end" : "flex-start",
                  width: "100%",
                }}
              >
                <IonLabel
                  style={{
                    backgroundColor: message.sender === "user" ? "#21AAFF" : "#FFEFD7",
                    color: message.sender === "user" ? "#fff" : "#000",
                    padding: "10px",
                    borderRadius: "10px",
                    maxWidth: "70%",
                  }}
                >
                  {message.text}
                </IonLabel>
                </div>
              </IonItem>
            ))}
          </IonList>

          <div className="inputContainer">
            <IonInput
              value={currentMessage}
              placeholder="Type a message..."
              onIonChange={(e) => setCurrentMessage(e.detail.value!)}
              style={{ flex: 1 }}
            />
            <IonButton onClick={handleSendMessage}>Send</IonButton>
          </div>

        </IonContent>
        
    </>
  );
}

export default Chat;
