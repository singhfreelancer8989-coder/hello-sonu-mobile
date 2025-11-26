import { StyleSheet } from "react-native";

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
  headerBar: { height: 100, width: "100%", justifyContent: 'center', paddingHorizontal: 10 },

  scrollContainer: { padding: 20, paddingBottom: 50 },
  pageTitle: { fontSize: 22, fontWeight: 'bold', color: '#3b4bf8', marginBottom: 25, marginTop: 10 },

  // Input Styles
  inputGroup: { marginBottom: 18 },
  label: { fontSize: 15, fontWeight: '500', color: '#000', marginBottom: 8 },
  input: { height: 50, borderWidth: 1, borderColor: '#CCC', borderRadius: 8, paddingHorizontal: 12, fontSize: 14, color: '#000' },
  placeholderColor: { color: '#999' },

  // Dropdown Styles
  dropdownInput: { height: 50, borderWidth: 1, borderColor: '#CCC', borderRadius: 8, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  inputText: { fontSize: 14, color: '#000' },

  // Map Input Styles
  mapInputContainer: { flexDirection: 'row', height: 50, borderWidth: 1, borderColor: '#CCC', borderRadius: 8, overflow: 'hidden' },
  mapInput: { flex: 1, paddingHorizontal: 12, fontSize: 14, color: '#000' },
  mapIconBox: { width: 50, justifyContent: 'center', alignItems: 'center', borderLeftWidth: 1, borderLeftColor: '#CCC' },

  // Upload Button
  uploadButton: { backgroundColor: '#5B5DFF', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 6, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center' },
  uploadButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },

  // Radio Button Styles
  radioGroup: { flexDirection: 'row', alignItems: 'center' },
  radioButtonContainer: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
  radioCircle: { height: 20, width: 20, borderRadius: 10, borderWidth: 2, borderColor: '#555', alignItems: 'center', justifyContent: 'center', marginRight: 6 },
  radioFill: { height: 10, width: 10, borderRadius: 5, backgroundColor: '#000' },
  radioLabel: { fontSize: 14, color: '#000' },

  // Mobile Input Styles (Reused logic)
  mobileContainer: { height: 50, borderWidth: 1, borderColor: '#CCC', borderRadius: 8, flexDirection: 'row', alignItems: 'center', overflow: 'hidden' },
  countryCode: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, height: '100%', backgroundColor: '#F9F9F9' },
  countryText: { fontSize: 14, color: '#555', fontWeight: '500' },
  verticalDivider: { width: 1, height: '100%', backgroundColor: '#CCC' },
  phoneInput: { flex: 1, height: '100%', paddingHorizontal: 12, fontSize: 14, color: '#000' },

  // Submit Button
  submitButton: { height: 55, backgroundColor: '#5B75FF', borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginTop: 30, elevation: 5 },
  submitButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold', textTransform: 'uppercase' },

  // Modal Styles (Reused)
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { width: '80%', backgroundColor: '#FFF', borderRadius: 12, padding: 20, maxHeight: '50%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  modalItem: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  modalItemText: { fontSize: 16, textAlign: 'center', color: '#333' },
  closeButton: { marginTop: 15, backgroundColor: '#000', padding: 10, borderRadius: 8, alignItems: 'center' },
  closeButtonText: { color: '#FFF', fontWeight: 'bold' }
})

export default styles;