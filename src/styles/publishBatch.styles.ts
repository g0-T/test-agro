// @/styles/publishBatch.styles.ts
import { StyleSheet, Dimensions, Platform, ColorSchemeName } from 'react-native';
import { getThemeColors } from '@/constants/theme';

const { width } = Dimensions.get('window');
export const isDesktop = width > 768;

export const getStyles = (theme: ColorSchemeName) => {
    const isDark = theme === 'dark';
    const colors = getThemeColors(isDark);

    return StyleSheet.create({

        // ─── Root ──────────────────────────────────────────────────────────
        container: {
            flex: 1,
            backgroundColor: colors.backgroundColor,
        },

        // ─── Mobile header ─────────────────────────────────────────────────
        header: {
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.borderColor,
        },
        headerTitle: {
            color: colors.textColor,
            fontSize: 24,
            fontWeight: '900',
            letterSpacing: -0.5,
        },
        headerSubtitle: {
            color: colors.mutedText,
            fontSize: 13,
            marginTop: 4,
        },

        // ─── Desktop header ────────────────────────────────────────────────
        desktopHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 32,
            paddingVertical: 20,
            borderBottomWidth: 1,
            borderBottomColor: colors.borderColor,
        },
        desktopHeaderRight: {
            flexDirection: 'row',
            gap: 12,
        },
        saveDraftBtn: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 7,
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 12,
            borderWidth: 1.5,
            borderColor: colors.brand + '60',
            backgroundColor: isDark ? 'rgba(44,89,38,0.12)' : 'rgba(44,89,38,0.06)',
        },
        saveDraftText: {
            fontSize: 13,
            fontWeight: '700',
            color: colors.brand,
        },

        // ─── Step indicator ────────────────────────────────────────────────
        desktopStepBar: {
            borderBottomWidth: 1,
            borderBottomColor: colors.borderColor,
            paddingVertical: 12,
            paddingHorizontal: 32,
        },
        stepRow: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 12,
            gap: 0,
        },
        stepItem: {
            alignItems: 'center',
            gap: 6,
        },
        stepDot: {
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
            borderWidth: 1.5,
            borderColor: colors.borderColor,
            alignItems: 'center',
            justifyContent: 'center',
        },
        stepDotActive: {
            backgroundColor: colors.brand,
            borderColor: colors.brand,
            ...Platform.select({
                ios: { shadowColor: colors.brand, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.4, shadowRadius: 6 },
                android: { elevation: 4 },
                web: { boxShadow: `0 3px 10px ${colors.brand}55` } as any,
            }),
        },
        stepDotDone: {
            backgroundColor: colors.brand,
            borderColor: colors.brand,
            opacity: 0.7,
        },
        stepNumber: {
            fontSize: 12,
            fontWeight: '700',
            color: colors.mutedText,
        },
        stepNumberActive: {
            color: '#fff',
        },
        stepLabel: {
            fontSize: 10,
            fontWeight: '600',
            color: colors.mutedText,
        },
        stepLabelActive: {
            color: colors.brand,
            fontWeight: '800',
        },
        stepConnector: {
            width: 32,
            height: 1.5,
            backgroundColor: colors.borderColor,
            marginHorizontal: 4,
            marginBottom: 18,
        },
        stepConnectorDone: {
            backgroundColor: colors.brand,
            opacity: 0.5,
        },

        // ─── Scroll / grid ─────────────────────────────────────────────────
        scrollContent: {
            paddingBottom: 60,
        },
        desktopScrollContent: {
            padding: 24,
        },
        mainWrapper: {
            width: '100%',
            maxWidth: isDesktop ? 1100 : '100%',
            alignSelf: 'center',
            paddingHorizontal: isDesktop ? 0 : 16,
        },
        desktopGrid: {
            flexDirection: 'row',
            gap: 20,
            maxWidth: 1100,
            alignSelf: 'center',
            width: '100%',
        },
        desktopCol: {
            flex: 1,
            gap: 16,
        },

        // ─── Section card ──────────────────────────────────────────────────
        sectionCard: {
            backgroundColor: colors.cardColor,
            borderRadius: 20,
            padding: 20,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: colors.borderColor,
            ...Platform.select({
                ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: isDark ? 0.25 : 0.07, shadowRadius: 8 },
                android: { elevation: 3 },
                web: { boxShadow: isDark ? '0 3px 12px rgba(0,0,0,0.25)' : '0 2px 8px rgba(0,0,0,0.06)' } as any,
            }),
        },
        fullWidthCard: {
            // Used in desktop to force full width if needed
        },
        multimediaCard: {
            borderBottomWidth: 3,
            borderBottomColor: colors.brand,
        },

        // ─── Section title row ─────────────────────────────────────────────
        sectionHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginBottom: 16,
        },
        sectionTitle: {
            fontSize: 14,
            fontWeight: '800',
            color: colors.textColor,
            textTransform: 'uppercase',
            letterSpacing: 0.8,
        },

        // ─── Upload area ───────────────────────────────────────────────────
        uploadArea: {
            height: 170,
            borderWidth: 2,
            borderStyle: 'dashed',
            borderColor: colors.brand + '80',
            borderRadius: 16,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: isDark ? 'rgba(44,89,38,0.1)' : 'rgba(44,89,38,0.04)',
        },
        cameraIconContainer: {
            backgroundColor: colors.brand,
            padding: 14,
            borderRadius: 50,
            marginBottom: 8,
        },
        tipsRow: {
            flexDirection: 'row',
            gap: 8,
            marginTop: 14,
            flexWrap: 'wrap',
        },
        tipChip: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 20,
            backgroundColor: isDark ? 'rgba(44,89,38,0.15)' : 'rgba(44,89,38,0.07)',
        },
        tipText: {
            fontSize: 11,
            color: colors.brand,
            fontWeight: '600',
        },

        // ─── Form inputs ───────────────────────────────────────────────────
        label: {
            fontSize: 12,
            fontWeight: '700',
            color: colors.mutedText,
            marginBottom: 7,
            textTransform: 'uppercase',
            letterSpacing: 0.4,
        },
        input: {
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
            borderRadius: 12,
            paddingHorizontal: 12,
            height: 48,
            color: colors.textColor,
            borderWidth: 1,
            borderColor: colors.borderColor,
            fontSize: 14,
            width: '100%', // Asegura que llene su contenedor flex1
        },
        pickerButton: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        row: {
            flexDirection: 'row',
            gap: 12, // Espacio real entre columnas
            width: '100%',
            // Importante: En móviles muy pequeños, esto permite que no se encimen
            flexWrap: 'wrap',
        },
        flex1: {
            // En desktop ocupan mitad y mitad (50% menos el gap)
            // En móvil, si el espacio es crítico, bajará a la siguiente línea
            flex: isDesktop ? 1 : 1,
            minWidth: isDesktop ? 150 : 120,
        },
        counterRow: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.borderColor,
            overflow: 'hidden', // Evita que los botones se salgan del borde
        },
        counterInput: {
            flex: 1,
            borderWidth: 0, // Quitamos el borde individual para que no colisione
            textAlign: 'center',
            height: 45,
            fontSize: 16,
            backgroundColor: 'transparent',
        },
        counterBtn: {
            width: 40,
            height: 45,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
        },

        // ─── Map placeholder ───────────────────────────────────────────────
        mapPlaceholder: {
            height: 160,
            borderRadius: 16,
            backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.04)',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 14,
            borderWidth: 1.5,
            borderColor: colors.borderColor,
            borderStyle: 'dashed',
        },

        // ─── Currency toggle ───────────────────────────────────────────────
        toggleGroup: {
            flexDirection: 'row',
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
            padding: 5,
            borderRadius: 14,
            marginBottom: 16,
        },
        toggleItem: {
            flex: 1,
            paddingVertical: 11,
            alignItems: 'center',
            borderRadius: 10,
        },

        // ─── Price input ───────────────────────────────────────────────────
        priceInputWrap: {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1.5,
            borderColor: colors.borderColor,
            borderRadius: 14,
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
            paddingLeft: 14,
            marginBottom: 12,
        },
        currencyLabel: {
            fontSize: 15,
            fontWeight: '800',
            color: colors.brand,
            paddingRight: 8,
            borderRightWidth: 1,
            borderRightColor: colors.borderColor,
        },
        priceInput: {
            flex: 1,
            fontSize: 32,
            fontWeight: '900',
            textAlign: 'center',
            height: 72,
            paddingVertical: 0,
            paddingHorizontal: 0,
            borderWidth: 0,
            backgroundColor: 'transparent',
        },

        // ─── Price breakdown ───────────────────────────────────────────────
        priceBreakdown: {
            flexDirection: 'row',
            gap: 10,
            marginBottom: 16,
        },
        breakdownItem: {
            flex: 1,
            backgroundColor: isDark ? 'rgba(44,89,38,0.12)' : 'rgba(44,89,38,0.06)',
            borderRadius: 12,
            padding: 12,
            alignItems: 'center',
        },
        breakdownLabel: {
            fontSize: 11,
            fontWeight: '700',
            color: colors.mutedText,
            marginBottom: 4,
        },
        breakdownValue: {
            fontSize: 15,
            fontWeight: '800',
            color: colors.brand,
        },

        // ─── Fee box ────────────────────────────────────────────────────────
        feeContainer: {
            backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : '#f0f4f0',
            padding: 18,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: colors.borderColor,
        },
        feeRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        divider: {
            height: 1,
            backgroundColor: colors.borderColor,
            marginVertical: 14,
        },

        // ─── Preview card (desktop) ────────────────────────────────────────
        previewCard: {
            backgroundColor: colors.cardColor,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: colors.borderColor,
            overflow: 'hidden',
        },
        previewTitle: {
            fontSize: 11,
            fontWeight: '800',
            color: colors.mutedText,
            textTransform: 'uppercase',
            letterSpacing: 1,
            paddingHorizontal: 18,
            paddingTop: 16,
            paddingBottom: 12,
            borderBottomWidth: 1,
            borderBottomColor: colors.borderColor,
        },
        previewBody: {
            padding: 18,
            gap: 6,
        },
        previewTag: {
            alignSelf: 'flex-start',
            backgroundColor: isDark ? 'rgba(44,89,38,0.25)' : 'rgba(44,89,38,0.1)',
            paddingHorizontal: 10,
            paddingVertical: 3,
            borderRadius: 20,
        },
        previewTagText: {
            fontSize: 11,
            fontWeight: '700',
            color: colors.brand,
        },
        previewHeading: {
            fontSize: 17,
            fontWeight: '900',
            color: colors.textColor,
            lineHeight: 23,
        },
        previewMeta: {
            fontSize: 12,
            color: colors.mutedText,
        },
        previewPrice: {
            fontSize: 20,
            fontWeight: '900',
            color: '#C5A059',
            marginTop: 4,
        },

        // ─── Publish button ────────────────────────────────────────────────
        publishButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            backgroundColor: colors.brand,
            padding: 18,
            borderRadius: 18,
            marginVertical: 8,
            ...Platform.select({
                ios: { shadowColor: colors.brand, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12 },
                android: { elevation: 6 },
                web: { boxShadow: `0 6px 20px ${colors.brand}55` } as any,
            }),
        },
        buttonText: {
            color: 'white',
            fontWeight: '800',
            fontSize: 17,
        },

        // ─── Picker modal ──────────────────────────────────────────────────
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.75)',
            justifyContent: 'flex-end',
        },
        modalContent: {
            backgroundColor: colors.cardColor,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            maxHeight: '70%',
            padding: 24,
        },
        modalItem: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.borderColor,
        },
        modalText: {
            color: colors.textColor,
            fontSize: 16,
        },
    });
};
