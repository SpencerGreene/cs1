import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LOG } from '../logConfig';

// Helper function to convert blob to base64 in React Native
export const BlobToSaveImage = (blob, contentType) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
            const imageData = reader.result.split(',')[1];
            resolve({ imageData, contentType });
        };
        reader.readAsDataURL(blob);
    });
};

export const savedImageToBlob = async (saveImage) => {
    LOG('os is', Platform.OS);
    if (Platform.OS === 'android') {
        return null;
    } else {
        try {
            const response = await fetch(`data:image/jpeg;base64,${saveImage.imageData}`);
            const blob = await response.blob();
            return blob;
        } catch (error) {
            console.error('Error converting base64 to blob:', error);
            throw error;
        }
    }
};

/*
// Function to save data to storage
export const saveData = async (key, data) => {
    try {
        if (Platform.OS === 'web') {
            // Handle image blob for web
            if (data instanceof Blob) {
                const blobUrl = URL.createObjectURL(data);
                localStorage.setItem(key, blobUrl);
            } else {
                localStorage.setItem(key, JSON.stringify(data));
            }
        } else {
            // Handle image blob for React Native
            if (data instanceof Blob) {
                // Convert blob to base64 string
                const base64String = await BlobToBase64(data);
                await AsyncStorage.setItem(key, base64String);
            } else {
                await AsyncStorage.setItem(key, JSON.stringify(data));
            }
        }
    } catch (error) {
        console.error('Error saving data:', error);
    }
};

// Function to retrieve data from storage
export const getData = async (key) => {
    try {
        if (Platform.OS === 'web') {
            const storedData = localStorage.getItem(key);
            // Check if it's a blob URL
            if (storedData && storedData.startsWith('blob:')) {
                return storedData;
            } else {
                return storedData ? JSON.parse(storedData) : null;
            }
        } else {
            const storedData = await AsyncStorage.getItem(key);
            return storedData ? JSON.parse(storedData) : null;
        }
    } catch (error) {
        console.error('Error retrieving data:', error);
        return null;
    }
};



// Function to delete data from storage
export const deleteData = async (key) => {
    try {
        if (Platform.OS === 'web') {
            // Handle cleanup for web (remove blob URL)
            const storedData = localStorage.getItem(key);
            if (storedData && storedData.startsWith('blob:')) {
                URL.revokeObjectURL(storedData);
            }
            localStorage.removeItem(key);
        } else {
            // Handle cleanup for React Native
            await AsyncStorage.removeItem(key);
        }
    } catch (error) {
        console.error('Error deleting data:', error);
    }
};

*/