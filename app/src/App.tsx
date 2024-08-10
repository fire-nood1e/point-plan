import {Redirect, Route} from "react-router-dom";
import {IonApp, IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs,} from "@ionic/react";
import {IonReactRouter} from "@ionic/react-router";
import {library, radio, search} from "ionicons/icons";
// import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import Radio from "./pages/Radio.tsx";
import Library from "./pages/Library.tsx";
import Search from "./pages/Search.tsx";
import {useAppSelector} from "./store.ts";

function TabBar() {
	return (
		<IonTabs>
			<IonRouterOutlet>
				<Route exact path="/radio">
					<Radio/>
				</Route>
				<Route exact path="/library">
					<Library/>
				</Route>
				<Route exact path="/search">
					<Search/>
				</Route>
				<Route exact path="/">
					<Redirect to="/login"/>
				</Route>
			</IonRouterOutlet>

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

function App() {
	const user = useAppSelector((state) => state.user.value);

	return (
		<IonApp>
			<IonReactRouter>
				{
					user ? <TabBar/> : <Login/>
				}
			</IonReactRouter>
		</IonApp>
	);
}

export default App;
