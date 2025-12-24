import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';

interface StoryNode {
  story: string;
  choice1: string;
  choice2: string;
  choice1Next?: number;
  choice2Next?: number;
}

const storyData: StoryNode[] = [
  {
    story: 'Bạn đang đứng ở ngã ba đường. Một con đường dẫn đến rừng tối, một con đường dẫn đến bãi biển. Bạn sẽ chọn con đường nào?',
    choice1: 'Đi vào rừng tối',
    choice2: 'Đi đến bãi biển',
    choice1Next: 1,
    choice2Next: 2,
  },
  {
    story: 'Bạn bước vào rừng tối. Trong rừng, bạn thấy một túi vàng bị rơi. Bạn sẽ làm gì?',
    choice1: 'Nhặt túi vàng',
    choice2: 'Bỏ qua và tiếp tục đi',
    choice1Next: 3,
    choice2Next: 4,
  },
  {
    story: 'Bạn đến bãi biển. Trên bãi biển có một chiếc thuyền. Bạn sẽ làm gì?',
    choice1: 'Lên thuyền và ra khơi',
    choice2: 'Ở lại bãi biển và khám phá',
    choice1Next: 5,
    choice2Next: 6,
  },
  {
    story: 'Bạn nhặt túi vàng. Đột nhiên, một nhóm cướp xuất hiện và đòi lấy túi vàng. Bạn sẽ làm gì?',
    choice1: 'Chạy trốn',
    choice2: 'Đưa túi vàng cho họ',
    choice1Next: 7,
    choice2Next: 8,
  },
  {
    story: 'Bạn tiếp tục đi trong rừng và tìm thấy một ngôi nhà nhỏ. Bạn gõ cửa và một người già mở cửa, mời bạn vào. Bạn đã tìm thấy nơi an toàn. Kết thúc tốt đẹp!',
    choice1: 'Chơi lại',
    choice2: 'Chơi lại',
    choice1Next: 0,
    choice2Next: 0,
  },
  {
    story: 'Bạn ra khơi và gặp một cơn bão lớn. Thuyền của bạn bị lật. Bạn đã bị đắm tàu. Kết thúc!',
    choice1: 'Chơi lại',
    choice2: 'Chơi lại',
    choice1Next: 0,
    choice2Next: 0,
  },
  {
    story: 'Bạn khám phá bãi biển và tìm thấy một kho báu cổ. Bạn đã trở thành người giàu có! Kết thúc tuyệt vời!',
    choice1: 'Chơi lại',
    choice2: 'Chơi lại',
    choice1Next: 0,
    choice2Next: 0,
  },
  {
    story: 'Bạn chạy trốn thành công và giữ được túi vàng. Bạn đã trở thành người giàu có! Kết thúc tuyệt vời!',
    choice1: 'Chơi lại',
    choice2: 'Chơi lại',
    choice1Next: 0,
    choice2Next: 0,
  },
  {
    story: 'Bạn đưa túi vàng cho cướp. Họ lấy vàng và để bạn đi. Bạn an toàn nhưng mất vàng. Kết thúc bình thường.',
    choice1: 'Chơi lại',
    choice2: 'Chơi lại',
    choice1Next: 0,
    choice2Next: 0,
  },
];

export default function HomeScreen() {
  const [storyIndex, setStoryIndex] = useState(0);

  const handleChoice = (choice: 1 | 2) => {
    const currentStory = storyData[storyIndex];
    const nextIndex = choice === 1 ? currentStory.choice1Next : currentStory.choice2Next;
    
    if (nextIndex !== undefined) {
      setStoryIndex(nextIndex);
    }
  };

  const currentStory = storyData[storyIndex];
  const isEnding = !currentStory.choice1Next || currentStory.choice1Next === 0;

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('@/assets/images/bg.avif')}
        style={styles.backgroundImage}
        contentFit="cover"
      />
      <View style={styles.overlay}>
        <View style={styles.storyContainer}>
          <Text style={styles.storyText}>{currentStory.story}</Text>
        </View>

        {!isEnding && (
          <View style={styles.choicesContainer}>
            <TouchableOpacity
              style={[styles.choiceButton, styles.choice1Button]}
              onPress={() => handleChoice(1)}
            >
              <Text style={styles.choiceText}>{currentStory.choice1}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.choiceButton, styles.choice2Button]}
              onPress={() => handleChoice(2)}
            >
              <Text style={styles.choiceText}>{currentStory.choice2}</Text>
            </TouchableOpacity>
          </View>
        )}

        {isEnding && (
          <TouchableOpacity
            style={styles.restartButton}
            onPress={() => setStoryIndex(0)}
          >
            <Text style={styles.restartButtonText}>Chơi lại</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  storyContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  storyText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 36,
    textShadowColor: '#000000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  choicesContainer: {
    gap: 20,
    marginBottom: 20,
  },
  choiceButton: {
    paddingVertical: 18,
    paddingHorizontal: 30,
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
  choice1Button: {
    backgroundColor: '#E74C3C',
  },
  choice2Button: {
    backgroundColor: '#3498DB',
  },
  choiceText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  restartButton: {
    backgroundColor: '#2ECC71',
    paddingVertical: 18,
    paddingHorizontal: 50,
    borderRadius: 25,
    alignItems: 'center',
    alignSelf: 'center',
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
