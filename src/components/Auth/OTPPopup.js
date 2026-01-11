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
    Keyboard,
    Alert
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { showErrorAlert } from '../../utility/error.utility';

const OTPPopup = ({ visible, onClose, onVerify, mobile }) => {
    const Navigator = useNavigation();

    // 1. OTP State
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const inputRefs = useRef([]);

    // Reset OTP and Timer when modal opens
    useEffect(() => {
        if (visible) {
            setOtp(['', '', '', '', '', '']);
            setTimer(30);
            setCanResend(false);
        }
    }, [visible]);

    // Timer Logic
    useEffect(() => {
        let interval;
        if (visible && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [visible, timer]);

    // Handle Resend
    const handleResend = () => {
        if (!canResend) return;
        setTimer(30);
        setCanResend(false);
        Alert.alert("Sent!", "OTP has been resent to your mobile number.");
        // Here you would typically trigger the API call to resend OTP
    };

    // Text Change Handler (Includes Paste Logic)
    const handleChange = (text, index) => {
        // Handle Paste (length == 6)
        if (text.length === 6 && /^\d+$/.test(text)) {
            const pastedOtp = text.split('');
            setOtp(pastedOtp);
            inputRefs.current[5]?.focus();
            return;
        }

        // Handle single digit input
        if (!/^\d*$/.test(text)) return;
        if (text.length > 1) return; // Prevent multi-char entry manually

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
            showErrorAlert("Invalid OTP", "Please enter the valid 6-digit OTP.");
            return;
        }
        onVerify(finalOtp);
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            {/* 1. Overlay (Background) - Click to Close */}
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={onClose}
            >
                {/* KeyboardAvoidingView for keyboard handling */}
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.keyboardView}
                >
                    {/* 2. Content Box - Stop Propagation */}
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
                                        maxLength={index === 0 ? 6 : 1} // Extend max length for first input to allow paste
                                        value={digit}
                                        onChangeText={(text) => handleChange(text, index)}
                                        onKeyPress={(e) => handleKeyPress(e, index)}
                                        textAlign="center"
                                        selectTextOnFocus={true} // Improve UX
                                        includeFontPadding={false}
                                        textAlignVertical="center"
                                    />
                                ))}
                            </View>

                            {/* Verify Button */}
                            <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyPress}>
                                <Text style={styles.verifyButtonText}>Verify</Text>
                            </TouchableOpacity>

                            {/* Resend Text */}
                            <View style={styles.footer}>
                                <Text style={styles.footerText}>Didn't receive OTP? </Text>
                                <TouchableOpacity onPress={handleResend} disabled={!canResend}>
                                    <Text style={[styles.linkText, !canResend && { color: '#999', textDecorationLine: 'none' }]}>
                                        {canResend ? "Request again" : `Resend in ${timer}s`}
                                    </Text>
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
        justifyContent: 'center', // Centered vertically now
        alignItems: 'center',
    },
    keyboardView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    // White Popup Box
    popupContainer: {
        width: wp('90%'),
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
        fontSize: wp('7%'),
        color: '#000',
        marginBottom: 10,
        fontFamily: 'Poppins-Bold',
    },
    subtitle: {
        fontSize: wp('3.5%'),
        color: '#666',
        textAlign: 'center',
        paddingHorizontal: 10,
        fontFamily: 'Poppins-Regular',
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 30,
    },
    otpBox: {
        width: wp('11%'),
        height: wp('12%'),
        borderWidth: 1.5,
        borderRadius: 8,
        fontSize: wp('5%'),
        color: '#000',
        backgroundColor: '#fff',
        fontFamily: 'Poppins-Medium',
        marginHorizontal: wp('0.5%'),
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0, // Ensure no padding affects centering
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
        fontSize: wp('4.5%'),
        fontFamily: 'Poppins-Medium',
    },
    footer: {
        flexDirection: 'row',
        marginTop: 5,
        alignItems: 'center',
    },
    footerText: {
        fontSize: wp('3.5%'),
        color: '#666',
        fontFamily: 'Poppins-Regular',
    },
    linkText: {
        fontSize: wp('3.5%'),
        color: '#5B75FF',
        textDecorationLine: 'underline',
        fontFamily: 'Poppins-Medium',
    },
});

export default OTPPopup;