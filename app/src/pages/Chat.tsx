import React, {useContext, useEffect, useState} from "react";
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
  IonLoading
} from "@ionic/react";
import {ellipsisHorizontal, ellipsisVertical, search} from "ionicons/icons";
import "./Chat.css";
import "../theme/tab-bar.css"
import {createChat, createMessages} from "../server-api/chat.ts";
import Markdown from "react-markdown";
import {LocationContext} from "../store.ts";

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
	const {setLocation} = useContext(LocationContext);
  const [loading, setLoading] = useState(false); // 로딩 상태 추가

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

    setLoading(true); // 로딩 시작

		createMessages(chatId!, {message: currentMessage}).then((message) => {
			const botMessage = {sender: "bot", text: message!.message};
			const query = botMessage.text.match(/포항[가-힣 \d]+/)![0];
			naver.maps.Service.geocode({
				query,
			}, function (status, response) {
				if (status !== naver.maps.Service.Status.OK) {
					console.error("Failed to find location");
					return;
				}

				console.log(response);

				const {x, y} = response.v2.addresses[0];
				setLocation(`${x},${y}`);
			});
			setMessages([...messages, userMessage, botMessage]);
      setLoading(false); // 로딩 종료
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

      <IonLoading
          className="custom-loading"
          isOpen={loading} // 로딩 상태에 따라 표시 여부 결정
          message={"Planning in progress..."} // 로딩 메시지
          duration={0} // 자동으로 닫히지 않도록 설정
        />

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
