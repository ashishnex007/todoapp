import React,{useState,useEffect} from "react";
import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
// import { SwipeListView } from 'react-native-swipe-list-view'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import Storage from 'react-native-storage';
import Modal from "react-native-modal";
import Task from './components/Task';

const storage = new Storage({
  size: 1000,
  storageBackend: AsyncStorage,
  defaultExpires: null,
  enableCache: true,
});


export default function App() {
  const [task, setTask] = useState('');
  const [taskItems, settaskItems] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalTask, setModalTask] = useState('');

  useEffect(() => {
    storage
      .load({
        key: 'tasks',
      })
      .then((tasks) => {
        settaskItems(tasks);
      })
      .catch((err) => {
        console.warn(err.message);
        // Handle errors, e.g., if there are no tasks in storage yet
      });
  }, []); 

  //modal
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  // to add a new task and handle the edits
  const handleTask = () => {
    Keyboard.dismiss();

    if (editingIndex !== null) {
      // If editingIndex is not null, update the existing task
      let itemsCopy = [...taskItems];
      itemsCopy[editingIndex] = { ...itemsCopy[editingIndex], text: modalTask };
      settaskItems(itemsCopy);
      setEditingIndex(null);
      toggleModal();
    } else {
      // If editingIndex is null, add a new task
      settaskItems([{ text: task, completed: false }, ...taskItems]);
      storage.save({
        key: 'tasks',
        data: taskItems,
      });
    }
    setTask('');
    setModalTask('');
  };

  // to delete a task
  const deleteTask = (index) => {
    settaskItems((prevItems) => {
      let itemsCopy = [...prevItems];
      itemsCopy.splice(index, 1);
      // Save the updated taskItems to storage
      storage.save({
        key: 'tasks',
        data: itemsCopy,
      });
      return itemsCopy;
    });
  };

  // edit a task
  const editTask = (index) => {
    setModalTask(taskItems[index].text);
    setEditingIndex(index);
    toggleModal();
  };

  return (
    <View style={styles.container}>
    <View style={styles.taskViewer}>
      <View style={styles.headWrap}>
        <Text style={styles.heading}>Nex Tasks</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.items}>
          {taskItems.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => editTask(index)}>
              <Task text={item.text} completed={item.completed} deleteTask={() => deleteTask(index)}/>
            </TouchableOpacity>
          ))}
      </View>
      </ScrollView>
    </View>

    <KeyboardAvoidingView behavior={Platform.OS==="android"?"height":"padding"} style={styles.writeTaskWrapper}>
      <TextInput style={styles.input} placeholder='Add your task...' value={task} onChangeText={text=> setTask(text)}/>
        <TouchableOpacity onPress={()=>handleTask()}>
            <View style={styles.addWrapper}>
                <Text style={styles.addButton}>+</Text>
            </View>
        </TouchableOpacity>
    </KeyboardAvoidingView>

    {/*Modal code*/}
    <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeading}>Edit Task</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Edit your task..."
            value={modalTask}
            onChangeText={(text) => setModalTask(text)}
          />
          <TouchableOpacity onPress={() => handleTask()}>
            <View style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Update</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop:90,
    flex: 1,
    backgroundColor: '#e8e9eb',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 150,
  },
  taskViewer:{
    paddingTop:25,
    paddingLeft:20
  },
  headWrap:{
    display:"flex",
    alignItems:"center",
    justifyContent:"center"
  },
  heading:{
    fontSize:25,
    fontWeight:"bold",
    fontFamily:"",
  },
  items:{
    marginTop:30,
  },
  writeTaskWrapper:{
    position:"absolute",
    bottom:40,
    width:"100%",
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
    paddingHorizontal:20
  },
  input:{
    backgroundColor:"#fff",
    width:"85%",
    paddingHorizontal:15,
    paddingVertical:10,
    borderRadius:30,
    borderColor:"#C0C0C0",
    borderWidth:1
  },
  addWrapper:{
    width:50,
    height:50,
    backgroundColor:"#fff",
    borderRadius:60,
    alignItems:"center",
    justifyContent:"center",
    borderColor:"#C0C0C0",
    borderWidth:1
  },
  addButton:{
    fontSize:40,
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  modalHeading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalInput: {
    backgroundColor: "#e8e9eb",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
