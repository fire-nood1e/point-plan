import {IonContent, IonHeader, IonItem, IonList, IonTitle, IonToolbar} from "@ionic/react";
import {logout} from "../api/user.ts";
import {UserContext} from "../store.ts";
import {useContext} from "react";

function Settings() {
	const {setUser} = useContext(UserContext);

	return (
		<>
			<IonHeader>
				<IonToolbar>
					<IonTitle>Search</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent>
				<IonList>
					<IonItem onClick={() => logout(setUser)}>
						Logout
					</IonItem>
				</IonList>
			</IonContent>
		</>
	);
}

export default Settings;
