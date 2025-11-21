import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  FlatList, 
  TextInput, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Assuming Expo or a similar icon library

// --- Dummy Data ---
const dummyMessages = [
  { id: '1', text: 'Hey, did you see the new listing for B-Farmhouse?', sender: 'me', time: '7:00 PM' },
  { id: '2', text: 'Yes, it looks amazing! Is the price negotiable?', sender: 'other', time: '7:01 PM' },
  { id: '3', text: 'I think so. I can check with the agent tomorrow.', sender: 'me', time: '7:05 PM' },
  { id: '4', text: 'Great! Let me know what you find out.', sender: 'other', time: '7:05 PM' },
];

// --- Components ---

// 1. Message Bubble Component
const MessageBubble = ({ message }) => {
  const isMe = message.sender === 'me';
  
  return (
    <View style={[
      styles.messageContainer,
      isMe ? styles.myMessageContainer : styles.otherMessageContainer
    ]}>
      <View style={[
        styles.bubble,
        isMe ? styles.myBubble : styles.otherBubble
      ]}>
        <Text style={[styles.messageText, isMe ? styles.myMessageText : styles.otherMessageText]}>
          {message.text}
        </Text>
        <Text style={styles.messageTime}>{message.time}</Text>
      </View>
    </View>
  );
};

// 2. Chat UI Screen
const AIChatScreen = () => {
  const [inputText, setInputText] = useState('');
  
  // Dummy send function
  const handleSend = () => {
    if (inputText.trim()) {
      console.log('Sending message:', inputText.trim());
      // In a real app, you would add the message to the state here
      setInputText(''); 
    }
  };

  return (
    <>
      {/* Header */}
      <View style={styles.header}>
        <MaterialIcons name="arrow-back" size={24} color="#007AFF" />
        <Text style={styles.headerTitle}>Agent Support</Text>
        <MaterialIcons name="more-vert" size={24} color="#007AFF" />
      </View>

      {/* Message List */}
      <FlatList
        data={dummyMessages}
        renderItem={({ item }) => <MessageBubble message={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messageList}
        inverted // To show the newest messages at the bottom
      />

      {/* Input Area (Uses KeyboardAvoidingView for smooth behavior) */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20} // Adjust as needed
        style={styles.inputArea}
      >
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#888"
          value={inputText}
          onChangeText={setInputText}
          multiline={true} // Allow multiple lines
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <MaterialIcons name="send" size={24} color="white" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
</>  );
};

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8', // Light background for the chat screen
  },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  
  // Message List Styles
  messageList: {
    paddingVertical: 10,
  },
  
  // Message Bubble Styles
  messageContainer: {
    marginVertical: 4,
    paddingHorizontal: 10,
    flexDirection: 'row',
  },
  myMessageContainer: {
    justifyContent: 'flex-end', // Align my messages to the right
  },
  otherMessageContainer: {
    justifyContent: 'flex-start', // Align other messages to the left
  },
  bubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 15,
    flexDirection: 'column',
  },
  myBubble: {
    backgroundColor: '#007AFF', // Blue color for my messages
    borderBottomRightRadius: 2, // Tweak for an iOS-like bubble tail effect
  },
  otherBubble: {
    backgroundColor: '#FFFFFF', // White color for others' messages
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  messageText: {
    fontSize: 15,
    marginBottom: 3,
  },
  myMessageText: {
    color: 'white',
  },
  otherMessageText: {
    color: '#333',
  },
  messageTime: {
    fontSize: 10,
    alignSelf: 'flex-end',
    color: '#C0C0C0', // Light gray time stamp
  },

  // Input Area Styles
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA',
  },
  input: {
    flex: 1,
    padding: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 20,
    maxHeight: 100, // Prevent it from getting too large with multiline
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AIChatScreen;