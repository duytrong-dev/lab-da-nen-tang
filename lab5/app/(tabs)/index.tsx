import { StyleSheet, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { Audio } from 'expo-av';

const keys = [
  { color: '#E74C3C', sound: require('@/assets/sounds/note1.wav'), id: 1 }, // Red
  { color: '#F39C12', sound: require('@/assets/sounds/note2.wav'), id: 2 }, // Orange
  { color: '#F1C40F', sound: require('@/assets/sounds/note3.wav'), id: 3 }, // Yellow
  { color: '#2ECC71', sound: require('@/assets/sounds/note4.wav'), id: 4 }, // Green
  { color: '#3498DB', sound: require('@/assets/sounds/note5.wav'), id: 5 }, // Blue
  { color: '#9B59B6', sound: require('@/assets/sounds/note6.wav'), id: 6 }, // Purple
];

export default function HomeScreen() {
  const playSound = async (sound: any) => {
    try {
      const { sound: soundObject } = await Audio.Sound.createAsync(sound);
      await soundObject.playAsync();
      soundObject.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          soundObject.unloadAsync();
        }
      });
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {keys.map((key) => (
          <TouchableOpacity
            key={key.id}
            style={[styles.key, { backgroundColor: key.color }]}
            onPress={() => playSound(key.sound)}
            activeOpacity={0.8}
          />
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
    gap: 10,
  },
  key: {
    flex: 1,
    borderRadius: 20,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
