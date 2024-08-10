import {IonContent} from "@ionic/react";
import {useEffect} from "react";

function Map() {
	useEffect(() => {
		const naverMap = new naver.maps.Map('naver-map', {
			center: new naver.maps.LatLng(36.00568611, 129.3616667),
			zoom: 10
		});

		const marker = new naver.maps.Marker({
			position: new naver.maps.LatLng(36.00568611, 129.3616667),
			map: naverMap
		});
	});

	return (
		<>
			<IonContent>
				<div id="naver-map" style={{width: "100vw", height: "100vh"}}></div>
			</IonContent>
		</>
	);
}

export default Map;
