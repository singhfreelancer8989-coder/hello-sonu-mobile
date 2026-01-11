import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, Dimensions } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const SkeletonPropertyCard = ({ style }) => {
    const animatedValue = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const startAnimation = () => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(animatedValue, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(animatedValue, {
                        toValue: 0.3,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        };

        startAnimation();
    }, [animatedValue]);

    return (
        <View style={[styles.card, style]}>
            {/* Image Skeleton */}
            <Animated.View style={[styles.imageSkeleton, { opacity: animatedValue }]} />

            {/* Title Line Skeleton */}
            <View style={styles.textContainer}>
                <Animated.View style={[styles.titleSkeleton, { opacity: animatedValue }]} />
                <Animated.View style={[styles.subtitleSkeleton, { opacity: animatedValue }]} />
            </View>

            {/* Meta Row Skeleton */}
            <View style={styles.metaRow}>
                <Animated.View style={[styles.metaSkeleton, { opacity: animatedValue }]} />
                <Animated.View style={[styles.metaSkeleton, { opacity: animatedValue }]} />
            </View>
        </View>
    );
};

export default SkeletonPropertyCard;

const styles = StyleSheet.create({
    card: {
        width: wp('47.5%'),
        marginRight: wp('4%'),
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: wp('2.5%'),
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        marginBottom: 5,
    },
    imageSkeleton: {
        width: "100%",
        height: hp('14%'),
        borderRadius: 12,
        backgroundColor: '#E1E9EE',
    },
    textContainer: {
        marginTop: hp('1%'),
    },
    titleSkeleton: {
        width: '80%',
        height: hp('2%'),
        borderRadius: 4,
        backgroundColor: '#E1E9EE',
        marginBottom: 6,
    },
    subtitleSkeleton: {
        width: '50%',
        height: hp('1.5%'),
        borderRadius: 4,
        backgroundColor: '#E1E9EE',
    },
    metaRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 8,
    },
    metaSkeleton: {
        width: '30%',
        height: hp('1.5%'),
        borderRadius: 4,
        backgroundColor: '#E1E9EE',
    },
});
