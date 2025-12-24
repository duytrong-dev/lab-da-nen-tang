import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, SafeAreaView } from 'react-native';

const ballImages = {
  1: require('@/assets/images/ball1.png'),
  2: require('@/assets/images/ball2.png'),
  3: require('@/assets/images/ball3.png'),
  4: require('@/assets/images/ball4.png'),
  5: require('@/assets/images/ball5.png'),
};

export default function HomeScreen() {
  const [ballImage, setBallImage] = useState(1);

  const changeBall = () => {
    const randomBall = Math.floor(Math.random() * 5) + 1;
    setBallImage(randomBall);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity onPress={changeBall} activeOpacity={0.9}>
          <Image
            source={ballImages[ballImage as keyof typeof ballImages]}
            style={styles.ball}
            contentFit="contain"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  ball: {
    width: 300,
    height: 300,
  },
});
