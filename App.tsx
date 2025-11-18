import "./global.css";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Button from "./src/components/buttons/Button";

export default function App() {
  return (
    <View style={styles.container}>
      <Text className='text-2xl bg-red-400'>Tired of not having any fun media? just Enddit!</Text>
      <Text>Hej</Text>
      <Button title="Test button"/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
