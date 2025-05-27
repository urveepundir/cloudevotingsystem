
console.log('LoginScreen rendered');

import React from 'react';
import { View, Text, Button } from 'react-native';

export default function ConfirmationScreen({ navigation }) {
  return (
    <View style={{ padding: 20 }}>
      <Text>✅ Your vote has been recorded!</Text>
      <Button title="View Stats" onPress={() => navigation.navigate('Stats')} />
    </View>
  );
}
