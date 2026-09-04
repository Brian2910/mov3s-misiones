import { View, Text, StyleSheet } from 'react-native';

export default function MissionDetailScreen() {
  return (
    <View style={styles.container}>
      <Text>Detalle de la misión</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});