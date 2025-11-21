import { useNavigation } from '@react-navigation/native';
import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Modal,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';


const OTPPopup = ({ visible, onClose, onVerify, mobile }) => {
    const Navigator = useNavigation();
    // 1. OTP State
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef([]);

    useEffect(() => {
        if (visible) {
            setOtp(['', '', '', '', '', '']);
        }
    }, [visible]);

    // Text Change Handler
    const handleChange = (text, index) => {
        if (!/^\d*$/.test(text)) return;

        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        // Auto Focus Next
        if (text.length !== 0 && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    // Backspace Handler
    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    // Verify Button Handler
    const handleVerifyPress = () => {
        const finalOtp = otp.join('');
        if (finalOtp.length < 6) {
            alert("Pura OTP daalo ustaad!");
            return;
        }
        onVerify(finalOtp);
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            {/* 1. Overlay (Background) - Click to Close */}
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={onClose}
            >
                {/* KeyboardAvoidingView taaki keyboard aane pe box upar khisak jaye */}
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.keyboardView}
                >
                    {/* 2. Content Box - Stop Propagation (Clicking here won't close modal) */}
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.popupContainer}>

                            {/* Title Section */}
                            <View style={styles.headerContainer}>
                                <Text style={styles.title}>Verify</Text>
                                <Text style={styles.subtitle}>
                                    Your OTP was sent to you via Phone Number {mobile ? `(+91 ${mobile})` : ''}
                                </Text>
                            </View>

                            {/* OTP Inputs Section */}
                            <View style={styles.otpContainer}>
                                {otp.map((digit, index) => (
                                    <TextInput
                                        key={index}
                                        ref={(ref) => (inputRefs.current[index] = ref)}
                                        style={[
                                            styles.otpBox,
                                            { borderColor: digit ? '#5B75FF' : '#CCC' }
                                        ]}
                                        keyboardType="number-pad"
                                        maxLength={1}
                                        value={digit}
                                        onChangeText={(text) => handleChange(text, index)}
                                        onKeyPress={(e) => handleKeyPress(e, index)}
                                        textAlign="center"
                                    />
                                ))}
                            </View>

                            {/* Verify Button */}
                            <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyPress}>
                                <Text style={styles.verifyButtonText}>Verify</Text>
                            </TouchableOpacity>

                            {/* Resend Text */}
                            <View style={styles.footer}>
                                <Text style={styles.footerText}>Did'nt receive OTP? </Text>
                                <TouchableOpacity>
                                    <Text style={styles.linkText}>Request again</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    // Overlay: 
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },
    keyboardView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // White Popup Box
    popupContainer: {
        width: '90%',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        paddingHorizontal: 10,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 30,
    },
    otpBox: {
        width: 40,
        height: 45,
        borderWidth: 1.5,
        borderRadius: 8,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        backgroundColor: '#fff',
    },
    verifyButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#5B75FF',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    verifyButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        marginTop: 5,
    },
    footerText: {
        fontSize: 14,
        color: '#666',
    },
    linkText: {
        fontSize: 14,
        color: '#5B75FF',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
});

export default OTPPopup;