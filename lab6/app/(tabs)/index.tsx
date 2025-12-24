import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Alert } from 'react-native';

interface Question {
  question: string;
  answer: boolean;
}

const questions: Question[] = [
  { question: 'React Native là một framework để phát triển ứng dụng di động.', answer: true },
  { question: 'JavaScript và Java là cùng một ngôn ngữ lập trình.', answer: false },
  { question: 'TypeScript là một superset của JavaScript.', answer: true },
  { question: 'Expo là một công cụ để phát triển ứng dụng React Native.', answer: true },
  { question: 'CSS không thể sử dụng trong React Native.', answer: true },
  { question: 'useState là một React Hook để quản lý state.', answer: true },
  { question: 'Flutter và React Native sử dụng cùng một ngôn ngữ lập trình.', answer: false },
  { question: 'npm là viết tắt của Node Package Manager.', answer: true },
  { question: 'React Native chỉ có thể chạy trên iOS.', answer: false },
  { question: 'Component trong React có thể được tái sử dụng.', answer: true },
];

export default function HomeScreen() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleAnswer = (userAnswer: boolean) => {
    const currentQuestion = questions[currentQuestionIndex];
    
    if (userAnswer === currentQuestion.answer) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizFinished(false);
  };

  if (quizFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Quiz Completed!</Text>
          <Text style={styles.scoreText}>
            Your Score: {score}/{questions.length}
          </Text>
          <Text style={styles.percentageText}>{percentage}%</Text>
          <TouchableOpacity style={styles.restartButton} onPress={resetQuiz}>
            <Text style={styles.restartButtonText}>Play Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
        
        <Text style={styles.questionNumber}>
          Question {currentQuestionIndex + 1} of {questions.length}
        </Text>

        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.trueButton]}
            onPress={() => handleAnswer(true)}
          >
            <Text style={styles.buttonText}>TRUE</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.falseButton]}
            onPress={() => handleAnswer(false)}
          >
            <Text style={styles.buttonText}>FALSE</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.scoreText}>Score: {score}/{questions.length}</Text>
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
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  progressContainer: {
    height: 8,
    backgroundColor: '#2D2D44',
    borderRadius: 4,
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4ECDC4',
    borderRadius: 4,
  },
  questionNumber: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
    opacity: 0.7,
  },
  questionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  questionText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 40,
  },
  buttonsContainer: {
    gap: 20,
    marginBottom: 30,
  },
  button: {
    paddingVertical: 20,
    borderRadius: 15,
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
  trueButton: {
    backgroundColor: '#2ECC71',
  },
  falseButton: {
    backgroundColor: '#E74C3C',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  scoreText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  resultTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 30,
    textAlign: 'center',
  },
  percentageText: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#4ECDC4',
    marginBottom: 40,
  },
  restartButton: {
    backgroundColor: '#4ECDC4',
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
  restartButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
