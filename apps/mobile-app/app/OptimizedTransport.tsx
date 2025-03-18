import React from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    Linking,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    FlatList
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type Delivery = {
    volume_cft: number;
    weight_kg: number;
};

type Destination = {
    lat: number;
    lng: number;
    deliveries: Delivery[];
};

type Weather = {
    name: string;
    weather: { description: string; icon: string }[];
    main: { temp: number; humidity: number };
    coord?: { lon: number; lat: number };
    base?: string;
    visibility?: number;
    wind?: { speed: number; deg: number; gust: number };
    clouds?: { all: number };
    dt?: number;
    sys?: { type: number; id: number; country: string; sunrise: number; sunset: number };
    timezone?: number;
    id?: number;
    cod?: number;
};

type VehicleData = {
    strategy: string;
    total_distance_km: number;
    total_estimated_cost_LKR: number;
    total_volume_cft?: number;
    total_weight_kg?: number;
    vehicles: string[];
};

type Route = {
    total_distance_km: number;
    routeLink: string;
};

type IndividualRoute = {
    distanceKm: number;
    routeLink: string;
};

type GroupedRoute = {
    groupId: number;
    destinations: Destination[];
    route: Route;
    weather: Weather[];
    vehicles: VehicleData;
};

type TransportData = {
    groupedRoutes: GroupedRoute[];
};

type IndividualTransportData = {
    type: "individual";
    destination: Destination;
    route: IndividualRoute;
    weather: Weather;
    vehicles: VehicleData;
};

type Props = {
    transportData?: TransportData | IndividualTransportData;
    route?: { params?: { transportData?: TransportData | IndividualTransportData } };
};

// Type guard function to check if the data is IndividualTransportData
function isIndividualTransportData(data: any): data is IndividualTransportData {
    return data && data.type === "individual" && data.destination && data.route;
}

const OptimizedTransport: React.FC<Props> = (props) => {
    const params = useLocalSearchParams();
    let transportData: any = undefined;

    if (props.transportData) {
        transportData = props.transportData;
    } else if (props.route?.params?.transportData) {
        transportData = props.route.params.transportData;
    } else if (params.transportData) {
        try {
            transportData = JSON.parse(params.transportData as string);
        } catch (e) {
            console.error("Failed to parse transportData from params:", e);
        }
    }

    if (!transportData) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" />
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle" size={48} color="#e74c3c" />
                    <Text style={styles.errorText}>No transport data available</Text>
                </View>
            </SafeAreaView>
        );
    }

    // Handle individual transport data using type guard
    if (isIndividualTransportData(transportData)) {
        const individualData = transportData;
        const vehicles = individualData.vehicles.vehicles;


        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" />

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Transport Plan Details</Text>
                    <Text style={styles.headerSubtitle}>Individual Route Information</Text>
                </View>

                <ScrollView style={styles.content}>
                    <View style={styles.formContainer}>
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Vehicle Information</Text>
                            <View style={styles.dataRow}>
                                <Text style={styles.dataLabel}>Strategy:</Text>
                                <Text style={styles.dataValue}>{individualData.vehicles.strategy}</Text>
                            </View>
                            <View style={styles.dataRow}>
                                <Text style={styles.dataLabel}>Total Distance:</Text>
                                <Text style={styles.dataValue}>{individualData.route.distanceKm.toFixed(2)} km</Text>
                            </View>
                            <View style={styles.dataRow}>
                                <Text style={styles.dataLabel}>Estimated Cost:</Text>
                                <Text style={styles.dataValue}>LKR {individualData.vehicles.total_estimated_cost_LKR.toLocaleString()}</Text>
                            </View>
                            <View style={styles.dataRow}>
                                <Text style={styles.dataLabel}>Vehicles:</Text>
                                <FlatList
                                    data={vehicles}
                                    renderItem={({ item, index }) => <Text style={styles.dataValue}>{index + 1}. {item}</Text>}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                            </View>


                        </View>

                        <TouchableOpacity
                            style={styles.mapButton}
                            onPress={() => Linking.openURL(individualData.route.routeLink)}
                        >
                            <Ionicons name="map" size={20} color="#fff" />
                            <Text style={styles.buttonText}>View Route on Google Maps</Text>
                        </TouchableOpacity>

                        <View style={styles.destinationContainer}>
                            <View style={styles.destinationHeader}>
                                <Text style={styles.destinationTitle}>Destination</Text>
                            </View>

                            <View style={styles.dataRow}>
                                <Text style={styles.dataLabel}>Coordinates:</Text>
                                <Text style={styles.dataValue}>
                                    {individualData.destination.lat}, {individualData.destination.lng}
                                </Text>
                            </View>

                            <Text style={styles.subSectionTitle}>Deliveries</Text>
                            {individualData.destination.deliveries.map((delivery, idx) => (
                                <View key={idx} style={styles.deliveryContainer}>
                                    <View style={styles.deliveryHeader}>
                                        <Text style={styles.deliveryTitle}>Delivery {idx + 1}</Text>
                                    </View>
                                    <View style={styles.rowInputs}>
                                        <View style={styles.halfInput}>
                                            <Text style={styles.inputLabel}>Volume:</Text>
                                            <Text style={styles.dataValue}>{delivery.volume_cft} CFT</Text>
                                        </View>
                                        <View style={styles.halfInput}>
                                            <Text style={styles.inputLabel}>Weight:</Text>
                                            <Text style={styles.dataValue}>{delivery.weight_kg} KG</Text>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>

                        <View style={styles.weatherContainer}>
                            <Text style={styles.sectionTitle}>Weather Conditions</Text>
                            <View style={styles.weatherCard}>
                                <Image
                                    source={{ uri: `https://openweathermap.org/img/wn/${individualData.weather.weather[0].icon}@2x.png` }}
                                    style={styles.weatherIcon}
                                />
                                <View style={styles.weatherInfo}>
                                    <Text style={styles.weatherLocation}>{individualData.weather.name}</Text>
                                    <Text style={styles.weatherDescription}>
                                        {individualData.weather.weather[0].description}
                                    </Text>
                                    <Text style={styles.weatherDetail}>
                                        Temperature: {individualData.weather.main.temp}°C
                                    </Text>
                                    <Text style={styles.weatherDetail}>
                                        Humidity: {individualData.weather.main.humidity}%
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    // Handle grouped routes
    if (!transportData.groupedRoutes) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" />
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle" size={48} color="#e74c3c" />
                    <Text style={styles.errorText}>Invalid transport data format</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Optimized Transport Plan</Text>
                <Text style={styles.headerSubtitle}>
                    {transportData.groupedRoutes.length} routes optimized
                </Text>
            </View>

            <ScrollView style={styles.content}>
                {transportData.groupedRoutes.map((group: GroupedRoute) => (
                    <View key={group.groupId} style={styles.formContainer}>
                        <View style={styles.groupHeader}>
                            <Text style={styles.groupTitle}>Route Group {group.groupId}</Text>
                            <View style={styles.groupBadge}>
                                <Text style={styles.groupBadgeText}>{group.destinations.length} stops</Text>
                            </View>
                        </View>

                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Vehicle Information</Text>
                            <View style={styles.dataRow}>
                                <Text style={styles.dataLabel}>Strategy:</Text>
                                <Text style={styles.dataValue}>{group.vehicles.strategy}</Text>
                            </View>
                            <View style={styles.dataRow}>
                                <Text style={styles.dataLabel}>Total Distance:</Text>
                                <Text style={styles.dataValue}>
                                    {group.vehicles?.total_distance_km !== undefined ? `${group.vehicles.total_distance_km.toFixed(2)} km` : 'N/A'}
                                </Text>
                            </View>
                            <View style={styles.dataRow}>
                                <Text style={styles.dataLabel}>Estimated Cost:</Text>
                                <Text style={styles.dataValue}>LKR {group.vehicles.total_estimated_cost_LKR.toLocaleString()}</Text>
                            </View>
                            <View style={styles.dataRow}>
                                <Text style={styles.dataLabel}>Vehicles Needed:</Text>
                            </View>
                            <View style={styles.dataRow}>
                                <FlatList
                                    data={group.vehicles.vehicles}
                                    renderItem={({ item, index }) => (
                                        <View style={styles.dataRow}>
                                            <Text style={styles.dataValue}>{index + 1}. {item}</Text>
                                        </View>
                                    )}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.mapButton}
                            onPress={() => Linking.openURL(group.route.routeLink)}
                        >
                            <Ionicons name="map" size={20} color="#fff" />
                            <Text style={styles.buttonText}>View Route on Google Maps</Text>
                        </TouchableOpacity>

                        <Text style={styles.sectionTitle}>Destinations</Text>
                        {group.destinations.map((destination, index) => (
                            <View key={index} style={styles.destinationContainer}>
                                <View style={styles.destinationHeader}>
                                    <Text style={styles.destinationTitle}>Stop {index + 1}</Text>
                                </View>

                                <View style={styles.dataRow}>
                                    <Text style={styles.dataLabel}>Coordinates:</Text>
                                    <Text style={styles.dataValue}>
                                        {destination.lat}, {destination.lng}
                                    </Text>
                                </View>

                                <Text style={styles.subSectionTitle}>Deliveries</Text>
                                {destination.deliveries.map((delivery, idx) => (
                                    <View key={idx} style={styles.deliveryContainer}>
                                        <View style={styles.deliveryHeader}>
                                            <Text style={styles.deliveryTitle}>Delivery {idx + 1}</Text>
                                        </View>
                                        <View style={styles.rowInputs}>
                                            <View style={styles.halfInput}>
                                                <Text style={styles.inputLabel}>Volume:</Text>
                                                <Text style={styles.dataValue}>{delivery.volume_cft} CFT</Text>
                                            </View>
                                            <View style={styles.halfInput}>
                                                <Text style={styles.inputLabel}>Weight:</Text>
                                                <Text style={styles.dataValue}>{delivery.weight_kg} KG</Text>
                                            </View>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        ))}

                        <View style={styles.weatherContainer}>
                            <Text style={styles.sectionTitle}>Weather Conditions</Text>
                            {group.weather.map((w, idx) => (
                                <View key={idx} style={styles.weatherCard}>
                                    <Image
                                        source={{ uri: `https://openweathermap.org/img/wn/${w.weather[0].icon}@2x.png` }}
                                        style={styles.weatherIcon}
                                    />
                                    <View style={styles.weatherInfo}>
                                        <Text style={styles.weatherLocation}>{w.name}</Text>
                                        <Text style={styles.weatherDescription}>
                                            {w.weather[0].description}
                                        </Text>
                                        <Text style={styles.weatherDetail}>
                                            Temperature: {w.main.temp}°C
                                        </Text>
                                        <Text style={styles.weatherDetail}>
                                            Humidity: {w.main.humidity}%
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121b2e',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: '#e74c3c',
        marginTop: 10,
    },
    header: {
        backgroundColor: '#192841',
        padding: 16,
        paddingTop: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#263c5a',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#8a9bae',
        marginTop: 4,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    formContainer: {
        backgroundColor: '#192841',
        borderRadius: 8,
        padding: 16,
        marginBottom: 20,
    },
    groupHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    groupTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    groupBadge: {
        backgroundColor: '#2980b9',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 16,
    },
    groupBadgeText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    mapButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2980b9',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        marginLeft: 8,
    },
    destinationContainer: {
        backgroundColor: '#1e3254',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
    },
    destinationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    destinationTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    subSectionTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#ffffff',
        marginTop: 8,
        marginBottom: 10,
    },
    deliveryContainer: {
        backgroundColor: '#243761',
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
    },
    deliveryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    deliveryTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ffffff',
    },
    rowInputs: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfInput: {
        width: '48%',
    },
    inputLabel: {
        fontSize: 14,
        color: '#8a9bae',
        marginBottom: 6,
    },
    weatherContainer: {
        marginBottom: 10,
    },
    weatherCard: {
        backgroundColor: '#243761',
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    weatherIcon: {
        width: 60,
        height: 60,
        marginRight: 12,
    },
    weatherInfo: {
        flex: 1,
    },
    weatherLocation: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 4,
    },
    weatherDescription: {
        fontSize: 14,
        color: '#ffffff',
        textTransform: 'capitalize',
        marginBottom: 6,
    },
    weatherDetail: {
        fontSize: 14,
        color: '#8a9bae',
        marginBottom: 2,
    },
    sectionContainer: {
        padding: 16,
        backgroundColor: '#1e2a47',
        borderRadius: 8,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        color: '#ffffff',
        marginBottom: 8,
    },
    dataRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        padding: 8,
        backgroundColor: '#253958',
        borderRadius: 6,
    },
    dataLabel: {
        fontSize: 14,
        color: '#8a9bae',
    },
    dataValue: {
        fontSize: 14,
        color: '#ffffff',
        fontWeight: '500',
    },


});

export default OptimizedTransport;