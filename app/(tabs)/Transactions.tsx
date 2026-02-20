import React, { useMemo, useState, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    useColorScheme,
    Image,
    useWindowDimensions,
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { getStyles } from '@/styles/transactions.styles';
import { getThemeColors } from '@/constants/theme';
import { MARKET_DATA, MarketItem } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';

// ─── Types ─────────────────────────────────────────────────────────────────────

type MainTab = 'sales' | 'purchases';
type SubTab = 'detail' | 'chat';

interface StatusStep {
    key: string;
    label: string;
    icon: keyof typeof MaterialIcons.glyphMap;
}

interface ChatMessage {
    id: string;
    text: string;
    fromMe: boolean;
    time: string;
}

interface Purchase {
    orderId: string;
    item: MarketItem;
    sellerName: string;
    status: 'pending' | 'transit' | 'completed';
    currentStep: number;
    location?: string;
    eta?: string;
    messages: ChatMessage[];
}

interface SaleOrder {
    orderId: string;
    item: MarketItem;
    buyerName: string;
    status: 'pending' | 'transit' | 'completed';
    currentStep: number;
    messages: ChatMessage[];
}

// ─── Constants ─────────────────────────────────────────────────────────────────

const STATUS_STEPS: StatusStep[] = [
    { key: 'pending', label: 'Pendiente', icon: 'hourglass-empty' },
    { key: 'transit', label: 'En Tránsito', icon: 'local-shipping' },
    { key: 'completed', label: 'Completado', icon: 'check-circle' },
];

const STATUS_BADGE: Record<Purchase['status'], { label: string; color: string; bg: string }> = {
    pending: { label: 'PENDIENTE', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
    transit: { label: 'EN TRÁNSITO', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
    completed: { label: 'COMPLETADO', color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
};

// ─── Mock derived data ─────────────────────────────────────────────────────────

const SELLER_NAMES = ['AgroInversiones S.A.', 'Hacienda La Palma', 'GanaderosPro', 'Finca El Llano'];
const BUYER_NAMES = ['Pedro Martínez', 'Agropecuaria del Norte', 'Finca Los Altos', 'Don Rafael Gómez'];

const MOCK_MESSAGES: ChatMessage[][] = [
    [
        { id: '1', text: '¿Cuándo está disponible el lote para retirar?', fromMe: false, time: '10:15' },
        { id: '2', text: 'Listo desde este lunes. Solo necesito confirmación de pago.', fromMe: true, time: '10:18' },
        { id: '3', text: 'Perfecto, transferimos hoy mismo.', fromMe: false, time: '10:20' },
    ],
    [
        { id: '1', text: 'Buen día, ¿el precio es negociable?', fromMe: false, time: '09:00' },
        { id: '2', text: 'Buenos días. Para lotes mayores a 30 cabezas sí tenemos margen.', fromMe: true, time: '09:05' },
        { id: '3', text: 'Somos 45. ¿Cuánto nos pueden dar?', fromMe: false, time: '09:10' },
    ],
    [
        { id: '1', text: '¿Tienen certificado sanitario?', fromMe: false, time: 'Ayer' },
        { id: '2', text: 'Sí, todos los animales están vacunados y con guía de movilización.', fromMe: true, time: 'Ayer' },
        { id: '3', text: 'Excelente, cerramos trato.', fromMe: false, time: 'Ayer' },
    ],
    [
        { id: '1', text: '¿Cuál es el peso promedio real del lote?', fromMe: false, time: '08:30' },
        { id: '2', text: 'El último pesaje fue de 310 kg promedio. Tengo la factura del pesaje.', fromMe: true, time: '08:45' },
        { id: '3', text: 'Bien, lo tomamos. ¿Cómo coordinamos el transporte?', fromMe: false, time: '08:50' },
    ],
];

const deriveMySales = (data: MarketItem[]): SaleOrder[] =>
    data.slice(0, 4).map((item, i) => ({
        orderId: `VT-${3000 + i + 1}`,
        item,
        buyerName: BUYER_NAMES[i],
        status: (['pending', 'transit', 'completed', 'transit'] as Purchase['status'][])[i],
        currentStep: [0, 1, 2, 1][i],
        messages: MOCK_MESSAGES[i],
    }));

const derivePurchases = (data: MarketItem[]): Purchase[] =>
    data.slice(5, 9).map((item, i) => ({
        orderId: `AM-${4920 + i + 1}`,
        item,
        sellerName: SELLER_NAMES[i],
        status: (['pending', 'transit', 'transit', 'completed'] as Purchase['status'][])[i],
        currentStep: [0, 1, 1, 2][i],
        location: ['Tank Farm', 'Peaje de Valencia', 'Barquisimeto', undefined][i],
        eta: ['En preparación', '6h', '12h', undefined][i],
        messages: MOCK_MESSAGES[i],
    }));

// ─── TrackerBar ────────────────────────────────────────────────────────────────

const TrackerBar = ({
    currentStep,
    styles,
}: {
    currentStep: number;
    styles: ReturnType<typeof getStyles>;
}) => {
    const progress = currentStep / (STATUS_STEPS.length - 1);
    return (
        <View style={styles.trackerWrapper}>
            <View style={styles.trackerLine}>
                <View style={[styles.trackerLineProgress, { width: `${progress * 100}%` as any }]} />
            </View>
            <View style={styles.trackerSteps}>
                {STATUS_STEPS.map((step, index) => {
                    const done = index <= currentStep;
                    return (
                        <View key={step.key} style={styles.trackerStep}>
                            <View style={[styles.trackerDot, done ? styles.trackerDotActive : styles.trackerDotInactive]}>
                                {done && <MaterialIcons name={step.icon} size={14} color="#fff" />}
                            </View>
                            <Text style={[styles.trackerStepLabel, done && styles.trackerStepLabelActive]}>
                                {step.label}
                            </Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

// ─── ChatPanel ────────────────────────────────────────────────────────────────

const ChatPanel = ({
    messages,
    counterpart,
    styles,
    colors,
}: {
    messages: ChatMessage[];
    counterpart: string;
    styles: ReturnType<typeof getStyles>;
    colors: ReturnType<typeof getThemeColors>;
}) => {
    const [input, setInput] = useState('');
    const [localMessages, setLocalMessages] = useState(messages);

    const sendMessage = useCallback(() => {
        if (!input.trim()) return;
        setLocalMessages(prev => [
            ...prev,
            { id: Date.now().toString(), text: input.trim(), fromMe: true, time: 'Ahora' },
        ]);
        setInput('');
    }, [input]);

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={100}
        >
            {/* Chat header */}
            <View style={styles.chatHeader}>
                <View style={styles.chatAvatar}>
                    <Text style={styles.chatAvatarText}>{counterpart.charAt(0)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.chatCounterpart} numberOfLines={1}>{counterpart}</Text>
                    <View style={styles.chatOnlineRow}>
                        <View style={styles.chatOnlineDot} />
                        <Text style={styles.chatOnlineText}>Activo ahora</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.chatCallBtn}>
                    <MaterialIcons name="phone" size={18} color={colors.brand} />
                </TouchableOpacity>
            </View>

            {/* Messages */}
            <ScrollView
                style={styles.chatMessages}
                contentContainerStyle={{ padding: 12, paddingBottom: 4 }}
                showsVerticalScrollIndicator={false}
            >
                {localMessages.map(msg => (
                    <View
                        key={msg.id}
                        style={[
                            styles.chatBubbleWrapper,
                            msg.fromMe ? styles.chatBubbleWrapperMe : styles.chatBubbleWrapperThem,
                        ]}
                    >
                        <View style={[styles.chatBubble, msg.fromMe ? styles.chatBubbleMe : styles.chatBubbleThem]}>
                            <Text style={[styles.chatBubbleText, msg.fromMe && styles.chatBubbleTextMe]}>
                                {msg.text}
                            </Text>
                        </View>
                        <Text style={styles.chatTime}>{msg.time}</Text>
                    </View>
                ))}
            </ScrollView>

            {/* Input */}
            <View style={styles.chatInputRow}>
                <TextInput
                    style={styles.chatInput}
                    placeholder="Escribe un mensaje..."
                    placeholderTextColor={colors.mutedText}
                    value={input}
                    onChangeText={setInput}
                    multiline
                />
                <TouchableOpacity
                    style={[styles.chatSendBtn, !input.trim() && { opacity: 0.4 }]}
                    onPress={sendMessage}
                    activeOpacity={0.8}
                >
                    <MaterialIcons name="send" size={18} color="#fff" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

// ─── Mobile PurchaseCard ───────────────────────────────────────────────────────

const MobilePurchaseCard = ({
    purchase,
    styles,
    colors,
}: {
    purchase: Purchase;
    styles: ReturnType<typeof getStyles>;
    colors: ReturnType<typeof getThemeColors>;
}) => {
    const badge = STATUS_BADGE[purchase.status];
    const [subTab, setSubTab] = useState<SubTab>('detail');

    return (
        <View style={styles.purchaseCard}>
            <View style={styles.purchaseHeader}>
                <View style={styles.purchaseHeaderLeft}>
                    <View style={styles.purchaseThumb}>
                        <Image source={{ uri: purchase.item.img }} style={styles.purchaseThumbImg} resizeMode="cover" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.purchaseOrderId}>PEDIDO #{purchase.orderId}</Text>
                        <Text style={styles.purchaseTitle} numberOfLines={1}>{purchase.item.title}</Text>
                        <Text style={styles.purchaseSeller}>Vendedor: {purchase.sellerName}</Text>
                    </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: badge.bg, borderColor: badge.color + '40' }]}>
                    <Text style={[styles.statusText, { color: badge.color }]}>{badge.label}</Text>
                </View>
            </View>

            <View style={styles.subTabsRow}>
                {(['detail', 'chat'] as SubTab[]).map(t => (
                    <TouchableOpacity
                        key={t}
                        style={[styles.subTab, subTab === t && styles.subTabActive]}
                        onPress={() => setSubTab(t)}
                    >
                        <MaterialIcons
                            name={t === 'detail' ? 'info-outline' : 'chat-bubble-outline'}
                            size={13}
                            color={subTab === t ? colors.brand : colors.mutedText}
                        />
                        <Text style={[styles.subTabText, subTab === t && styles.subTabTextActive]}>
                            {t === 'detail' ? 'Detalle' : 'Chat'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {subTab === 'detail' ? (
                <>
                    <TrackerBar currentStep={purchase.currentStep} styles={styles} />
                    {purchase.location && (
                        <View style={[styles.locationRow, { flexWrap: 'wrap', gap: 4 }]}>
                            <View style={[styles.locationLeft, { flexShrink: 1, minWidth: 0 }]}>
                                <MaterialIcons name="location-on" size={16} color={colors.brand} />
                                <Text style={styles.locationText} numberOfLines={2}>
                                    Ubicación: <Text style={styles.locationValue}>{purchase.location}</Text>
                                </Text>
                            </View>
                            {purchase.eta && (
                                <Text style={[styles.locationEta, { flexShrink: 0, marginLeft: 4 }]}>
                                    ETA: {purchase.eta}
                                </Text>
                            )}
                        </View>
                    )}
                </>
            ) : (
                <View style={{ height: 340 }}>
                    <ChatPanel messages={purchase.messages} counterpart={purchase.sellerName} styles={styles} colors={colors} />
                </View>
            )}
        </View>
    );
};

// ─── Mobile SaleCard ──────────────────────────────────────────────────────────

const MobileSaleCard = ({
    sale,
    styles,
    colors,
}: {
    sale: SaleOrder;
    styles: ReturnType<typeof getStyles>;
    colors: ReturnType<typeof getThemeColors>;
}) => {
    const badge = STATUS_BADGE[sale.status];
    const [subTab, setSubTab] = useState<SubTab>('detail');

    return (
        <View style={styles.purchaseCard}>
            <View style={styles.purchaseHeader}>
                <View style={styles.purchaseHeaderLeft}>
                    <View style={styles.purchaseThumb}>
                        <Image source={{ uri: sale.item.img }} style={styles.purchaseThumbImg} resizeMode="cover" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.purchaseOrderId}>VENTA #{sale.orderId}</Text>
                        <Text style={styles.purchaseTitle} numberOfLines={1}>{sale.item.title}</Text>
                        <Text style={styles.purchaseSeller}>Comprador: {sale.buyerName}</Text>
                    </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: badge.bg, borderColor: badge.color + '40' }]}>
                    <Text style={[styles.statusText, { color: badge.color }]}>{badge.label}</Text>
                </View>
            </View>

            <View style={styles.subTabsRow}>
                {(['detail', 'chat'] as SubTab[]).map(t => (
                    <TouchableOpacity
                        key={t}
                        style={[styles.subTab, subTab === t && styles.subTabActive]}
                        onPress={() => setSubTab(t)}
                    >
                        <MaterialIcons
                            name={t === 'detail' ? 'inventory-2' : 'chat-bubble-outline'}
                            size={13}
                            color={subTab === t ? colors.brand : colors.mutedText}
                        />
                        <Text style={[styles.subTabText, subTab === t && styles.subTabTextActive]}>
                            {t === 'detail' ? 'Detalle' : 'Chat'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {subTab === 'detail' ? (
                <>
                    <TrackerBar currentStep={sale.currentStep} styles={styles} />
                    <View style={styles.listingActionsRow}>
                        <TouchableOpacity style={styles.btnPrimary} activeOpacity={0.8}>
                            <MaterialIcons name="edit" size={14} color="#fff" />
                            <Text style={styles.btnPrimaryText}>Editar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnGold} activeOpacity={0.8}>
                            <MaterialIcons name="rocket-launch" size={14} color="#C5A059" />
                            <Text style={styles.btnGoldText}>Impulsar</Text>
                        </TouchableOpacity>
                    </View>
                </>
            ) : (
                <View style={{ height: 340 }}>
                    <ChatPanel messages={sale.messages} counterpart={sale.buyerName} styles={styles} colors={colors} />
                </View>
            )}
        </View>
    );
};

// ─── Desktop list row ─────────────────────────────────────────────────────────

const DesktopListRow = ({
    title, subtitle, orderId, status, imgUri, isSelected, onPress, styles, colors,
}: {
    title: string; subtitle: string; orderId: string; status: Purchase['status'];
    imgUri: string; isSelected: boolean; onPress: () => void;
    styles: ReturnType<typeof getStyles>; colors: ReturnType<typeof getThemeColors>;
}) => {
    const badge = STATUS_BADGE[status];
    return (
        <TouchableOpacity
            style={[styles.desktopListItem, isSelected && styles.desktopListItemSelected]}
            onPress={onPress}
            activeOpacity={0.85}
        >
            {isSelected && <View style={styles.desktopListSelectedBar} />}
            <View style={styles.desktopListThumb}>
                <Image source={{ uri: imgUri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
                <Text style={styles.desktopListOrderId}>{orderId}</Text>
                <Text style={styles.desktopListTitle} numberOfLines={1}>{title}</Text>
                <Text style={styles.desktopListSub} numberOfLines={1}>{subtitle}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: badge.bg, borderColor: badge.color + '40', alignSelf: 'center' }]}>
                <Text style={[styles.statusText, { color: badge.color }]}>{badge.label}</Text>
            </View>
        </TouchableOpacity>
    );
};

// ─── Main Screen ───────────────────────────────────────────────────────────────

const TransactionsScreen = () => {
    const theme = useColorScheme();
    const isDark = theme === 'dark';
    const styles = useMemo(() => getStyles(theme), [theme]);
    const colors = useMemo(() => getThemeColors(isDark), [isDark]);

    const { user } = useAuth();
    const isSeller = user?.role === 'seller';

    const [activeTab, setActiveTab] = useState<MainTab>(isSeller ? 'sales' : 'purchases');
    const [selectedSaleIdx, setSelectedSaleIdx] = useState(0);
    const [selectedPurchaseIdx, setSelectedPurchaseIdx] = useState(0);
    const [desktopSubTab, setDesktopSubTab] = useState<SubTab>('detail');

    const mySales = useMemo(() => deriveMySales(MARKET_DATA), []);
    const myPurchases = useMemo(() => derivePurchases(MARKET_DATA), []);

    const { width } = useWindowDimensions();
    const isDesktop = width > 768;

    const selectedSale = mySales[selectedSaleIdx];
    const selectedPurchase = myPurchases[selectedPurchaseIdx];
    const activePurchases = myPurchases.filter(p => p.status !== 'completed');

    const StatsRow = () => (
        <View style={styles.statsRow}>
            {activeTab === 'sales' ? (
                <>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>Publicaciones</Text>
                        <Text style={styles.statValue}>{mySales.length}</Text>
                        <Text style={styles.statBadge}>+2 esta sem.</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>En tránsito</Text>
                        <Text style={styles.statValue}>{mySales.filter(s => s.status === 'transit').length}</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>Completadas</Text>
                        <Text style={styles.statValue}>{mySales.filter(s => s.status === 'completed').length}</Text>
                    </View>
                </>
            ) : (
                <>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>Activas</Text>
                        <Text style={styles.statValue}>{activePurchases.length}</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>En tránsito</Text>
                        <Text style={styles.statValue}>{myPurchases.filter(p => p.status === 'transit').length}</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>Recibidas</Text>
                        <Text style={styles.statValue}>{myPurchases.filter(p => p.status === 'completed').length}</Text>
                    </View>
                </>
            )}
        </View>
    );

    // ─── Desktop Detail Panel ──────────────────────────────────────────────────

    const DesktopDetailPanel = () => {
        const isSalesTab = activeTab === 'sales';
        const item = isSalesTab ? selectedSale : selectedPurchase;
        const counterpart = isSalesTab ? selectedSale.buyerName : selectedPurchase.sellerName;
        const badge = STATUS_BADGE[item.status];

        return (
            <View style={styles.desktopDetailPanel}>
                {/* Hero image */}
                <View style={styles.desktopDetailImage}>
                    <Image source={{ uri: item.item.img }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                    <View style={styles.desktopDetailImageOverlay} />
                    <View style={styles.desktopDetailImageContent}>
                        <Text style={styles.desktopDetailImageTitle}>{item.item.title}</Text>
                        <Text style={styles.desktopDetailImageSub}>
                            {item.item.location}, Venezuela · {item.item.heads} cabezas · {item.item.breed}
                        </Text>
                    </View>
                    <View style={[styles.statusBadge, {
                        position: 'absolute', top: 16, right: 16,
                        backgroundColor: badge.bg, borderColor: badge.color + '40',
                    }]}>
                        <Text style={[styles.statusText, { color: badge.color }]}>{badge.label}</Text>
                    </View>
                </View>

                {/* Sub-tabs */}
                <View style={styles.desktopDetailSubTabs}>
                    {([
                        { key: 'detail', label: 'Detalle', icon: 'info-outline' },
                        { key: 'chat', label: `Chat con ${isSalesTab ? 'Comprador' : 'Vendedor'}`, icon: 'chat-bubble-outline' },
                    ] as { key: SubTab; label: string; icon: keyof typeof MaterialIcons.glyphMap }[]).map(t => (
                        <TouchableOpacity
                            key={t.key}
                            style={[styles.desktopDetailSubTab, desktopSubTab === t.key && styles.desktopDetailSubTabActive]}
                            onPress={() => setDesktopSubTab(t.key)}
                        >
                            <MaterialIcons
                                name={t.icon}
                                size={15}
                                color={desktopSubTab === t.key ? colors.brand : colors.mutedText}
                            />
                            <Text style={[styles.desktopDetailSubTabText, desktopSubTab === t.key && styles.desktopDetailSubTabTextActive]}>
                                {t.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {desktopSubTab === 'detail' ? (
                    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, gap: 16 }}>
                        {/* Info grid */}
                        <View style={styles.desktopDetailInfoGrid}>
                            {[
                                { label: 'Orden', value: isSalesTab ? selectedSale.orderId : selectedPurchase.orderId },
                                { label: isSalesTab ? 'Comprador' : 'Vendedor', value: counterpart },
                                { label: 'Raza', value: item.item.breed },
                                { label: 'Categoría', value: item.item.category },
                                { label: 'Peso', value: item.item.weight },
                                { label: 'Cabezas', value: String(item.item.heads) },
                            ].map(({ label, value }) => (
                                <View key={label} style={styles.desktopDetailInfoCell}>
                                    <Text style={styles.desktopDetailInfoLabel}>{label}</Text>
                                    <Text style={styles.desktopDetailInfoValue}>{value}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Tracker */}
                        <View style={styles.desktopDetailCard}>
                            <Text style={styles.desktopDetailCardTitle}>Estado del pedido</Text>
                            <TrackerBar currentStep={item.currentStep} styles={styles} />
                        </View>

                        {/* Location */}
                        {!isSalesTab && (selectedPurchase as Purchase).location && (
                            <View style={[styles.locationRow, { flexWrap: 'wrap', gap: 4 }]}>
                                <View style={[styles.locationLeft, { flexShrink: 1, minWidth: 0 }]}>
                                    <MaterialIcons name="location-on" size={16} color={colors.brand} />
                                    <Text style={styles.locationText} numberOfLines={2}>
                                        Ubicación actual:{' '}
                                        <Text style={styles.locationValue}>{(selectedPurchase as Purchase).location}</Text>
                                    </Text>
                                </View>
                                {(selectedPurchase as Purchase).eta && (
                                    <Text style={[styles.locationEta, { flexShrink: 0, marginLeft: 4 }]}>
                                        ETA: {(selectedPurchase as Purchase).eta}
                                    </Text>
                                )}
                            </View>
                        )}

                        {/* Actions for sales */}
                        {isSalesTab && (
                            <View style={styles.listingActionsRow}>
                                <TouchableOpacity style={styles.btnPrimary} activeOpacity={0.8}>
                                    <MaterialIcons name="edit" size={14} color="#fff" />
                                    <Text style={styles.btnPrimaryText}>Editar publicación</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.btnGold} activeOpacity={0.8}>
                                    <MaterialIcons name="rocket-launch" size={14} color="#C5A059" />
                                    <Text style={styles.btnGoldText}>Impulsar</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </ScrollView>
                ) : (
                    <View style={{ flex: 1 }}>
                        <ChatPanel
                            messages={item.messages}
                            counterpart={counterpart}
                            styles={styles}
                            colors={colors}
                        />
                    </View>
                )}
            </View>
        );
    };

    // ─── DESKTOP LAYOUT ───────────────────────────────────────────────────────

    if (isDesktop) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.desktopRoot}>

                    {/* Left sidebar */}
                    <View style={styles.desktopSidebar}>
                        <View style={styles.desktopSidebarHeader}>
                            <Text style={styles.headerTitle}>Actividad</Text>
                            <Text style={styles.headerSubtitle}>{isSeller ? 'Ventas y compras' : 'Mis compras'}</Text>
                        </View>

                        {isSeller && (
                            <View style={styles.desktopSidebarTabs}>
                                {([
                                    { key: 'sales' as MainTab, label: 'Mis Ventas', icon: 'inventory-2' as const },
                                    { key: 'purchases' as MainTab, label: 'Mis Compras', icon: 'shopping-cart' as const },
                                ]).map(t => (
                                    <TouchableOpacity
                                        key={t.key}
                                        style={[styles.desktopSidebarTab, activeTab === t.key && styles.desktopSidebarTabActive]}
                                        onPress={() => setActiveTab(t.key)}
                                    >
                                        <MaterialIcons
                                            name={t.icon}
                                            size={15}
                                            color={activeTab === t.key ? colors.brand : colors.mutedText}
                                        />
                                        <Text style={[styles.desktopSidebarTabText, activeTab === t.key && styles.desktopSidebarTabTextActive]}>
                                            {t.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        <View style={{ paddingHorizontal: 12, paddingBottom: 4 }}>
                            <StatsRow />
                        </View>

                        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                            {activeTab === 'sales'
                                ? mySales.map((sale, i) => (
                                    <DesktopListRow
                                        key={sale.orderId}
                                        title={sale.item.title}
                                        subtitle={`Comprador: ${sale.buyerName}`}
                                        orderId={`VENTA #${sale.orderId}`}
                                        status={sale.status}
                                        imgUri={sale.item.img}
                                        isSelected={selectedSaleIdx === i}
                                        onPress={() => { setSelectedSaleIdx(i); setDesktopSubTab('detail'); }}
                                        styles={styles}
                                        colors={colors}
                                    />
                                ))
                                : myPurchases.map((purchase, i) => (
                                    <DesktopListRow
                                        key={purchase.orderId}
                                        title={purchase.item.title}
                                        subtitle={`Vendedor: ${purchase.sellerName}`}
                                        orderId={`PEDIDO #${purchase.orderId}`}
                                        status={purchase.status}
                                        imgUri={purchase.item.img}
                                        isSelected={selectedPurchaseIdx === i}
                                        onPress={() => { setSelectedPurchaseIdx(i); setDesktopSubTab('detail'); }}
                                        styles={styles}
                                        colors={colors}
                                    />
                                ))
                            }
                        </ScrollView>
                    </View>

                    {/* Right detail panel */}
                    <View style={{ flex: 1, overflow: 'hidden' }}>
                        <DesktopDetailPanel />
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    // ─── MOBILE LAYOUT ────────────────────────────────────────────────────────

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Actividad</Text>
                    <Text style={styles.headerSubtitle}>{isSeller ? 'Ventas y compras' : 'Mis compras'}</Text>
                </View>
                <TouchableOpacity>
                    <MaterialIcons name="filter-list" size={24} color={colors.brand} />
                </TouchableOpacity>
            </View>

            {isSeller && (
                <View style={styles.tabsWrapper}>
                    {([
                        { key: 'sales' as MainTab, label: 'Mis Ventas', icon: 'inventory-2' as const },
                        { key: 'purchases' as MainTab, label: 'Mis Compras', icon: 'shopping-cart' as const },
                    ]).map(t => (
                        <TouchableOpacity
                            key={t.key}
                            style={[styles.tab, activeTab === t.key && styles.tabActive]}
                            onPress={() => setActiveTab(t.key)}
                            activeOpacity={0.85}
                        >
                            <MaterialIcons name={t.icon} size={15} color={activeTab === t.key ? '#fff' : colors.mutedText} />
                            <Text style={[styles.tabText, activeTab === t.key && styles.tabTextActive]}>{t.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <StatsRow />

                <View style={styles.sectionRow}>
                    <Text style={styles.sectionTitle}>
                        {activeTab === 'sales' ? 'Mis Ventas' : 'Rastreo de Compras'}
                    </Text>
                    {activeTab === 'purchases' && activePurchases.length > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{activePurchases.length} ACTIVAS</Text>
                        </View>
                    )}
                </View>

                {activeTab === 'sales'
                    ? mySales.map(sale => (
                        <MobileSaleCard key={sale.orderId} sale={sale} styles={styles} colors={colors} />
                    ))
                    : myPurchases.map(purchase => (
                        <MobilePurchaseCard key={purchase.orderId} purchase={purchase} styles={styles} colors={colors} />
                    ))
                }
            </ScrollView>
        </SafeAreaView>
    );
};

export default TransactionsScreen;
