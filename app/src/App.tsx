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
import {library, radio, search} from "ionicons/icons";
// import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import Radio from "./pages/Radio.tsx";
import Library from "./pages/Library.tsx";
import Search from "./pages/Search.tsx";
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
				<Search/>
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
				<IonTabButton tab="radio" href="/radio">
					<IonIcon icon={radio}/>
					<IonLabel>Radio</IonLabel>
				</IonTabButton>

				<IonTabButton tab="library" href="/library">
					<IonIcon icon={library}/>
					<IonLabel>Library</IonLabel>
				</IonTabButton>

				<IonTabButton tab="search" href="/search">
					<IonIcon icon={search}/>
					<IonLabel>Search</IonLabel>
				</IonTabButton>
			</IonTabBar>
		</IonTabs>
	);
}

function OnBoarding() {
	// const dispatch = useAppDispatch();

	return (
		<IonItem>
			{/*<IonButton onClick={() => dispatch(completeOnBoarding())}>complete onboarding</IonButton>*/}
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
