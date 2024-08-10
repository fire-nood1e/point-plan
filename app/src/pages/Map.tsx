import {
	IonContent,
	IonDatetime,
	IonDatetimeButton,
	IonLabel,
	IonModal,
	IonSegment,
	IonSegmentButton
} from "@ionic/react";
import {useEffect, useState} from "react";
import "./Map.css";
import {getData} from "../api/data.ts";

function Map() {
	const [map, setMap] = useState<naver.maps.Map | null>(null);
	const [selected, setSelected] = useState("decibel");
	const [datetime, setDatetime] = useState("2024-07-11T10:00:00");
	const [heatMap, setHeatMap] = useState<naver.maps.visualization.HeatMap | null>(null);

	useEffect(() => {
		if (!map) {
			const naverMap = new naver.maps.Map('naver-map', {
				center: new naver.maps.LatLng(36.00568611, 129.3616667),
				zoom: 10
			});

			setMap(naverMap);
			setDatetime("2024-07-11T11:00:00");
		}
	});

	useEffect(() => {
		if (!map) return;
		getData(selected, datetime.replace("T", " ")).then((data) => {
			heatMap?.setMap(null);
			const heatMap_ = new naver.maps.visualization.HeatMap({
				data: data.map((item) => {
					return new naver.maps.visualization.WeightedLocation(item[0], item[1], item[2]);
				}),
				map: map!,
			});
			setHeatMap(heatMap_);
		});
	}, [selected, datetime]);

	return (
		<>
			<IonContent>
				<div id="naver-map" style={{width: "100vw", height: "100vh", position: "absolute", left: "0", top: "0"}}></div>
				<div style={{padding: "10px"}}>
					<IonSegment value={selected} onIonChange={(e) => setSelected(e.detail.value as string)}>
						<IonSegmentButton value="decibel">
							<IonLabel>Decibel</IonLabel>
						</IonSegmentButton>
						<IonSegmentButton value="lightlux">
							<IonLabel>Light</IonLabel>
						</IonSegmentButton>
						<IonSegmentButton value="pm10">
							<IonLabel>Pm10</IonLabel>
						</IonSegmentButton>
						<IonSegmentButton value="pm25">
							<IonLabel>Pm25</IonLabel>
						</IonSegmentButton>
						<IonSegmentButton value="population">
							<IonLabel>Population</IonLabel>
						</IonSegmentButton>
					</IonSegment>
				</div>
				<IonDatetimeButton datetime="datetime"></IonDatetimeButton>

				<IonModal keepContentsMounted={true}>
					<IonDatetime
						id="datetime"
						presentation="date-time"
						value={datetime}
						formatOptions={{
							time: {hour: '2-digit', minute: '2-digit'},
							date: {day: '2-digit', month: 'long'},
						}}
						onIonChange={(e) => setDatetime(e.detail.value as string)}
					></IonDatetime>
				</IonModal>

			</IonContent>
		</>
	);
}

export default Map;
