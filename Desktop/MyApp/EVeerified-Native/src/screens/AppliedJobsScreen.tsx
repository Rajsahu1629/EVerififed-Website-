import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, fontSize } from '../lib/theme';
import { Briefcase, MapPin, CheckCircle, Clock, Building2 } from 'lucide-react-native';
import { useUser } from '../contexts/UserContext';
import { query } from '../lib/database';

// Type for applied job with job details
interface AppliedJob {
    id: number;
    job_post_id: number;
    status: string;
    applied_at: string;
    // Job post details
    brand: string;
    role_required: string;
    city: string;
    pincode: string;
}

export default function AppliedJobsScreen() {
    const { userData } = useUser();
    const [applications, setApplications] = useState<AppliedJob[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Fetch user's applications with job details
    const fetchApplications = useCallback(async () => {
        if (!userData?.id) return;

        try {
            const result = await query<AppliedJob>(
                `SELECT 
                    ja.id, 
                    ja.job_post_id, 
                    ja.status, 
                    ja.applied_at,
                    jp.brand,
                    jp.role_required,
                    jp.city,
                    jp.pincode
                 FROM job_applications ja
                 JOIN job_posts jp ON ja.job_post_id = jp.id
                 WHERE ja.user_id = $1
                 ORDER BY ja.applied_at DESC`,
                [userData.id]
            );
            setApplications(result);
        } catch (error) {
            console.error('Error fetching applications:', error);
        }
    }, [userData?.id]);

    // Initial load
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await fetchApplications();
            setLoading(false);
        };
        loadData();
    }, [fetchApplications]);

    // Pull to refresh
    const onRefresh = async () => {
        setRefreshing(true);
        await fetchApplications();
        setRefreshing(false);
    };

    // Format date
    const formatDate = (dateString: string): string => {
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffTime = Math.abs(now.getTime() - date.getTime());
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 0) return 'Today';
            if (diffDays === 1) return 'Yesterday';
            if (diffDays < 7) return `${diffDays} days ago`;
            if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${diffDays >= 14 ? 's' : ''} ago`;
            return `${Math.floor(diffDays / 30)} month${diffDays >= 60 ? 's' : ''} ago`;
        } catch {
            return 'Recently';
        }
    };

    // Get status color
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'shortlisted': return '#10b981';
            case 'interview': return '#8b5cf6';
            case 'rejected': return '#ef4444';
            case 'hired': return '#059669';
            default: return '#1a9d6e'; // applied
        }
    };

    // Render application card
    const renderItem = ({ item }: { item: AppliedJob }) => (
        <View style={styles.jobCard}>
            <View style={styles.cardHeader}>
                <View style={styles.companyIcon}>
                    <Text style={styles.companyInitial}>
                        {item.brand?.charAt(0)?.toUpperCase() || 'J'}
                    </Text>
                </View>
                <View style={styles.companyInfo}>
                    <Text style={styles.roleText}>{item.role_required || 'Job Role'}</Text>
                    <Text style={styles.companyText}>{item.brand || 'Company'}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '15' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                        {item.status?.toUpperCase() || 'APPLIED'}
                    </Text>
                </View>
            </View>

            <View style={styles.cardFooter}>
                <View style={styles.metaWithIcon}>
                    <MapPin size={14} color={colors.muted} />
                    <Text style={styles.metaText}>
                        {item.city ? `${item.city} (${item.pincode})` : item.pincode || 'Location'}
                    </Text>
                </View>
                <View style={styles.metaWithIcon}>
                    <Clock size={14} color={colors.muted} />
                    <Text style={styles.metaText}>{formatDate(item.applied_at)}</Text>
                </View>
            </View>
        </View>
    );

    // Empty state
    const EmptyState = () => (
        <View style={styles.emptyState}>
            <View style={styles.emptyIconBg}>
                <Briefcase size={32} color={colors.muted} />
            </View>
            <Text style={styles.emptyTitle}>No Applications Yet</Text>
            <Text style={styles.emptyText}>You have not applied to any jobs yet.</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Briefcase size={22} color={colors.foreground} />
                <Text style={styles.headerTitle}>Applied Jobs</Text>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={styles.loadingText}>Loading applications...</Text>
                </View>
            ) : (
                <FlatList
                    data={applications}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[colors.primary]}
                        />
                    }
                    ListEmptyComponent={EmptyState}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.foreground,
    },
    listContent: {
        padding: spacing.lg,
        gap: spacing.md,
        flexGrow: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: spacing.md,
    },
    loadingText: {
        fontSize: 14,
        color: colors.muted,
    },
    jobCard: {
        backgroundColor: colors.card,
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    companyIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: colors.primary + '15',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    companyInitial: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.primary,
    },
    companyInfo: {
        flex: 1,
    },
    roleText: {
        fontSize: 15,
        fontWeight: '700',
        color: colors.foreground,
        marginBottom: 2,
    },
    companyText: {
        fontSize: 13,
        color: colors.muted,
        fontWeight: '500',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    cardFooter: {
        flexDirection: 'row',
        gap: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingTop: spacing.sm,
    },
    metaWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    metaText: {
        fontSize: 12,
        color: colors.muted,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: spacing.xxl * 2,
    },
    emptyIconBg: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.lg,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.foreground,
    },
    emptyText: {
        fontSize: 14,
        color: colors.muted,
        marginTop: spacing.xs,
    },
});

