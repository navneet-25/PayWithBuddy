import React, { Component } from "react";
import { IconButton, TextInput } from 'react-native-paper';
import { Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FontAwesome, MaterialIcons, Entypo } from '@expo/vector-icons';
import {
    Alert,
    Modal,
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
    ActivityIndicator
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';


class AddItems extends Component {
    state = {
        modalVisible: false,
        name: '',
        customer_id: null,
        customer_name: null,
        isLoading: false
    };

    async componentDidMount() {
        this.setState({ customer_id: await AsyncStorage.getItem("user_id"), customer_name: await AsyncStorage.getItem("user_name") });
    }

    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    }

    addDairy = () => {

        if (this.state.name !== "") {
            this.setState({ isLoading: true });
            fetch(`http://skyably.com/paywithbuddy/Api/add-diary.php`, {
                method: 'post',
                header: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({

                    name: this.state.name,
                    customer_id: this.state.customer_id,
                    user_name: this.state.customer_name

                })


            }).then((response) => response.json())
                .then((responseJson) => {

                    console.log(responseJson);


                    if (responseJson.added) {

                        this.setState({ modalVisible: false, name: "", isLoading: false });
                        this.props.loadit();

                    } else {
                        console.log(responseJson);
                    }

                })
                .catch((error) => {
                    console.error(error);

                });
        }

    }

    render() {
        const { modalVisible } = this.state;
        return (
            <View>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        this.setState({ isLoading: false });
                        this.setModalVisible(!modalVisible);
                    }}

                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>

                            <Entypo
                                name="cross"
                                size={20}
                                onPress={() => {
                                    this.setState({ isLoading: false });
                                    this.setModalVisible(!modalVisible);
                                }}
                                style={styles.cross}
                            />

                            <Input
                                label="Name"
                                placeholder=''
                                style={{ fontSize: 14 }}
                                onChangeText={(e) => this.setState({ name: e })}
                            />

                            <TouchableHighlight
                                style={{ ...styles.openButton, backgroundColor: "#fa8072" }}
                                onPress={() => {
                                    this.addDairy();
                                }}
                            >
                                {this.state.isLoading ? (
                                    <Text style={styles.textStyle}><ActivityIndicator size={12} style={{ paddingRight: 10 }} color="#fff" animating={this.state.isLoading} />  CREATE DAIRY</Text>
                                ) : (
                                        <Text style={styles.textStyle}>CREATE DAIRY</Text>
                                    )}
                            </TouchableHighlight>

                        </View>
                    </View>
                </Modal>
                {/* <IconButton
                    style={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        backgroundColor: '#ff6347',
                        position: 'absolute',
                        bottom: 25,
                        right: 20,
                        elevation: 5,
                    }}
                    icon="plus"
                    color="#fcfcfc"
                    size={38}
                    rippleColor="rgba(0, 0, 0, .11)"
                    onPress={() => this.setModalVisible(true)}
                /> */}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(52, 52, 52, 0.8)",
    },
    modalView: {
        opacity: 1,
        margin: 20,
        backgroundColor: "white",
        borderRadius: 5,
        padding: 30,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: "80%"
    },
    openButton: {
        backgroundColor: "#9400d3",
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        elevation: 4,
    },
    textStyle: {
        color: "#fff"
    },
    cross: {
        position: "absolute",
        top: 10,
        right: 18,
        fontSize: 15,
        padding: 5,
    }
});

export default AddItems;