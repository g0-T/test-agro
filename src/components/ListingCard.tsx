import React, { memo, useMemo } from 'react';
import { View, Text, Image, TouchableOpacity, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import type { MarketItem } from '@/data/mockData';
import { BCV_RATE } from '@/utils/currency';
import { getCardStyles } from '@/styles/listingCard.styles';

interface ListingCardProps {
  item: MarketItem;
}

const ListingCardComponent = ({ item }: ListingCardProps) => {
  const theme = useColorScheme();
  const { styles, colors } = useMemo(() => getCardStyles(theme), [theme]);
  const router = useRouter();

  const priceInBs = useMemo(() => (item.price * BCV_RATE).toFixed(2), [item.price]);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => router.push({ pathname: '/(tabs)/ListingCard', params: { id: String(item.id) } })}
      style={styles.card}
    >
      <View>
        <Image
          source={{ uri: item.img }}
          style={styles.image}
          resizeMode="cover"
          fadeDuration={300}
        />
        <View style={styles.badgeContainer}>
          {item.verified && (
            <View style={styles.verifiedBadge}>
              <MaterialIcons name="verified" size={12} color="#fff" />
              <Text style={styles.verifiedText}>VERIFICADO</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.rowBetween}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.location} numberOfLines={1}>{item.location}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.price}>${item.price}<Text style={styles.priceUnit}>/kg</Text></Text>
            <Text style={{ fontSize: 10, color: colors.mutedText }}>≈ {priceInBs} Bs.</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Peso Prom.</Text>
            <Text style={styles.statValue}>{item.weight}</Text>
          </View>
          <View style={[styles.statItem, styles.statBorder]}>
            <Text style={styles.statLabel}>Edad</Text>
            <Text style={styles.statValue}>{item.age}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Condición</Text>
            <Text style={[styles.statValue, { color: colors.brand }]}>{item.condition}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.submitBtn} activeOpacity={0.7}>
            <Text style={styles.submitBtnText}>OFERTAR</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ padding: 12, backgroundColor: colors.backgroundColor, borderRadius: 10 }}>
            <MaterialIcons name="share" size={20} color={colors.mutedText} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const arePropsEqual = (prev: ListingCardProps, next: ListingCardProps) => {
  return prev.item.id === next.item.id &&
    prev.item.price === next.item.price &&
    prev.item.verified === next.item.verified;
};

export const ListingCard = memo(ListingCardComponent, arePropsEqual);