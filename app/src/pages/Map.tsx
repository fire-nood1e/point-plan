import { IonContent, IonHeader, IonTitle, IonToolbar } from "@ionic/react";

function Map() {
  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Map</IonTitle>
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
          Map content
        </div>
      </IonContent>
    </>
  );
}

export default Map;
