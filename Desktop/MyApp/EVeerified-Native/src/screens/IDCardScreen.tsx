import React, { useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    ScrollView,
    Modal,
    TextInput,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
    TouchableOpacity,
    Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, Line } from 'react-native-svg';
import {
    Zap, Star, CheckCircle, Clock, AlertCircle, LogOut,
    Package, ChevronRight, X, MapPin, Phone, User, Home, Download, Share2,
    Instagram, MessageCircle, Facebook
} from 'lucide-react-native';
import { useUser, VerificationStatus } from '../contexts/UserContext';
import { colors, spacing } from '../lib/theme';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { LanguageSelector } from '../components/LanguageSelector';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';
import { useRef } from 'react';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 40;
const CARD_ASPECT_RATIO = 1.586;
const CARD_HEIGHT = CARD_WIDTH / CARD_ASPECT_RATIO;

// Web-matched Circuit Pattern
const CircuitPattern = ({ color = '#ffd700', isGold, isTeal }: { color?: string, isGold?: boolean, isTeal?: boolean }) => {
    // Colors from web version
    const strokeColor = isGold ? "#d4a574" : isTeal ? "#00d9cc" : "#00ccaa";

    return (
        <Svg width="100%" height="100%" style={{ position: 'absolute', opacity: 0.4 }}>
            {/* Horizontal lines */}
            <Line x1="10%" y1="20%" x2="30%" y2="20%" stroke={strokeColor} strokeWidth="2" />
            <Line x1="12%" y1="35%" x2="32%" y2="35%" stroke={strokeColor} strokeWidth="2" />
            <Line x1="8%" y1="55%" x2="25%" y2="55%" stroke={strokeColor} strokeWidth="1.5" />
            <Line x1="14%" y1="75%" x2="35%" y2="75%" stroke={strokeColor} strokeWidth="1.5" />

            {/* Diagonal segments */}
            <Path d="M 150 60 L 190 75 L 250 75" stroke={strokeColor} strokeWidth="2" fill="none" />
            <Path d="M 170 110 L 210 125 L 280 125" stroke={strokeColor} strokeWidth="2" fill="none" />

            {/* Right side lines */}
            <Line x1="75%" y1="15%" x2="92%" y2="15%" stroke={strokeColor} strokeWidth="1.5" />
            <Line x1="77%" y1="30%" x2="94%" y2="30%" stroke={strokeColor} strokeWidth="1.5" />

            {/* Circuit nodes */}
            <Circle cx="30%" cy="20%" r="2.5" fill={strokeColor} />
            <Circle cx="35%" cy="28%" r="2.5" fill={strokeColor} />
            <Circle cx="32%" cy="35%" r="2.5" fill={strokeColor} />
            <Circle cx="25%" cy="55%" r="2.5" fill={strokeColor} />
            <Circle cx="35%" cy="75%" r="2.5" fill={strokeColor} />
            <Circle cx="80%" cy="45%" r="2.5" fill={strokeColor} />
        </Svg>
    );
};

// QR Code Grid Pattern
const QRCodeGrid = ({ size = 65 }: { size?: number }) => {
    const cols = 5;
    const cellSize = size / cols;
    const filledIndices = [0, 1, 2, 4, 5, 6, 10, 14, 18, 20, 21, 22, 24]; // Matching web pattern

    return (
        <View style={{ width: size, height: size, flexDirection: 'row', flexWrap: 'wrap' }}>
            {Array.from({ length: 25 }).map((_, i) => (
                <View
                    key={i}
                    style={{
                        width: cellSize,
                        height: cellSize,
                        backgroundColor: filledIndices.includes(i) ? '#1f2937' : 'transparent', // bg-gray-800
                        padding: 1.5
                    }}
                />
            ))}
        </View>
    );
};

// Theme Configs (Web Matched)
const THEMES = {
    gold: {
        gradient: ['#3a2817', '#4a3520', '#5a4228'] as const,
        primaryColor: '#d4a574',
        badgeGradient: ['rgba(212, 165, 116, 0.25)', 'rgba(180, 130, 50, 0.15)'] as const,
        badgeBorder: '#d4a574',
        partnersGradient: ['rgba(160, 110, 40, 0.55)', 'rgba(180, 130, 50, 0.45)'] as const,
        partnersBorder: 'rgba(200, 150, 70, 0.7)',
    },
    teal: {
        gradient: ['#0a4d4d', '#0d5f5f', '#107373'] as const,
        primaryColor: '#00d9cc',
        badgeGradient: ['rgba(0, 217, 204, 0.25)', 'rgba(0, 217, 204, 0.15)'] as const,
        badgeBorder: '#00d9cc',
        partnersGradient: ['rgba(0, 180, 180, 0.4)', 'rgba(0, 200, 200, 0.35)'] as const,
        partnersBorder: 'rgba(0, 217, 204, 0.6)',
    },
    // Technician Theme - "Titanium" (Black/Grey)
    green: {
        gradient: ['#000000', '#1c1c1c', '#333333'] as const,
        primaryColor: '#e0e0e0', // Silver
        badgeGradient: ['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)'] as const,
        badgeBorder: '#a0a0a0',
        partnersGradient: ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)'] as const,
        partnersBorder: 'rgba(255, 255, 255, 0.2)',
    },
};

const getRoleLabel = (role?: string) => {
    switch (role) {
        case "technician": return { title: "Verified EV Technician" };
        case "sales": return { title: "Verified EV Sales Consultant" };
        case "workshop": return { title: "Verified EV Manager" };
        case "aspirant": return { title: "Verified EV Fresher" };
        default: return { title: "EV Professional" };
    }
};

const getVerificationProgress = (role?: string, status?: VerificationStatus, step?: number): string => {
    const required = role === 'technician' ? 2 : 1;
    if (status === 'verified') return `All ${required} test${required > 1 ? 's' : ''} passed`;
    if (status === 'failed') return 'Retry after 7 days';
    if (status === 'step1_completed') return '1 test passed, 1 remaining';
    return `Complete your verification`;
};

export default function IDCardScreen() {
    const { userData, logout } = useUser();
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const cardRef = useRef(null);

    // Order Modal State
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [orderForm, setOrderForm] = useState({
        fullName: userData?.fullName || '',
        address: '',
        city: userData?.city || '',
        pincode: userData?.pincode || '',
        mobile: userData?.phoneNumber || '',
    });

    // Theme Logic - Decoupled from Verification Status
    const isVerified = userData?.verificationStatus === 'verified' || userData?.verificationStatus === 'approved';
    const isPending = !isVerified;

    // Theme depends strictly on Role
    const isGold = userData?.role === 'sales';
    const isTeal = userData?.role === 'workshop';
    // Both technicians and aspirants use the Titanium (green/black) theme
    // const isTitanium = userData?.role === 'technician' || userData?.role === 'aspirant';

    // Early return if userData is null (during logout) to prevent color flash
    if (!userData) {
        return null;
    }

    const theme = isGold ? THEMES.gold : isTeal ? THEMES.teal : THEMES.green;
    const roleInfo = getRoleLabel(userData?.role);
    const [showShareModal, setShowShareModal] = useState(false);

    // Format Experience Text Compactly
    const getExperienceLabel = (exp?: string) => {
        if (!exp || exp === 'fresher') return 'Fresher';
        if (exp === '0-1') return '0-1 Experienced';
        if (exp === '1-2') return '1+ Experienced';
        if (exp === '2-5') return '2+ Experienced';
        if (exp === '5+') return '5+ Experienced';
        return `${exp} Experienced`;
    };

    const experienceText = getExperienceLabel(userData?.experience);

    // Experience Partners - Use user's selected brands from registration
    const userBrands = userData?.brands || [];
    const experiencePartners = useMemo(() => {
        const defaultPartners = [
            { name: "OLA", sub: "Electric" },
            { name: "Ather", sub: "Energy" },
            { name: "TVS", sub: "iQube" }
        ];

        if (userBrands.length > 0) {
            // Map user's brands to display format
            return userBrands.slice(0, 3).map((brand, index) => ({
                name: brand,
                sub: index === 0 ? "Electric" : "EV",
                color: index === 0 ? theme.primaryColor : "#ffffff"
            }));
        }

        return defaultPartners.map((p, index) => ({
            ...p,
            color: index === 0 ? theme.primaryColor : "#ffffff"
        }));
    }, [userBrands, theme.primaryColor]);

    const handleLogout = async () => {
        await logout();
        navigation.reset({ index: 0, routes: [{ name: 'RoleSelection' }] });
    };

    const handleStartVerification = () => {
        const step = userData?.verificationStatus === 'step1_completed' ? 2 : 1;
        navigation.navigate('SkillVerification', { step });
    };

    const handleOrderCard = () => {
        if (!orderForm.fullName || !orderForm.address || !orderForm.pincode || !orderForm.mobile) {
            Alert.alert('Missing Details', 'Please fill all required fields');
            return;
        }
        Alert.alert('Order Placed!', `Your physical ID Card for Rs 200 will be delivered within 7-10 days.`);
        setShowOrderModal(false);
    };

    const handleShare = async (platform?: 'whatsapp' | 'instagram' | 'facebook') => {
        try {
            const uri = await captureRef(cardRef, {
                format: 'png',
                quality: 0.9,
            });

            if (!platform) {
                const isSharingAvailable = await Sharing.isAvailableAsync();
                if (!isSharingAvailable) {
                    Alert.alert('Error', 'Sharing not available on this device');
                    return;
                }
                await Sharing.shareAsync(uri);
                return;
            }

            // Platform specific sharing (Limited by system, but trying best effort)
            const message = "I am an EV Certified Professional! Check out my ID card.";

            if (platform === 'whatsapp') {
                const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
                const canOpen = await Linking.canOpenURL(url).catch(() => false);

                if (canOpen) {
                    await Linking.openURL(url);
                } else {
                    // Fallback to system share if WhatsApp is not installed (e.g. Simulator)
                    await Sharing.shareAsync(uri);
                }
            } else {
                // For others or generic share, use system share sheet which supports image + text best
                await Sharing.shareAsync(uri);
            }
            setShowShareModal(false);
        } catch (error) {
            console.error('Share error:', error);
            Alert.alert('Share', 'Could not share. Please try the general share option.');
        }
    };

    const handleDownload = async () => {
        try {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission needed', 'Please grant library access to save your ID card.');
                return;
            }

            const uri = await captureRef(cardRef, {
                format: 'png',
                quality: 1.0,
            });

            // For Expo Go on Android/iOS, this is the most reliable way
            const asset = await MediaLibrary.createAssetAsync(uri);
            await MediaLibrary.createAlbumAsync('EVeerified', asset, false);

            Alert.alert('Success', 'ID Card saved to your gallery in the EVeerified folder!');
        } catch (error) {
            console.error('Download error:', error);
            Alert.alert('Error', 'Could not save the ID card. Please try taking a screenshot.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <LinearGradient colors={['#1a9d6e', '#137a55']} style={styles.header}>
                <View style={styles.headerRow}>
                    <View style={styles.headerLeft}>
                        <Zap size={20} color="#00d9a3" fill="#00d9a3" />
                        <Text style={styles.headerLogoText}>
                            <Text style={{ color: '#00d9a3' }}>EV</Text>erified
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <LanguageSelector color="#fff" />
                        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
                            <LogOut size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={styles.welcomeText}>Welcome, {userData?.fullName?.split(' ')[0] || 'User'}!</Text>
                <Text style={styles.roleText}>{roleInfo.title}</Text>
            </LinearGradient>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* ID Card */}
                <View ref={cardRef} collapsable={false} style={[styles.cardContainer, { height: CARD_HEIGHT }]}>
                    <LinearGradient
                        colors={[...theme.gradient]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.cardGradient}
                    >
                        {/* Background Pattern */}
                        <CircuitPattern isGold={isGold} isTeal={isTeal} />

                        {/* Large Circle with QR Code */}
                        <View style={[styles.largeCircle, { borderColor: theme.primaryColor }]}>
                            <View style={styles.qrBg}>
                                <QRCodeGrid size={60} />
                            </View>
                        </View>



                        {/* Top Left: Logo */}
                        <View style={styles.cardHeader}>
                            <View style={styles.miniLogoBg}>
                                <Zap size={10} color={theme.primaryColor} fill={theme.primaryColor} />
                            </View>
                            <Text style={styles.miniLogoText}>
                                <Text style={{ color: theme.primaryColor }}>EV</Text>erified
                            </Text>
                        </View>

                        {/* User Details */}
                        <View style={styles.userDetails}>
                            <Text style={styles.cardName}>{userData?.fullName}</Text>
                            <Text style={styles.cardRole}>{roleInfo.title}</Text>
                            <Text style={[styles.cardSub, { marginTop: 4, opacity: 0.9 }]}>
                                {experienceText}
                            </Text>
                        </View>

                        {/* Badge */}
                        <View style={styles.bottomSection}>
                            <View style={[styles.badgeContainer, { borderColor: isVerified ? theme.badgeBorder : '#FFC107' }]}>
                                <LinearGradient
                                    colors={isVerified ? [...theme.badgeGradient] : ['rgba(255, 193, 7, 0.25)', 'rgba(255, 193, 7, 0.15)']}
                                    style={styles.badgeValues}
                                >
                                    {isVerified ? (
                                        <>
                                            <Text style={[styles.badgeTitle, { color: theme.primaryColor }]}>VERIFIED</Text>
                                            <View style={{ flexDirection: 'row', gap: 1 }}>
                                                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={8} fill="#FFD700" color="#FFD700" />)}
                                            </View>
                                        </>
                                    ) : (
                                        <>
                                            <Text style={[styles.badgeTitle, { color: '#FFC107', fontSize: 7 }]}>PENDING</Text>
                                            <Text style={[styles.badgeTitle, { color: '#FFC107', fontSize: 6 }]}>VERIFICATION</Text>
                                        </>
                                    )}
                                </LinearGradient>
                            </View>

                            {/* Experience Partners */}
                            {/* Experience Partners - Only for experienced roles */}
                            {userData?.role !== 'aspirant' && (
                                <View style={styles.partnersSection}>
                                    <Text style={styles.partnersLabel}>EXPERIENCE{'\n'}PARTNERS</Text>

                                    <LinearGradient
                                        colors={[...theme.partnersGradient]}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={[styles.partnersDill, { borderColor: theme.partnersBorder }]}
                                    >
                                        {experiencePartners.map((p, i) => (
                                            <View key={i} style={{ alignItems: 'center' }}>
                                                <Text style={{ color: p.color, fontSize: 10, fontWeight: 'bold' }}>{p.name}</Text>
                                                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 7 }}>{p.sub}</Text>
                                            </View>
                                        ))}
                                    </LinearGradient>
                                </View>
                            )}
                        </View>

                    </LinearGradient>
                </View>

                {/* Verification Status / Actions */}
                <View style={[
                    styles.statusCard,
                    {
                        backgroundColor: isVerified ? '#ecfdf5' : isPending ? '#fffbeb' : '#fef2f2',
                        borderColor: isVerified ? '#d1fae5' : isPending ? '#fef3c7' : '#fecaca'
                    }
                ]}>
                    <View style={[styles.statusIcon, {
                        backgroundColor: isVerified ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)'
                    }]}>
                        {isVerified ? <CheckCircle size={22} color="#10b981" /> : <Clock size={22} color="#f59e0b" />}
                    </View>
                    <View style={styles.statusInfo}>
                        <Text style={[styles.statusTitle, { color: isVerified ? '#10b981' : '#f59e0b' }]}>
                            {isVerified ? 'Verified' : 'Verification Pending'}
                        </Text>
                        <Text style={styles.statusSub}>
                            {getVerificationProgress(userData?.role, userData?.verificationStatus, userData?.verificationStep)}
                        </Text>
                    </View>
                    {!isVerified && (
                        <TouchableOpacity onPress={handleStartVerification} style={styles.verifyBtn}>
                            <Text style={styles.verifyBtnText}>
                                {userData?.verificationStatus === 'step1_completed' ? 'Continue' : 'Start'}
                            </Text>
                            <ChevronRight size={16} color="#fff" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Action Buttons (Download/Share) */}
                <View style={styles.actionRow}>
                    <TouchableOpacity style={styles.actionBtn} onPress={handleDownload}>
                        <Download size={18} color="#fff" />
                        <Text style={styles.actionBtnText}>Download</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, styles.shareBtn]} onPress={() => setShowShareModal(true)}>
                        <Share2 size={18} color={colors.foreground} />
                        <Text style={[styles.actionBtnText, { color: colors.foreground }]}>Share</Text>
                    </TouchableOpacity>
                </View>

                {/* Physical Card Order - Now visible to all professionals */}
                <TouchableOpacity style={styles.orderBtn} onPress={() => setShowOrderModal(true)}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(26, 157, 110, 0.1)', justifyContent: 'center', alignItems: 'center' }}>
                            <Package size={20} color="#1a9d6e" />
                        </View>
                        <View>
                            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Order Physical Card (Rs 200)</Text>
                            <Text style={{ fontSize: 12, color: colors.muted }}>Get your premium ID card at your door step</Text>
                        </View>
                    </View>
                    <ChevronRight size={20} color={colors.muted} />
                </TouchableOpacity>

            </ScrollView>

            {/* Share Modal */}
            <Modal visible={showShareModal} animationType="fade" transparent>
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowShareModal(false)}
                >
                    <View style={styles.shareMenu}>
                        <Text style={styles.shareTitle}>Share via</Text>
                        <View style={styles.shareGrid}>
                            <TouchableOpacity style={styles.shareItem} onPress={() => handleShare('whatsapp')}>
                                <View style={[styles.shareIcon, { backgroundColor: '#25D366' }]}>
                                    <MessageCircle size={24} color="#fff" />
                                </View>
                                <Text style={styles.shareLabel}>WhatsApp</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.shareItem} onPress={() => handleShare('instagram')}>
                                <View style={[styles.shareIcon, { backgroundColor: '#E4405F' }]}>
                                    <Instagram size={24} color="#fff" />
                                </View>
                                <Text style={styles.shareLabel}>Instagram</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.shareItem} onPress={() => handleShare('facebook')}>
                                <View style={[styles.shareIcon, { backgroundColor: '#1877F2' }]}>
                                    <Facebook size={24} color="#fff" />
                                </View>
                                <Text style={styles.shareLabel}>Facebook</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.shareItem} onPress={() => handleShare()}>
                                <View style={[styles.shareIcon, { backgroundColor: '#6b7280' }]}>
                                    <Share2 size={24} color="#fff" />
                                </View>
                                <Text style={styles.shareLabel}>More</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Order Modal */}
            <Modal visible={showOrderModal} animationType="slide" transparent>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Order Physical ID Card (Rs 200)</Text>
                            <TouchableOpacity onPress={() => setShowOrderModal(false)}>
                                <X size={24} color={colors.muted} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={{ maxHeight: 400 }}>
                            <Text style={styles.formLabel}>Full Name *</Text>
                            <View style={styles.inputBox}><User size={18} color="#9ca3af" /><TextInput style={styles.input} value={orderForm.fullName} onChangeText={t => setOrderForm({ ...orderForm, fullName: t })} /></View>

                            <Text style={styles.formLabel}>Address *</Text>
                            <View style={styles.inputBox}><Home size={18} color="#9ca3af" /><TextInput style={styles.input} value={orderForm.address} onChangeText={t => setOrderForm({ ...orderForm, address: t })} /></View>

                            <View style={{ flexDirection: 'row', gap: 10 }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.formLabel}>City *</Text>
                                    <View style={styles.inputBox}><MapPin size={18} color="#9ca3af" /><TextInput style={styles.input} value={orderForm.city} onChangeText={t => setOrderForm({ ...orderForm, city: t })} /></View>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.formLabel}>Pincode *</Text>
                                    <View style={styles.inputBox}><TextInput style={styles.input} value={orderForm.pincode} onChangeText={t => setOrderForm({ ...orderForm, pincode: t })} keyboardType='numeric' /></View>
                                </View>
                            </View>

                            <Text style={styles.formLabel}>Mobile *</Text>
                            <View style={styles.inputBox}><Phone size={18} color="#9ca3af" /><TextInput style={styles.input} value={orderForm.mobile} onChangeText={t => setOrderForm({ ...orderForm, mobile: t })} keyboardType='phone-pad' /></View>

                            <TouchableOpacity style={styles.submitBtn} onPress={handleOrderCard}>
                                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Place Order</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },

    // Header
    header: { padding: 20, paddingTop: 10, paddingBottom: 20 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    headerLogoText: { color: '#fff', fontSize: 18, fontWeight: '700' },
    logoutBtn: { padding: 4 },
    welcomeText: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
    roleText: { color: 'rgba(255,255,255,0.9)', fontSize: 14, marginTop: 2 },

    scrollContent: { padding: 20 },

    // Card Styles
    cardContainer: {
        width: '100%',
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        marginBottom: 20,
    },
    cardGradient: { flex: 1, padding: 20, position: 'relative' },

    // Large Circle with QR
    largeCircle: {
        position: 'absolute',
        top: '50%',
        right: '8%',
        width: CARD_HEIGHT * 0.7, // 70% of height
        height: CARD_HEIGHT * 0.7,
        borderRadius: (CARD_HEIGHT * 0.7) / 2,
        borderWidth: 2,
        opacity: 0.25,
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ translateY: -(CARD_HEIGHT * 0.7) / 2 }],
    },
    qrBg: {
        backgroundColor: '#fff',
        padding: 4,
        borderRadius: 8,
    },



    // Card Header Logo
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
    miniLogoBg: {
        width: 20,
        height: 20,
        borderRadius: 6,
        backgroundColor: 'rgba(0, 217, 163, 0.2)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    miniLogoText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },

    // User Details
    userDetails: { marginBottom: 'auto' },
    cardName: { color: '#fff', fontSize: 24, fontWeight: 'bold', lineHeight: 28 },
    cardRole: { color: '#fff', fontSize: 12, fontWeight: '600' },
    cardSub: { color: 'rgba(255,255,255,0.85)', fontSize: 10, marginTop: 2 },

    // Bottom Section
    bottomSection: { marginTop: 'auto', gap: 12 },

    badgeContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 2.5,
        overflow: 'hidden'
    },
    badgeValues: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    badgeTitle: { fontSize: 8.5, fontWeight: 'bold', marginBottom: 2 },

    // Partners
    partnersSection: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    partnersLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 7, fontWeight: '700', lineHeight: 9 },
    partnersDill: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        borderWidth: 1.5,
        borderRightWidth: 0,
        marginRight: -20, // Extend to edge
    },

    // Status Card
    statusCard: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, borderWidth: 1, gap: 12, marginBottom: 16 },
    statusIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
    statusInfo: { flex: 1 },
    statusTitle: { fontSize: 15, fontWeight: 'bold' },
    statusSub: { fontSize: 12, color: '#6b7280' },
    verifyBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, gap: 4 },
    verifyBtnText: { color: '#fff', fontSize: 13, fontWeight: '600' },

    // Actions
    actionRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
    actionBtn: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, padding: 14, backgroundColor: '#1a9d6e', borderRadius: 14 },
    shareBtn: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb' },
    actionBtnText: { color: '#fff', fontWeight: '600' },

    // Order Btn
    orderBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#e5e7eb' },

    // Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle: { fontSize: 18, fontWeight: 'bold' },
    formLabel: { fontSize: 13, fontWeight: '600', marginBottom: 6, marginTop: 12 },
    inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f4f6', borderRadius: 12, paddingHorizontal: 12, height: 48, gap: 10 },
    input: { flex: 1, fontSize: 14 },
    submitBtn: { backgroundColor: '#1a9d6e', borderRadius: 12, height: 50, justifyContent: 'center', alignItems: 'center', marginTop: 24 },

    // Share Modal
    shareMenu: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 32,
        width: '100%',
        alignItems: 'center',
    },
    shareTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.foreground,
        marginBottom: 24,
    },
    shareGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 10,
    },
    shareItem: {
        alignItems: 'center',
        gap: 8,
    },
    shareIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    shareLabel: {
        fontSize: 12,
        color: colors.muted,
        fontWeight: '500',
    },
});
