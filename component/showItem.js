import React, { Component } from "react";
import {
    Alert,
    Modal,
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
    ActivityIndicator
} from "react-native";
import { Divider } from "react-native-elements";

class showItem extends Component {
    state = {
        modalVisible: false,
        item_id: '',
        item_data: [],
        isLoading: false
    };

    setModalVisible = async (visible) => {
        this.setState({ isLoading: true, modalVisible: visible, item_id: await this.props.id });
        this.showItem();
    }

    showItem = async () => {
        fetch('http://skyably.com/paywithbuddy/Api/show-item.php', {
            method: 'post',
            header: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({

                item_id: this.state.item_id,

            })

        })
            .then((response) => response.json())
            .then((responseJson) => {

                this.setState({ item_data: responseJson, isLoading: false });

            })
            .catch((error) => {
                //  console.error(error);
            });
    }

    render() {
        const { modalVisible } = this.state;
        return (
            <View style={styles.centeredView}>
                <Modal
                    animationType="none"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        this.setModalVisible(!modalVisible)
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            {this.state.isLoading ? (
                                <View style={{ borderBottomColor: "#cecece", borderStyle: "dashed", padding: 50 }}>
                                    <Text style={styles.modalText}><ActivityIndicator size="small" color="#0000ff" /></Text>
                                </View>
                            ) : (
                                    <View style={{ padding: 15, width: "90%" }}>
                                        <View>
                                            <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center", color: "#68798f", paddingBottom: 8 }}>Item Details</Text>
                                        </View>
                                        {/* <Divider /> */}
                                        <View style={{ borderBottomColor: "#cecece", borderStyle: "dashed", borderBottomWidth: 1, paddingVertical: 10 }}>
                                            <Text style={styles.modalText}><Text style={{ fontSize: 14, color: "grey", fontWeight: "bold" }}>Bought By: </Text> {this.state.item_data.name}</Text>
                                        </View>
                                        <View style={{ borderBottomColor: "#cecece", borderStyle: "dashed", borderBottomWidth: 1, paddingVertical: 10 }}>
                                            <Text style={styles.modalText}><Text style={{ fontSize: 14, color: "grey", fontWeight: "bold" }}>Item Name: </Text> {this.state.item_data.item}</Text>
                                        </View>
                                        <View style={{ borderBottomColor: "#cecece", borderStyle: "dashed", borderBottomWidth: 1, paddingVertical: 10 }}>
                                            <Text style={styles.modalText}><Text style={{ fontSize: 14, color: "grey", fontWeight: "bold" }}>Item Price: </Text> ₹ {this.state.item_data.price}</Text>
                                        </View>
                                        <View style={{ borderBottomColor: "#cecece", borderStyle: "dashed", borderBottomWidth: 1, paddingVertical: 10 }}>
                                            <Text style={styles.modalText}><Text style={{ fontSize: 14, color: "grey", fontWeight: "bold" }}>Day: </Text> {this.state.item_data.day}</Text>
                                        </View>
                                        <View style={{ borderBottomColor: "#cecece", borderStyle: "dashed", borderBottomWidth: 1, paddingVertical: 10 }}>
                                            <Text style={styles.modalText}><Text style={{ fontSize: 14, color: "grey", fontWeight: "bold" }}>Date: </Text> {this.state.item_data.date}</Text>
                                        </View>
                                        <View style={{ paddingVertical: 10 }}>
                                            <Text style={styles.modalText}><Text style={{ fontSize: 14, color: "grey", fontWeight: "bold" }}>Time: </Text> {this.state.item_data.time}</Text>
                                        </View>
                                    </View>
                                )}


                            <TouchableHighlight
                                style={{ ...styles.openButton, backgroundColor: "#0b37d9" }}
                                onPress={() => {
                                    this.setModalVisible(!modalVisible);
                                }}
                            >
                                <Text style={styles.textStyle}>Close</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 5,
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
        backgroundColor: "#0b37d9",
        padding: 15,
        elevation: 2,
        width: "100%",
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5
    },
    textStyle: {
        color: "white",
        textAlign: "center"
    },
    modalText: {
        width: "100%",
        marginBottom: 1,
    }
});

export default showItem;