import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, Alert } from 'react-native';
import { Input, Divider, ListItem } from 'react-native-elements';
import { MaterialCommunityIcons, Ionicons, Entypo, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { Snackbar } from 'react-native-paper';
import { Button } from 'react-native-elements';
import { Image } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';


export default class login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            snackbarVisible: false,
            snackbarMessage: '',
            snackbarCount: 0,
            userEmail: '',
            userPassword: '',
            getEmail: '',
            id: null,
            isLoading: false,
            token: ''
        }
    }

    componentDidMount() {

        this.setState({ id: AsyncStorage.getItem('user_id') });

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
    }

    setEmail = e => {
        this.setState({ userEmail: e });
    }

    setPassword = e => {
        this.setState({ userPassword: e });
    }

    login = async () => {

        this.setState({ isLoading: true });

        fetch(`https://skyably.com/paywithbuddy/Api/Login.php`, {
            method: 'post',
            header: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({


                email: this.state.userEmail,
                password: this.state.userPassword,
                token: this.state.token

            })


        }).then((response) => response.json())
            .then((responseJson) => {

                console.log(responseJson);

                if (responseJson.done) {

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
                            AsyncStorage.setItem('user_phone', responseJson.user_data[0].mobile);
                            this.setState({ isLoading: false });
                            this.props.navigation.navigate("First");

                        })
                        .catch((error) => {
                            console.error(error);
                        });

                }
                else {
                    this.setState({ isLoading: false });
                    Alert.alert("Login Failed", "Email or Password is incorrect!!");
                }

            })
            .catch((error) => {
                console.error(error);

            });
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor="#0b37d9" />
                <View style={{ backgroundColor: "#0b37d9", height: 1000, width: 5000, position: "relative", top: -240, transform: [{ rotate: "-25deg" }] }}></View>
                <View style={styles.signUp}>
                    <Image source={{ uri: 'https://flaticons.net/icon.php?slug_category=banking&slug_icon=cash' }} style={{ height: 100, width: 100, marginLeft: "auto", marginRight: "auto", marginBottom: 20 }} />
                    <Text style={{ textAlign: "left", color: "#fff", fontWeight: "600", width: "100%", fontSize: 24 }}>Log In</Text>
                    <View style={{ marginTop: 20, width: "100%", color: "#fff" }}>
                        <Input
                            label="Email"
                            labelStyle={{ color: "#fff" }}
                            placeholder="Enter Your Email"
                            inputContainerStyle={{ color: "#fff", borderBottomColor: "#fff" }}
                            style={{ color: "#fff", fontSize: 12 }}
                            placeholderTextColor="#fff"
                            onChangeText={this.setEmail}
                        />

                        <Input
                            label="Password"
                            labelStyle={{ color: "#fff" }}
                            placeholder="Enter Your Password"
                            inputContainerStyle={{ color: "#fff", borderBottomColor: "#fff" }}
                            style={{ color: "#fff", fontSize: 12 }}
                            placeholderTextColor="#fff"
                            secureTextEntry={true}
                            onChangeText={this.setPassword}
                        />
                        <Text style={{ width: "100%", fontSize: 12, color: "#fefefe", textAlign: "right", position: "relative", top: -17, right: 5 }} onPress={() => console.log("ok")}>Forget Passowrd?</Text>
                    </View>
                    <View style={{ marginRight: "auto", marginLeft: "auto" }}>
                        {this.state.isLoading ? (
                            <View style={{ borderColor: "#fff", backgroundColor: "#fff", width: 177, height: 40, padding: 8, borderRadius: 3, elevation: 5, alignItems: "center" }}>
                                <ActivityIndicator size={20} color="#000" />
                            </View>
                        ) : (
                                <Button title="Login"
                                    type="outline"
                                    titleStyle={{ color: "#000" }}
                                    containerStyle={{ elevation: 5 }}
                                    buttonStyle={{ borderColor: "#fff", backgroundColor: "#fff", width: "100%", }}
                                    onPress={() => this.login()}
                                />
                            )}

                        <Text style={{ width: "100%", fontSize: 12, color: "#fefefe", textAlign: "center", marginTop: 20 }} onPress={() => this.props.navigation.navigate('SignUp')}>Don't have in account? Sign Up</Text>
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
        top: "8%",
        width: "72%",
        backgroundColor: "transparent",
    },
});