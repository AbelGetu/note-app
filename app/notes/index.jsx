import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput } from "react-native";
import NoteList from "../../components/NoteList";
import AddNoteModal from "../../components/AddNoteModal";

const NoteScreen = () => {
    const [notes, setNotes] = useState([
        {id: '1', text: 'Note One'},
        {id: '2', text: 'Note Two'},
        {id: '3', text: 'Note Three'}
    ]);
    const [modalVisible, setModalVisible] = useState(false);
    const [newNote, setNewNote] = useState('')

    // Add new note
    const addNote = () => {
        if(newNote.trim() === '') return;
        setNotes((prevNotes) => [
            ...prevNotes,
            {id: Date.now.toString(), text: newNote}
        ])

        setNewNote('');
        setModalVisible(false);
    }
  return (
    <View style={styles.container}>
        <NoteList notes={notes}/>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.addButtonText}>+ Add Note</Text>
        </TouchableOpacity>

        <AddNoteModal modalVisible={modalVisible} addNote={addNote} newNote={newNote} setModalVisible={setModalVisible} setNewNote={setNewNote} />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff'
    },    
    addButton: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center'
    },
    addButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold'
    }
})

export default NoteScreen;