import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Task = (props) => {

    const [completed, setCompleted] = useState(false);

    const handleCompleteTask = () => {
        setCompleted(!completed);
    };

    const styles = StyleSheet.create({
        item:{
            backgroundColor: completed ? '#d3d3d3' : '#fff',
            padding:20,
            width:"95%",
            borderRadius:10,
            flexDirection:"row",
            alignItems:"center",
            justifyContent:"space-between",
            marginBottom:20
        },
        itemLeft:{
            flexDirection:"row",
            alignItems:"center",
            flexWrap:"wrap"
        },
        square:{
            width:24,
            height:24,
            borderRadius:5,
            backgroundColor:"#b5d4ff",
            marginRight:15,
        },
        tick: {
            color: completed ? '#007BFF' : 'transparent', 
            fontSize: 18,
            fontWeight: 'bold',
            marginLeft:3
        },
        text:{
            textDecorationLine: completed ? 'line-through' : 'none', // Add strikethrough effect
            color: completed ? '#a9a9a9' : 'black',
            maxWidth:"80%"
        },
        xwrap:{
            width:19,
            height:19,
            backgroundColor:"#f06767",
            borderRadius:20,
            display:"flex",
            alignItems:"center",
            justifyContent:"center"
        },
        x:{
            fontSize: 15,
            fontWeight:"bold",
            color:"#fff",
            position:"absolute",
            top:0
        },
    })

  return (
    <View style={styles.item}>
        <TouchableOpacity onPress={handleCompleteTask}>
            <View style={styles.itemLeft}>
                <View style={styles.square}>
                    <Text style={styles.tick}>✓</Text>
                </View>
                <Text style={styles.text}>{props.text}</Text>
            </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={props.deleteTask}>
            <View style={styles.xwrap}>
                <Text style={styles.x}>x</Text>
            </View>
        </TouchableOpacity>
    </View>
  )
}

export default Task;
