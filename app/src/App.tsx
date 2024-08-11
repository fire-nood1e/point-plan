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
import {LocationContext, UserContext} from "./store.ts";
import {useEffect, useState} from "react";
import Signup from "./pages/Signup.tsx";
import {Preferences} from "@capacitor/preferences";
import { SplashScreen } from '@capacitor/splash-screen';
import {myInfo, User} from "./api/user.ts";
import {Redirect, useLocation} from "react-router";

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
				<Redirect exact path="/" to="/chat"/>
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

  useEffect(() => {
    const showSplashScreen = async () => {
      // 스플래시 스크린 표시
      await SplashScreen.show({
        showDuration: 3000, // 2초 동안 표시
        autoHide: true, // 자동으로 숨기기
      });
    };

    showSplashScreen();
  }, []);

	const [onBoarding, setOnBoarding] = useState(onBoardingPreference);
	const [user, setUser] = useState(userPreference);
	const [isLoginPage, goLoginPage] = useState(false);
	const goJoinPage = () => {
		goLoginPage(false);
	};
	const [location, setLocation] = useState<string | null>(null);

	const completeOnBoarding = () => {
		Preferences.set({key: "onBoarding", value: "complete"});
		setOnBoarding(true);
	};

	return (
		<IonApp>
			<UserContext.Provider value={{user, setUser}}>
				<LocationContext.Provider value={{location, setLocation}}>
					<IonReactRouter>
						{!onBoarding ? <OnBoarding completeOnBoarding={completeOnBoarding}/> : user ? <TabBar/> : isLoginPage ?
							<Login goJoinPage={goJoinPage}/> :
							<Signup goLoginPage={() => goLoginPage(true)}/>}
					</IonReactRouter>
				</LocationContext.Provider>
			</UserContext.Provider>
		</IonApp>
	);
}

export default App;
