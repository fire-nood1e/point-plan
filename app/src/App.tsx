import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { chatbubblesOutline, playCircle, radio, ellipsisHorizontalOutline } from "ionicons/icons";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import Radio from "./pages/Radio.tsx";
import Library from "./pages/Library.tsx";
import Search from "./pages/Search.tsx";
import Signup from "./pages/Signup.tsx";

function App() {
  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/home">
              <Home />
            </Route>
            <Route exact path="/login">
              <Login />
            </Route>
            <Route exact path="/radio">
              <Radio />
            </Route>
            <Route exact path="/library">
              <Library />
            </Route>
            <Route exact path="/search">
              <Search />
            </Route>
            <Route exact path="/register">
              <Signup />
            </Route>

            <Route exact path="/">
              <Redirect to="/login" />
            </Route>

          </IonRouterOutlet>

          <IonTabBar slot="bottom">
            <IonTabButton tab="home" href="/login">
              <IonIcon icon={playCircle} />
              <IonLabel>Listen now</IonLabel>
            </IonTabButton>

            <IonTabButton tab="radio" href="/radio">
              <IonIcon icon={radio} />
              <IonLabel>Radio</IonLabel>
            </IonTabButton>

            <IonTabButton tab="library" href="/library">
              <IonIcon icon={chatbubblesOutline} />
              <IonLabel>Plan Now</IonLabel>
            </IonTabButton>

            <IonTabButton tab="setting" href="/setting">
              <IonIcon icon={ellipsisHorizontalOutline} />
              <IonLabel>Settings</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
}

export default App;
