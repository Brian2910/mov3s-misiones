import './i18n';
import { useTranslation } from 'react-i18next';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MissionsProvider } from './context/MissionsContext';
import HomeScreen from './screens/HomeScreen';
import MissionDetailScreen from './screens/MissionDetailScreen';

export type RootStackParamList = {
  Home: undefined;
  MissionDetail: { missionId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const { t } = useTranslation();

 return (
    <MissionsProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: t('missions') }}
          />
          <Stack.Screen
            name="MissionDetail"
            component={MissionDetailScreen}
            options={{ title: t('missionDetail') }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </MissionsProvider>
  );
}