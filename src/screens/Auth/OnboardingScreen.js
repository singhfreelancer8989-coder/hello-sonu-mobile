import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
} from 'react-native';

// Import the icon library
// You can use any set, like FontAwesome, MaterialIcons, etc.
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Colors for the icons
const COLORS = {
  icon1: '#8A2BE2', // Top-Left (Building)
  icon2: '#FFD700', // Top (Checklist)
  icon3: '#A52A2A', // Top-Right (List/Eye)
  icon4: '#C0C0C0', // Right (House)
  icon5: '#40E0D0', // Bottom-Right (R)
  icon6: '#FF7F50', // Bottom (House/$)
  icon7: '#F0E68C', // Bottom-Left (House/Coin)
  icon8: '#C0C0C0', // Left (House)
};

const OnboardingScreen = () => {
  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.container}>
        <View style={styles.circleContainer}>
          {/* Central Logo */}
          <View style={styles.logo}>
            <Text style={styles.logoText}>LOGO</Text>
          </View>

          {/* --- Surrounding Icons --- */}

          {/* Icon 1: Top-Left (Building) */}
          <View style={[styles.iconBox, { top: 45, left: 45 }]}>
            <Icon name="office-building" size={30} color={COLORS.icon1} />
          </View>

          {/* Icon 2: Top (Checklist) */}
          <View style={[styles.iconBox, { top: 0, alignSelf: 'center' }]}>
            <Icon name="clipboard-check-outline" size={30} color={COLORS.icon2} />
          </View>

          {/* Icon 3: Top-Right (List/Eye) */}
          <View style={[styles.iconBox, { top: 45, right: 45 }]}>
            <Icon name="file-eye-outline" size={30} color={COLORS.icon3} />
          </View>

          {/* Icon 4: Right (House) */}
          <View style={[styles.iconBox, { top: '50%', right: 0 }]}>
            <Icon name="home-outline" size={30} color={COLORS.icon8} />
          </View>

          {/* Icon 5: Bottom-Right (R) */}
          <View style={[styles.iconBox, { bottom: 45, right: 45 }]}>
            <Icon name="alpha-r-circle-outline" size={30} color={COLORS.icon5} />
          </View>

          {/* Icon 6: Bottom (House/$) */}
          <View style={[styles.iconBox, { bottom: 0, alignSelf: 'center' }]}>
            <Icon name="home-currency-usd" size={30} color={COLORS.icon6} />
          </View>

          {/* Icon 7: Bottom-Left (House/Coin) */}
          <View style={[styles.iconBox, { bottom: 45, left: 45 }]}>
            <Icon name="home-analytics" size={30} color={COLORS.icon7} />
          </View>

          {/* Icon 8: Left (House) */}
          <View style={[styles.iconBox, { top: '50%', left: 0 }]}>
            <Icon name="home-outline" size={30} color={COLORS.icon8} />
          </View>
        </View>
      </View>

      {/* Bottom Button */}
      <TouchableOpacity style={styles.button} > 
        <Text style={styles.buttonText}>
            Getting Started
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleContainer: {
    width: 320,
    height: 320,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  // Base style for the icon *container*
  iconBox: {
    width: 50,
    height: 50,
    position: 'absolute',
    // Added these to center the icon inside the box
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    height: 56,
    backgroundColor: '#34C759',
    borderRadius: 28,
    marginHorizontal: 24,
    marginBottom: 80,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  buttonText: {
    fontSize: 28,
    fontWeight: "500",
    color: "#fff"
  },
});

export default OnboardingScreen;