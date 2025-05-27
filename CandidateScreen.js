console.log('LoginScreen rendered');

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import { Auth } from 'aws-amplify';

export default function CandidateScreen({ navigation }) {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const token = (await Auth.currentSession()).getIdToken().getJwtToken();
      const response = await axios.get('https://YOUR_API_ENDPOINT/candidates', {
        headers: { Authorization: token },
      });
      setCandidates(response.data);
    } catch (error) {
      console.log('Error fetching candidates:', error);
      Alert.alert('Error', 'Failed to load candidates.');
    } finally {
      setLoading(false);
    }
  };

  const voteForCandidate = async (candidate_id) => {
    try {
      setVoting(true);
      const user = await Auth.currentAuthenticatedUser();
      const token = (await Auth.currentSession()).getIdToken().getJwtToken();

      const votePayload = {
        candidate_id,
        user_id: user.username,
      };

      await axios.post('https://YOUR_API_ENDPOINT/vote', votePayload, {
        headers: { Authorization: token },
      });

      Alert.alert('Success', 'Your vote has been recorded.', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Confirmation'),
        },
      ]);
    } catch (error) {
      console.log('Error submitting vote:', error);
      Alert.alert('Error', 'Failed to submit your vote.');
    } finally {
      setVoting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Loading candidates...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={candidates}
        keyExtractor={(item) => item.candidate_id}
        renderItem={({ item }) => (
          <View style={styles.candidateCard}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.party}>{item.party}</Text>
            <Button
              title={voting ? 'Voting...' : 'Vote'}
              onPress={() => voteForCandidate(item.candidate_id)}
              disabled={voting}
            />
          </View>
        )}
        ListEmptyComponent={<Text>No candidates found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  candidateCard: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  party: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  centered: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
