import {useState} from 'react';
import {useHistory} from 'react-router-dom';
import {IonButton, IonContent, IonInput, IonItem, IonLabel} from "@ionic/react";
import {register} from "../api/user.ts";

function Signup({ goLoginPage }: { goLoginPage: () => void }) {
	// 사용자 이름과 비밀번호 상태 관리
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const history = useHistory();  // useHistory 훅 사용

	// 로그인 버튼 클릭 시 호출될 함수
	const handleLogin = async () => {
		// 입력된 사용자 이름과 비밀번호를 출력하거나, 서버에 요청을 보내는 등의 작업을 수행할 수 있습니다.
		await register({username, password});

		// 회원가입 성공 후 로그인 페이지로 이동
		history.push('/login');
	};

	return (
		<>
			<IonContent className="ion-padding">
				<div>
					<h2><strong>Sign up</strong></h2>
				</div>
				<IonItem>
					<IonLabel position="floating"></IonLabel>
					<IonInput
						value={username}
						onIonChange={(e) => setUsername(e.detail.value!)}
						placeholder="Enter your username"
					/>
				</IonItem>
				{/* 비밀번호 입력 */}
				<IonItem>
					<IonLabel position="floating"></IonLabel>
					<IonInput
						type="password"
						value={password}
						onIonChange={(e) => setPassword(e.detail.value!)}
						placeholder="Enter your password"
					/>
				</IonItem>
				{/* 회원가입 버튼 */}
				<IonButton expand="block" onClick={handleLogin}>
					Sign Up
				</IonButton>

				<IonButton onClick={goLoginPage}>
					<p>Join Now</p>
				</IonButton>
			</IonContent>
		</>
	);
}

export default Signup;
