import { View, Text, TouchableOpacity, StatusBar, SafeAreaView, ImageBackground, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <ImageBackground
                source={{ uri: 'https://plus.unsplash.com/premium_photo-1661963474760-35522559bd3f?q=80&w=2670&auto=format&fit=crop' }}
                style={styles.backgroundImage}
                imageStyle={styles.backgroundImageStyle}
            >
                <View style={styles.overlay}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>
                            Smart Garment Chanin
                        </Text>
                        <Text style={styles.headerSubtitle}>
                        AI-Based Supply Chain Management System
                        </Text>
                    </View>

                    {/* Main Content */}
                    <View style={styles.mainContent}>
                        <Text style={styles.selectText}>
                            Select a module to begin
                        </Text>

                        <View style={styles.buttonsContainer}>
                            {/* Transport Button */}
                            <TouchableOpacity
                                style={[styles.moduleButton, styles.transportButton]}
                                onPress={() => router.push('/transport')}
                                activeOpacity={0.8}
                            >
                                <View style={styles.buttonContent}>
                                    <View style={styles.iconContainer}>
                                        <Ionicons name="car" size={28} color="#fff" />
                                    </View>
                                    <View style={styles.textContainer}>
                                        <Text style={styles.buttonTitle}>Transport</Text>
                                        <Text style={styles.buttonSubtitle}>Management</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>

                            {/* Packing Button */}
                            <TouchableOpacity
                                style={[styles.moduleButton, styles.packingButton]}
                                onPress={() => router.push('/packing')}
                                activeOpacity={0.8}
                            >
                                <View style={styles.buttonContent}>
                                    <View style={styles.iconContainer}>
                                        <Ionicons name="cube" size={28} color="#fff" />
                                    </View>
                                    <View style={styles.textContainer}>
                                        <Text style={styles.buttonTitle}>Packing</Text>
                                        <Text style={styles.buttonSubtitle}>Solutions</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            Supply Chain Management System v1.0
                        </Text>
                    </View>
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
    },
    backgroundImageStyle: {
        opacity: 0.2,
    },
    overlay: {
        flex: 1,
        backgroundColor: '#1a2a3a',
    },
    header: {
        paddingTop: height * 0.05,
        paddingHorizontal: 20,
        paddingBottom: 20,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: width < 350 ? 24 : 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
        textAlign: 'center',
        lineHeight: width < 350 ? 28 : 32,
    },
    headerSubtitle: {
        fontSize: width < 350 ? 14 : 16,
        color: '#a0c8e0',
        textAlign: 'center',
        lineHeight: 20,
    },
    mainContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    selectText: {
        fontSize: width < 350 ? 18 : 22,
        marginBottom: 40,
        color: '#fff',
        textAlign: 'center',
        fontWeight: '600',
    },
    buttonsContainer: {
        width: '100%',
        alignItems: 'center',
        gap: 20,
    },
    moduleButton: {
        width: Math.min(width * 0.85, 320),
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderRadius: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    transportButton: {
        backgroundColor: '#3498db',
    },
    packingButton: {
        backgroundColor: '#2ecc71',
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    buttonTitle: {
        fontSize: 18,
        color: '#fff',
        fontWeight: '700',
        marginBottom: 2,
    },
    buttonSubtitle: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '500',
        opacity: 0.9,
    },
    footer: {
        padding: 20,
        alignItems: 'center',
        paddingBottom: height * 0.03,
    },
    footerText: {
        color: '#a0c8e0',
        fontSize: 12,
        textAlign: 'center',
    },
});