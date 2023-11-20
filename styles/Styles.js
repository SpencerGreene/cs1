import { StyleSheet } from 'react-native';
import AppColors from './AppColors';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColors.background,
        alignItems: 'left',
        justifyContent: 'center',
    },
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
        marginBottom: 2,
    },    
    bodyText: {
        fontSize: 15,
        color: AppColors.bodyText,
        lineHeight: 20
    },
    inputView: {
        width: "100%",
        height: 45,
        marginBottom: 20,
        alignItems: "left",
    },
    textInput: {
        height: 40,
        flex: 1,
        paddingHorizontal: 10,
        marginLeft: 0,
        borderWidth: 1,
        borderRadius: 5,
    }
});
