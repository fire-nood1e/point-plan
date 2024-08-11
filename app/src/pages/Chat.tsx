import React, {useEffect, useState} from "react";
import {
	IonButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonIcon,
	IonInput,
	IonItem,
	IonLabel,
	IonList,
	IonTitle,
	IonToolbar,
} from "@ionic/react";
import {ellipsisHorizontal, ellipsisVertical, search} from "ionicons/icons";
import "./Chat.css";
import "../theme/tab-bar.css"
import {createChat, createMessages} from "../api/chat.ts";
import Markdown from "react-markdown";

function Chat() {
	const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
		[{
			sender: "bot",
			text:
				`## Hello! How can I help you?
				
### Please tell us your __interests__ to start planning.`,
		}]
	);
	const [currentMessage, setCurrentMessage] = useState("");
	const [chatId, setChatId] = useState<number | null>(null);

	useEffect(() => {
		if (chatId === null) {
			createChat({chat_name: "Chatting"}).then((chat) => {
				setChatId(chat!.chat_id);
			});
		}
	}, []);

	const handleSendMessage = () => {
		if (currentMessage.trim() === "") return;

		const userMessage = {sender: "user", text: currentMessage};
		setMessages([...messages, userMessage]);

		createMessages(chatId!, {message: currentMessage}).then((message) => {
			const botMessage = {sender: "bot", text: message!.message};
			setMessages([...messages, userMessage, botMessage]);
		});

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

					<IonTitle>Plan Now</IonTitle>

					<IonButtons slot="primary">
						<IonButton>
							<IonIcon slot="icon-only" icon={search}></IonIcon>
						</IonButton>
					</IonButtons>

				</IonToolbar>
			</IonHeader>

			<IonContent className="chatContainer">

				<div className="flexContainer">
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
											backgroundColor: message.sender === "user" ? "#c6ebff" : "#fff7ee",
											color: message.sender === "user" ? "#fff" : "#000",
											padding: "10px",
											borderRadius: "10px",
											maxWidth: "85%",
										}}
									>
										<Markdown>
											{message.text}
										</Markdown>
									</IonLabel>
								</div>
							</IonItem>
						))}
					</IonList>
				</div>

				<div className="inputContainer">
					<IonInput
						value={currentMessage}
						placeholder="Type a message..."
						onInput={(e) => setCurrentMessage(e.target.value!)}
						style={{flex: 1}}
					/>
					<IonButton onClick={handleSendMessage}>Send</IonButton>
				</div>

			</IonContent>

		</>
	);
}

export default Chat;
