import {Route} from "react-router-dom";
import {
	IonApp,
	IonButton,
	IonIcon,
	IonItem,
	IonLabel,
	IonRouterOutlet,
	IonTabBar,
	IonTabButton,
	IonTabs,
} from "@ionic/react";
import {IonReactRouter} from "@ionic/react-router";
import {chatbubblesOutline, ellipsisHorizontalOutline, mapOutline} from "ionicons/icons";
// import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import Map from "./pages/Map.tsx";
import Chat from "./pages/Chat.tsx";
import Settings from "./pages/Settings.tsx";
import {UserContext} from "./store.ts";
import {useState} from "react";
import Signup from "./pages/Signup.tsx";
import {Preferences} from "@capacitor/preferences";
import {User} from "./api/user.ts";
import {useLocation} from "react-router";

function TabBar() {
	const location = useLocation();

	return (
		<IonTabs>
			<IonRouterOutlet>
				<Route exact path="/map">
					<Map/>
				</Route>
				<Route exact path="/chat">
					<Chat/>
				</Route>
				<Route exact path="/settings">
					<Settings/>
				</Route>
			</IonRouterOutlet>

			<IonTabBar slot="bottom">
				<IonTabButton tab="map" href="/map" selected={location.pathname.startsWith("/map")}>
					<IonIcon icon={mapOutline}/>
					<IonLabel>Map</IonLabel>
				</IonTabButton>

				<IonTabButton tab="chat" href="/chat" selected={location.pathname.startsWith("/chat")}>
					<IonIcon icon={chatbubblesOutline}/>
					<IonLabel>Chat</IonLabel>
				</IonTabButton>

				<IonTabButton tab="settings" href="/settings" selected={location.pathname.startsWith("/settings")}>
					<IonIcon icon={ellipsisHorizontalOutline}/>
					<IonLabel>Settings</IonLabel>
				</IonTabButton>
			</IonTabBar>
		</IonTabs>
	);
}

function OnBoarding({completeOnBoarding}: { completeOnBoarding: () => void }) {
	return (
		<IonItem>
			onBoarding
			<IonButton onClick={completeOnBoarding}>complete onboarding</IonButton>
		</IonItem>
	)
}

const onBoardingPreference = (await Preferences.get({key: "onBoarding"})).value == null;
const _userPreference = (await Preferences.get({key: "user"})).value;
let userPreference: User | null = null;
if (_userPreference) {
	userPreference = JSON.parse(_userPreference) as User;
}

function App() {
	const [onBoarding, setOnBoarding] = useState(onBoardingPreference);
	const [user, setUser] = useState(userPreference);
	const [isLoginPage, goLoginPage] = useState(false);
	const goJoinPage = () => {
		goLoginPage(false);
	};

	const completeOnBoarding = () => {
		Preferences.set({key: "onBoarding", value: "complete"});
		setOnBoarding(true);
	};

	return (
		<IonApp>
			<UserContext.Provider value={{user, setUser}}>
				<IonReactRouter>
					{!onBoarding ? <OnBoarding completeOnBoarding={completeOnBoarding}/> : user ? <TabBar/> : isLoginPage ?
						<Login goJoinPage={goJoinPage}/> :
						<Signup goLoginPage={() => goLoginPage(true)}/>}
				</IonReactRouter>
			</UserContext.Provider>
		</IonApp>
	);
}

export default App;
