import React, { useState, useContext } from 'react';
import {
    StyleSheet, View, Image, Text, Platform,
    Modal, Pressable,
} from 'react-native';

import { AuthContext } from '../components/AuthProvider';
import Styles from '../styles/Styles';
import { PHASES } from '../config';

export default function Header({ gameState }) {
    const { userInfo, logout } = useContext(AuthContext);
    const [isModalVisible, setModalVisible] = useState(false);

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

    const renderProfileContent = () => {
        const { profileImage } = userInfo;

        if (profileImage) {
            return (
                <Image
                    source={{ uri: profileImage }}
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

    return (
        <View style={styles.headerContainer}>
            <Text style={styles.phaseTitle}>
                {gameState.phase.display}
            </Text>
            {gameState.phase === PHASES.select && profileButton}
            {gameState.phase === PHASES.select && profileMenu}
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        minWidth: '100%',
        height: 70,
        paddingHorizontal: 20,
        alignItems: 'flex-start',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    profileContainer: {
        alignSelf: 'flex-end',
    },
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
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'lightgray', // Add a background color for the circle
        justifyContent: 'center',
        alignItems: 'center',
    },
    initialsText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white', // Set the text color
    },
});
