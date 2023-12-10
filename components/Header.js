import React, { useState, useContext, useEffect } from 'react';
import {
    StyleSheet, View, Image, Text,
    Modal, Pressable,
} from 'react-native';

import { AuthContext } from '../components/AuthProvider';
import { LOG, INFO } from '../logConfig';

import AppColors from '../styles/AppColors';
import Styles from '../styles/Styles';
import { PHASES } from '../config';
import CountdownTimer from './CountdownTimer';

export default function Header({ gameState, maxGameTime, onTimeout }) {
    const { userInfo, logout } = useContext(AuthContext);
    const [isModalVisible, setModalVisible] = useState(false);
    const [profileUri, setProfileUri] = useState(null);

    const toggleModal = () => { setModalVisible(!isModalVisible); };
    const handleLogout = () => { setModalVisible(false); logout(); };
    const handleBackgroundPress = () => { if (isModalVisible) toggleModal(); }

    const getInitials = () => {
        const { firstName, lastName } = userInfo;
        if (firstName && lastName) {
            return `${firstName.charAt(0)}${lastName.charAt(0)}`;
        } else if (firstName) {
            return firstName.charAt(0);
        } else if (lastName) {
            return lastName.charAt(0);
        }
        return ''; // Return an empty string if no initials are available
    };

    useEffect(() => {
        const makeUri = async () => {
            const imageUri = URL.createObjectURL(userInfo.profileBlob);
            await setProfileUri(imageUri);
        };

        if (userInfo.profileBlob) makeUri();

        return () => { profileUri && URL.revokeObjectURL(profileUri); };    // clean up
    }, [userInfo]);

    const renderProfileContent = () => {
        const { profilePictureUrl, profileBlobUri } = userInfo;

        if (profileUri) {
            return (
                <Image
                    // source={{ uri: profilePictureUrl }}
                    source={{ uri: profileUri }}
                    style={styles.profileImage}
                />
            );
        } else {
            const initials = getInitials();
            return (
                <View style={styles.initialsContainer}>
                    <Text style={styles.initialsText}>{initials}</Text>
                </View>
            );
        }
    };

    const profileButton = (
        <Pressable onPress={toggleModal}
            style={({ pressed }) => [styles.profileContainer, pressed && styles.pressed]}
        >
            {renderProfileContent()}
        </Pressable>
    );

    const profileMenu = (
        <Modal
            animationType="none"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={toggleModal}
        >
            <Pressable onPress={handleBackgroundPress} style={styles.modalContainer}>
                <View style={Styles.dropdownContent}>
                    <Pressable style={Styles.dropdownItem} onPress={handleLogout}>
                        <Text>Logout</Text>
                    </Pressable>
                    {/* Add more items as needed */}
                </View>
            </Pressable>
        </Modal>
    );

    const headerSelect = (
        <View style={styles.headerContainer}>
            <View style={styles.phaseContainer}>
                <Image style={styles.logoImage} source={require('../assets/loginlogo.jpg')} />
            </View>
            {profileButton}
            {profileMenu}
        </View>
    );

    const headerGame = (
        <View style={styles.headerContainer}>
            <View style={styles.phaseContainer}>
                <Text style={styles.phaseTitle}>
                    {gameState.phase.display}
                </Text>
            </View>
            <View style={styles.teamContainer}>
                <Text
                    style={[
                        styles.teamLabel,
                        gameState.allianceColor === 'red' ? styles.alliance.red : null,
                        gameState.allianceColor === 'blue' ? styles.alliance.blue : null,
                    ]}>
                    {gameState.scoutTeamNumT}
                </Text>
            </View>
            <View style={styles.phaseContainer}>
                <CountdownTimer
                    initialTime={maxGameTime}
                    clockState={gameState.clockState}
                    timeoutTime={gameState.phase.endTime}
                    onTimeout={onTimeout}
                />
            </View>
        </View>
    );

    INFO({gameState});
    return gameState.phase === PHASES.select ? headerSelect : headerGame;
}

const styles = StyleSheet.create({
    // layout
    headerContainer: {
        minWidth: '100%',
        height: 70,
        paddingHorizontal: 20,
        alignItems: 'flex-start',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    phaseContainer: {
        flex: 6,
        minHeight: 40,
        alignSelf: 'center',
        justifyContent: 'center',

    },
    teamContainer: {
        // flex: 6,
        maxHeight: 45,
        minWidth: 80,
        alignSelf: 'center',
        justifyContent: 'center',

    },
    profileContainer: {
        flex: 1,
        alignSelf: 'center',
        alignItems: 'flex-end',
    },

    // logo top left
    logoImage: {
        width: 150,
        height: 40,
        alignSelf: 'flex-start',
        marginBottom: 0,
        marginTop: 0,
    },

    // phase top left
    phaseTitle: {
        fontSize: 19,
        color: AppColors.text,
        fontWeight: '700',
    },

    // team center
    teamLabel: {
        fontSize: 19,
        color: AppColors.medGray,
        fontWeight: '700',
        backgroundColor: AppColors.lightGray,
        borderRadius: 5,
        alignSelf: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    alliance: {
        blue: {
            backgroundColor: AppColors.frcBlue,
        },
        red: {
            backgroundColor: AppColors.frcRed,
        }
    },
    // clock right
    clockLabel: {
        fontSize: 19,
        color: AppColors.bodyText,
        fontWeight: '500',
        alignSelf: 'flex-end',
    },

    // profile top right
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    pressed: {
        opacity: 0.5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
    },
    initialsContainer: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: AppColors.lightGray, // Add a background color for the circle
        justifyContent: 'center',
        alignItems: 'center',
    },
    initialsText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white', // Set the text color
    },
});
