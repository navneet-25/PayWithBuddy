import React from 'react';
import { Component } from 'react';
import {
    StyleSheet, StatusBar, Text, View, ScrollView,
    DrawerLayoutAndroid, Alert, TouchableHighlight,
    RefreshControl, ActivityIndicator
} from 'react-native';
import { MaterialCommunityIcons, AntDesign, Ionicons } from '@expo/vector-icons';
import { Icon, Avatar, ListItem } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddToDairy from './diaryCode';
import AddDairy from './addDairy';
import { DrawerActions } from 'react-navigation-drawer';
import { Badge } from 'react-native-elements';
import { Fab, Button, ActionSheet, Root } from 'native-base';
import { NavigationEvents } from 'react-navigation';


export default class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {
            itemName: '',
            itemPrice: '',
            drawerPosition: "left",
            allDairys: [],
            customer_id: null,
            customer_name: null,
            customer_email: null,
            isLoading: true,
            refreshing: false,
            active: false,
            clicked_dairy_code: null,
            clicked_dairy_name: null,
            notification: false
        }

        this.add_to_dairy = React.createRef();

    }

    async componentDidMount() {

        this.setState({
            customer_id: await AsyncStorage.getItem("user_id"),
            customer_name: await AsyncStorage.getItem("user_name"),
            customer_email: await AsyncStorage.getItem("email")
        });

        if (this.state.customer_id === null) {
            this.props.navigation.navigate('LogIn');
        }

        this.showDairy();
        this.isanyNotification();

    }


    isanyNotification = () => {
        fetch('http://skyably.com/paywithbuddy/Api/check_notification.php', {
            method: 'post',
            header: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({

                customer_id: this.state.customer_id,

            })

        })
            .then((response) => response.json())
            .then((responseJson) => {

                this.setState({ notification: responseJson.notification, isLoading: false, refreshing: false });

            })
            .catch((error) => {
                //  console.error(error);
            });
    }


    showDairy = () => {
        fetch('http://skyably.com/paywithbuddy/Api/show-dairy.php', {
            method: 'post',
            header: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({

                customer_id: this.state.customer_id,

            })

        })
            .then((response) => response.json())
            .then((responseJson) => {

                this.setState({ allDairys: responseJson, isLoading: false, refreshing: false });

            })
            .catch((error) => {
                //  console.error(error);
            });
    }

    deleteDairy = () => {
        fetch('http://skyably.com/paywithbuddy/Api/request_delete.php', {
            method: 'post',
            header: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({

                code: this.state.clicked_dairy_code,
                dairy_name: this.state.clicked_dairy_name,
                requested_by: this.state.customer_name,
                requested_id: this.state.customer_id,

            })

        })
            .then((response) => response.json())
            .then((responseJson) => {

                if (responseJson.requsted) {
                    Alert.alert(
                        "Already Requsted!",
                        "This dairy alredy requested for wrap waiting for all confirmations.",
                        [
                            { text: "OK", onPress: () => null }
                        ],
                        { cancelable: false }
                    );
                } else {
                    if (responseJson.added) {
                        responseJson.tokens.map(function (respons, i) {

                            fetch('https://exp.host/--/api/v2/push/send', {
                                body: JSON.stringify({
                                    to: respons.mobileToken,
                                    title: "PayWithBuddy",
                                    body: "Hey " + respons.name + "! " + respons.r_by + " requested to wrap dairy: " + respons.d_name,
                                    sound: 'default',
                                    badge: 3,
                                }),
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                method: 'POST',
                            })

                        });
                        this.componentDidMount();
                    } else {
                        Alert.alert(
                            "Failed!",
                            "Something went wrong!!",
                            [
                                { text: "OK", onPress: () => null }
                            ],
                            { cancelable: false }
                        );
                    }
                }

            })
            .catch((error) => {
                //  console.error(error);
            });
    }

    _onRefresh() {
        this.setState({ refreshing: true });
        this.showDairy();
    }


    render() {

        var BUTTONS = [
            { text: "Request Wrap", icon: "trash", iconColor: "#fa213b" },
            { text: "Cancel", icon: "close", iconColor: "#000" }
        ];
        var DESTRUCTIVE_INDEX = 1;
        var CANCEL_INDEX = 2;

        if (this.state.isLoading) {
            return (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator size={30} color="#0000ff" />
                </View>
            )
        } else {
            return (
                <Root>
                    <NavigationEvents
                        onWillFocus={() => {
                            this.isanyNotification();
                            this.showDairy();
                        }}
                    />
                    <View style={styles.container}>
                        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
                        <View style={styles.header}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 10 }}>
                                <MaterialCommunityIcons name="text" size={30} style={{ color: "#000" }} onPress={() => this.props.navigation.dispatch(DrawerActions.openDrawer())} />
                                <Text style={{ color: "#000", fontSize: 20 }}>Pay With Buddy{this.state.clicked}</Text>
                                <Ionicons name="notifications-outline" size={26} color="black" onPress={() => { this.props.navigation.navigate("Notification"); this.setState({ notification: false }) }} />
                                {this.state.notification && (<Badge size="large" status="primary" containerStyle={{ position: 'absolute', top: 10, right: 12 }} />)}
                            </View>
                        </View>
                        <View style={styles.rest}>
                            {this.state.allDairys === null ? (
                                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                    <Text>Create Your Daiary!!</Text>
                                </View>
                            ) : (
                                    <ScrollView style={{ flexWrap: "wrap" }} refreshControl={
                                        <RefreshControl
                                            refreshing={this.state.refreshing}
                                            onRefresh={this._onRefresh.bind(this)}
                                        />
                                    }>
                                        <View style={{ flex: 1, paddingVertical: 8, paddingHorizontal: 20 }}>
                                            {this.state.allDairys.map((items, i) => {
                                                return (
                                                    <View style={{ marginVertical: 2 }} key={i}>
                                                        <TouchableHighlight
                                                            activeOpacity={0.6}
                                                            style={{ width: "auto", margin: 5, borderRadius: 10, elevation: 5, backgroundColor: "#fff" }}
                                                            underlayColor="#DDDDDD"
                                                            onPress={() => this.props.navigation.navigate("Home", { code: items.dairy_code })}
                                                            onLongPress={() => {
                                                                this.setState({ clicked_dairy_code: items.dairy_code, clicked_dairy_name: items.name });
                                                                ActionSheet.show(
                                                                    {
                                                                        options: BUTTONS,
                                                                        cancelButtonIndex: CANCEL_INDEX,
                                                                        destructiveButtonIndex: DESTRUCTIVE_INDEX,
                                                                        title: "Choose your option"
                                                                    },
                                                                    buttonIndex => {
                                                                        if (buttonIndex == 0) {
                                                                            Alert.alert(
                                                                                'Confirmation',
                                                                                'Are you sure to request for delete?',
                                                                                [
                                                                                    { text: 'NO', style: 'cancel' },
                                                                                    { text: 'YES', onPress: () => this.deleteDairy() },
                                                                                ]
                                                                            )
                                                                        }
                                                                    }
                                                                )
                                                            }
                                                            }>
                                                            <View style={{ width: "100%", minHeight: 70, paddingHorizontal: 8, paddingVertical: 10, flexDirection: "row", alignItems: "center", borderRadius: 10, backgroundColor: "#fff" }}>
                                                                <View style={{ borderRadius: 50, borderWidth: 1, marginHorizontal: 10, borderColor: "#cecece", padding: 5 }}>
                                                                    <AntDesign name="book" size={20} />
                                                                </View>
                                                                <View style={{ flexDirection: "column", width: "100%" }}>
                                                                    <Text style={{ fontSize: 14, fontWeight: "700" }}>{items.name}  {items.requested_for_del == 1 && (<AntDesign name="exclamationcircle" size={14} color="#f5ac00" />)}</Text>
                                                                    <Text style={{ fontSize: 12 }}>Code: <Text style={{ fontWeight: "700" }}>{items.dairy_code}</Text></Text>
                                                                </View>
                                                                <View style={{ flexDirection: "column", marginLeft: "auto", marginRight: 10 }}>
                                                                    <Text style={{ fontSize: 14 }}>Members</Text>
                                                                    <Text style={{ fontSize: 12, textAlign: "center", fontWeight: "700" }}>{items.members}</Text>
                                                                </View>
                                                            </View>
                                                        </TouchableHighlight>
                                                    </View>
                                                )
                                            })}
                                        </View>
                                    </ScrollView>
                                )}
                        </View>
                        <Fab
                            active={this.state.active}
                            direction="up"
                            containerStyle={{}}
                            style={{
                                backgroundColor: '#ff6347',
                                elevation: 5,
                                padding: 10
                            }}
                            position="bottomRight"
                            onPress={() => this.setState({ active: !this.state.active })}>
                            <AntDesign name="plus" size={24} color="#fff" />
                            <Button onPress={() => this.content.setModalVisible(true)} style={{ backgroundColor: '#fff' }}>
                                <AntDesign name="addfile" size={18} color="black" />
                            </Button>
                            <Button onPress={() => this.content1.setModalVisible(true)} style={{ backgroundColor: '#fff' }}>
                                <AntDesign name="adduser" size={20} color="black" />
                            </Button>
                        </Fab>
                        <AddDairy ref={instance => { this.content = instance; }} loadit={this.showDairy} />
                        <AddToDairy ref={instance => { this.content1 = instance; }} loadit={this.showDairy} />
                    </View>
                </Root>
            );
        }
    }



    logOut = () => {
        AsyncStorage.clear().then(this.props.navigation.navigate("LogIn"));
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flex: 1,
        width: "100%",
    },
    rest: {
        flex: 15,
        backgroundColor: "white",
        width: "100%",
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5
    },
    navigationContainer: {
        backgroundColor: "#fff"
    },
});
