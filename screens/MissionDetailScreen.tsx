import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../App';
import { useMissions } from '../context/MissionsContext';

type DetailRouteProp = RouteProp<RootStackParamList, 'MissionDetail'>;

export default function MissionDetailScreen() {
  const { t } = useTranslation();
  const route = useRoute<DetailRouteProp>();
  const navigation = useNavigation();
  const { missions, toggleMission } = useMissions();

  const { missionId } = route.params;
  const mission = missions.find((m) => m.id === missionId);

  if (!mission) {
    return (
      <View style={styles.centered}>
        <Text>Misión no encontrada</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{mission.title}</Text>
      <Text style={styles.description}>{mission.description}</Text>

      <View style={styles.pointsBox}>
        <Text style={styles.pointsText}>⭐ {mission.points} {t('points')}</Text>
      </View>

      <Text style={mission.completed ? styles.completed : styles.pending}>
        {mission.completed ? `✅ ${t('completed')}` : `⏳ ${t('pending')}`}
      </Text>

      <Pressable
        style={[styles.button, mission.completed ? styles.buttonUndo : styles.buttonComplete]}
        onPress={() => toggleMission(mission.id)}
      >
        <Text style={styles.buttonText}>
          {mission.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
        </Text>
      </Pressable>

      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Volver</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fafafa' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#222', marginBottom: 8 },
  description: { fontSize: 16, color: '#555', marginBottom: 20 },
  pointsBox: {
    backgroundColor: '#2e7d32',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  pointsText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  completed: { color: '#2e7d32', fontWeight: '600', fontSize: 16, marginBottom: 24 },
  pending: { color: '#b8860b', fontWeight: '600', fontSize: 16, marginBottom: 24 },
  button: { borderRadius: 8, padding: 14, alignItems: 'center', marginBottom: 12 },
  buttonComplete: { backgroundColor: '#2e7d32' },
  buttonUndo: { backgroundColor: '#b8860b' },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  backButton: { alignItems: 'center', padding: 10 },
  backButtonText: { color: '#555', fontSize: 15 },
});