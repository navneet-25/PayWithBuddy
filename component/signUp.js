import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { Input, Divider, ListItem } from 'react-native-elements';
import { Snackbar } from 'react-native-paper';
import { Button } from 'react-native-elements';
import { Image } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default class Profile extends Component {

    constructor(props) {
        super(props);

        this.state = {
            snackbarVisible: false,
            snackbarMessage: '',
            snackbarCount: 0,
            userEmail: '',
            userPassword: '',
            userPhone: '',
            userName: '',
            isLoading: false,
            token: ''
        }
    }

    componentDidMount() {

        this.fetToken();

    }

    async fetToken() {
        const { status: existingStatus } = await Permissions.getAsync(
            Permissions.NOTIFICATIONS
        );
        let finalStatus = existingStatus;

        // only ask if permissions have not already been determined, because
        // iOS won't necessarily prompt the user a second time.
        if (existingStatus !== 'granted') {
            // Android remote notification permissions are granted during the app
            // install, so this will only ask on iOS
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
        }

        // Stop here if the user did not grant permissions
        if (finalStatus !== 'granted') {
            return;
        }

        // Get the token that uniquely identifies this device
        let token = await Notifications.getExpoPushTokenAsync();
        this.setState({ token: token.data });
        console.log(token.data);
    }

    creactAccount = () => {

        if (this.state.userName !== "" || this.state.userEmail !== "" || this.state.userPassword !== "" || this.state.userPhone !== "") {
            this.setState({ isLoading: true });

            fetch(`https://skyably.com/paywithbuddy/Api/SignUp.php`, {
                method: 'post',
                header: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({

                    name: this.state.userName,
                    email: this.state.userEmail,
                    phone: this.state.userPhone,
                    password: this.state.userPassword,
                    mobileToken: this.state.token

                })


            }).then((response) => response.json())
                .then((responseJson) => {

                    console.log("Result", responseJson);
                    this.setState({ isloading: false })
                    if (responseJson.signUp) {

                        fetch(`https://skyably.com/paywithbuddy/Api/fetchuser.php`, {
                            method: 'post',
                            header: {
                                'Accept': 'application/json',
                                'Content-type': 'application/json'
                            },
                            body: JSON.stringify({

                                email: this.state.userEmail

                            })


                        }).then((response) => response.json())
                            .then((responseJson) => {

                                AsyncStorage.setItem('Auth', 'logged');
                                AsyncStorage.setItem('email', responseJson.user_data[0].email);
                                AsyncStorage.setItem('user_id', responseJson.user_data[0].id);
                                AsyncStorage.setItem('user_name', responseJson.user_data[0].name);
                                this.setState({ isLoading: false });
                                this.props.navigation.navigate("First");

                            })
                            .catch((error) => {
                                console.error(error);

                            });

                    }
                    else if (responseJson.email_exist) {
                        this.setState({ isLoading: false });
                        Alert.alert('Email Exist!', "Email exist already please try with another one!");
                    }
                    else {
                        this.setState({ isLoading: false });
                        Alert.alert('Registration Failed');
                    }

                })
                .catch((error) => {
                    console.error(error);

                });
        } else {
            Alert.alert("Request Invalid", "Plase fill all required feild");
        }

    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor="#f08080" />
                <View style={{ backgroundColor: "#f08080", height: 1000, width: 5000, position: "relative", top: -240, transform: [{ rotate: "25deg" }] }}></View>
                <View style={styles.signUp}>
                    <Image source={{ uri: 'https://flaticons.net/icon.php?slug_category=banking&slug_icon=cash' }} style={{ height: 100, width: 100, marginLeft: "auto", marginRight: "auto", marginBottom: 20 }} />
                    <Text style={{ textAlign: "left", color: "#fff", fontWeight: "600", width: "100%", fontSize: 24 }}>REGISTER</Text>
                    <Divider style={{ marginVertical: 5, width: "100%", height: 1, backgroundColor: "#fff", elevation: 5 }} />
                    <View style={{ marginTop: 20, width: "100%", color: "#fff" }}>
                        <Input
                            label="Name"
                            labelStyle={{ color: "#fff" }}
                            placeholder="Enter Your Name"
                            inputContainerStyle={{ color: "#fff", borderBottomColor: "#fff" }}
                            style={{ color: "#fff", fontSize: 12 }}
                            placeholderTextColor="#fff"
                            onChangeText={(e) => this.setState({ userName: e })}
                        />

                        <Input
                            label="Email"
                            labelStyle={{ color: "#fff" }}
                            placeholder="Enter Your Email"
                            inputContainerStyle={{ color: "#fff", borderBottomColor: "#fff" }}
                            style={{ color: "#fff", fontSize: 12 }}
                            placeholderTextColor="#fff"
                            onChangeText={(e) => this.setState({ userEmail: e })}
                        />

                        <Input
                            label="Phone"
                            labelStyle={{ color: "#fff" }}
                            placeholder="Enter Your Mobile Number"
                            inputContainerStyle={{ color: "#fff", borderBottomColor: "#fff" }}
                            style={{ color: "#fff", fontSize: 12 }}
                            placeholderTextColor="#fff"
                            onChangeText={(e) => this.setState({ userPhone: e })}
                        />

                        <Input
                            label="Password"
                            labelStyle={{ color: "#fff" }}
                            placeholder="Enter Your Password"
                            inputContainerStyle={{ color: "#fff", borderBottomColor: "#fff" }}
                            style={{ color: "#fff", fontSize: 12 }}
                            placeholderTextColor="#fff"
                            secureTextEntry={true}
                            onChangeText={(e) => this.setState({ userPassword: e })}
                        />
                    </View>
                    <View style={{ marginRight: "auto", marginLeft: "auto" }}>
                        {this.state.isLoading ? (
                            <View style={{ borderColor: "#fff", backgroundColor: "#fff", width: 177, height: 40, padding: 8, borderRadius: 3, elevation: 5, alignItems: "center" }}>
                                <ActivityIndicator size={20} color="#000" />
                            </View>
                        ) : (
                                <Button title="CREATE ACCOUNT"
                                    type="outline"
                                    titleStyle={{ color: "#000" }}
                                    containerStyle={{ elevation: 5 }}
                                    buttonStyle={{ borderColor: "#fff", backgroundColor: "#fff", width: "100%", }}
                                    onPress={() => this.creactAccount()}
                                />
                            )}
                        <Text style={{ width: "100%", fontSize: 12, color: "#fefefe", textAlign: "center", marginLeft: "auto", marginRight: "auto", marginTop: 20 }} onPress={() => this.props.navigation.navigate('LogIn')}>Have an account? Sign In</Text>

                    </View>
                </View>


                <Snackbar
                    visible={this.state.snackbarVisible}
                    onDismiss={() => this.setState({ snackbarVisible: false })}
                    action={{
                        label: 'Ok',
                        onPress: () => {
                            this.setState({ snackbarVisible: false })
                        },
                    }}>
                    {this.state.snackbarMessage}
                </Snackbar>
                {/* <View style={{ backgroundColor: "transparent", flex: 1, position: "relative", bottom: 10, left: 15, justifyContent: "flex-end", width: "100%" }}>
                    <Text style={{ color: "#cecece", fontSize: 12 }}>Terms & Conditions</Text>
                </View> */}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        flex: 2,
    },
    signUp: {
        flex: 10,
        position: "absolute",
        top: "5%",
        width: "72%",
        backgroundColor: "transparent",
    },
});