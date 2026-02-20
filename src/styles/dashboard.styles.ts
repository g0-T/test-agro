import { StyleSheet, Dimensions, Platform, ColorSchemeName } from 'react-native';
import { getThemeColors } from '@/constants/theme';

const { width } = Dimensions.get('window');
export const isDesktop = width > 768;

export const getStyles = (theme: ColorSchemeName) => {
    const isDark = theme === 'dark';
    const colors = getThemeColors(isDark);

    return StyleSheet.create({

        // ─── Root ──────────────────────────────────────────────────────
        container: {
            flex: 1,
            backgroundColor: colors.backgroundColor,
        },

        // ─── Desktop two-column root ───────────────────────────────────
        desktopRoot: {
            flex: 1,
            flexDirection: 'row',
        },
        desktopLeft: {
            width: 320,
            borderRightWidth: 1,
            borderRightColor: colors.borderColor,
            backgroundColor: isDark ? colors.backgroundColor : colors.cardColor,
        },
        desktopRight: {
            flex: 1,
            backgroundColor: colors.backgroundColor,
        },

        // ─── Mobile top bar ────────────────────────────────────────────
        mobileTopBar: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 8,
        },
        mobileTopBarTitle: {
            fontSize: 26,
            fontWeight: '900',
            color: colors.textColor,
            letterSpacing: -0.5,
        },
        mobileTopBarSub: {
            fontSize: 13,
            color: colors.mutedText,
            marginTop: 2,
        },
        mobilePadding: {
            paddingHorizontal: 20,
            paddingTop: 8,
        },
        notifBtn: {
            position: 'relative',
            width: 42,
            height: 42,
            borderRadius: 21,
            backgroundColor: isDark ? 'rgba(44,89,38,0.15)' : 'rgba(44,89,38,0.08)',
            alignItems: 'center',
            justifyContent: 'center',
        },
        notifDot: {
            position: 'absolute',
            top: 6,
            right: 6,
            width: 16,
            height: 16,
            borderRadius: 8,
            backgroundColor: '#ef4444',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1.5,
            borderColor: colors.backgroundColor,
        },
        notifDotText: {
            fontSize: 9,
            fontWeight: '900',
            color: '#fff',
        },

        // ─── Greeting banner (desktop only) ───────────────────────────
        greetingBanner: {
            borderRadius: 20,
            backgroundColor: colors.brand,
            padding: 24,
            flexDirection: 'row',
            alignItems: 'center',
            overflow: 'hidden',
            ...Platform.select({
                ios: { shadowColor: colors.brand, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12 },
                android: { elevation: 6 },
                web: { boxShadow: `0 6px 24px ${colors.brand}55` } as any,
            }),
        },
        greetingBannerContent: {
            flex: 1,
        },
        greetingBannerTitle: {
            fontSize: 22,
            fontWeight: '900',
            color: '#fff',
            letterSpacing: -0.3,
        },
        greetingBannerSubtitle: {
            fontSize: 14,
            color: 'rgba(255,255,255,0.8)',
            marginTop: 6,
            lineHeight: 20,
        },
        greetingBannerIcon: {
            marginLeft: 16,
        },

        // ─── Profile card ──────────────────────────────────────────────
        profileCard: {
            backgroundColor: colors.cardColor,
            borderRadius: 20,
            padding: 18,
            borderWidth: 1,
            borderColor: colors.borderColor,
        },
        desktopProfileCard: {
            backgroundColor: 'transparent',
            padding: 0,
        },
        avatarRow: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 14,
            marginBottom: 16,
        },
        desktopAvatarRow: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 14,
            marginBottom: 16,
        },
        avatar: {
            width: 68,
            height: 68,
            borderRadius: 34,
            backgroundColor: isDark ? '#398331' : '#d4edda',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            borderWidth: 3,
            borderColor: colors.brand + '60',
        },
        avatarInitial: {
            fontSize: 28,
            fontWeight: '900',
            color: colors.brand,
        },
        avatarOnline: {
            position: 'absolute',
            bottom: 2,
            right: 2,
            width: 14,
            height: 14,
            borderRadius: 7,
            backgroundColor: '#22c55e',
            borderWidth: 2,
            borderColor: colors.cardColor,
        },
        userName: {
            fontSize: 18,
            fontWeight: '900',
            color: colors.textColor,
            letterSpacing: -0.3,
        },
        userEmail: {
            fontSize: 13,
            color: colors.mutedText,
            marginTop: 2,
        },
        ratingText: {
            fontSize: 12,
            color: colors.mutedText,
            fontWeight: '600',
        },
        editBtn: {
            width: 34,
            height: 34,
            borderRadius: 17,
            borderWidth: 1,
            borderColor: colors.borderColor,
            alignItems: 'center',
            justifyContent: 'center',
        },
        profileMeta: {
            gap: 8,
        },
        roleBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
            alignSelf: 'flex-start',
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 20,
            backgroundColor: isDark ? 'rgba(44,89,38,0.2)' : 'rgba(44,89,38,0.08)',
            borderWidth: 1,
            borderColor: colors.brand + '40',
        },
        roleBadgeText: {
            fontSize: 12,
            fontWeight: '700',
            color: colors.brand,
        },
        locationText: {
            fontSize: 12,
            color: colors.mutedText,
        },

        // ─── Stats grid ────────────────────────────────────────────────
        statsGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 10,
        },
        statCard: {
            flex: 1,
            minWidth: isDesktop ? 140 : 100,
            backgroundColor: colors.cardColor,
            borderRadius: 16,
            padding: 14,
            borderWidth: 1,
            borderColor: colors.borderColor,
            gap: 4,
        },
        statIconWrap: {
            width: 34,
            height: 34,
            borderRadius: 10,
            backgroundColor: isDark ? 'rgba(44,89,38,0.2)' : 'rgba(44,89,38,0.08)',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 6,
        },
        statValue: {
            fontSize: 22,
            fontWeight: '900',
            color: colors.textColor,
            letterSpacing: -0.5,
        },
        statLabel: {
            fontSize: 11,
            fontWeight: '600',
            color: colors.mutedText,
        },
        statTrend: {
            fontSize: 10,
            fontWeight: '700',
            marginTop: 2,
        },

        // ─── Seller CTA ────────────────────────────────────────────────
        sellerCta: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
            backgroundColor: colors.brand,
            borderRadius: 20,
            padding: 18,
            ...Platform.select({
                ios: { shadowColor: colors.brand, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 10 },
                android: { elevation: 5 },
                web: { boxShadow: `0 4px 16px ${colors.brand}55` } as any,
            }),
        },
        sellerCtaIconWrap: {
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: 'rgba(255,255,255,0.2)',
            alignItems: 'center',
            justifyContent: 'center',
        },
        sellerCtaTitle: {
            fontSize: 16,
            fontWeight: '800',
            color: '#fff',
        },
        sellerCtaSubtitle: {
            fontSize: 12,
            color: 'rgba(255,255,255,0.8)',
            marginTop: 3,
            lineHeight: 18,
        },
        sellerActiveCard: {
            backgroundColor: isDark ? 'rgba(34,197,94,0.08)' : 'rgba(34,197,94,0.06)',
            borderRadius: 20,
            padding: 18,
            borderWidth: 1,
            borderColor: 'rgba(34,197,94,0.25)',
        },
        sellerActiveTitle: {
            fontSize: 15,
            fontWeight: '800',
            color: '#22c55e',
        },
        sellerActiveSubtitle: {
            fontSize: 13,
            color: colors.mutedText,
            marginBottom: 14,
            lineHeight: 18,
        },
        sellerActiveBtn: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            alignSelf: 'flex-start',
            backgroundColor: '#22c55e',
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 12,
        },
        sellerActiveBtnText: {
            fontSize: 13,
            fontWeight: '700',
            color: '#fff',
        },

        // ─── Activity feed ─────────────────────────────────────────────
        activityCard: {
            backgroundColor: colors.cardColor,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: colors.borderColor,
            overflow: 'hidden',
        },
        activityHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.borderColor,
        },
        sectionTitle: {
            fontSize: 16,
            fontWeight: '800',
            color: colors.textColor,
        },
        notifBadge: {
            paddingHorizontal: 10,
            paddingVertical: 3,
            borderRadius: 20,
            backgroundColor: isDark ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.1)',
            borderWidth: 1,
            borderColor: 'rgba(239,68,68,0.3)',
        },
        notifBadgeText: {
            fontSize: 10,
            fontWeight: '800',
            color: '#ef4444',
        },
        activityItem: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            padding: 14,
        },
        activityItemBorder: {
            borderBottomWidth: 1,
            borderBottomColor: colors.borderColor,
        },
        activityItemHighlight: {
            backgroundColor: isDark ? 'rgba(44,89,38,0.08)' : 'rgba(44,89,38,0.04)',
        },
        activityIconWrap: {
            width: 40,
            height: 40,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
        },
        activityTitle: {
            fontSize: 14,
            fontWeight: '700',
            color: colors.textColor,
        },
        activitySubtitle: {
            fontSize: 12,
            color: colors.mutedText,
            marginTop: 2,
        },
        activityTime: {
            fontSize: 11,
            color: colors.mutedText,
            marginLeft: 'auto',
            whiteSpace: 'nowrap',
        } as any,

        // ─── Profile menu ──────────────────────────────────────────────
        menuCard: {
            backgroundColor: colors.cardColor,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: colors.borderColor,
            overflow: 'hidden',
        },
        menuSectionLabel: {
            fontSize: 10,
            fontWeight: '800',
            color: colors.mutedText,
            textTransform: 'uppercase',
            letterSpacing: 1,
            padding: 16,
            paddingBottom: 8,
        },
        menuItem: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            paddingHorizontal: 16,
            paddingVertical: 14,
        },
        menuItemBorder: {
            borderBottomWidth: 1,
            borderBottomColor: colors.borderColor,
        },
        menuItemText: {
            fontSize: 14,
            fontWeight: '600',
        },

        // ─── Legacy (kept for compat with existing usages) ────────────
        header: {
            padding: 16,
            alignItems: 'center',
            justifyContent: 'center',
        },
        title: {
            fontSize: 20,
            fontWeight: '800',
            color: colors.textColor,
        },
        subtitle: {
            fontSize: 12,
            color: colors.mutedText,
            marginTop: 6,
        },
        content: {
            width: '100%',
            maxWidth: isDesktop ? 1200 : '100%',
            alignSelf: 'center',
            paddingHorizontal: isDesktop ? 20 : 12,
            paddingBottom: 60,
        },
        statsRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 12,
            marginTop: 12,
            flexWrap: 'wrap',
        },
        statNumber: {
            fontSize: 22,
            fontWeight: '900',
            color: colors.brand,
        },
        searchRow: {
            flexDirection: 'row',
            gap: 8,
            marginTop: 12,
            alignItems: 'center',
        },
        searchInput: {
            flex: 1,
            backgroundColor: colors.cardColor,
            borderRadius: 10,
            padding: 12,
            borderWidth: 1,
            borderColor: colors.borderColor,
            color: colors.textColor,
        },
        list: {
            marginTop: 12,
        },
        itemCard: {
            backgroundColor: colors.cardColor,
            borderRadius: 12,
            padding: 12,
            marginBottom: 10,
            borderWidth: 1,
            borderColor: colors.borderColor,
        },
        itemTitle: {
            fontSize: 16,
            fontWeight: '700',
            color: colors.textColor,
        },
        itemMeta: {
            fontSize: 12,
            color: colors.mutedText,
            marginTop: 6,
        },
    });
};
