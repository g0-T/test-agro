// app/(auth)/index.tsx
import React, { useState, useMemo } from 'react';
import {
    View, Text, useColorScheme, TouchableOpacity, TextInput,
    StatusBar, ScrollView, KeyboardAvoidingView, Platform,
    useWindowDimensions, Animated,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { getStyles } from '@/styles/auth.styles';
import { useAuth } from '@/context/AuthContext';

// ─── Feature bullets shown on the desktop side panel ──────────────────────────
const FEATURES = [
    { icon: 'verified' as const, text: 'Vendedores y compradores verificados' },
    { icon: 'local-shipping' as const, text: 'Rastreo de lotes en tiempo real' },
    { icon: 'trending-up' as const, text: 'Precios actualizados con tasa BCV' },
    { icon: 'chat-bubble' as const, text: 'Chat directo entre partes' },
];

// ─── Reusable InputField ───────────────────────────────────────────────────────
const InputField = ({
    label,
    icon,
    placeholder,
    secure = false,
    keyboardType = 'default',
    colors,
    styles,
}: {
    label: string;
    icon: keyof typeof MaterialIcons.glyphMap;
    placeholder: string;
    secure?: boolean;
    keyboardType?: any;
    colors: any;
    styles: any;
}) => {
    const [focused, setFocused] = useState(false);
    const [visible, setVisible] = useState(false);

    return (
        <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{label}</Text>
            <View style={[styles.inputWrapper, focused && styles.inputWrapperFocused]}>
                <MaterialIcons name={icon} size={20} color={focused ? colors.brand : colors.mutedText} style={styles.inputIcon} />
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor={colors.placeholderColor}
                    secureTextEntry={secure && !visible}
                    keyboardType={keyboardType}
                    autoCapitalize="none"
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                />
                {secure && (
                    <TouchableOpacity onPress={() => setVisible(v => !v)} style={{ padding: 4 }}>
                        <MaterialIcons name={visible ? 'visibility' : 'visibility-off'} size={18} color={colors.mutedText} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

// ─── Main Auth Screen ─────────────────────────────────────────────────────────
const AuthScreen = () => {
    const { width } = useWindowDimensions();
    const isDesktop = width >= 768;
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const { styles, colors } = useMemo(() => getStyles(colorScheme), [colorScheme]);

    const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
    const [confirmStep, setConfirmStep] = useState(false);
    const [confirmationCode, setConfirmationCode] = useState('');
    const { signIn } = useAuth();

    const handleAuthAction = () => {
        signIn('seller');
    };

    // ─── Form JSX (shared between desktop / mobile) ────────────────────────────
    const FormContent = () => (
        <View style={[styles.card, isDesktop && styles.cardDesktop]}>
            {/* Logo for mobile (desktop shows it in side panel) */}
            {!isDesktop && (
                <View style={styles.header}>
                    <View style={styles.logoSquare}>
                        <MaterialIcons name="agriculture" size={36} color="#fff" />
                    </View>
                    <Text style={styles.mainTitle}>AgroMarket</Text>
                    <Text style={styles.subtitle}>MERCADO GANADERO</Text>
                </View>
            )}

            {/* Tab toggle */}
            <View style={styles.toggleContainer}>
                <TouchableOpacity
                    style={[styles.toggleBtn, activeTab === 'login' && styles.toggleBtnActive]}
                    onPress={() => { setActiveTab('login'); setConfirmStep(false); }}
                    activeOpacity={0.85}
                >
                    <Text style={activeTab === 'login' ? styles.toggleTextActive : styles.toggleTextInactive}>
                        Entrar
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.toggleBtn, activeTab === 'signup' && styles.toggleBtnActive]}
                    onPress={() => setActiveTab('signup')}
                    activeOpacity={0.85}
                >
                    <Text style={activeTab === 'signup' ? styles.toggleTextActive : styles.toggleTextInactive}>
                        Registrarse
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.form}>
                {/* Signup-only fields */}
                {activeTab === 'signup' && !confirmStep && (
                    <InputField label="Nombre completo" icon="badge" placeholder="Juan Pérez" colors={colors} styles={styles} />
                )}
                {activeTab === 'signup' && !confirmStep && (
                    <InputField label="Teléfono" icon="phone" placeholder="+58 412 000 0000" keyboardType="phone-pad" colors={colors} styles={styles} />
                )}

                {/* Common fields */}
                {!confirmStep && (
                    <>
                        <InputField label="Correo electrónico" icon="email" placeholder="ejemplo@agro.ve" colors={colors} styles={styles} />
                        <InputField label="Contraseña" icon="lock-outline" placeholder="••••••••" secure colors={colors} styles={styles} />
                    </>
                )}

                {/* Forgot password */}
                {activeTab === 'login' && !confirmStep && (
                    <TouchableOpacity style={styles.forgotRow}>
                        <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
                    </TouchableOpacity>
                )}

                {/* Main CTA */}
                {!confirmStep && (
                    <TouchableOpacity
                        style={styles.submitBtn}
                        activeOpacity={0.85}
                        onPress={() => {
                            if (activeTab === 'signup') { setConfirmStep(true); return; }
                            handleAuthAction();
                        }}
                    >
                        <Text style={styles.submitBtnText}>
                            {activeTab === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
                        </Text>
                    </TouchableOpacity>
                )}

                {/* Confirmation step */}
                {activeTab === 'signup' && confirmStep && (
                    <View style={styles.confirmBox}>
                        <View style={styles.confirmIconWrap}>
                            <MaterialIcons name="mark-email-unread" size={32} color={colors.brand} />
                        </View>
                        <Text style={styles.confirmTitle}>Revisa tu correo</Text>
                        <Text style={styles.confirmSubtitle}>
                            Enviamos un código de 6 dígitos a tu dirección de correo.
                        </Text>
                        <View style={[styles.inputWrapper, { marginTop: 16 }]}>
                            <MaterialIcons name="pin" size={20} color={colors.mutedText} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { letterSpacing: 8, fontWeight: '700' }]}
                                placeholder="000000"
                                placeholderTextColor={colors.placeholderColor}
                                keyboardType="number-pad"
                                maxLength={6}
                                value={confirmationCode}
                                onChangeText={setConfirmationCode}
                            />
                        </View>
                        <TouchableOpacity
                            style={[styles.submitBtn, { marginTop: 16 }]}
                            onPress={() => { setConfirmStep(false); setActiveTab('login'); }}
                            activeOpacity={0.85}
                        >
                            <Text style={styles.submitBtnText}>Confirmar</Text>
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
                            <TouchableOpacity onPress={() => setConfirmStep(false)}>
                                <Text style={styles.footerText}>← Volver</Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Text style={[styles.footerText, { color: colors.brand, fontWeight: '700' }]}>
                                    Reenviar código
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>

            {/* Footer */}
            {!confirmStep && (
                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>
                        {activeTab === 'login' ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
                        <Text
                            style={styles.linkText}
                            onPress={() => { setActiveTab(activeTab === 'login' ? 'signup' : 'login'); setConfirmStep(false); }}
                        >
                            {activeTab === 'login' ? 'Regístrate aquí' : 'Inicia sesión'}
                        </Text>
                    </Text>
                </View>
            )}
        </View>
    );

    // ─── DESKTOP LAYOUT ────────────────────────────────────────────────────────
    if (isDesktop) {
        return (
            <SafeAreaProvider>
                <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
                <View style={[styles.containerDesktop, { flex: 1 }]}>
                    {/* Left brand panel */}
                    <View style={styles.desktopSidePanel}>
                        <View style={styles.desktopLogoWrap}>
                            <MaterialIcons name="agriculture" size={52} color="#fff" />
                        </View>
                        <Text style={styles.desktopBrandText}>AgroMarket</Text>
                        <Text style={styles.desktopTagline}>
                            El mercado ganadero líder en Venezuela
                        </Text>

                        <View style={styles.desktopFeatureList}>
                            {FEATURES.map(f => (
                                <View key={f.text} style={styles.desktopFeatureItem}>
                                    <View style={styles.desktopFeatureIcon}>
                                        <MaterialIcons name={f.icon} size={16} color="#fff" />
                                    </View>
                                    <Text style={styles.desktopFeatureText}>{f.text}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Bottom badge */}
                        <View style={styles.desktopTrustBadge}>
                            <MaterialIcons name="verified-user" size={14} color="rgba(255,255,255,0.9)" />
                            <Text style={styles.desktopTrustText}>Plataforma segura · SSL · Datos cifrados</Text>
                        </View>
                    </View>

                    {/* Right form panel */}
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                        <ScrollView
                            contentContainerStyle={[styles.scrollContent, styles.scrollDesktop]}
                            keyboardShouldPersistTaps="always"
                            showsVerticalScrollIndicator={false}
                        >
                            <FormContent />
                        </ScrollView>
                    </KeyboardAvoidingView>
                </View>
            </SafeAreaProvider>
        );
    }

    // ─── MOBILE LAYOUT ─────────────────────────────────────────────────────────
    return (
        <SafeAreaProvider>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.backgroundColor }} edges={['top']}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                    <ScrollView
                        contentContainerStyle={[styles.scrollContent, styles.scrollMobile]}
                        keyboardShouldPersistTaps="always"
                        showsVerticalScrollIndicator={false}
                    >
                        <FormContent />
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default AuthScreen;
