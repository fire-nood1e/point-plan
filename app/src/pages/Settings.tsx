import {IonContent, IonHeader, IonItem, IonList, IonTitle, IonToolbar, IonImg,
	IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle} from "@ionic/react";
import {logout} from "../server-api/user.ts";
import {UserContext} from "../store.ts";
import {useContext} from "react";
import "./More.css";

function Settings() {
	const {setUser} = useContext(UserContext);

	return (
		<>
			<IonHeader>
				<IonToolbar>
					<IonTitle>See More</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent>
				<IonImg
					src="../assets/imgs/profile.png"
					style={
						{
							width: "80px",
							height: "auto",
							display: "block",
							margin: "auto",
							position: "relative",
							top: "10px",
						}
					}
					>
					</IonImg>
				<h3>username</h3>
				<IonList>
					<IonItem onClick={() => logout(setUser)}>
						Logout
					</IonItem>
				</IonList>
				<IonCard>
					<IonCardHeader>
						<IonCardTitle>Quiet Cafe</IonCardTitle>
						<IonCardSubtitle>2024.08.09</IonCardSubtitle>
					</IonCardHeader>

					<IonCardContent>Here's a small text description for the card content. Nothing more, nothing less.</IonCardContent>
				</IonCard>
				<IonImg
					src="../assets/imgs/popo.png"
					alt="My name is Popo"
					
					style={
						{
							width: "50%",
							height: "auto",
							display: "block",
							position: "absolute",
							bottom: "100px",
							right: "20px",
						}
					}
				></IonImg>

			</IonContent>
		</>
	);
}

export default Settings;
