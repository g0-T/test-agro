// app/(tabs)/help.tsx
import React, { useState, useMemo } from 'react';
import {
    View, Text, TouchableOpacity, useColorScheme,
    ScrollView, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { getHelpStyles } from '@/styles/help.styles';

// ─── FAQ Data ───────────────────────────────────────────────────────────────────

const FAQ_ITEMS = [
    {
        icon: 'storefront' as const,
        question: '¿Cómo publico un lote de ganado?',
        answer: 'Ve a la pestaña "Publicar" en el menú de navegación. Completa el formulario con el tipo, categoría, raza, peso promedio y cantidad de cabezas. Adjunta fotos de calidad. Una vez enviado, nuestro equipo verificará la publicación en menos de 24 horas.',
    },
    {
        icon: 'verified' as const,
        question: '¿Qué significa el badge "Verificado"?',
        answer: 'El sello de verificación indica que el vendedor ha sido validado por nuestro equipo: documentación legal, guías de movilización y certificados sanitarios al día. Los lotes verificados generan hasta 3x más contactos.',
    },
    {
        icon: 'local-shipping' as const,
        question: '¿Cómo funciona el rastreo de pedidos?',
        answer: 'En la sección "Transacciones" puedes ver el estado en tiempo real de tus compras: Pendiente → En Tránsito → Completado. El vendedor actualiza el estado y puedes chatear directamente desde la tarjeta del pedido.',
    },
    {
        icon: 'attach-money' as const,
        question: '¿Cómo se calculan los precios en Bs.?',
        answer: 'Los precios se publican en USD y se convierten automáticamente usando la tasa oficial BCV del día. La conversión se actualiza diariamente y se muestra en el header del marketplace.',
    },
    {
        icon: 'chat-bubble-outline' as const,
        question: '¿Cómo contacto a un vendedor?',
        answer: 'Desde cualquier tarjeta de lote, presiona "OFERTAR" para iniciar una negociación. También puedes acceder al chat directamente desde el panel de Transacciones una vez que hayas enviado una oferta.',
    },
    {
        icon: 'security' as const,
        question: '¿Es seguro comprar en AgroMarket?',
        answer: 'Sí. Utilizamos verificación de identidad para vendedores, guías de movilización oficiales y un sistema de reputación. Recomendamos siempre verificar los documentos antes de cerrar cualquier transacción.',
    },
    {
        icon: 'rocket-launch' as const,
        question: '¿Qué es "Impulsar" una publicación?',
        answer: 'La opción Impulsar destaca tu lote en posiciones premium del marketplace durante 7 días, aumentando su visibilidad frente a compradores activos. Es especialmente útil para lotes grandes o urgentes.',
    },
];

const TOPICS = ['Publicación', 'Compras', 'Pagos', 'Cuenta', 'Rastreo', 'Verificación'];

// ─── FAQ Accordion ──────────────────────────────────────────────────────────────

const FaqItem = ({
    item, styles, colors,
}: {
    item: typeof FAQ_ITEMS[0];
    styles: any; colors: any;
}) => {
    const [open, setOpen] = useState(false);
    return (
        <View style={styles.faqCard}>
            <TouchableOpacity style={styles.faqHeader} onPress={() => setOpen(o => !o)} activeOpacity={0.75}>
                <View style={styles.faqHeaderLeft}>
                    <View style={styles.faqIcon}>
                        <MaterialIcons name={item.icon} size={18} color={colors.brand} />
                    </View>
                    <Text style={styles.faqQuestion}>{item.question}</Text>
                </View>
                <MaterialIcons
                    name={open ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                    size={22}
                    color={colors.mutedText}
                />
            </TouchableOpacity>
            {open && (
                <Text style={styles.faqAnswer}>{item.answer}</Text>
            )}
        </View>
    );
};

// ─── Main Screen ────────────────────────────────────────────────────────────────

const HelpScreen = () => {
    const theme = useColorScheme();
    const { styles, colors } = useMemo(() => getHelpStyles(theme), [theme]);
    const [search, setSearch] = useState('');

    const filteredFaq = useMemo(() => {
        if (!search.trim()) return FAQ_ITEMS;
        const s = search.toLowerCase();
        return FAQ_ITEMS.filter(
            f => f.question.toLowerCase().includes(s) || f.answer.toLowerCase().includes(s)
        );
    }, [search]);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Centro de Ayuda</Text>
                <Text style={styles.headerSubtitle}>Encuentra respuestas rápidas a tus preguntas</Text>
            </View>

            {/* Search */}
            <View style={styles.searchWrap}>
                <MaterialIcons name="search" size={20} color={colors.mutedText} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar en el centro de ayuda..."
                    placeholderTextColor={colors.mutedText}
                    value={search}
                    onChangeText={setSearch}
                />
                {search.length > 0 && (
                    <TouchableOpacity onPress={() => setSearch('')}>
                        <MaterialIcons name="close" size={18} color={colors.mutedText} />
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Hero Banner */}
                {!search && (
                    <View style={styles.heroBanner}>
                        <View style={styles.heroBannerIcon}>
                            <MaterialIcons name="support-agent" size={28} color="#fff" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.heroBannerTitle}>¿Necesitas ayuda directa?</Text>
                            <Text style={styles.heroBannerSub}>Nuestro equipo responde en menos de 2 horas hábiles.</Text>
                            <TouchableOpacity style={styles.heroBannerBtn}>
                                <Text style={styles.heroBannerBtnText}>Contactar soporte</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* Topics */}
                {!search && (
                    <View>
                        <Text style={styles.sectionLabel}>Temas populares</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {TOPICS.map(t => (
                                <TouchableOpacity key={t} style={styles.topicChip}>
                                    <Text style={styles.topicChipText}>{t}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* FAQ */}
                <View>
                    <Text style={styles.sectionLabel}>Preguntas Frecuentes</Text>
                    {filteredFaq.map((item, i) => (
                        <FaqItem key={i} item={item} styles={styles} colors={colors} />
                    ))}
                    {filteredFaq.length === 0 && (
                        <View style={{ alignItems: 'center', paddingVertical: 32, gap: 10 }}>
                            <MaterialIcons name="search-off" size={44} color={colors.mutedText} />
                            <Text style={{ color: colors.mutedText, fontWeight: '600', fontSize: 14 }}>
                                No se encontraron resultados
                            </Text>
                        </View>
                    )}
                </View>

                {/* Contact options */}
                {!search && (
                    <View>
                        <Text style={styles.sectionLabel}>Canales de contacto</Text>
                        <View style={styles.contactRow}>
                            {[
                                { icon: 'chat' as const, label: 'Chat en vivo', sub: 'Respuesta inmediata' },
                                { icon: 'email' as const, label: 'Email', sub: 'soporte@agromarket.ve' },
                                { icon: 'phone' as const, label: 'Teléfono', sub: '+58 412-0000000' },
                            ].map(c => (
                                <TouchableOpacity key={c.label} style={styles.contactCard} activeOpacity={0.8}>
                                    <View style={styles.contactIcon}>
                                        <MaterialIcons name={c.icon} size={22} color={colors.brand} />
                                    </View>
                                    <Text style={styles.contactLabel}>{c.label}</Text>
                                    <Text style={styles.contactSub}>{c.sub}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default HelpScreen;
