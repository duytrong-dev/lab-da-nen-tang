import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';

const diceImages = {
  1: require('@/assets/images/dice1.png'),
  2: require('@/assets/images/dice2.png'),
  3: require('@/assets/images/dice3.png'),
  4: require('@/assets/images/dice4.png'),
  5: require('@/assets/images/dice5.png'),
  6: require('@/assets/images/dice6.png'),
};

export default function HomeScreen() {
  const [dice1, setDice1] = useState(1);
  const [dice2, setDice2] = useState(1);

  const rollDice = () => {
    const newDice1 = Math.floor(Math.random() * 6) + 1;
    const newDice2 = Math.floor(Math.random() * 6) + 1;
    setDice1(newDice1);
    setDice2(newDice2);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Dice Game</Text>
        
        <View style={styles.diceContainer}>
          <View style={styles.diceWrapper}>
            <Image
              source={diceImages[dice1 as keyof typeof diceImages]}
              style={styles.dice}
              contentFit="contain"
            />
          </View>
          
          <View style={styles.diceWrapper}>
            <Image
              source={diceImages[dice2 as keyof typeof diceImages]}
              style={styles.dice}
              contentFit="contain"
            />
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={rollDice}>
          <Text style={styles.buttonText}>Roll Dice</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4A90E2',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 50,
    textAlign: 'center',
  },
  diceContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30,
    marginBottom: 50,
  },
  diceWrapper: {
    width: 120,
    height: 120,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  dice: {
    width: 100,
    height: 100,
  },
  button: {
    backgroundColor: '#E74C3C',
    paddingVertical: 18,
    paddingHorizontal: 50,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
