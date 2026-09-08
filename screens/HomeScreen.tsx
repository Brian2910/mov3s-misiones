import { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, ActivityIndicator, RefreshControl, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMissions } from '../context/MissionsContext';
import { fetchAiSuggestion, MissionSuggestion } from '../api/aiSuggestions';
import { Mission } from '../types/Mission';
import type { RootStackParamList } from '../App';

type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const { t, i18n } = useTranslation();
  const { missions, loading, refreshing, error, refresh } = useMissions();
  const navigation = useNavigation<HomeNavigationProp>();

  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<MissionSuggestion | null>(null);

  const totalPoints = missions
    .filter((m) => m.completed)
    .reduce((sum, m) => sum + m.points, 0);

  function toggleLanguage() {
    i18n.changeLanguage(i18n.language === 'es' ? 'en' : 'es');
  }

  function askForSuggestion() {
    setAiLoading(true);
    setAiError(null);
    setSuggestion(null);

    fetchAiSuggestion()
      .then((result) => setSuggestion(result))
      .catch(() => setAiError('No se pudo generar una sugerencia, probá de nuevo.'))
      .finally(() => setAiLoading(false));
  }

  function closeSuggestion() {
    setSuggestion(null);
    setAiError(null);
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2e7d32" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>⭐ {totalPoints} {t('points')}</Text>
        <Pressable style={styles.langButton} onPress={toggleLanguage}>
          <Text style={styles.langButtonText}>
            {i18n.language === 'es' ? 'EN' : 'ES'}
          </Text>
        </Pressable>
      </View>

      <Pressable style={styles.aiButton} onPress={askForSuggestion} disabled={aiLoading}>
        {aiLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.aiButtonText}>✨ Sugerime una misión</Text>
        )}
      </Pressable>

      <FlatList
        data={missions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MissionCard
            mission={item}
            onPress={() => navigation.navigate('MissionDetail', { missionId: item.id })}
          />
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} colors={['#2e7d32']} />
        }
      />

      <Modal
        visible={suggestion !== null || aiError !== null}
        transparent
        animationType="fade"
        onRequestClose={closeSuggestion}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            {suggestion && (
              <>
                <Text style={styles.modalTitle}>{suggestion.title}</Text>
                <Text style={styles.modalDescription}>{suggestion.description}</Text>
                <Text style={styles.modalPoints}>⭐ {suggestion.suggestedPoints} pts sugeridos</Text>
              </>
            )}
            {aiError && <Text style={styles.modalError}>{aiError}</Text>}
            <Pressable style={styles.modalClose} onPress={closeSuggestion}>
              <Text style={styles.modalCloseText}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function MissionCard({ mission, onPress }: { mission: Mission; onPress: () => void }) {
  const { t } = useTranslation();
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{mission.title}</Text>
      <Text style={styles.description}>{mission.description}</Text>
      <View style={styles.statusRow}>
        <Text style={mission.completed ? styles.completed : styles.pending}>
          {mission.completed ? `✅ ${t('completed')}` : `⏳ ${t('pending')}`}
        </Text>
        <Text style={styles.pending}>{mission.points} {t('points')}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#2e7d32',
  },
  headerText: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  langButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  langButtonText: { color: '#fff', fontWeight: '600' },
  aiButton: {
    backgroundColor: '#6a1b9a',
    margin: 16,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  aiButtonText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  list: { padding: 16, paddingTop: 0 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#222' },
  description: { fontSize: 14, color: '#666', marginBottom: 10 },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  completed: { color: '#2e7d32', fontWeight: '600' },
  pending: { color: '#b8860b', fontWeight: '600' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '85%',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, color: '#222' },
  modalDescription: { fontSize: 14, color: '#555', marginBottom: 12 },
  modalPoints: { fontSize: 15, fontWeight: '600', color: '#6a1b9a', marginBottom: 16 },
  modalError: { fontSize: 15, color: '#c62828', marginBottom: 16 },
  modalClose: { alignItems: 'center', padding: 10 },
  modalCloseText: { color: '#2e7d32', fontWeight: '600' },
});