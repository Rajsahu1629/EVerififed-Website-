import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    ScrollView,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ArrowLeft, User, Phone, Lock, MapPin, Briefcase } from 'lucide-react-native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser, UserRole } from '../contexts/UserContext';
import { LanguageSelector } from '../components/LanguageSelector';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Checkbox } from '../components/ui/Checkbox';
import { Progress } from '../components/ui/Progress';
import { colors, spacing, borderRadius, fontSize, shadows } from '../lib/theme';
import { query } from '../lib/database';

type VerificationFormNavigationProp = StackNavigationProp<RootStackParamList, 'VerificationForm'>;

const states = [
    { label: 'Delhi', value: 'Delhi' },
    { label: 'Madhya Pradesh', value: 'Madhya Pradesh' },
    { label: 'Maharashtra', value: 'Maharashtra' },
    { label: 'Gujarat', value: 'Gujarat' },
    { label: 'Rajasthan', value: 'Rajasthan' },
    { label: 'Uttar Pradesh', value: 'Uttar Pradesh' },
    { label: 'Karnataka', value: 'Karnataka' },
    { label: 'Tamil Nadu', value: 'Tamil Nadu' },
];

const qualifications = [
    { label: 'ITI', value: 'iti' },
    { label: 'Diploma', value: 'diploma' },
    { label: 'B.Tech / B.E.', value: 'btech' },
    { label: 'Other', value: 'other' },
];

const experiences = [
    { label: 'Fresher', value: 'fresher' },
    { label: '1-2 years', value: '1-2' },
    { label: '2-5 years', value: '2-5' },
    { label: '5+ years', value: '5+' },
];

const evBrands = ['Bajaj', 'Ola', 'Ather', 'TVS', 'Hero Electric', 'Other'];

const VerificationFormScreen: React.FC = () => {
    const navigation = useNavigation<VerificationFormNavigationProp>();
    const { t } = useLanguage();
    const { selectedRole } = useUser();

    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    // Auto-set experience for Aspirants
    // Auto-set experience removed to allow selection

    // Form data
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        state: '',
        city: '',
        pincode: '',
        qualification: '',
        experience: '',
        currentWorkshop: '',
        brandWorkshop: '',
        brands: [] as string[],
        otherQualification: '',
        priorKnowledge: '', // For Freshers
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const updateField = (field: string, value: string | string[]) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const toggleBrand = (brand: string) => {
        const newBrands = formData.brands.includes(brand)
            ? formData.brands.filter(b => b !== brand)
            : [...formData.brands, brand];
        updateField('brands', newBrands);
    };

    const validateStep1 = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.fullName) newErrors.fullName = t('required');
        if (!formData.phoneNumber) {
            newErrors.phoneNumber = t('required');
        } else if (!/^[6-9]\d{9}$/.test(formData.phoneNumber)) {
            newErrors.phoneNumber = t('invalidPhone');
        }
        if (!formData.password) {
            newErrors.password = t('required');
        } else if (formData.password.length < 6) {
            newErrors.password = t('passwordLength');
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = t('passwordMismatch');
        }
        if (!formData.state) newErrors.state = t('required');
        if (selectedRole === 'aspirant') {
            if (!formData.qualification) newErrors.qualification = t('required');
            if (formData.qualification === 'other' && !formData.otherQualification) {
                newErrors.otherQualification = t('required');
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.qualification) newErrors.qualification = t('required');
        if (formData.qualification === 'other' && !formData.otherQualification) {
            newErrors.otherQualification = t('required');
        }
        if (!formData.experience) newErrors.experience = t('required');

        // Brands only required for experienced professionals
        if (selectedRole !== 'aspirant' && formData.brands.length === 0) {
            newErrors.brands = t('selectAtLeastOne');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (step === 1 && validateStep1()) {
            if (selectedRole === 'aspirant') {
                // For Freshers, submit directly after Step 1
                handleSubmit();
            } else {
                setStep(2);
            }
        } else if (step === 2 && validateStep2()) {
            setStep(3);
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            // Check if user already exists
            const existingUsers = await query<any>(
                `SELECT id FROM users WHERE phone_number = $1`,
                [formData.phoneNumber]
            );

            if (existingUsers.length > 0) {
                Alert.alert(t('error'), t('userAlreadyExists'));
                setIsLoading(false);
                return;
            }

            await query(
                `INSERT INTO users (
          full_name, phone_number, password, state, city, pincode,
          qualification, experience, current_workshop, brand_workshop,
          brands, role, verification_status, verification_step, prior_knowledge
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
                [
                    formData.fullName, // 1
                    formData.phoneNumber, // 2
                    formData.password, // 3
                    formData.state, // 4
                    formData.city, // 5
                    formData.pincode, // 6
                    formData.qualification === 'other' ? formData.otherQualification : formData.qualification, // 7
                    selectedRole === 'aspirant' ? 'fresher' : formData.experience, // 8
                    formData.currentWorkshop, // 9
                    formData.brandWorkshop, // 10
                    JSON.stringify(selectedRole === 'aspirant' ? [] : formData.brands), // 11
                    selectedRole || 'technician', // 12
                    'pending', // 13
                    0, // 14
                    formData.priorKnowledge // 15
                ]
            );


            navigation.reset({
                index: 0,
                routes: [{ name: 'Success' }],
            });
        } catch (error) {
            console.error('Registration error:', error);
            Alert.alert(t('error'), t('registrationFailed'));
        } finally {
            setIsLoading(false);
        }
    };

    const renderStep1 = () => (
        <>
            <Input
                label={t('fullName')}
                placeholder={t('fullName')}
                value={formData.fullName}
                onChangeText={(v) => updateField('fullName', v)}
                error={errors.fullName}
                leftIcon={<User size={20} color={colors.muted} />}
            />

            <Input
                label={t('phoneNumber')}
                placeholder="9876543210"
                keyboardType="phone-pad"
                value={formData.phoneNumber}
                onChangeText={(v) => updateField('phoneNumber', v)}
                error={errors.phoneNumber}
                maxLength={10}
                leftIcon={<Phone size={20} color={colors.muted} />}
            />

            <Input
                label={t('createPassword')}
                placeholder="••••••"
                secureTextEntry
                value={formData.password}
                onChangeText={(v) => updateField('password', v)}
                error={errors.password}
                leftIcon={<Lock size={20} color={colors.muted} />}
            />

            <Input
                label={t('confirmPassword')}
                placeholder="••••••"
                secureTextEntry
                value={formData.confirmPassword}
                onChangeText={(v) => updateField('confirmPassword', v)}
                error={errors.confirmPassword}
                leftIcon={<Lock size={20} color={colors.muted} />}
            />

            <Select
                label={t('state')}
                placeholder={t('selectState')}
                options={states}
                value={formData.state}
                onValueChange={(v) => updateField('state', v)}
                error={errors.state}
            />

            <Input
                label={t('city')}
                placeholder={t('city')}
                value={formData.city}
                onChangeText={(v) => updateField('city', v)}
                error={errors.city}
                leftIcon={<MapPin size={20} color={colors.muted} />}
            />

            <Input
                label={t('pincode')}
                placeholder="123456"
                keyboardType="number-pad"
                value={formData.pincode}
                onChangeText={(v) => updateField('pincode', v)}
                maxLength={6}
                error={errors.pincode}
            />

            {selectedRole === 'aspirant' && (
                <>
                    <Select
                        label={t('qualification')}
                        placeholder={t('selectQualification')}
                        options={qualifications}
                        value={formData.qualification}
                        onValueChange={(v) => updateField('qualification', v)}
                        error={errors.qualification}
                    />

                    {formData.qualification === 'other' && (
                        <Input
                            label={t('specifyQualification')}
                            placeholder="Enter your degree/diploma"
                            value={formData.otherQualification}
                            onChangeText={(v) => updateField('otherQualification', v)}
                            error={errors.otherQualification}
                        />
                    )}

                    {selectedRole === 'aspirant' && (
                        <View style={{ marginTop: spacing.md }}>
                            <Input
                                label={t('priorKnowledge')}
                                placeholder={t('priorKnowledgePlaceholder')}
                                value={formData.priorKnowledge}
                                onChangeText={(v) => updateField('priorKnowledge', v)}
                                multiline
                                numberOfLines={3}
                                style={{ height: 100, textAlignVertical: 'top' }}
                            />
                        </View>
                    )}
                </>
            )}

        </>
    );

    const renderStep2 = () => (
        <>
            <Select
                label={t('qualification')}
                placeholder={t('selectQualification')}
                options={qualifications}
                value={formData.qualification}
                onValueChange={(v) => updateField('qualification', v)}
                error={errors.qualification}
            />

            {formData.qualification === 'other' && (
                <Input
                    label={t('specifyQualification')} // Ensure translation exists or use literal
                    placeholder="Enter your degree/diploma"
                    value={formData.otherQualification}
                    onChangeText={(v) => updateField('otherQualification', v)}
                    error={errors.otherQualification}
                />
            )}

            <Select
                label={t('totalExperience')}
                placeholder={t('selectExperience')}
                options={selectedRole === 'aspirant' ?
                    [
                        { label: 'Fresher (No Experience)', value: 'fresher' }
                    ] :
                    [
                        { label: '0-1 years', value: '0-1' }, // Replaces Fresher for professionals
                        { label: '1-2 years', value: '1-2' },
                        { label: '2-5 years', value: '2-5' },
                        { label: '5+ years', value: '5+' },
                    ]
                }
                value={formData.experience}
                onValueChange={(v) => updateField('experience', v)}
                error={errors.experience}
            />

            {selectedRole !== 'aspirant' && (
                <Input
                    label={t('currentWorkshop')}
                    placeholder={t('currentWorkshop')}
                    value={formData.currentWorkshop}
                    onChangeText={(v) => updateField('currentWorkshop', v)}
                    leftIcon={<Briefcase size={20} color={colors.muted} />}
                />
            )}

            {selectedRole !== 'aspirant' && (
                <View style={styles.brandsSection}>
                    <Text style={styles.brandsLabel}>{t('brandsWorkedWith')}</Text>
                    {errors.brands && <Text style={styles.errorText}>{errors.brands}</Text>}
                    <View style={styles.brandsGrid}>
                        {evBrands.map((brand) => (
                            <TouchableOpacity
                                key={brand}
                                style={[
                                    styles.brandChip,
                                    formData.brands.includes(brand) && styles.brandChipSelected,
                                ]}
                                onPress={() => toggleBrand(brand)}
                                activeOpacity={0.7}
                            >
                                <Checkbox
                                    checked={formData.brands.includes(brand)}
                                    onCheckedChange={() => toggleBrand(brand)}
                                />
                                <Text style={[
                                    styles.brandChipText,
                                    formData.brands.includes(brand) && styles.brandChipTextSelected,
                                ]}>
                                    {brand}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )}
        </>
    );

    const renderStep3 = () => (
        <View style={styles.reviewSection}>
            <Text style={styles.reviewTitle}>{t('reviewSubmit')}</Text>

            <View style={styles.reviewItem}>
                <Text style={styles.reviewLabel}>{t('fullName')}</Text>
                <Text style={styles.reviewValue}>{formData.fullName}</Text>
            </View>

            <View style={styles.reviewItem}>
                <Text style={styles.reviewLabel}>{t('phoneNumber')}</Text>
                <Text style={styles.reviewValue}>{formData.phoneNumber}</Text>
            </View>

            <View style={styles.reviewItem}>
                <Text style={styles.reviewLabel}>{t('state')}</Text>
                <Text style={styles.reviewValue}>{formData.state}</Text>
            </View>

            <View style={styles.reviewItem}>
                <Text style={styles.reviewLabel}>{t('city')}</Text>
                <Text style={styles.reviewValue}>{formData.city}</Text>
            </View>

            <View style={styles.reviewItem}>
                <Text style={styles.reviewLabel}>{t('qualification')}</Text>
                <Text style={styles.reviewValue}>{formData.qualification}</Text>
            </View>

            {selectedRole !== 'aspirant' && (
                <>
                    <View style={styles.reviewItem}>
                        <Text style={styles.reviewLabel}>{t('totalExperience')}</Text>
                        <Text style={styles.reviewValue}>{formData.experience}</Text>
                    </View>

                    <View style={styles.reviewItem}>
                        <Text style={styles.reviewLabel}>{t('brandsWorkedWith')}</Text>
                        <Text style={styles.reviewValue}>{formData.brands.join(', ')}</Text>
                    </View>
                </>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => step > 1 ? setStep(step - 1) : navigation.goBack()}
                    >
                        <ArrowLeft size={24} color={colors.foreground} />
                    </TouchableOpacity>
                    <LanguageSelector style={{ position: 'absolute', right: spacing.lg, top: spacing.md }} />

                    <Text style={styles.headerTitle}>
                        {t('step')} {step}/{selectedRole === 'aspirant' ? 1 : 3}
                    </Text>
                    <Text style={styles.headerSubtitle}>
                        {step === 1 ? t('basicDetails') : step === 2 ? t('professionalDetails') : t('reviewSubmit')}
                    </Text>

                    <View style={styles.progressContainer}>
                        <Progress value={(step / (selectedRole === 'aspirant' ? 1 : 3)) * 100} />
                    </View>
                </View>

                {/* Content */}
                <ScrollView
                    style={styles.content}
                    contentContainerStyle={styles.contentContainer}
                    keyboardShouldPersistTaps="handled"
                >
                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}
                    {step === 3 && renderStep3()}

                    <View style={styles.buttonContainer}>
                        {step < 3 && selectedRole !== 'aspirant' ? (
                            <Button onPress={handleNext} fullWidth>
                                {t('next')}
                            </Button>
                        ) : selectedRole === 'aspirant' && step === 1 ? (
                            <Button onPress={handleNext} loading={isLoading} fullWidth>
                                {t('submit')}
                            </Button>
                        ) : (
                            <Button onPress={handleSubmit} loading={isLoading} fullWidth>
                                {t('submit')}
                            </Button>
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    keyboardView: {
        flex: 1,
    },
    header: {
        backgroundColor: colors.background,
        paddingTop: spacing.xl,
        paddingBottom: spacing.md,
        paddingHorizontal: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    backButton: {
        position: 'absolute',
        top: spacing.lg,
        left: spacing.md,
        padding: spacing.sm,
        zIndex: 100,
    },
    headerTitle: {
        fontSize: fontSize.lg,
        fontWeight: '600',
        color: colors.foreground,
        textAlign: 'center',
        marginTop: spacing.md,
    },
    headerSubtitle: {
        fontSize: fontSize.sm,
        color: colors.muted,
        textAlign: 'center',
        marginTop: spacing.xs,
    },
    progressContainer: {
        marginTop: spacing.md,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: spacing.lg,
        paddingBottom: spacing.xxl,
    },
    brandsSection: {
        marginBottom: spacing.md,
    },
    brandsLabel: {
        fontSize: fontSize.sm,
        fontWeight: '500',
        color: colors.foreground,
        marginBottom: spacing.sm,
    },
    brandsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    brandChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.background,
        gap: spacing.sm,
    },
    brandChipSelected: {
        backgroundColor: colors.secondary,
        borderColor: colors.primary,
    },
    brandChipText: {
        fontSize: fontSize.sm,
        color: colors.foreground,
    },
    brandChipTextSelected: {
        color: colors.primary,
        fontWeight: '500',
    },
    errorText: {
        fontSize: fontSize.xs,
        color: colors.error,
        marginBottom: spacing.xs,
    },
    reviewSection: {
        gap: spacing.md,
    },
    reviewTitle: {
        fontSize: fontSize.lg,
        fontWeight: '600',
        color: colors.foreground,
        marginBottom: spacing.sm,
    },
    reviewItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    reviewLabel: {
        fontSize: fontSize.sm,
        color: colors.muted,
        flex: 1,
    },
    reviewValue: {
        fontSize: fontSize.sm,
        color: colors.foreground,
        fontWeight: '500',
        flex: 1,
        textAlign: 'right',
    },
    buttonContainer: {
        marginTop: spacing.xl,
    },
});

export default VerificationFormScreen;
