import { StyleSheet, StatusBar } from 'react-native';
import AppColors from './AppColors';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColors.background,
        // backgroundColor: '#780000',
        alignItems: 'left',
        marginTop: StatusBar.currentHeight || 0,
    },
    mediumTitle: {
        fontSize: 23,
        color: AppColors.text,
        fontWeight: '700'
    },
    column30: {
        paddingLeft: 30,
        paddingRight: 30,
        minWidth: "100%",
    },
    groupLeft: {
        alignItems: 'left',
    },
    groupCenter: {
        alignItems: 'center',
    },
    inputLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: AppColors.bodyText,
        marginBottom: 2,
    },
    bodyText: {
        fontSize: 15,
        color: AppColors.text,
        lineHeight: 20
    },
    inputView: {
        minWidth: "100%",
        height: 45,
        marginBottom: 20,
        alignItems: "left",
    },
    textInput: {
        height: 40,
        flex: 1,
        minWidth: "100%",
        paddingHorizontal: 10,
        marginLeft: 0,
        borderWidth: 1,
        borderRadius: 5,
    },
    scoutContainer: {
        minWidth: "100%",
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 30,
        paddingBottom: 30,
        minHeight: 480,
        flexDirection: 'column',
    },
    dropdownContent: {
        width: 150, // Adjust the width as needed
        marginTop: 70, // Adjust the marginTop to position it below the profile image
        marginRight: 20,
        backgroundColor: '#fff',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: AppColors.lightGray,
        overflow: 'hidden',
    },
    dropdownItem: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        width: '100%',
        alignItems: 'center',
    },
    metadataLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: AppColors.bodyText,
    },
});
