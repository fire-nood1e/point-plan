import {Redirect, Route} from "react-router-dom";
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
import {chatbubblesOutline, mapOutline, ellipsisHorizontalOutline} from "ionicons/icons";
// import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import Radio from "./pages/Radio.tsx";
import Library from "./pages/Library.tsx";
import Settings from "./pages/Settings.tsx";
import {useAppDispatch, useAppSelector} from "./store.ts";
import {useState} from "react";
import Signup from "./pages/Signup.tsx";
import {completeOnBoarding} from "./store/onBoarding.ts";

function Routes() {
	return (
		<IonRouterOutlet>
			<Route exact path="/map">
				<Radio/>
			</Route>
			<Route exact path="/chat">
				<Library/>
			</Route>
			<Route exact path="/settings">
				<Settings/>
			</Route>
			<Route exact path="/">
				<Redirect to="/chat"/>
			</Route>
		</IonRouterOutlet>
	);
}

function TabBar() {
	return (
		<IonTabs>
			<Routes/>
			<IonTabBar slot="bottom">
				<IonTabButton tab="map" href="/map">
					<IonIcon icon={mapOutline}/>
					<IonLabel>Map</IonLabel>
				</IonTabButton>

				<IonTabButton tab="chat" href="/chat">
					<IonIcon icon={chatbubblesOutline}/>
					<IonLabel>Chat</IonLabel>
				</IonTabButton>

				<IonTabButton tab="settings" href="/settings">
					<IonIcon icon={ellipsisHorizontalOutline}/>
					<IonLabel>Settings</IonLabel>
				</IonTabButton>
			</IonTabBar>  
		</IonTabs>
	);
}

function OnBoarding() {
	const dispatch = useAppDispatch();

	return (
		<IonItem>
			<IonButton onClick={() => dispatch(completeOnBoarding())}>complete onboarding</IonButton>
		</IonItem>
	)
}

function App() {
	const onBoarding = useAppSelector((state) => state.onBoarding.value);
	const user = useAppSelector((state) => state.user.value);
	const [isLoginPage, goLoginPage] = useState(false);
	const goJoinPage = () => {
		goLoginPage(false);
	};

	return (
		<IonApp>
			<IonReactRouter>
				{onBoarding ? <OnBoarding/> : user ? <TabBar/> : isLoginPage ? <Login goJoinPage={goJoinPage}/> :
					<Signup goLoginPage={() => goLoginPage(true)}/>}
			</IonReactRouter>
		</IonApp>
	);
}

export default App;
