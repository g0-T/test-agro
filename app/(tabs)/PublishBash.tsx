// app/(tabs)/publish/index.tsx  — PublishBatch
import React, { useState, useEffect, useMemo } from 'react';
import {
    View, Text, ScrollView, TextInput, TouchableOpacity,
    Modal, FlatList, Alert, useColorScheme, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { FILTERS } from '@/constants/filters';
import { getThemeColors } from '@/constants/theme';
import { getStyles } from '@/styles/publishBatch.styles';

// ─── Step indicator ────────────────────────────────────────────────────────────
const STEPS = [
    { number: 1, title: 'Multimedia', icon: 'camera-burst' as const },
    { number: 2, title: 'Información', icon: 'information-outline' as const },
    { number: 3, title: 'Raza', icon: 'cow' as const },
    { number: 4, title: 'Ubicación', icon: 'map-marker-outline' as const },
    { number: 5, title: 'Precio', icon: 'cash' as const },
];

const StepIndicator = ({ currentSection, colors, styles }: { currentSection: number; colors: any; styles: any; }) => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.stepRow}>
        {STEPS.map((step, idx) => {
            const done = step.number < currentSection;
            const active = step.number === currentSection;
            return (
                <React.Fragment key={step.number}>
                    <View style={styles.stepItem}>
                        <View style={[
                            styles.stepDot,
                            done && styles.stepDotDone,
                            active && styles.stepDotActive,
                        ]}>
                            {done
                                ? <MaterialIcons name="check" size={14} color="#fff" />
                                : <Text style={[styles.stepNumber, active && styles.stepNumberActive]}>{step.number}</Text>
                            }
                        </View>
                        <Text style={[styles.stepLabel, active && styles.stepLabelActive]}>{step.title}</Text>
                    </View>
                    {idx < STEPS.length - 1 && (
                        <View style={[styles.stepConnector, done && styles.stepConnectorDone]} />
                    )}
                </React.Fragment>
            );
        })}
    </ScrollView>
);

// ─── Section card wrapper ──────────────────────────────────────────────────────
const SectionCard = ({ children, style, styles }: { children: React.ReactNode; style?: any; styles: any }) => (
    <View style={[styles.sectionCard, style]}>{children}</View>
);

// ─── Main Component ────────────────────────────────────────────────────────────
const PublishBatch = () => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const styles = useMemo(() => getStyles(colorScheme), [colorScheme]);
    const theme = useMemo(() => getThemeColors(isDark), [isDark]);

    const { width } = useWindowDimensions();
    const isDesktop = width > 768;

    const [currentSection, setCurrentSection] = useState(1);

    const [formData, setFormData] = useState({
        title: '',
        type: FILTERS.TYPES[1],
        category: FILTERS.CATEGORIES[0],
        breedGroup: 'Cebú',
        breed: FILTERS.BREEDS['Cebú'][0],
        heads: '',
        weight: '',
        location: FILTERS.LOCATIONS[0],
        currency: 'USD',
        price: '',
        description: '',
    });

    useEffect(() => {
        const breeds = FILTERS.BREEDS[formData.breedGroup as keyof typeof FILTERS.BREEDS];
        setFormData(prev => ({ ...prev, breed: breeds[0] }));
    }, [formData.breedGroup]);

    const [picker, setPicker] = useState({ visible: false, options: [] as string[], field: '', title: '' });
    
    const openPicker = (field: string, title: string, options: string[]) =>
        setPicker({ visible: true, options, field, title });
        
    const handleSelect = (option: string) => {
        setFormData(prev => ({ ...prev, [picker.field]: option }));
        setPicker(prev => ({ ...prev, visible: false }));
    };

    const priceNum = parseFloat(formData.price) || 0;
    const companyFee = priceNum * 0.05;
    const netIncome = priceNum - companyFee;
    const isFormValid = formData.title.length > 0 && formData.price.length > 0;

    const update = (key: string, value: string) => setFormData(prev => ({ ...prev, [key]: value }));

    // ✨ NUEVO: Manejador estricto para números. Bloquea letras en Desktop y Móvil.
    const updateNumber = (key: string, value: string, allowDecimals: boolean = false) => {
        // Regex: Si permite decimales deja números y el punto. Si no, solo números.
        const regex = allowDecimals ? /[^0-9.]/g : /[^0-9]/g;
        let sanitized = value.replace(regex, '');
        
        // Evitar que escriban múltiples puntos decimales ej: "10.5.2"
        if (allowDecimals) {
            const parts = sanitized.split('.');
            if (parts.length > 2) {
                sanitized = parts[0] + '.' + parts.slice(1).join('');
            }
        }
        update(key, sanitized);
    };

    // ─── Sections (Definidas como variables JSX, NO como funciones para no perder el focus) ───

    const section1Multimedia = (
        <SectionCard styles={styles} style={isDesktop ? {} : styles.multimediaCard}>
            <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name="camera-burst" size={20} color={theme.brand} />
                <Text style={styles.sectionTitle}>1. Fotos y Videos</Text>
            </View>
            <Text style={styles.label}>Sube contenido de alta calidad para vender más rápido.</Text>

            <TouchableOpacity style={styles.uploadArea} activeOpacity={0.7}>
                <View style={styles.cameraIconContainer}>
                    <MaterialCommunityIcons name="camera-plus-outline" size={32} color="white" />
                </View>
                <Text style={{ color: theme.textColor, fontSize: 16, fontWeight: '800', marginTop: 4 }}>
                    Añadir Multimedia
                </Text>
                <Text style={{ color: theme.mutedText, fontSize: 12, marginTop: 4, textAlign: 'center' }}>
                    Máximo 10 fotos · 2 videos HD
                </Text>
            </TouchableOpacity>

            <View style={styles.tipsRow}>
                {['Luz natural', 'Varios ángulos', 'Alta resolución'].map(tip => (
                    <View key={tip} style={styles.tipChip}>
                        <MaterialIcons name="tips-and-updates" size={12} color={theme.brand} />
                        <Text style={styles.tipText}>{tip}</Text>
                    </View>
                ))}
            </View>
        </SectionCard>
    );

    const section2Info = (
        <SectionCard styles={styles} style={isDesktop ? {} : styles.multimediaCard}>
            <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name="information-outline" size={20} color={theme.brand} />
                <Text style={styles.sectionTitle}>2. Información General</Text>
            </View>

            <Text style={styles.label}>Título de la publicación</Text>
            <TextInput
                style={styles.input}
                placeholder="Ej: 40 Becerros Brahman en excelente estado..."
                placeholderTextColor={theme.placeholderColor}
                value={formData.title}
                onChangeText={(v) => update('title', v)}
            />

            <Text style={[styles.label, { marginTop: 14 }]}>Descripción (opcional)</Text>
            <TextInput
                style={[styles.input, { height: 90, textAlignVertical: 'top', paddingTop: 12 }]}
                placeholder="Describe el estado de los animales, alimentación, manejo sanitario..."
                placeholderTextColor={theme.placeholderColor}
                value={formData.description}
                onChangeText={(v) => update('description', v)}
                multiline
            />

            <View style={[styles.row, { marginTop: 14 }]}>
                <View style={styles.flex1}>
                    <Text style={styles.label}>Tipo</Text>
                    <TouchableOpacity
                        style={[styles.input, styles.pickerButton]}
                        onPress={() => openPicker('type', 'Seleccionar Tipo', FILTERS.TYPES)}
                    >
                        <Text style={{ color: theme.textColor, fontSize: 14 }}>{formData.type}</Text>
                        <MaterialCommunityIcons name="chevron-down" size={20} color={theme.brand} />
                    </TouchableOpacity>
                </View>
                <View style={styles.flex1}>
                    <Text style={styles.label}>Categoría</Text>
                    <TouchableOpacity
                        style={[styles.input, styles.pickerButton]}
                        onPress={() => openPicker('category', 'Categoría', FILTERS.CATEGORIES)}
                    >
                        <Text style={{ color: theme.textColor, fontSize: 12 }} numberOfLines={1}>{formData.category}</Text>
                        <MaterialCommunityIcons name="chevron-down" size={20} color={theme.brand} />
                    </TouchableOpacity>
                </View>
            </View>
        </SectionCard>
    );

    const section3Breed = (
        <SectionCard styles={styles} style={isDesktop ? {} : styles.multimediaCard}>
            <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name="cow" size={20} color={theme.brand} />
                <Text style={styles.sectionTitle}>3. Raza y Conteo</Text>
            </View>

            <View style={styles.row}>
                <View style={styles.flex1}>
                    <Text style={styles.label}>Grupo</Text>
                    <TouchableOpacity
                        style={[styles.input, styles.pickerButton]}
                        onPress={() => openPicker('breedGroup', 'Grupo de Raza', Object.keys(FILTERS.BREEDS))}
                    >
                        <Text style={{ color: theme.textColor, fontSize: 14 }}>{formData.breedGroup}</Text>
                        <MaterialCommunityIcons name="chevron-down" size={20} color={theme.brand} />
                    </TouchableOpacity>
                </View>
                <View style={styles.flex1}>
                    <Text style={styles.label}>Raza específica</Text>
                    <TouchableOpacity
                        style={[styles.input, styles.pickerButton]}
                        onPress={() => openPicker('breed', 'Raza', FILTERS.BREEDS[formData.breedGroup as keyof typeof FILTERS.BREEDS])}
                    >
                        <Text style={{ color: theme.textColor, fontSize: 14 }}>{formData.breed}</Text>
                        <MaterialCommunityIcons name="chevron-down" size={20} color={theme.brand} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={[styles.row, { marginTop: 14 }]}>
                <View style={styles.flex1}>
                    <Text style={styles.label}>N° de cabezas</Text>
                    <View style={styles.counterRow}>
                        <TouchableOpacity
                            style={styles.counterBtn}
                            onPress={() => updateNumber('heads', String(Math.max(0, parseInt(formData.heads || '0') - 1)))}
                        >
                            <MaterialIcons name="remove" size={18} color={theme.brand} />
                        </TouchableOpacity>
                        <TextInput
                            style={[styles.input, styles.counterInput]}
                            keyboardType="numeric"
                            placeholder="0"
                            placeholderTextColor={theme.placeholderColor}
                            value={formData.heads}
                            onChangeText={(v) => updateNumber('heads', v)} // ✨ Modificado para usar Regex
                        />
                        <TouchableOpacity
                            style={styles.counterBtn}
                            onPress={() => updateNumber('heads', String(parseInt(formData.heads || '0') + 1))}
                        >
                            <MaterialIcons name="add" size={18} color={theme.brand} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.flex1}>
                    <Text style={styles.label}>Peso prom. (Kg)</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        placeholder="0"
                        placeholderTextColor={theme.placeholderColor}
                        value={formData.weight}
                        onChangeText={(v) => updateNumber('weight', v, true)} // ✨ Decimales permitidos (true)
                    />
                </View>
            </View>
        </SectionCard>
    );

    const section4Location = (
        <SectionCard styles={styles} style={isDesktop ? styles.fullWidthCard : styles.multimediaCard} >
            <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name="map-marker-outline" size={20} color={theme.brand} />
                <Text style={styles.sectionTitle}>4. Localización de la Finca</Text>
            </View>

            <TouchableOpacity
                style={[styles.input, styles.pickerButton]}
                onPress={() => openPicker('location', 'Seleccionar Estado', FILTERS.LOCATIONS)}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <MaterialIcons name="location-on" size={18} color={theme.brand} />
                    <Text style={{ color: theme.textColor, fontSize: 15, fontWeight: '600' }}>{formData.location}</Text>
                </View>
                <MaterialCommunityIcons name="chevron-down" size={22} color={theme.brand} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.mapPlaceholder} activeOpacity={0.8}>
                <View style={{ alignItems: 'center', gap: 10 }}>
                    <View style={{ backgroundColor: theme.brand, padding: 14, borderRadius: 50 }}>
                        <MaterialCommunityIcons name="google-maps" size={28} color="white" />
                    </View>
                    <Text style={{ color: theme.textColor, fontWeight: '700', fontSize: 15 }}>
                        Fijar ubicación en {formData.location}
                    </Text>
                    <Text style={{ color: theme.mutedText, fontSize: 12 }}>
                        Toca para marcar en el mapa
                    </Text>
                </View>
            </TouchableOpacity>
        </SectionCard >
    );

    const section5Price = (
        <SectionCard styles={styles} style={isDesktop ? styles.fullWidthCard : styles.multimediaCard} >
            <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name="cash" size={20} color={theme.brand} />
                <Text style={styles.sectionTitle}>5. Definir Precio</Text>
            </View>

            <View style={styles.toggleGroup}>
                {['USD', 'VES'].map(c => (
                    <TouchableOpacity
                        key={c}
                        style={[styles.toggleItem, formData.currency === c && { backgroundColor: theme.brand }]}
                        onPress={() => update('currency', c)}
                        activeOpacity={0.85}
                    >
                        <Text style={{
                            color: formData.currency === c ? '#fff' : theme.mutedText,
                            fontWeight: '700', fontSize: 14,
                        }}>{c}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.label}>Precio total del lote</Text>
            <View style={styles.priceInputWrap}>
                <Text style={styles.currencyLabel}>{formData.currency}</Text>
                <TextInput
                    style={[styles.input, styles.priceInput]}
                    keyboardType="numeric"
                    placeholder="0.00"
                    placeholderTextColor={theme.placeholderColor}
                    value={formData.price}
                    onChangeText={(v) => updateNumber('price', v, true)} // ✨ Regex con Decimales
                />
            </View>

            {formData.heads && parseInt(formData.heads) > 0 && priceNum > 0 && (
                <View style={styles.priceBreakdown}>
                    <View style={styles.breakdownItem}>
                        <Text style={styles.breakdownLabel}>Por cabeza</Text>
                        <Text style={styles.breakdownValue}>
                            {formData.currency} {(priceNum / parseInt(formData.heads)).toFixed(0)}
                        </Text>
                    </View>
                    {formData.weight && (
                        <View style={styles.breakdownItem}>
                            <Text style={styles.breakdownLabel}>Por kg aprox.</Text>
                            <Text style={styles.breakdownValue}>
                                {formData.currency} {(priceNum / (parseInt(formData.heads) * parseFloat(formData.weight))).toFixed(2)}
                            </Text>
                        </View>
                    )}
                </View>
            )}

            <View style={styles.feeContainer}>
                <View style={styles.feeRow}>
                    <Text style={{ color: theme.mutedText, fontSize: 14 }}>Comisión del servicio (5%)</Text>
                    <Text style={{ color: theme.error, fontWeight: '700' }}>
                        -{formData.currency} {companyFee.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.feeRow}>
                    <Text style={{ color: theme.textColor, fontWeight: '800', fontSize: 16 }}>Neto a recibir</Text>
                    <Text style={{ color: theme.brand, fontWeight: '900', fontSize: 26, letterSpacing: -0.5 }}>
                        {formData.currency} {netIncome.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </Text>
                </View>
            </View>
        </SectionCard>
    );

    const publishBtn = (
        <TouchableOpacity
            style={[styles.publishButton, !isFormValid && { opacity: 0.5 }]}
            onPress={() => {
                if (!isFormValid) {
                    Alert.alert('Campos requeridos', 'Por favor completa el título y el precio del lote.');
                    return;
                }
                Alert.alert('Enviado', 'Tu lote fue enviado para validación. Te notificaremos pronto.');
            }}
            activeOpacity={0.85}
        >
            <MaterialIcons name="rocket-launch" size={20} color="#fff" />
            <Text style={styles.buttonText}>Publicar Lote Ahora</Text>
        </TouchableOpacity>
    );

    const pickerModal = (
        <Modal visible={picker.visible} transparent animationType="slide">
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <Text style={{ color: theme.brand, fontSize: 18, fontWeight: '800' }}>{picker.title}</Text>
                        <TouchableOpacity onPress={() => setPicker({ ...picker, visible: false })}>
                            <MaterialIcons name="close" size={22} color={theme.mutedText} />
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={picker.options}
                        keyExtractor={i => i}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.modalItem} onPress={() => handleSelect(item)}>
                                <Text style={[styles.modalText, item === (formData as any)[picker.field] && { color: theme.brand, fontWeight: '700' }]}>
                                    {item}
                                </Text>
                                {item === (formData as any)[picker.field] && (
                                    <MaterialIcons name="check-circle" size={18} color={theme.brand} />
                                )}
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </View>
        </Modal>
    );

    // ─── DESKTOP LAYOUT ─────────────────────────────────────────────────────────
    if (isDesktop) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.desktopHeader}>
                    <View>
                        <Text style={styles.headerTitle}>Publicar Lote</Text>
                        <Text style={styles.headerSubtitle}>Completa la información para llegar a más compradores</Text>
                    </View>
                    <View style={styles.desktopHeaderRight}>
                        <TouchableOpacity style={styles.saveDraftBtn}>
                            <MaterialIcons name="save" size={16} color={theme.brand} />
                            <Text style={styles.saveDraftText}>Guardar borrador</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView contentContainerStyle={styles.desktopScrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.desktopGrid}>
                        <View style={styles.desktopCol}>
                            {section1Multimedia}
                            {section2Info}
                            {section3Breed}
                        </View>
                        <View style={styles.desktopCol}>
                            {section4Location}
                            {section5Price}

                            <View style={styles.previewCard}>
                                <Text style={styles.previewTitle}>Vista previa del anuncio</Text>
                                <View style={styles.previewBody}>
                                    <View style={styles.previewTag}>
                                        <Text style={styles.previewTagText}>{formData.breed}</Text>
                                    </View>
                                    <Text style={styles.previewHeading} numberOfLines={2}>
                                        {formData.title || 'Título de tu lote'}
                                    </Text>
                                    <Text style={styles.previewMeta}>
                                        {formData.heads || '0'} cabezas · {formData.weight || '0'} Kg · {formData.location}
                                    </Text>
                                    <Text style={styles.previewPrice}>
                                        {formData.price ? `${formData.currency} ${Number(formData.price).toLocaleString()}` : 'Precio no definido'}
                                    </Text>
                                </View>
                            </View>

                            {publishBtn}
                        </View>
                    </View>
                </ScrollView>
                {pickerModal}
            </SafeAreaView>
        );
    }

    // ─── MOBILE LAYOUT ──────────────────────────────────────────────────────────
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Publicar Lote</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.mainWrapper}>
                    {section1Multimedia}
                    {section2Info}
                    {section3Breed}
                    {section4Location}
                    {section5Price}
                    {publishBtn}
                </View>
            </ScrollView>

            {pickerModal}
        </SafeAreaView>
    );
};

export default PublishBatch;