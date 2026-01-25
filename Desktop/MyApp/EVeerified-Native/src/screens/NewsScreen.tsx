import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, fontSize } from '../lib/theme';
import { Calendar, ChevronRight } from 'lucide-react-native';
import { useLanguage } from '../contexts/LanguageContext';

const NEWS_DATA = [
    {
        id: '1',
        title_en: 'India to have 10,000 EV charging stations by 2026',
        title_hi: 'भारत में 2026 तक 10,000 EV चार्जिंग स्टेशन होंगे',
        title_mr: 'भारतात २०२६ पर्यंत १०,००० ईव्ही चार्जिंग स्टेशन असतील',
        title_kn: '2026 ರ ವೇಳೆಗೆ ಭಾರತದಲ್ಲಿ 10,000 ಇವಿ ಚಾರ್ಜಿಂಗ್ ಸ್ಟೇಷನ್‌ಗಳು',
        title_te: '2026 నాటికి భారతదేశంలో 10,000 EV ఛార్జింగ్ స్టేషన్లు',
        title_or: '୨୦୨୬ ସୁଦ୍ଧା ଭାରତରେ ୧୦,୦୦୦ ଇଭି ଚାର୍ଜିଂ ଷ୍ଟେସନ ହେବ',
        source: 'EV India News',
        date: '2 hours ago',
        image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
    {
        id: '2',
        title_en: 'Tata Motors announces new EV battery technology',
        title_hi: 'टाटा मोटर्स ने नई EV बैटरी तकनीक की घोषणा की',
        title_mr: 'टाटा मोटर्सने नवीन ईव्ही बॅटरी तंत्रज्ञानाची घोषणा केली',
        title_kn: 'ಟಾಟಾ ಮೋಟಾರ್ಸ್ ಹೊಸ ಇವಿ ಬ್ಯಾಟರಿ ತಂತ್ರಜ್ಞಾನವನ್ನು ಘೋಷಿಸಿದೆ',
        title_te: 'టాటా మోటార్స్ కొత్త EV బ్యాటరీ టెక్నాలజీని ప్రకటించింది',
        title_or: 'ଟାଟା ମୋଟର୍ସ ନୂତନ ଇଭି ବ୍ୟାଟେରୀ ପ୍ରଯୁକ୍ତିବିଦ୍ୟା ଘୋଷಣಾ କରିଛି',
        source: 'Auto Weekly',
        date: '5 hours ago',
        image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
    {
        id: '3',
        title_en: 'Skills shortage in EV sector: 50,000 technicians needed',
        title_hi: 'EV क्षेत्र में कौशल की कमी: 50,000 तकनीशियनों की आवश्यकता',
        title_mr: 'ईव्ही क्षेत्रात कौशल्यांची कमतरता: ५०,००० तंत्रज्ञांची गरज',
        title_kn: 'ಇವಿ ಕ್ಷೇತ್ರದಲ್ಲಿ ಕೌಶಲ್ಯದ ಕೊರತೆ: 50,000 ತಂತ್ರಜ್ಞರ ಅಗತ್ಯವಿದೆ',
        title_te: 'EV రంగంలో నైపుణ్యాల కొరత: 50,000 మంది టెక్నీషియన్లు అవసరం',
        title_or: 'ଇଭି କ୍ଷେତ୍ରରେ ଦକ୍ଷତା ଅଭାବ: ୫୦,୦୦୦ ଟେକ୍ନିସିଆନ ଆବଶ୍ୟಕ',
        source: 'Skill India',
        date: '1 day ago',
        image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
];

export default function NewsScreen() {
    const { language } = useLanguage();

    const renderItem = ({ item }: { item: any }) => {
        const title = language === 'hi' ? item.title_hi :
            language === 'mr' ? item.title_mr :
                language === 'kn' ? item.title_kn :
                    language === 'te' ? item.title_te :
                        language === 'or' ? item.title_or :
                            item.title_en;

        return (
            <TouchableOpacity style={styles.newsCard} activeOpacity={0.7}>
                <Image source={{ uri: item.image }} style={styles.newsImage} />
                <View style={styles.newsContent}>
                    <Text style={styles.newsTitle} numberOfLines={2}>{title}</Text>
                    <View style={styles.metaRow}>
                        <Text style={styles.sourceText}>{item.source}</Text>
                        <View style={styles.dot} />
                        <View style={styles.dateRow}>
                            <Calendar size={12} color={colors.muted} />
                            <Text style={styles.dateText}>{item.date}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.arrowContainer}>
                    <ChevronRight size={20} color={colors.muted} />
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" />
            <Text style={styles.headerTitle}>EV News & Updates</Text>
            <FlatList
                data={NEWS_DATA}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.foreground,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
    },
    listContent: {
        padding: spacing.lg,
        gap: spacing.md,
    },
    newsCard: {
        flexDirection: 'row',
        backgroundColor: colors.card,
        borderRadius: borderRadius.xl,
        padding: spacing.sm,
        gap: spacing.md,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    newsImage: {
        width: 80,
        height: 80,
        borderRadius: borderRadius.lg,
        backgroundColor: '#f1f1f1',
    },
    newsContent: {
        flex: 1,
        justifyContent: 'center',
        gap: 8,
    },
    newsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.foreground,
        lineHeight: 22,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    sourceText: {
        fontSize: 12,
        color: colors.primary,
        fontWeight: '600',
    },
    dot: {
        width: 3,
        height: 3,
        borderRadius: 1.5,
        backgroundColor: colors.muted,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    dateText: {
        fontSize: 12,
        color: colors.muted,
    },
    arrowContainer: {
        paddingRight: spacing.sm,
    },
});
