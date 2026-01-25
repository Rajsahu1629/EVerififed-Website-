import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ArrowLeft, MapPin, Users, Clock, CheckCircle } from 'lucide-react-native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import { colors, spacing, borderRadius, fontSize, shadows } from '../lib/theme';
import { query } from '../lib/database';

type PreviousJobsNavigationProp = StackNavigationProp<RootStackParamList, 'PreviousJobs'>;

interface JobPost {
    id: string;
    brand: string;
    role_required: string;
    number_of_people: string;
    salary_min: number;
    salary_max: number;
    city: string;
    status: string;
    created_at: string;
}

const PreviousJobsScreen: React.FC = () => {
    const navigation = useNavigation<PreviousJobsNavigationProp>();
    const { t } = useLanguage();
    const { recruiterData } = useUser();

    const [jobs, setJobs] = useState<JobPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Use useFocusEffect to reload jobs when screen comes into focus
    useFocusEffect(
        React.useCallback(() => {
            loadJobs();
        }, [])
    );

    const loadJobs = async () => {
        try {
            const result = await query<JobPost>(
                `SELECT * FROM job_posts WHERE recruiter_id = $1 ORDER BY created_at DESC`,
                [recruiterData?.id]
            );
            setJobs(result);
        } catch (error) {
            console.error('Error loading jobs:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'received':
                return { text: t('statusReceived'), color: colors.info, icon: Clock };
            case 'matching':
                return { text: t('statusMatching'), color: colors.warning, icon: Users };
            case 'profiles_sent':
                return { text: t('statusProfilesSent'), color: colors.success, icon: CheckCircle };
            case 'trial_booked':
                return { text: t('statusTrialBooked'), color: colors.success, icon: CheckCircle };
            default:
                return { text: t('pending'), color: colors.muted, icon: Clock };
        }
    };

    const formatSalary = (min: number, max: number) => {
        return `₹${(min / 1000).toFixed(0)}k - ₹${(max / 1000).toFixed(0)}k`;
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <ArrowLeft size={24} color={colors.foreground} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('previousJobPosts')}</Text>
            </View>

            {/* Content */}
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : jobs.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>{t('noJobsYet')}</Text>
                </View>
            ) : (
                <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                    {jobs.map((job) => {
                        const statusConfig = getStatusConfig(job.status);
                        const StatusIcon = statusConfig.icon;

                        return (
                            <View key={job.id} style={styles.jobCard}>
                                <View style={styles.jobHeader}>
                                    <View style={styles.brandBadge}>
                                        <Text style={styles.brandText}>{job.brand}</Text>
                                    </View>
                                    <View style={[styles.statusBadge, { backgroundColor: `${statusConfig.color}15` }]}>
                                        <StatusIcon size={14} color={statusConfig.color} />
                                        <Text style={[styles.statusText, { color: statusConfig.color }]}>
                                            {statusConfig.text}
                                        </Text>
                                    </View>
                                </View>

                                <Text style={styles.roleText}>{job.role_required}</Text>

                                <View style={styles.jobDetails}>
                                    <View style={styles.detailItem}>
                                        <MapPin size={16} color={colors.muted} />
                                        <Text style={styles.detailText}>{job.city}</Text>
                                    </View>
                                    <View style={styles.detailItem}>
                                        <Users size={16} color={colors.muted} />
                                        <Text style={styles.detailText}>{job.number_of_people} {t('people')}</Text>
                                    </View>
                                </View>

                                <Text style={styles.salaryText}>
                                    {formatSalary(job.salary_min, job.salary_max)}
                                </Text>
                            </View>
                        );
                    })}
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        backgroundColor: colors.background,
        paddingTop: spacing.xl,
        paddingBottom: spacing.md,
        paddingHorizontal: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backButton: {
        position: 'absolute',
        left: spacing.md,
        padding: spacing.sm,
    },
    headerTitle: {
        fontSize: fontSize.lg,
        fontWeight: '600',
        color: colors.foreground,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
    },
    emptyText: {
        fontSize: fontSize.base,
        color: colors.muted,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: spacing.lg,
        gap: spacing.md,
    },
    jobCard: {
        backgroundColor: colors.card,
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        ...shadows.md,
    },
    jobHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    brandBadge: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.md,
    },
    brandText: {
        fontSize: fontSize.xs,
        fontWeight: '600',
        color: colors.primaryForeground,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full,
    },
    statusText: {
        fontSize: fontSize.xs,
        fontWeight: '500',
    },
    roleText: {
        fontSize: fontSize.lg,
        fontWeight: '600',
        color: colors.foreground,
        marginBottom: spacing.sm,
    },
    jobDetails: {
        flexDirection: 'row',
        gap: spacing.lg,
        marginBottom: spacing.sm,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    detailText: {
        fontSize: fontSize.sm,
        color: colors.muted,
    },
    salaryText: {
        fontSize: fontSize.base,
        fontWeight: '600',
        color: colors.success,
    },
});

export default PreviousJobsScreen;
