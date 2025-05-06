import React, { useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton,
  IonText, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon
} from '@ionic/react';
import { cloudDoneOutline, cloudOfflineOutline } from 'ionicons/icons';
import ComputerList from '../components/ComputerList';

const Dashboard: React.FC = () => {
  const [connected, setConnected] = useState(false);

  const handleConnect = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/connect');
      const data = await res.json();
      if (data.success) {
        setConnected(true);
      }
    } catch (err) {
      console.error('Connection failed:', err);
    }
  };
  
  

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>HRBS Deploy Tool</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Status</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonText color={connected ? 'success' : 'danger'}>
              <p>
                <IonIcon icon={connected ? cloudDoneOutline : cloudOfflineOutline} /> 
                {connected ? ' Connected to Domain Controller' : ' Not Connected'}
              </p>
            </IonText>
            <IonButton expand="block" onClick={handleConnect} disabled={connected}>
              Connect to Domain Controller
            </IonButton>
          </IonCardContent>
        </IonCard>
        {connected && <ComputerList />}
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;
