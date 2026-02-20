import React, { useMemo, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    useColorScheme,
    ScrollView,
    useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getStyles } from '@/styles/dashboard.styles';
import { getThemeColors } from '@/constants/theme';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

// ─── Types ──────────────────────────────────────────────────────────────────

interface UserState {
    name: string;
    role: string;
    isSeller: boolean;
    email: string;
    joined: string;
    location: string;
    rating: number;
    totalDeals: number;
    activeListings: number;
    totalRevenue: string;
}

interface ActivityItem {
    id: string;
    icon: keyof typeof MaterialIcons.glyphMap;
    iconColor: string;
    title: string;
    subtitle: string;
    time: string;
    highlight?: boolean;
}

interface QuickStat {
    label: string;
    value: string | number;
    icon: keyof typeof MaterialIcons.glyphMap;
    trend?: string;
    trendUp?: boolean;
}

// ─── Mock activity feed (no product data hardcoded) ─────────────────────────

const ACTIVITY: ActivityItem[] = [
    { id: '1', icon: 'visibility', iconColor: '#3b82f6', title: 'Nueva vista en tu lote', subtitle: 'Lote #VT-3001 · +12 vistas hoy', time: 'Hace 5m', highlight: true },
    { id: '2', icon: 'chat-bubble', iconColor: '#8b5cf6', title: 'Mensaje de Pedro Martínez', subtitle: '¿El precio es negociable?', time: 'Hace 18m', highlight: true },
    { id: '3', icon: 'local-shipping', iconColor: '#f59e0b', title: 'Pedido en tránsito', subtitle: 'AM-4921 salió de Hacienda Origen', time: 'Hace 2h' },
    { id: '4', icon: 'check-circle', iconColor: '#22c55e', title: 'Venta completada', subtitle: 'Lote #VT-3003 · Agropecuaria del Norte', time: 'Ayer' },
    { id: '5', icon: 'star', iconColor: '#C5A059', title: 'Nueva reseña recibida', subtitle: '⭐⭐⭐⭐⭐ por Don Rafael Gómez', time: 'Hace 2 días' },
];

// ─── RatingStars ─────────────────────────────────────────────────────────────

const RatingStars = ({ rating, size = 14 }: { rating: number; size?: number }) => (
    <View style={{ flexDirection: 'row', gap: 2 }}>
        {[1, 2, 3, 4, 5].map(i => (
            <MaterialIcons
                key={i}
                name={i <= Math.floor(rating) ? 'star' : i - rating < 1 ? 'star-half' : 'star-border'}
                size={size}
                color="#C5A059"
            />
        ))}
    </View>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const UserProfile = () => {
    const theme = useColorScheme();
    const isDark = theme === 'dark';
    const styles = useMemo(() => getStyles(theme), [theme]);
    const colors = useMemo(() => getThemeColors(isDark), [isDark]);

    const { width } = useWindowDimensions();
    const isDesktop = width > 768;

    const [user, setUser] = useState<UserState>({
        name: 'Juan Pérez',
        role: 'Comprador',
        isSeller: false,
        email: 'juan.perez@market.com',
        joined: '2024',
        location: 'Guárico, Venezuela',
        rating: 4.5,
        totalDeals: 23,
        activeListings: 0,
        totalRevenue: '$48,200',
    });

    const [notifCount] = useState(3);

    const becomeSeller = () => {
        setUser(prev => ({
            ...prev,
            isSeller: true,
            role: 'Vendedor / Comprador',
            activeListings: 2,
        }));
    };

    const quickStats: QuickStat[] = user.isSeller
        ? [
            { label: 'Publicaciones', value: user.activeListings, icon: 'inventory-2', trend: '+2 esta sem.', trendUp: true },
            { label: 'Tratos cerrados', value: user.totalDeals, icon: 'handshake', trend: '+5 este mes', trendUp: true },
            { label: 'Ingresos totales', value: user.totalRevenue, icon: 'attach-money', trend: '+12%', trendUp: true },
            { label: 'Valoración', value: user.rating, icon: 'star', },
        ]
        : [
            { label: 'Compras realizadas', value: user.totalDeals, icon: 'shopping-cart', trend: '+3 este mes', trendUp: true },
            { label: 'En tránsito', value: 2, icon: 'local-shipping' },
            { label: 'Valoración', value: user.rating, icon: 'star' },
        ];

    // ─── Profile card (shared between layouts) ─────────────────────────────

    const ProfileCard = ({ compact = false }: { compact?: boolean }) => (
        <View style={compact ? styles.desktopProfileCard : styles.profileCard}>
            {/* Avatar area */}
            <View style={compact ? styles.desktopAvatarRow : styles.avatarRow}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarInitial}>{user.name.charAt(0)}</Text>
                    <View style={styles.avatarOnline} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                        <RatingStars rating={user.rating} size={13} />
                        <Text style={styles.ratingText}>{user.rating} · {user.totalDeals} tratos</Text>
                    </View>
                </View>
                {!compact && (
                    <TouchableOpacity style={styles.editBtn}>
                        <MaterialIcons name="edit" size={16} color={colors.brand} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Role & Location */}
            <View style={styles.profileMeta}>
                <View style={styles.roleBadge}>
                    <MaterialIcons name={user.isSeller ? 'store' : 'person'} size={12} color={colors.brand} />
                    <Text style={styles.roleBadgeText}>{user.role}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <MaterialIcons name="location-on" size={13} color={colors.mutedText} />
                    <Text style={styles.locationText}>{user.location}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <MaterialIcons name="calendar-today" size={13} color={colors.mutedText} />
                    <Text style={styles.locationText}>Miembro desde {user.joined}</Text>
                </View>
            </View>
        </View>
    );

    // ─── Stats grid ──────────────────────────────────────────────────────────

    const StatsGrid = () => (
        <View style={styles.statsGrid}>
            {quickStats.map(stat => (
                <View key={stat.label} style={styles.statCard}>
                    <View style={styles.statIconWrap}>
                        <MaterialIcons name={stat.icon} size={18} color={colors.brand} />
                    </View>
                    <Text style={styles.statValue}>
                        {stat.label === 'Valoración' ? String(stat.value) : stat.value}
                    </Text>
                    {stat.label === 'Valoración' && (
                        <RatingStars rating={Number(stat.value)} size={11} />
                    )}
                    <Text style={styles.statLabel}>{stat.label}</Text>
                    {stat.trend && (
                        <Text style={[styles.statTrend, { color: stat.trendUp ? colors.success : colors.error }]}>
                            {stat.trendUp ? '↑' : '↓'} {stat.trend}
                        </Text>
                    )}
                </View>
            ))}
        </View>
    );

    // ─── Become seller CTA ───────────────────────────────────────────────────

    const SellerCTA = () => !user.isSeller ? (
        <TouchableOpacity style={styles.sellerCta} onPress={becomeSeller} activeOpacity={0.85}>
            <View style={styles.sellerCtaIconWrap}>
                <MaterialIcons name="store" size={26} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={styles.sellerCtaTitle}>¿Quieres vender?</Text>
                <Text style={styles.sellerCtaSubtitle}>Activa tu perfil de vendedor y publica tu primer lote hoy.</Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color="#fff" style={{ opacity: 0.7 }} />
        </TouchableOpacity>
    ) : (
        <View style={styles.sellerActiveCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <MaterialIcons name="verified" size={20} color="#22c55e" />
                <Text style={styles.sellerActiveTitle}>Perfil de Vendedor Activo</Text>
            </View>
            <Text style={styles.sellerActiveSubtitle}>Tienes {user.activeListings} publicaciones activas en el mercado.</Text>
            <TouchableOpacity style={styles.sellerActiveBtn} activeOpacity={0.85}>
                <MaterialIcons name="add" size={16} color="#fff" />
                <Text style={styles.sellerActiveBtnText}>Nueva publicación</Text>
            </TouchableOpacity>
        </View>
    );

    // ─── Activity feed ───────────────────────────────────────────────────────

    const ActivityFeed = () => (
        <View style={styles.activityCard}>
            <View style={styles.activityHeader}>
                <Text style={styles.sectionTitle}>Actividad reciente</Text>
                <View style={styles.notifBadge}>
                    <Text style={styles.notifBadgeText}>{notifCount} nuevas</Text>
                </View>
            </View>
            {ACTIVITY.map((item, idx) => (
                <TouchableOpacity
                    key={item.id}
                    style={[
                        styles.activityItem,
                        idx < ACTIVITY.length - 1 && styles.activityItemBorder,
                        item.highlight && styles.activityItemHighlight,
                    ]}
                    activeOpacity={0.75}
                >
                    <View style={[styles.activityIconWrap, { backgroundColor: item.iconColor + '20' }]}>
                        <MaterialIcons name={item.icon} size={18} color={item.iconColor} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.activityTitle}>{item.title}</Text>
                        <Text style={styles.activitySubtitle}>{item.subtitle}</Text>
                    </View>
                    <Text style={styles.activityTime}>{item.time}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );

    // ─── Profile menu ────────────────────────────────────────────────────────

    const ProfileMenu = () => (
        <View style={styles.menuCard}>
            <Text style={styles.menuSectionLabel}>Configuración</Text>
            {[
                { icon: 'person-outline' as const, label: 'Editar datos personales', color: colors.textColor },
                { icon: 'notifications-outline' as const, label: 'Notificaciones', color: colors.textColor },
                { icon: 'shield-outline' as const, label: 'Privacidad y seguridad', color: colors.textColor },
                { icon: 'help-circle-outline' as const, label: 'Ayuda y soporte', color: colors.textColor },
                { icon: 'exit-outline' as const, label: 'Cerrar Sesión', color: '#ef4444' },
            ].map((item, idx, arr) => (
                <TouchableOpacity
                    key={item.label}
                    style={[styles.menuItem, idx < arr.length - 1 && styles.menuItemBorder]}
                    activeOpacity={0.7}
                >
                    <Ionicons name={item.icon} size={20} color={item.color} />
                    <Text style={[styles.menuItemText, { color: item.color }]}>{item.label}</Text>
                    {item.icon !== 'exit-outline' && (
                        <MaterialIcons name="chevron-right" size={18} color={colors.mutedText} style={{ marginLeft: 'auto' }} />
                    )}
                </TouchableOpacity>
            ))}
        </View>
    );

    // ─── DESKTOP LAYOUT ──────────────────────────────────────────────────────

    if (isDesktop) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.desktopRoot}>

                    {/* Left column: profile + menu */}
                    <View style={styles.desktopLeft}>
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24, gap: 20 }}>
                            <ProfileCard compact />
                            <SellerCTA />
                            <ProfileMenu />
                        </ScrollView>
                    </View>

                    {/* Right column: stats + activity */}
                    <ScrollView
                        style={styles.desktopRight}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ padding: 24, gap: 20 }}
                    >
                        {/* Greeting banner */}
                        <View style={styles.greetingBanner}>
                            <View style={styles.greetingBannerContent}>
                                <Text style={styles.greetingBannerTitle}>Bienvenido, {user.name.split(' ')[0]} 👋</Text>
                                <Text style={styles.greetingBannerSubtitle}>
                                    {user.isSeller
                                        ? 'Tienes 3 mensajes sin leer y 2 pedidos en tránsito.'
                                        : 'Tienes 2 compras activas. Aquí está tu resumen de hoy.'}
                                </Text>
                            </View>
                            <View style={styles.greetingBannerIcon}>
                                <MaterialIcons name="agriculture" size={40} color="rgba(255,255,255,0.3)" />
                            </View>
                        </View>

                        <StatsGrid />
                        <ActivityFeed />
                    </ScrollView>
                </View>
            </SafeAreaView>
        );
    }

    // ─── MOBILE LAYOUT ───────────────────────────────────────────────────────

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Mobile top bar */}
            <View style={styles.mobileTopBar}>
                <View>
                    <Text style={styles.mobileTopBarTitle}>Mi Cuenta</Text>
                    <Text style={styles.mobileTopBarSub}>Gestiona tu perfil y rol</Text>
                </View>
                <TouchableOpacity style={styles.notifBtn}>
                    <MaterialIcons name="notifications" size={22} color={colors.brand} />
                    {notifCount > 0 && (
                        <View style={styles.notifDot}>
                            <Text style={styles.notifDotText}>{notifCount}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
                <View style={styles.mobilePadding}>
                    <ProfileCard />
                    <View style={{ height: 16 }} />
                    <StatsGrid />
                    <View style={{ height: 16 }} />
                    <SellerCTA />
                    <View style={{ height: 20 }} />
                    <ActivityFeed />
                    <View style={{ height: 20 }} />
                    <ProfileMenu />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default UserProfile;
