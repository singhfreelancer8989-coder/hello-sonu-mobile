import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import images from '../../../assets/images';

const screenWidth = Dimensions.get('window').width;

const AppHeader = ({ userName, profileImage }) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
            <View style={styles.contentWrapper}>

                {/* Text Section - Left Side */}
                <View style={styles.textContainer}>
                    <Text style={styles.greetingText}>Hello!</Text>
                    <Text
                        minimumFontScale={0.8}
                        style={styles.userNameText}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {userName || "Sapana chechani"}
                    </Text>
                </View>

                {/* Rectangular Logo Section - Right Side */}
                <View style={styles.logoWrapper}>
                    <Image
                        source={profileImage ? { uri: profileImage } : images.mainLogo} 
                        style={styles.logoImage}
                        // 'cover' fills the rectangle, 'contain' shows full logo without crop
                        resizeMode="cover" 
                    />
                </View>
{/* 
                <View style={{
                    width: 50,
                    height: 50,
                    borderRadius: 45,
                    backgroundColor: "#007AFF20",
                    justifyContent: "center",
                    alignItems: "center",
                    alignSelf: "center",
                }}>
                    <Text style={{
                        fontSize: 20,
                        fontFamily: "Poppins-Medium",
                        color: "#007AFF",
                    }}>
                        MV
                    </Text>
                </View> */}



            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: screenWidth,
        backgroundColor: '#ffffff',
        paddingHorizontal: 24,       // Thoda breathing space zyada diya
        paddingBottom: 15,
        borderBottomWidth: 1,        // Optional: Ek halki line separation ke liye
        borderBottomColor: '#f0f0f0',
    },

    contentWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',        // Text aur Logo ko vertically center kiya
    },

    textContainer: {
        flex: 1,
        marginRight: 20,             // Text logo se chipke nahi
        justifyContent: 'center',

    },

    greetingText: {
        fontSize: 16,
        color: '#636e72',            // Thoda sophisticated grey
        fontFamily: 'Poppins-SemiBold',
        letterSpacing: 0.5,
        textTransform: 'uppercase',  // Modern app feel ke liye
    },

    userNameText: {
        fontSize: 26,
        color: '#2d3436',            // Dark Bold color
        fontFamily: 'Poppins-Bold',  // Naam bold hona chahiye
        lineHeight: 32,
    },

    logoWrapper: {
        // Logo ke liye ek container banaya taaki shape perfect rahe
        backgroundColor: '#fff',
    },

    logoImage: {
        width: 100,                   // Rectangular Width
        height: 55,                   // Rectangular Height
    },
});

export default AppHeader;