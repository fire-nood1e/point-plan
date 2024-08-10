import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonContent, IonInput, IonItem, IonLabel, IonButton, IonRouterLink } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

function Login() {

    // 사용자 이름과 비밀번호 상태 관리
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();  // useHistory 훅 사용

    // 로그인 버튼 클릭 시 호출될 함수
    const handleLogin = () => {
        // 입력된 사용자 이름과 비밀번호를 출력하거나, 서버에 요청을 보내는 등의 작업을 수행할 수 있습니다.
        console.log('Username:', username);
        console.log('Password:', password);

        // 로그인 성공 후 홈으로 이동
        history.push('/home');
    };

  return (
    <>
      <IonContent className="ion-padding">
      <div>
            <h2><strong>Login</strong></h2>
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
            {/* 로그인 버튼 */}
            <IonButton expand="block" onClick={handleLogin}>
            Login
            </IonButton>
            <IonReactRouter>
                <IonRouterLink href="/register">
                    <p>Join Now</p>
                </IonRouterLink>
            </IonReactRouter>
      </IonContent>
    </>
  );
}

export default Login;
