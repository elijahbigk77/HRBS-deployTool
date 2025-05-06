import React, { useEffect, useState } from 'react';
import {
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle,
  IonCardContent, IonButton, IonSpinner
} from '@ionic/react';

const ComputerList: React.FC = () => {
  const [computers, setComputers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComputers = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/computers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            domainController: 'OPNETXNDS90VM01.hireseng.com',
            username: 'hireseng\\enyarko-admin', 
            password: 'E&Nayellis777'
          })
        });
  
        const data = await res.json();
        console.log(data); // or set to state
      } catch (err) {
        console.error('Error fetching computers:', err);
      }
    };
  
    fetchComputers();
  }, []);
  
  if (loading) return <IonSpinner name="dots" />;

  return (
    <>
      {computers.map((comp) => (
        <IonCard key={comp.name}>
          <IonCardHeader>
            <IonCardTitle>{comp.name}</IonCardTitle>
            <IonCardSubtitle>{comp.ip}</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <IonButton color="primary" onClick={() => alert(`Push App to ${comp.name}`)}>Push App</IonButton>
            <IonButton color="tertiary" onClick={() => alert(`Push Script to ${comp.name}`)} className="ion-margin-start">
              Push Script
            </IonButton>
          </IonCardContent>
        </IonCard>
      ))}
    </>
  );
};

export default ComputerList;
