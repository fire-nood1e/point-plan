import {IonContent, IonHeader, IonItem, IonList, IonTitle, IonToolbar, IonImg,
	IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle} from "@ionic/react";
import {logout} from "../server-api/user.ts";
import {UserContext} from "../store.ts";
import {useContext} from "react";


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

				<div style={{
						textAlign: "center",
						marginTop: "15px",
					}} >
				<h3>My Page</h3>
				{/* <p onClick={() => logout(setUser)}>Logout</p> */}
				</div>
				<IonList>
					
				<h2 style={{
					marginLeft: "20px",
				}}>📝 Reports</h2>

				<IonCard>
					<IonCardHeader>
						<IonCardTitle>Quiet Cafe</IonCardTitle>
						<IonCardSubtitle>2024.08.09</IonCardSubtitle>
					</IonCardHeader>

					<IonCardContent>Here's a small text description for the card content. Nothing more, nothing less.</IonCardContent>
				</IonCard>
				</IonList>
				<IonImg
					src="../assets/imgs/popo.png"
					alt="My name is Popo"
					
					style={
						{
							width: "200px",
							height: "auto",
							display: "block",
							position: "absolute",
							bottom: "180px",
							right: "20px",
						}
					}
				></IonImg>
				

			</IonContent>
		</>
	);
}

export default Settings;
