import { StyleSheet } from 'react-native';
import AppColors from './AppColors';

export default StyleSheet.create({
    mediumTitle: {
        fontSize: 23,
        color: AppColors.text,
        fontWeight: 700
    },
    column30: {
        paddingLeft: 30,
        paddingRight: 30,
    },
    groupLeft: {
        alignItems: 'left',
    },    
    groupCenter: {
        alignItems: 'center',
    },
    inputLabel: {
        fontSize: 13,
        fontWeight: 600,
        color: AppColors.bodyText,
    }
  });
