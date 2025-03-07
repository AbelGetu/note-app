import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert, ActivityIndicator } from "react-native";
import NoteList from "../../components/NoteList";
import AddNoteModal from "../../components/AddNoteModal";
import noteService from "../../services/noteService";
import { useRouter } from "expo-router";
import { useAuth } from '../../contexts/AuthContext';

const NoteScreen = () => {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();

    const [notes, setNotes] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [newNote, setNewNote] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if(!user && !authLoading) {
            router.replace('/auth');
        }
    }, [user, authLoading]);

    useEffect(() => {
        if(user) {
            fetchNotes();
        }
    }, [user]);

    const fetchNotes = async () => {
        setLoading(true);
        const response = await noteService.getNotes(user.$id);
        if(response.error) {
            setError(response.error);
            Alert.alert('Error', response.error);
        } else {
            setNotes(response.data);
            setError(null);
        }
        setLoading(false);
    };

    // Add new note
    const addNote = async () => {
        if(newNote.trim() === '') return;
        
        const response = await noteService.addNote(user.$id, newNote);
        if(response.error) {
            Alert.alert('Error', response.error);
        } else {
            setNotes([...notes, response.data]);
        }

        setNewNote('');
        setModalVisible(false);
    };

    // Update note
    const editNote = async (id, text) => {
        if(text.trim() === '') {
            Alert.alert('Error', 'Note text cannot be empty');
            return;
        }
        const response = await noteService.updateNote(id, text);
        if(response.error) {
            Alert.alert('Error', response.error);
        } else {
            setNotes(notes.map(note => {
                if(note.$id === id) {
                    return {...note, text};
                }
                return note;
            }));
        }
    }

    // Delete note
    const deleteNote = async (id) => {
        Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
            {
                text: 'Cancel',
                style: 'cancel'
            },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    const response = await noteService.deleteNote(id);
                    if(response.error) {
                        Alert.alert('Error', response.error);
                    } else {
                        setNotes(notes.filter(note => note.$id !== id));
                    }
                }
            }
        ]);
    };

    return (
        <View style={styles.container}>
            { loading ? (
                <ActivityIndicator size={'large'} color={'#007bff'} />
            ) : (
               <>
                {error && <Text style={styles.errorText}>{error}</Text>}
                {notes.length === 0 ? (
                    <Text style={styles.noNotesText}> You have no notes</Text>
                ) : (
                    <NoteList notes={notes} onDelete={deleteNote} onEdit={editNote} />
                )}
                
               </> 
            ) }
            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.addButtonText}>+ Add Note</Text>
            </TouchableOpacity>

            <AddNoteModal modalVisible={modalVisible} addNote={addNote} newNote={newNote} setModalVisible={setModalVisible} setNewNote={setNewNote} />
        </View>
    );
};

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
    },
    errorText: {
        color: 'red', 
        textAlign: 'center',
        fontSize: 16, 
        marginBottom: 10,
    },
    noNotesText: {
        textAlign: 'center',
        fontSize: 18,
        color: '#555',
        marginTop: 15,
        fontWeight: 'bold'
    }
});

export default NoteScreen;