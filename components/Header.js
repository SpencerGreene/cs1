import { StyleSheet, View, Pressable, Text, Platform } from 'react-native';
import AppColors from '../styles/AppColors';

export default function Header() {
    return (
        <View style={styles.headerContainer}>
            <Text>Header! Your OS is {Platform.OS} </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        minWidth: '100%',
        height: 70,
        paddingHorizontal: 20,
        alignItems: 'left',
        justifyContent: 'center',
        backgroundColor: '#007800',
    },
})