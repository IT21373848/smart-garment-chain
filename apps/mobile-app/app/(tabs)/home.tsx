import { View, Text, TouchableOpacity, StatusBar, SafeAreaView, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar barStyle="light-content" />
            <ImageBackground
                source={{ uri: 'https://plus.unsplash.com/premium_photo-1661963474760-35522559bd3f?q=80&w=2670&auto=format&fit=crop' }}
                style={{ flex: 1 }}
                imageStyle={{ opacity: 0.2 }}
            >
                <View style={{ flex: 1, backgroundColor: '#1a2a3a' }}>
                    {/* Header */}
                    <View style={{ padding: 20, alignItems: 'center' }}><Text style={{ fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 6, textAlign: 'center' }}>
                        Welcome to SCM System
                    </Text>
                        <Text style={{ fontSize: 16, color: '#a0c8e0', textAlign: 'center' }}>
                            Streamline your supply chain operations
                        </Text>
                    </View>

                    {/* Main Content */}
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
                        <Text style={{ fontSize: 22, marginBottom: 30, color: '#fff', textAlign: 'center' }}>
                            Select a module to begin
                        </Text>

                        {/* Transport Button */}
                        <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: '#3498db',
                                paddingVertical: 16,
                                paddingHorizontal: 24,
                                borderRadius: 12,
                                width: '80%',
                                marginBottom: 16,
                                elevation: 3,
                            }}
                            onPress={() => router.push('/transport')}
                        >
                            <Ionicons name="car" size={24} color="#fff" />
                            <Text style={{ fontSize: 18, color: '#fff', marginLeft: 12, fontWeight: '600' }}>
                                Transport Management
                            </Text>
                        </TouchableOpacity>

                        {/* Packing Button */}
                        <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: '#2ecc71',
                                paddingVertical: 16,
                                paddingHorizontal: 24,
                                borderRadius: 12,
                                width: '80%',
                                elevation: 3,
                            }}
                            onPress={() => router.push('/packing')}
                        >
                            <Ionicons name="cube" size={24} color="#fff" />
                            <Text style={{ fontSize: 18, color: '#fff', marginLeft: 12, fontWeight: '600' }}>
                                Packing Solutions
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Footer */}
                    <View style={{ padding: 16, alignItems: 'center' }}>
                        <Text style={{ color: '#a0c8e0', fontSize: 14 }}>
                            Supply Chain Management System v1.0
                        </Text>
                    </View>
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
}