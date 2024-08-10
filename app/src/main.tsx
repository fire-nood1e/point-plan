import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {IonApp, setupIonicReact} from "@ionic/react";
import App from "./App.tsx";

import "@ionic/react/css/core.css"; /* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css"; /* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
// import "@ionic/react/css/palettes/dark.system.css"; /* Theme variables */
import "./theme/variables.css";
import "./theme/tab-bar.css";
import {Provider} from "react-redux";
import store from "./store.ts";

setupIonicReact({
	mode: "ios",
});

const queryClient = new QueryClient();

// Render the app
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<Provider store={store}>
				<IonApp>
					<App/>
				</IonApp>
			</Provider>
		</QueryClientProvider>
	</StrictMode>,
);
