import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SPACING = 16;
const AVATAR_SIZE = 50;
const screenWidth = Dimensions.get('window').width;

const AppHeader = ({ userName, avatarUrl }) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
            <View style={styles.textContainer}>
                <Text style={styles.greetingText}>Hello!</Text>
                <Text style={styles.userNameText}>{userName}</Text>
            </View>

            <View style={styles.avatarWrapper}>
                <Image
                    source={{ uri: avatarUrl }}   // ← FIXED HERE
                    style={styles.avatarImage}
                    resizeMode="cover"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: screenWidth,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingHorizontal: SPACING,
        paddingBottom: 10,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    textContainer: {
        paddingTop: 10,
        flex: 1,
        marginRight: 10,
    },
    greetingText: {
        fontSize: 20,
        color: '#888',
        fontWeight: '500',
        marginBottom: 2,
    },
    userNameText: {
        fontSize: 40,
        color: '#333',
        fontWeight: '700',
    },
    avatarWrapper: {
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2,
        overflow: 'hidden',
        borderWidth: 1.5,
        borderColor: '#eee',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
});

export default AppHeader;
