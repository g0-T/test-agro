import { StyleSheet, Platform } from 'react-native';
import { getThemeColors } from '@/constants/theme';

export const getCardStyles = (theme: any) => {
  const isDark = theme === 'dark';
  const colors = getThemeColors(isDark);

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.cardColor,
      borderRadius: 16,
      marginBottom: 16,
      marginHorizontal: 12,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.borderColor,
      ...Platform.select({
        android: { elevation: 3 },
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        web: { boxShadow: '0px 2px 8px rgba(0,0,0,0.1)' }
      })
    },
    image: {
      width: '100%',
      height: 180,
    },
    badgeContainer: {
      position: 'absolute',
      top: 10,
      left: 10,
      flexDirection: 'row',
      gap: 5,
    },
    verifiedBadge: {
      backgroundColor: colors.brand,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      flexDirection: 'row',
      alignItems: 'center',
    },
    verifiedText: {
      color: '#ffffff',
      fontSize: 10,
      fontWeight: 'bold',
      marginLeft: 4,
    },
    content: {
      padding: 16,
    },
    rowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    title: {
      color: colors.textColor,
      fontWeight: 'bold',
      fontSize: 17,
      marginBottom: 2,
    },
    location: {
      color: colors.mutedText,
      fontSize: 13,
    },
    price: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.textColor,
      textAlign: 'right',
    },
    priceUnit: {
      fontSize: 12,
      fontWeight: 'normal',
      color: colors.mutedText,
    },
    actions: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 15,
    },
    submitBtn: {
      flex: 1,
      backgroundColor: colors.brand,
      padding: 12,
      borderRadius: 10,
      alignItems: 'center',
    },
    submitBtnText: {
      color: '#ffffff',
      fontWeight: 'bold',
      fontSize: 14,
    },
    statsRow: {
      flexDirection: 'row',
      paddingVertical: 12,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: colors.borderColor,
      marginVertical: 12,
    },
    statItem: { flex: 1, alignItems: 'center' },
    statLabel: { fontSize: 9, fontWeight: 'bold', color: colors.mutedText, textTransform: 'uppercase' },
    statValue: { fontSize: 13, fontWeight: '600', color: colors.textColor },
    statBorder: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: colors.borderColor },
    headBadge: {
      position: 'absolute', top: 10, right: 10,
      backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4
    },
    headText: { color: '#fff', fontSize: 10, fontWeight: 'bold' }
  });
  return { styles, colors };
};