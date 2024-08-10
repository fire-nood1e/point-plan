import { IonContent, IonHeader, IonTitle, IonToolbar } from "@ionic/react";

function Chat() {
  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Chatting</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          Chatting content
        </div>
      </IonContent>
    </>
  );
}

export default Chat;
