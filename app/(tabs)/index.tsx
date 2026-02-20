// app/(tabs)/index.tsx  — Market Screen
import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, useColorScheme,
    Modal, FlatList, ScrollView, useWindowDimensions,
    Animated,
    InteractionManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { getStyles } from '@/styles/market.styles';
import { MARKET_DATA } from '@/data/mockData';
import { BCV_RATE } from '@/utils/currency';
import { ListingCard } from '@/components/ListingCard';
import { FILTERS } from '@/constants/filters';

// ─── Types ─────────────────────────────────────────────────────────────────────
type BreedGroup = 'Cebú' | 'Lecheras' | null;

// ─── Helpers ───────────────────────────────────────────────────────────────────
const clean = (t: string) =>
    t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().replace(/s$/, '');

// ─── Animated Card Wrapper ──────────────────────────────────────────────────────
const AnimatedCard = React.memo(({ item, index }: { item: any; index: number }) => {
    const anim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        anim.setValue(0);
        
        Animated.timing(anim, {
            toValue: 1,
            duration: 280,
            delay: Math.min(index * 40, 300),
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <Animated.View style={{
            opacity: anim,
            transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }],
        }}>
            <ListingCard item={item} />
        </Animated.View>
    );
});

const AnimatedCardDesktop = React.memo(({ item, index }: { item: any; index: number }) => {
    const anim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Importante: No disparamos la animación hasta que el puente de JS esté libre
        const task = InteractionManager.runAfterInteractions(() => {
            Animated.timing(anim, {
                toValue: 1,
                duration: 300,
                delay: Math.min(index * 30, 400), // Stagger gradual
                useNativeDriver: true,
            }).start();
        });
        return () => task.cancel();
    }, []);

    return (
        <Animated.View style={{
            flex: 1 / 3,
            opacity: anim,
            transform: [
                { scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1] }) },
                { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }
            ],
        }}>
            <ListingCard item={item} />
        </Animated.View>
    );
});

// ─── Desktop sidebar filter panel ──────────────────────────────────────────────
const DesktopFilterSidebar = React.memo(({
    selectedType, onSelectType,
    selectedCategory, onSelectCategory,
    selectedLocation, onSelectLocation,
    selectedBreed, onSelectBreed,
    mainBreedGroup, setMainBreedGroup,
    onReset, hasActiveFilters,
    colors, styles,
}: {
    selectedType: string; onSelectType: (t: string) => void;
    selectedCategory: string | null; onSelectCategory: (c: string | null) => void;
    selectedLocation: string | null; onSelectLocation: (l: string | null) => void;
    selectedBreed: string | null; onSelectBreed: (b: string | null) => void;
    mainBreedGroup: BreedGroup; setMainBreedGroup: (g: BreedGroup) => void;
    onReset: () => void; hasActiveFilters: boolean;
    colors: any; styles: any;
}) => (
    <View style={styles.desktopSidebar}>
        <View style={styles.desktopSidebarHeader}>
            <Text style={styles.desktopSidebarTitle}>Filtros</Text>
            {hasActiveFilters && (
                <TouchableOpacity onPress={onReset}>
                    <Text style={styles.desktopSidebarReset}>Limpiar</Text>
                </TouchableOpacity>
            )}
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 24, padding: 16 }}>
            {/* Category */}
            <View>
                <Text style={styles.desktopFilterLabel}>Categoría</Text>
                <View style={styles.wrapContainer}>
                    {FILTERS.CATEGORIES.map(cat => (
                        <TouchableOpacity
                            key={cat}
                            style={[styles.chip, selectedCategory === cat && styles.activeChip]}
                            onPress={() => onSelectCategory(selectedCategory === cat ? null : cat)}
                        >
                            <Text style={{ color: selectedCategory === cat ? colors.brand : colors.mutedText, fontSize: 12 }}>
                                {cat}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Breed */}
            <View>
                <Text style={styles.desktopFilterLabel}>Raza</Text>
                <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10, marginTop: 8 }}>
                    {(Object.keys(FILTERS.BREEDS) as BreedGroup[]).filter(Boolean).map((g) => (
                        <TouchableOpacity
                            key={g!}
                            style={[styles.groupBtn, mainBreedGroup === g && styles.activeGroup]}
                            onPress={() => { setMainBreedGroup(mainBreedGroup === g ? null : g); onSelectBreed(null); }}
                        >
                            <Text style={{ color: mainBreedGroup === g ? colors.brand : colors.mutedText, fontSize: 13, fontWeight: '600' }}>
                                {g}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                {mainBreedGroup && (
                    <View style={styles.wrapContainer}>
                        {FILTERS.BREEDS[mainBreedGroup as keyof typeof FILTERS.BREEDS].map((breed) => (
                            <TouchableOpacity
                                key={breed}
                                onPress={() => onSelectBreed(selectedBreed === breed ? null : breed)}
                                style={[styles.breedChip, selectedBreed === breed && { backgroundColor: colors.brand }]}
                            >
                                <Text style={{ color: selectedBreed === breed ? '#fff' : colors.brand, fontSize: 12 }}>
                                    {breed}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>

            {/* Location */}
            <View>
                <Text style={styles.desktopFilterLabel}>Estado / Ubicación</Text>
                <View style={styles.wrapContainer}>
                    {FILTERS.LOCATIONS.map(loc => (
                        <TouchableOpacity
                            key={loc}
                            style={[styles.chip, selectedLocation === loc && styles.activeChip]}
                            onPress={() => onSelectLocation(selectedLocation === loc ? null : loc)}
                        >
                            <Text style={{ color: selectedLocation === loc ? colors.brand : colors.mutedText, fontSize: 12 }}>
                                {loc}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </ScrollView>
    </View>
));

// ─── Main Screen ───────────────────────────────────────────────────────────────
export const MarketScreen = () => {
    const theme = useColorScheme();
    const { styles, colors } = useMemo(() => getStyles(theme), [theme]);

    const [searchText, setSearchText] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedType, setSelectedType] = useState('Todos');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
    const [mainBreedGroup, setMainBreedGroup] = useState<BreedGroup>(null);
    const [selectedBreed, setSelectedBreed] = useState<string | null>(null);

    // Key changes to trigger re-animation
    const [filterKey, setFilterKey] = useState(0);
    const isFirstRender = useRef(true);

    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedSearch(searchText);

            if (isFirstRender.current) {
                isFirstRender.current = false;
                return;
            }

            if (searchText.length > 2 || searchText.length === 0) {
                setFilterKey(k => k + 1);
            }
        }, 400);
        return () => clearTimeout(t);
    }, [searchText]);

    const resetFilters = useCallback(() => {
        setSelectedType('Todos');
        setSelectedCategory(null);
        setSelectedLocation(null);
        setMainBreedGroup(null);
        setSelectedBreed(null);
        // Don't reset searchText — keep the search alive
    }, []);

    const applyFilter = useCallback((filterType: 'main' | 'advanced', key: string, value: any) => {
        if (filterType === 'main') {
            // Don't re-apply if already selected
            if (value === selectedType) return;
            setSelectedType(value);
            if (value !== 'Todos') {
                setSearchText('');
                setSelectedCategory(null);
                setSelectedLocation(null);
                setSelectedBreed(null);
                setMainBreedGroup(null);
            }
        } else {
            setSelectedType('Todos');
            setSearchText('');
            if (key === 'cat') {
                // Toggle off if same
                setSelectedCategory(prev => prev === value ? null : value);
            }
            if (key === 'loc') {
                setSelectedLocation(prev => prev === value ? null : value);
            }
            if (key === 'breed') {
                setSelectedBreed(prev => prev === value ? null : value);
            }
        }
        setFilterKey(k => k + 1);
    }, [selectedType]);

    // hasActiveFilters: only true for category/location/breed (not Todos/type)
    const hasActiveFilters = useMemo(
        () => !!selectedCategory || !!selectedLocation || !!selectedBreed,
        [selectedCategory, selectedLocation, selectedBreed]
    );

    const filteredData = useMemo(() => {
        const s = debouncedSearch.toLowerCase().trim();
        const tc = clean(selectedType);
        return MARKET_DATA.filter(item => {
            if (s && !item.title.toLowerCase().includes(s)) return false;
            if (selectedType !== 'Todos' && clean(item.type) !== tc) return false;
            if (selectedCategory && item.category !== selectedCategory) return false;
            if (selectedBreed && item.breed !== selectedBreed) return false;
            if (selectedLocation && item.location !== selectedLocation) return false;
            return true;
        });
    }, [debouncedSearch, selectedType, selectedCategory, selectedBreed, selectedLocation]);

    const { width } = useWindowDimensions();
    const isDesktop = width > 768;

    // ─── Logo / Top header ──────────────────────────────────────────────────────
    const LogoHeader = useCallback(() => (
        <View style={[styles.headerRow, {
            backgroundColor: colors.backgroundColor,
            paddingVertical: isDesktop ? 14 : 8, // smaller on mobile
        }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={[styles.logoIconWrap, { width: isDesktop ? 44 : 36, height: isDesktop ? 44 : 36, borderRadius: isDesktop ? 13 : 10 }]}>
                    <MaterialIcons name="agriculture" size={isDesktop ? 26 : 20} color="#fff" />
                </View>
                <View>
                    <Text style={[styles.title, { fontSize: isDesktop ? 22 : 18 }]}>AgroMarket</Text>
                    <Text style={styles.rate}>1$ = {Number(BCV_RATE).toFixed(2)} Bs. · BCV</Text>
                </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity style={styles.iconButton}>
                    <MaterialIcons name="notifications" size={isDesktop ? 22 : 20} color={colors.brand} />
                    <View style={styles.notificationDot} />
                </TouchableOpacity>
            </View>
        </View>
    ), [isDesktop, colors, styles]);

    // ─── Sticky search bar (no BlurView) ───────────────────────────────────────
    const SearchBar = useCallback(() => (
        <View style={[styles.searchBlurWrap, { backgroundColor: colors.backgroundColor }]}>
            <View style={[styles.searchRow, { paddingHorizontal: 16 }]}>
                <View style={styles.searchBar}>
                    <MaterialIcons name="search" size={20} color={colors.mutedText} />
                    <TextInput
                        style={{ flex: 1, marginLeft: 10, color: colors.textColor, fontSize: 15 }}
                        placeholder="Buscar ganado, raza, categoría..."
                        placeholderTextColor={colors.placeholderColor}
                        value={searchText}
                        onChangeText={setSearchText}
                        // On focus: reset advanced filters only, NOT the search text
                        onFocus={() => {
                            setSelectedCategory(null);
                            setSelectedLocation(null);
                            setSelectedBreed(null);
                            setMainBreedGroup(null);
                            // Keep selectedType — or reset it too
                            setSelectedType('Todos');
                        }}
                        returnKeyType="search"
                    />
                    {searchText.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchText('')}>
                            <MaterialIcons name="close" size={18} color={colors.mutedText} />
                        </TouchableOpacity>
                    )}
                </View>
                {!isDesktop && (
                    <TouchableOpacity style={styles.filterButton} onPress={() => setIsModalVisible(true)}>
                        <MaterialIcons name="tune" size={22} color="#fff" />
                        {hasActiveFilters && <View style={styles.filterActiveDot} />}
                    </TouchableOpacity>
                )}
            </View>

            {/* Type chips row */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 10, gap: 8 }}
            >
                {FILTERS.TYPES.map(type => {
                    const isSelected = selectedType === type;
                    return (
                        <TouchableOpacity
                            key={type}
                            onPress={() => applyFilter('main', 'type', type)}
                            disabled={isSelected}
                            style={[
                                styles.typeButton,
                                isSelected && { backgroundColor: colors.brand, borderColor: colors.brand },
                            ]}
                            activeOpacity={isSelected ? 1 : 0.7}
                        >
                            <Text style={{ color: isSelected ? '#fff' : colors.mutedText, fontWeight: '600', fontSize: 13 }}>
                                {type}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    ), [searchText, selectedType, hasActiveFilters, colors, styles, isDesktop, applyFilter]);

    // ─── Results header bar ─────────────────────────────────────────────────────
    const ResultsBar = useCallback(() => (
        <View style={styles.resultsBar}>
            <Text style={styles.resultsCount}>
                <Text style={{ color: colors.brand, fontWeight: '800' }}>{filteredData.length}</Text>
                {' '}lotes disponibles
            </Text>
            {/* Only show "Limpiar filtros" when category/location/breed are active, not for type */}
            {hasActiveFilters && (
                <TouchableOpacity onPress={resetFilters} style={styles.clearFiltersBtn}>
                    <MaterialIcons name="close" size={12} color={colors.brand} />
                    <Text style={styles.clearFiltersText}>Limpiar filtros</Text>
                </TouchableOpacity>
            )}
        </View>
    ), [filteredData.length, hasActiveFilters, colors, styles, resetFilters]);

    // ─── Render item with animation keyed by filterKey ─────────────────────────
    const renderMobileItem = useCallback(({ item, index }: { item: any; index: number }) => (
        <AnimatedCard key={`${filterKey}-${item.id}`} item={item} index={index} />
    ), [filterKey]);

    const renderDesktopItem = useCallback(({ item, index }: { item: any; index: number }) => (
        <AnimatedCardDesktop key={`${filterKey}-${item.id}`} item={item} index={index} />
    ), [filterKey]);

    // ─── DESKTOP LAYOUT ────────────────────────────────────────────────────────
    if (isDesktop) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={{ maxWidth: 1440, alignSelf: 'center', width: '100%' }}>
                    {/*<LogoHeader />*/}
                    {SearchBar()}
                </View>

                <View style={{ flex: 1, flexDirection: 'row', maxWidth: 1440, alignSelf: 'center', width: '100%' }}>
                    <DesktopFilterSidebar
                        selectedType={selectedType} onSelectType={(t) => applyFilter('main', 'type', t)}
                        selectedCategory={selectedCategory} onSelectCategory={(c) => applyFilter('advanced', 'cat', c!)}
                        selectedLocation={selectedLocation} onSelectLocation={(l) => applyFilter('advanced', 'loc', l!)}
                        selectedBreed={selectedBreed} onSelectBreed={(b) => applyFilter('advanced', 'breed', b!)}
                        mainBreedGroup={mainBreedGroup} setMainBreedGroup={setMainBreedGroup}
                        onReset={resetFilters} hasActiveFilters={hasActiveFilters}
                        colors={colors} styles={styles}
                    />

                    <View style={{ flex: 1 }}>
                        <ResultsBar />
                        <FlatList
                            data={filteredData}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderDesktopItem}
                            key={`desktop-3-${filterKey}`}
                            numColumns={3}
                            columnWrapperStyle={{ gap: 16, paddingHorizontal: 16 }}
                            contentContainerStyle={{ paddingBottom: 80, paddingTop: 4 }}
                            initialNumToRender={9}
                            showsVerticalScrollIndicator={false}
                            removeClippedSubviews={true}
                            maxToRenderPerBatch={isDesktop ? 6 : 4}
                            updateCellsBatchingPeriod={100}
                            windowSize={5}
                            getItemLayout={(data, index) => ({
                                length: 355,
                                offset: 355 * index,
                                index,
                            })}
                            ListEmptyComponent={
                                <View style={styles.emptyState}>
                                    <MaterialIcons name="search-off" size={48} color={colors.mutedText} />
                                    <Text style={styles.emptyText}>No se encontraron resultados.</Text>
                                    <TouchableOpacity onPress={resetFilters} style={styles.emptyReset}>
                                        <Text style={{ color: colors.brand, fontWeight: '700' }}>Limpiar filtros</Text>
                                    </TouchableOpacity>
                                </View>
                            }
                        />
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    // ─── MOBILE LAYOUT ─────────────────────────────────────────────────────────
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <LogoHeader />

            <FlatList
                data={filteredData}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderMobileItem}
                stickyHeaderIndices={[0]}
                ListHeaderComponent={SearchBar()}
                key={`mobile-1-${filterKey}`}
                numColumns={1}
                contentContainerStyle={{ paddingBottom: 100 }}
                initialNumToRender={6}
                maxToRenderPerBatch={4}
                windowSize={4}
                updateCellsBatchingPeriod={60}
                removeClippedSubviews
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <MaterialIcons name="search-off" size={48} color={colors.mutedText} />
                        <Text style={styles.emptyText}>No se encontraron resultados.</Text>
                    </View>
                }
            />

            {/* Mobile filter modal */}
            {isModalVisible && (
                <Modal visible animationType="slide" transparent onRequestClose={() => setIsModalVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <View>
                                    <Text style={styles.modalTitle}>Filtros Avanzados</Text>
                                    {hasActiveFilters && (
                                        <TouchableOpacity onPress={resetFilters} style={{ marginTop: 4 }}>
                                            <Text style={{ color: '#ef4444', fontWeight: '600', fontSize: 13 }}>Limpiar todos</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                                <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.iconButton}>
                                    <MaterialIcons name="close" size={24} color={colors.textColor} />
                                </TouchableOpacity>
                            </View>

                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={{ paddingBottom: 20, gap: 20 }}>
                                    <View>
                                        <Text style={styles.sectionTitle}>Categoría</Text>
                                        <View style={styles.wrapContainer}>
                                            {FILTERS.CATEGORIES.map(cat => (
                                                <TouchableOpacity
                                                    key={cat}
                                                    onPress={() => applyFilter('advanced', 'cat', cat)}
                                                    style={[styles.chip, selectedCategory === cat && styles.activeChip]}
                                                >
                                                    <Text style={{ color: selectedCategory === cat ? colors.brand : colors.mutedText }}>
                                                        {cat}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>

                                    <View>
                                        <Text style={styles.sectionTitle}>Raza</Text>
                                        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
                                            {(Object.keys(FILTERS.BREEDS) as BreedGroup[]).filter(Boolean).map(g => (
                                                <TouchableOpacity
                                                    key={g!}
                                                    onPress={() => { setMainBreedGroup(mainBreedGroup === g ? null : g); setSelectedBreed(null); }}
                                                    style={[styles.groupBtn, mainBreedGroup === g && styles.activeGroup]}
                                                >
                                                    <Text style={{ color: mainBreedGroup === g ? colors.brand : colors.mutedText }}>{g}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                        {mainBreedGroup && (
                                            <View style={styles.wrapContainer}>
                                                {FILTERS.BREEDS[mainBreedGroup as keyof typeof FILTERS.BREEDS].map(breed => (
                                                    <TouchableOpacity
                                                        key={breed}
                                                        onPress={() => applyFilter('advanced', 'breed', breed)}
                                                        style={[styles.breedChip, selectedBreed === breed && { backgroundColor: colors.brand }]}
                                                    >
                                                        <Text style={{ color: selectedBreed === breed ? '#fff' : colors.brand }}>{breed}</Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        )}
                                    </View>

                                    <View>
                                        <Text style={styles.sectionTitle}>Ubicación</Text>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                                            {FILTERS.LOCATIONS.map(loc => (
                                                <TouchableOpacity
                                                    key={loc}
                                                    onPress={() => applyFilter('advanced', 'loc', loc)}
                                                    style={[styles.chip, selectedLocation === loc && styles.activeChip]}
                                                >
                                                    <Text style={{ color: selectedLocation === loc ? colors.brand : colors.mutedText }}>
                                                        {loc}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    </View>
                                </View>
                            </ScrollView>

                            <TouchableOpacity style={styles.applyButton} onPress={() => setIsModalVisible(false)}>
                                <Text style={styles.applyButtonText}>
                                    Ver {filteredData.length} resultados
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
        </SafeAreaView>
    );
};

export default MarketScreen;
