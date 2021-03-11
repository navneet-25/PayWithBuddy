import React, { Component } from "react";
import { IconButton, TextInput } from 'react-native-paper';
import { Input } from 'react-native-elements';
import { ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FontAwesome, MaterialIcons, Entypo } from '@expo/vector-icons';
import {
    Alert,
    Modal,
    StyleSheet,
    Text,
    TouchableHighlight,
    View
} from "react-native";

class AddItems extends Component {
    state = {
        modalVisible: false,
        isLoading: false
    };

    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible, isLoading: false });
    }

    render() {
        const { modalVisible } = this.state;
        return (
            <View>
                <Modal
                    animationType="none"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        this.setModalVisible(!modalVisible);
                    }}

                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>

                            <Entypo
                                name="cross"
                                size={20}
                                onPress={() => {
                                    this.setModalVisible(!modalVisible);
                                }}
                                style={styles.cross}
                            />

                            <Input
                                label="Add Item"
                                placeholder='Ex: Milk, Atta...'
                                style={{ fontSize: 14 }}
                                leftIcon={
                                    <MaterialIcons
                                        style={{ marginRight: 5 }}
                                        name="playlist-add"
                                        size={20}
                                    />
                                }
                                onChangeText={this.props.itemName}
                            />

                            <Input
                                label="Price of an Item"
                                placeholder='Ex: 99, 200'
                                style={{ fontSize: 14 }}
                                leftIcon={
                                    <FontAwesome
                                        style={{ marginRight: 5 }}
                                        name="rupee"
                                        size={15}
                                    />
                                }
                                onChangeText={this.props.itemPrice}
                            />

                            <TouchableHighlight
                                style={{ ...styles.openButton, backgroundColor: "#0b37d9" }}
                                onPress={() => {
                                    this.props.additem();
                                    this.setState({ isLoading: true })
                                }}
                            >
                                {this.state.isLoading ? (
                                    <Text style={styles.textStyle}><ActivityIndicator size={12} style={{ paddingRight: 10 }} color="#fff" animating={this.state.isLoading} />  ADD ITEM</Text>
                                ) : (
                                        <Text style={styles.textStyle}>ADD ITEM</Text>
                                    )}
                            </TouchableHighlight>

                        </View>
                    </View>
                </Modal>
                <IconButton
                    style={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        backgroundColor: '#0b37d9',
                        position: 'absolute',
                        bottom: 25,
                        right: 20,
                        elevation: 5,
                    }}
                    icon="plus"
                    color="#fcfcfc"
                    size={35}
                    rippleColor="rgba(0, 0, 0, .11)"
                    onPress={() => this.setModalVisible(true)}
                />
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
        backgroundColor: "#F194FF",
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