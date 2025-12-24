import { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Image } from 'expo-image';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { WEATHER_API_URL, GEOCODING_API_URL } from '@/constants/weather';

interface WeatherData {
  name: string;
  address?: string;
  locationDetails?: string;
  temp: number;
  feels_like: number;
  humidity: number;
  description: string;
  icon: string;
}

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [cityInput, setCityInput] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getLocationWeather();
  }, []);

  const getLocationWeather = async () => {
    try {
      setLoading(true);
      setError(null);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Quyền truy cập vị trí bị từ chối');
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      await fetchWeatherByCoords(latitude, longitude);
    } catch (err) {
      setError('Không thể lấy vị trí');
      setLoading(false);
    }
  };

  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    try {
      const url = `${WEATHER_API_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code&timezone=auto`;
      console.log('Fetching weather from:', url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Lỗi ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Weather data received:', data);

      // Lấy thông tin địa điểm từ geocoding
      const geoUrl = `${GEOCODING_API_URL}?latitude=${lat}&longitude=${lon}&count=1&language=vi`;
      const geoResponse = await fetch(geoUrl);
      let cityName = 'Vị trí hiện tại';
      let fullAddress = '';
      let locationDetails = '';
      
      if (geoResponse.ok) {
        const geoData = await geoResponse.json();
        if (geoData.results && geoData.results.length > 0) {
          const location = geoData.results[0];
          cityName = location.name;
          
          // Tạo địa chỉ đầy đủ
          const addressParts = [];
          if (location.admin1) addressParts.push(location.admin1);
          if (location.country) addressParts.push(location.country);
          fullAddress = addressParts.join(', ');
          
          // Tạo thông tin chi tiết địa điểm
          const detailParts = [];
          if (location.name) detailParts.push(location.name);
          if (location.admin2) detailParts.push(location.admin2);
          if (location.admin1) detailParts.push(location.admin1);
          locationDetails = detailParts.join(', ');
        }
      }

      const weatherData: WeatherData = {
        name: cityName,
        address: fullAddress,
        locationDetails: locationDetails || cityName,
        temp: Math.round(data.current.temperature_2m),
        feels_like: Math.round(data.current.temperature_2m),
        humidity: data.current.relative_humidity_2m,
        description: getWeatherDescription(data.current.weather_code),
        icon: getWeatherIconFromCode(data.current.weather_code),
      };

      setWeatherData(weatherData);
      setError(null);
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err?.message || 'Không thể tải dữ liệu thời tiết');
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCity = async () => {
    if (!cityInput.trim()) {
      setError('Vui lòng nhập tên thành phố');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Bước 1: Tìm tọa độ từ tên thành phố
      const geoUrl = `${GEOCODING_API_URL}?name=${encodeURIComponent(cityInput)}&count=1&language=vi`;
      console.log('Searching city:', geoUrl);

      const geoResponse = await fetch(geoUrl);
      if (!geoResponse.ok) {
        throw new Error('Không thể tìm thành phố');
      }

      const geoData = await geoResponse.json();
      if (!geoData.results || geoData.results.length === 0) {
        setError('Không tìm thấy thành phố. Vui lòng thử tên thành phố khác.');
        setLoading(false);
        return;
      }

      const location = geoData.results[0];
      const lat = location.latitude;
      const lon = location.longitude;
      const cityName = location.name;

      // Bước 2: Lấy thời tiết từ tọa độ
      const weatherUrl = `${WEATHER_API_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code&timezone=auto`;
      console.log('Fetching weather:', weatherUrl);

      const weatherResponse = await fetch(weatherUrl);
      if (!weatherResponse.ok) {
        throw new Error(`Lỗi ${weatherResponse.status}: ${weatherResponse.statusText}`);
      }

      const weatherData = await weatherResponse.json();
      console.log('Weather data received:', weatherData);

      // Tạo địa chỉ đầy đủ
      const addressParts = [];
      if (location.admin1) addressParts.push(location.admin1);
      if (location.country) addressParts.push(location.country);
      const fullAddress = addressParts.join(', ');

      // Tạo thông tin chi tiết địa điểm
      const detailParts = [];
      if (location.name) detailParts.push(location.name);
      if (location.admin2) detailParts.push(location.admin2);
      if (location.admin1) detailParts.push(location.admin1);
      const locationDetails = detailParts.join(', ');

      const formattedData: WeatherData = {
        name: cityName,
        address: fullAddress,
        locationDetails: locationDetails || cityName,
        temp: Math.round(weatherData.current.temperature_2m),
        feels_like: Math.round(weatherData.current.temperature_2m),
        humidity: weatherData.current.relative_humidity_2m,
        description: getWeatherDescription(weatherData.current.weather_code),
        icon: getWeatherIconFromCode(weatherData.current.weather_code),
      };

      setWeatherData(formattedData);
      setCityInput('');
      setError(null);
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err?.message || 'Không tìm thấy thành phố. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const getWeatherDescription = (code: number): string => {
    // WMO Weather interpretation codes
    const descriptions: { [key: number]: string } = {
      0: 'Trời quang',
      1: 'Chủ yếu quang',
      2: 'Mây rải rác',
      3: 'Nhiều mây',
      45: 'Sương mù',
      48: 'Sương mù đóng băng',
      51: 'Mưa phùn nhẹ',
      53: 'Mưa phùn vừa',
      55: 'Mưa phùn dày đặc',
      56: 'Mưa phùn đóng băng nhẹ',
      57: 'Mưa phùn đóng băng dày đặc',
      61: 'Mưa nhẹ',
      63: 'Mưa vừa',
      65: 'Mưa nặng',
      66: 'Mưa đóng băng nhẹ',
      67: 'Mưa đóng băng nặng',
      71: 'Tuyết rơi nhẹ',
      73: 'Tuyết rơi vừa',
      75: 'Tuyết rơi nặng',
      77: 'Hạt tuyết',
      80: 'Mưa rào nhẹ',
      81: 'Mưa rào vừa',
      82: 'Mưa rào nặng',
      85: 'Mưa tuyết nhẹ',
      86: 'Mưa tuyết nặng',
      95: 'Dông',
      96: 'Dông có mưa đá',
      99: 'Dông có mưa đá nặng',
    };
    return descriptions[code] || 'Không xác định';
  };

  const getWeatherIconFromCode = (code: number): string => {
    // Chuyển đổi WMO code thành icon name
    if (code === 0) return 'sunny';
    if (code >= 1 && code <= 3) return 'partly-sunny';
    if (code >= 45 && code <= 48) return 'cloudy';
    if (code >= 51 && code <= 67) return 'rainy';
    if (code >= 71 && code <= 77) return 'snow';
    if (code >= 80 && code <= 86) return 'rainy';
    if (code >= 95 && code <= 99) return 'thunderstorm';
    return 'partly-sunny';
  };

  const getWeatherIcon = (iconName: string) => {
    const iconMap: { [key: string]: keyof typeof Ionicons.glyphMap } = {
      'sunny': 'sunny',
      'moon': 'moon',
      'partly-sunny': 'partly-sunny',
      'cloudy-night': 'cloudy-night',
      'cloud': 'cloud',
      'cloudy': 'cloudy',
      'rainy': 'rainy',
      'thunderstorm': 'thunderstorm',
      'snow': 'snow',
      'water': 'water',
    };
    return iconMap[iconName] || 'partly-sunny';
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Image
          source={require('@/assets/images/bg.avif')}
          style={styles.backgroundImage}
          contentFit="cover"
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4ECDC4" />
          <Text style={styles.loadingText}>Đang tải dữ liệu thời tiết...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('@/assets/images/bg.avif')}
        style={styles.backgroundImage}
        contentFit="cover"
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Nhập tên thành phố"
                placeholderTextColor="#999"
                value={cityInput}
                onChangeText={setCityInput}
                onSubmitEditing={fetchWeatherByCity}
              />
              <TouchableOpacity style={styles.searchButton} onPress={fetchWeatherByCity}>
                <Ionicons name="search" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.locationButton} onPress={getLocationWeather}>
                <Ionicons name="location" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {weatherData && (
              <View style={styles.weatherContainer}>
                <View style={styles.weatherCard}>
                  <Ionicons
                    name={getWeatherIcon(weatherData.icon)}
                    size={100}
                    color="#4ECDC4"
                  />
                  <Text style={styles.temperature}>
                    {weatherData.temp}°
                  </Text>
                  <Text style={styles.city}>{weatherData.name}</Text>
                  {weatherData.address && (
                    <Text style={styles.address}>{weatherData.address}</Text>
                  )}
                  {/* {weatherData.locationDetails && weatherData.locationDetails !== weatherData.name && (
                    <Text style={styles.locationDetails}>{weatherData.locationDetails}</Text>
                  )} */}
                  <Text style={styles.description}>
                    {weatherData.description}
                  </Text>
                </View>

                <View style={styles.detailsContainer}>
                  <View style={styles.detailCard}>
                    <Ionicons name="thermometer" size={30} color="#4ECDC4" />
                    <Text style={styles.detailLabel}>Cảm giác như</Text>
                    <Text style={styles.detailValue}>
                      {weatherData.feels_like}°
                    </Text>
                  </View>

                  <View style={styles.detailCard}>
                    <Ionicons name="water" size={30} color="#4ECDC4" />
                    <Text style={styles.detailLabel}>Độ ẩm</Text>
                    <Text style={styles.detailValue}>{weatherData.humidity}%</Text>
                  </View>
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
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
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
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'rgba(45, 45, 68, 0.9)',
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#3D3D5C',
  },
  searchButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 15,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationButton: {
    backgroundColor: '#E74C3C',
    borderRadius: 15,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    backgroundColor: '#E74C3C',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
  weatherContainer: {
    flex: 1,
  },
  weatherCard: {
    backgroundColor: 'rgba(45, 45, 68, 0.9)',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  temperature: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 10,
  },
  city: {
    fontSize: 32,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 10,
  },
  address: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 5,
    opacity: 0.8,
    textAlign: 'center',
  },
  locationDetails: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 3,
    opacity: 0.7,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  description: {
    fontSize: 20,
    color: '#4ECDC4',
    marginTop: 10,
    textTransform: 'capitalize',
  },
  detailsContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  detailCard: {
    flex: 1,
    backgroundColor: 'rgba(45, 45, 68, 0.9)',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  detailLabel: {
    fontSize: 14,
    color: '#999',
    marginTop: 10,
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
