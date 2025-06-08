import { Tabs } from 'expo-router';
import { Clock } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e5e7eb',
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#6b7280',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Attendance',
          tabBarIcon: ({ size, color }) => (
            <Clock size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}