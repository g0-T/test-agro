// app/(tabs)/settings.tsx
import React, { useState, useMemo } from 'react';
import {
    View, Text, TouchableOpacity, useColorScheme,
    ScrollView, Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { getSettingsStyles } from '@/styles/settings.styles';

// ─── Toggle Row ─────────────────────────────────────────────────────────────────

const ToggleRow = ({
    icon, label, value, onChange, styles, colors, isFirst,
}: {
    icon: keyof typeof MaterialIcons.glyphMap;
    label: string;
    value: boolean;
    onChange: (v: boolean) => void;
    styles: any; colors: any;
    isFirst?: boolean;
}) => (
    <View style={[styles.settingsRow, !isFirst && styles.settingsRowBorder]}>
        <View style={styles.settingsIconWrap}>
            <MaterialIcons name={icon} size={18} color={colors.brand} />
        </View>
        <Text style={styles.settingsLabel}>{label}</Text>
        <TouchableOpacity
            onPress={() => onChange(!value)}
            activeOpacity={0.8}
            style={[styles.toggle, value ? styles.toggleOn : styles.toggleOff]}
        >
            <View style={[styles.toggleThumb, { alignSelf: value ? 'flex-end' : 'flex-start' }]} />
        </TouchableOpacity>
    </View>
);

// ─── Link Row ───────────────────────────────────────────────────────────────────

const LinkRow = ({
    icon, label, value, onPress, styles, colors, isFirst, danger,
}: {
    icon: keyof typeof MaterialIcons.glyphMap;
    label: string;
    value?: string;
    onPress?: () => void;
    styles: any; colors: any;
    isFirst?: boolean;
    danger?: boolean;
}) => (
    <TouchableOpacity
        style={[styles.settingsRow, !isFirst && styles.settingsRowBorder]}
        onPress={onPress}
        activeOpacity={0.75}
    >
        <View style={[styles.settingsIconWrap, danger && { backgroundColor: 'rgba(239,68,68,0.1)' }]}>
            <MaterialIcons name={icon} size={18} color={danger ? '#ef4444' : colors.brand} />
        </View>
        <Text style={[styles.settingsLabel, danger && { color: '#ef4444' }]}>{label}</Text>
        {value && <Text style={styles.settingsValue}>{value}</Text>}
        <MaterialIcons name="chevron-right" size={18} color={danger ? '#ef4444' : colors.mutedText} />
    </TouchableOpacity>
);

// ─── Main Screen ────────────────────────────────────────────────────────────────

const SettingsScreen = () => {
    const theme = useColorScheme();
    const { styles, colors } = useMemo(() => getSettingsStyles(theme), [theme]);

    const [notifications, setNotifications] = useState(true);
    const [emailAlerts, setEmailAlerts] = useState(true);
    const [priceAlerts, setPriceAlerts] = useState(false);
    const [biometrics, setBiometrics] = useState(false);
    const [dataSync, setDataSync] = useState(true);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Configuración</Text>
                <Text style={styles.headerSubtitle}>Personaliza tu experiencia en AgroMarket</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Profile */}
                <View style={styles.profileCard}>
                    <View style={styles.avatar}>
                        <MaterialIcons name="person" size={30} color="#fff" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.profileName}>Mi Cuenta</Text>
                        <Text style={styles.profileRole}>Vendedor verificado · AgroMarket</Text>
                    </View>
                    <TouchableOpacity style={styles.profileEdit}>
                        <Text style={styles.profileEditText}>Editar</Text>
                    </TouchableOpacity>
                </View>

                {/* Notifications */}
                <View style={styles.sectionGroup}>
                    <Text style={styles.sectionLabel}>Notificaciones</Text>
                    <View style={styles.settingsCard}>
                        <ToggleRow icon="notifications" label="Notificaciones push" value={notifications} onChange={setNotifications} styles={styles} colors={colors} isFirst />
                        <ToggleRow icon="email" label="Alertas por email" value={emailAlerts} onChange={setEmailAlerts} styles={styles} colors={colors} />
                        <ToggleRow icon="trending-up" label="Alertas de precio" value={priceAlerts} onChange={setPriceAlerts} styles={styles} colors={colors} />
                    </View>
                </View>

                {/* Account */}
                <View style={styles.sectionGroup}>
                    <Text style={styles.sectionLabel}>Cuenta</Text>
                    <View style={styles.settingsCard}>
                        <LinkRow icon="person" label="Datos personales" onPress={() => {}} styles={styles} colors={colors} isFirst />
                        <LinkRow icon="lock" label="Cambiar contraseña" onPress={() => {}} styles={styles} colors={colors} />
                        <LinkRow icon="verified" label="Verificación de identidad" value="Verificado" onPress={() => {}} styles={styles} colors={colors} />
                        <LinkRow icon="language" label="Idioma" value="Español" onPress={() => {}} styles={styles} colors={colors} />
                        <LinkRow icon="attach-money" label="Moneda preferida" value="USD / VES" onPress={() => {}} styles={styles} colors={colors} />
                    </View>
                </View>

                {/* Privacy */}
                <View style={styles.sectionGroup}>
                    <Text style={styles.sectionLabel}>Privacidad & Seguridad</Text>
                    <View style={styles.settingsCard}>
                        <ToggleRow icon="fingerprint" label="Autenticación biométrica" value={biometrics} onChange={setBiometrics} styles={styles} colors={colors} isFirst />
                        <ToggleRow icon="sync" label="Sincronización de datos" value={dataSync} onChange={setDataSync} styles={styles} colors={colors} />
                        <LinkRow icon="policy" label="Política de privacidad" onPress={() => {}} styles={styles} colors={colors} />
                        <LinkRow icon="description" label="Términos y condiciones" onPress={() => {}} styles={styles} colors={colors} />
                    </View>
                </View>

                {/* Payments */}
                <View style={styles.sectionGroup}>
                    <Text style={styles.sectionLabel}>Pagos</Text>
                    <View style={styles.settingsCard}>
                        <LinkRow icon="account-balance" label="Métodos de pago" onPress={() => {}} styles={styles} colors={colors} isFirst />
                        <LinkRow icon="receipt" label="Historial de facturación" onPress={() => {}} styles={styles} colors={colors} />
                    </View>
                </View>

                {/* Danger zone */}
                <View style={styles.sectionGroup}>
                    <Text style={[styles.sectionLabel, { color: '#ef4444' }]}>Zona de peligro</Text>
                    <View style={styles.settingsCard}>
                        <LinkRow icon="logout" label="Cerrar sesión" onPress={() => {}} styles={styles} colors={colors} danger isFirst />
                        <LinkRow icon="delete-forever" label="Eliminar cuenta" onPress={() => {}} styles={styles} colors={colors} danger />
                    </View>
                </View>

                <Text style={styles.versionText}>AgroMarket v1.0.0 · Hecho con ♥ en Venezuela</Text>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SettingsScreen;
