import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const BANNERS = [
    {
        id: '1',
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        title: 'Find Your Dream Home',
        subtitle: 'Explore premium properties tailored for you',
    },
    {
        id: '2',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        title: 'Luxury Apartments',
        subtitle: 'Experience comfort and elegance in the city center',
    },
    {
        id: '3',
        image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        title: 'Modern Workspaces',
        subtitle: 'Discover the best offices and commercial spaces',
    },
];

const HomeBanner = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);

    useEffect(() => {
        const interval = setInterval(() => {
            let nextIndex = currentIndex + 1;
            if (nextIndex >= BANNERS.length) {
                nextIndex = 0;
            }
            setCurrentIndex(nextIndex);
            flatListRef.current?.scrollToIndex({
                index: nextIndex,
                animated: true,
            });
        }, 4000);

        return () => clearInterval(interval);
    }, [currentIndex]);

    const renderItem = ({ item }) => (
        <View style={styles.bannerItem}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.overlay} />
            <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.subtitle}</Text>
            </View>
        </View>
    );

    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index || 0);
        }
    }).current;

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={BANNERS}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
            />
            <View style={styles.pagination}>
                {BANNERS.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            currentIndex === index ? styles.activeDot : styles.inactiveDot,
                        ]}
                    />
                ))}
            </View>
        </View>
    );
};

export default HomeBanner;

const styles = StyleSheet.create({
    container: {
        height: 180,
        marginTop: 15,
        marginBottom: 20,
    },
    bannerItem: {
        width: width - 30,
        height: 180,
        marginHorizontal: 15,
        borderRadius: 16,
        overflow: 'hidden', // to ensure image borders are clipped to the radius
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        backgroundColor: '#fff',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    textContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
    },
    title: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 6,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    subtitle: {
        color: '#f8f8f8',
        fontSize: 14,
        fontWeight: '500',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    pagination: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: -15, // to push dots slightly below the banner
        alignSelf: 'center',
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: '#4834d4',
        width: 20,
    },
    inactiveDot: {
        backgroundColor: '#dcdde1',
    },
});
