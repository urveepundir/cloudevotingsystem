console.log('LoginScreen rendered');

import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { Auth } from 'aws-amplify';
import axios from 'axios';

const API = 'https://YOUR_API_ID.execute-api.YOUR_REGION.amazonaws.com';

export default function EligibilityScreen({ navigation }) {
  const [eligible, setEligible] = useState(null);

  useEffect(() => {
    const checkEligibility = async () => {
      const user = await Auth.currentAuthenticatedUser();
      const session = await Auth.currentSession();
      const token = session.getIdToken().getJwtToken();

      const res = await axios.get(`${API}/checkEligibility`, {
        headers: { Authorization: token }
      });

      setEligible(res.data.eligible);
    };

    checkEligibility();
  }, []);

  if (eligible === null) return <Text>Checking eligibility...</Text>;
  if (!eligible) return <Text>You are not eligible to vote.</Text>;

  return (
    <View>
      <Text>You are eligible!</Text>
      <Button title="Proceed to Vote" onPress={() => navigation.navigate('Candidates')} />
    </View>
  );
}
