import { IonContent, IonHeader, IonTitle, IonToolbar } from "@ionic/react";

function Radio() {
  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Radio</IonTitle>
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
          Radio content
        </div>
      </IonContent>
    </>
  );
}

export default Radio;
