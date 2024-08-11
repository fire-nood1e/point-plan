import {
	IonContent,
	IonDatetime,
	IonDatetimeButton,
	IonLabel,
	IonModal,
	IonSegment,
	IonSegmentButton
} from "@ionic/react";
import {useContext, useEffect, useState} from "react";
import "./Map.css";
import {getData} from "../api/data.ts";
import {LocationContext} from "../store.ts";

function Map() {
	const [map, setMap] = useState<naver.maps.Map | null>(null);
	const [selected, setSelected] = useState("decibel");
	const [datetime, setDatetime] = useState("2024-07-11T10:00:00");
	const [heatMap, setHeatMap] = useState<naver.maps.visualization.HeatMap | null>(null);
	const {location, setLocation} = useContext(LocationContext);
	const [marker, setMarker] = useState<naver.maps.Marker | null>(null);

	useEffect(() => {
		if (!map) {
			const naverMap = new naver.maps.Map('naver-map', {
				center: new naver.maps.LatLng(36.07, 129.4),
				zoom: 11
			});

			setMap(naverMap);
			setDatetime("2024-07-11T11:00:00");
			setLocation(location+"0");
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

	useEffect(() => {
		if (!map) return;
		marker?.setMap(null);
		if (!location) return;
		const [lng, lat] = location.split(",").map((item) => parseFloat(item));
		const marker_ = new naver.maps.Marker({
			position: new naver.maps.LatLng(lat, lng),
			map: map!
		});
		setMarker(marker_);
	}, [location]);

	return (
		<>
			<IonContent>
				<div id="naver-map" style={{width: "100vw", height: "100vh", position: "absolute", left: "0", top: "0"}}></div>
				<div style={{padding: "10px", paddingTop: "60px"}}>
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
