import { IonContent, IonHeader, IonTitle, IonToolbar } from "@ionic/react";

function Settings() {
  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Search</IonTitle>
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
          Search content
        </div>
      </IonContent>
    </>
  );
}

export default Settings;
