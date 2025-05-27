import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SnippetProvider } from '../context/SnippetContext';

export default function RootLayout() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" backgroundColor="#ffffff" translucent={false} />
      <SnippetProvider>
        <Stack 
          screenOptions={{
            headerShown: false,
            statusBarStyle: 'dark',
            statusBarBackgroundColor: '#ffffff'
          }}
        >
        </Stack>
      </SnippetProvider>
    </View>
  );
}