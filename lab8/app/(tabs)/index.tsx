import { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

interface BMICategory {
  label: string;
  color: string;
}

const getBMICategory = (bmi: number): BMICategory => {
  if (bmi < 18.5) {
    return { label: 'Thiếu cân', color: '#3498DB' };
  } else if (bmi < 25) {
    return { label: 'Bình thường', color: '#2ECC71' };
  } else if (bmi < 30) {
    return { label: 'Thừa cân', color: '#F39C12' };
  } else {
    return { label: 'Béo phì', color: '#E74C3C' };
  }
};

export default function HomeScreen() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | null>(null);
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState<BMICategory | null>(null);

  const calculateBMI = () => {
    const heightValue = parseFloat(height);
    const weightValue = parseFloat(weight);
    const ageValue = parseFloat(age);

    if (heightValue > 0 && weightValue > 0 && ageValue > 0 && gender) {
      const heightInMeters = heightValue / 100;
      const bmiValue = weightValue / (heightInMeters * heightInMeters);
      const calculatedBMI = parseFloat(bmiValue.toFixed(1));
      setBmi(calculatedBMI);
      setCategory(getBMICategory(calculatedBMI));
    } else {
      alert('Vui lòng nhập đầy đủ thông tin: chiều cao, cân nặng, độ tuổi và chọn giới tính!');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <Text style={styles.title}>BMI Calculator</Text>

            <View style={styles.card}>
              <Text style={styles.label}>Chiều cao (cm)</Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập chiều cao"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={height}
                onChangeText={setHeight}
              />
            </View>

            <View style={styles.card}>
              <Text style={styles.label}>Cân nặng (kg)</Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập cân nặng"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
              />
            </View>

            <View style={styles.card}>
              <Text style={styles.label}>Độ tuổi</Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập độ tuổi"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={age}
                onChangeText={setAge}
              />
            </View>

            <View style={styles.card}>
              <Text style={styles.label}>Giới tính</Text>
              <View style={styles.genderContainer}>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    gender === 'male' && styles.genderButtonActive,
                  ]}
                  onPress={() => setGender('male')}
                >
                  <Text
                    style={[
                      styles.genderButtonText,
                      gender === 'male' && styles.genderButtonTextActive,
                    ]}
                  >
                    Nam
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    gender === 'female' && styles.genderButtonActive,
                  ]}
                  onPress={() => setGender('female')}
                >
                  <Text
                    style={[
                      styles.genderButtonText,
                      gender === 'female' && styles.genderButtonTextActive,
                    ]}
                  >
                    Nữ
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.calculateButton} onPress={calculateBMI}>
              <Text style={styles.calculateButtonText}>Tính BMI</Text>
            </TouchableOpacity>

            {bmi !== null && category && (
              <View style={[styles.resultCard, { borderColor: category.color }]}>
                <Text style={styles.resultTitle}>Kết quả BMI</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.infoText}>
                    {gender === 'male' ? 'Nam' : 'Nữ'}, {age} tuổi
                  </Text>
                </View>
                <Text style={[styles.bmiValue, { color: category.color }]}>
                  {bmi}
                </Text>
                <View style={[styles.categoryBadge, { backgroundColor: category.color }]}>
                  <Text style={styles.categoryText}>{category.label}</Text>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 40,
  },
  card: {
    backgroundColor: '#2D2D44',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#1A1A2E',
    borderRadius: 10,
    padding: 15,
    fontSize: 18,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#3D3D5C',
  },
  calculateButton: {
    backgroundColor: '#4ECDC4',
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  calculateButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  resultCard: {
    backgroundColor: '#2D2D44',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    borderWidth: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  bmiValue: {
    fontSize: 64,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  categoryBadge: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 10,
  },
  genderButton: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3D3D5C',
  },
  genderButtonActive: {
    backgroundColor: '#4ECDC4',
    borderColor: '#4ECDC4',
  },
  genderButtonText: {
    color: '#999',
    fontSize: 18,
    fontWeight: '600',
  },
  genderButtonTextActive: {
    color: '#FFFFFF',
  },
  infoRow: {
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
  },
});
