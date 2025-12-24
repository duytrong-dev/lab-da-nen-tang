import { Image } from 'expo-image';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={require('@/assets/images/avatar.jpg')}
          style={styles.avatar}
          contentFit="cover"
        />
        <Text style={styles.name}>Nguyễn Duy Trọng</Text>
        <Text style={styles.title}>Web Developer</Text>
        
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Ionicons name="call" size={24} color="#FFFFFF" style={styles.icon} />
            <Text style={styles.infoText}>+12 3456798</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="mail" size={24} color="#FFFFFF" style={styles.icon} />
            <Text style={styles.infoText}>trongnd.22it@vku.udn.vn</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6C5CE7', // Màu tím thay vì teal
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 30,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  title: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 50,
    textAlign: 'center',
    opacity: 0.9,
  },
  infoContainer: {
    width: '100%',
    gap: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '100%',
  },
  icon: {
    marginRight: 15,
  },
  infoText: {
    fontSize: 16,
    color: '#6C5CE7',
    flex: 1,
  },
});
