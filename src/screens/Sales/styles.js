import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF', },
  logoPlaceholder: {
    height: "100%",
    width: "100%",
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainLogoImage: {
    width: "100%",
    height: "100%",
  },

  // Header Styles
  headerBar: { height: hp('8%'), width: "100%", justifyContent: 'center', paddingHorizontal: wp('2.5%') },

  scrollContainer: { padding: wp('5%'), paddingBottom: hp('6%') },
  pageTitle: { fontSize: wp('5.5%'), fontWeight: 'bold', color: '#3b4bf8', marginBottom: hp('3%'), marginTop: hp('1.2%') },

  // Input Styles
  inputGroup: { marginBottom: hp('2.2%') },
  label: { fontSize: wp('3.8%'), fontWeight: '500', color: '#000', marginBottom: hp('1%') },
  input: { height: wp('12.5%'), borderWidth: 1, borderColor: '#CCC', borderRadius: 8, paddingHorizontal: wp('3%'), fontSize: wp('3.5%'), color: '#000' },
  placeholderColor: { color: '#999' },

  // Dropdown Styles
  dropdownInput: { height: wp('12.5%'), borderWidth: 1, borderColor: '#CCC', borderRadius: 8, paddingHorizontal: wp('3%'), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  inputText: { fontSize: wp('3.5%'), color: '#000' },

  // Map Input Styles
  mapInputContainer: { flexDirection: 'row', height: wp('12.5%'), borderWidth: 1, borderColor: '#CCC', borderRadius: 8, overflow: 'hidden' },
  mapInput: { flex: 1, paddingHorizontal: wp('3%'), fontSize: wp('3.5%'), color: '#000' },
  mapIconBox: { width: wp('12.5%'), justifyContent: 'center', alignItems: 'center', borderLeftWidth: 1, borderLeftColor: '#CCC' },

  // Upload Button
  uploadButton: { backgroundColor: '#5B5DFF', paddingVertical: hp('1.2%'), paddingHorizontal: wp('5%'), borderRadius: 6, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center' },
  uploadButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: wp('3.5%') },

  // Radio Button Styles
  radioGroup: { flexDirection: 'row', alignItems: 'center' },
  radioButtonContainer: { flexDirection: 'row', alignItems: 'center', marginRight: wp('5%') },
  radioCircle: { height: wp('5%'), width: wp('5%'), borderRadius: wp('2.5%'), borderWidth: 2, borderColor: '#555', alignItems: 'center', justifyContent: 'center', marginRight: wp('1.5%') },
  radioFill: { height: wp('2.5%'), width: wp('2.5%'), borderRadius: wp('1.25%'), backgroundColor: '#000' },
  radioLabel: { fontSize: wp('3.5%'), color: '#000' },

  // Mobile Input Styles (Reused logic)
  mobileContainer: { height: wp('12.5%'), borderWidth: 1, borderColor: '#CCC', borderRadius: 8, flexDirection: 'row', alignItems: 'center', overflow: 'hidden' },
  countryCode: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: wp('3%'), height: '100%', backgroundColor: '#F9F9F9' },
  countryText: { fontSize: wp('3.5%'), color: '#555', fontWeight: '500' },
  verticalDivider: { width: 1, height: '100%', backgroundColor: '#CCC' },
  phoneInput: { flex: 1, height: '100%', paddingHorizontal: wp('3%'), fontSize: wp('3.5%'), color: '#000' },

  // Submit Button
  submitButton: { height: wp('13.5%'), backgroundColor: '#5B75FF', borderRadius: wp('7%'), justifyContent: 'center', alignItems: 'center', marginTop: hp('3.5%'), elevation: 5 },
  submitButtonText: { color: '#FFF', fontSize: wp('4.5%'), fontWeight: 'bold', textTransform: 'uppercase' },

  // Modal Styles (Reused)
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { width: '80%', backgroundColor: '#FFF', borderRadius: 12, padding: wp('5%'), maxHeight: '50%' },
  modalTitle: { fontSize: wp('4.5%'), fontWeight: 'bold', marginBottom: hp('1.8%'), textAlign: 'center' },
  modalItem: { paddingVertical: hp('1.5%'), borderBottomWidth: 1, borderBottomColor: '#eee' },
  modalItemText: { fontSize: wp('4%'), textAlign: 'center', color: '#333' },
  closeButton: { marginTop: hp('1.8%'), backgroundColor: '#000', padding: wp('2.5%'), borderRadius: 8, alignItems: 'center' },
  closeButtonText: { color: '#FFF', fontWeight: 'bold' }
})

export default styles;