import React from 'react';
import { Component } from 'react';
import { StyleSheet, StatusBar, Text, View, Button, Alert, DrawerLayoutAndroid, Image, ActivityIndicator } from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { Icon, Avatar, ListItem } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

import AddItemModel from './addItems';
import Table from './table';
import Dashboard from './dashboardView';
import { Divider } from 'react-native-paper';


export default class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {

            itemName: '',
            itemPrice: '',
            customer_name: null,
            customer_email: null,
            MasterKey: null,
            drawerPosition: "left",
            code: null,
            isloading: true,
            allrecords: [],
            noOfPerson: '',
            totalBalance: '',
            userTotal: '',
            days: 0,

        }

        this.drawerss = React.createRef();
        this.addItem = React.createRef();
        this.table = React.createRef();

    }

    async componentDidMount() {

        this.setState({
            isloading: true,
            code: await this.props.navigation.state.params.code,
            customer_email: await AsyncStorage.getItem("email"),
            customer_name: await AsyncStorage.getItem("user_name"),
            MasterKey: await AsyncStorage.getItem("user_id"),
        });

        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: false,
                shouldSetBadge: false,
            }),
        });

        await this.fetchData();

    }

    fetchData = () => {

        fetch('https://skyably.com/paywithbuddy/Api/fetchRecord.php', {
            method: 'post',
            header: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({

                code: this.state.code,
                masterkey: this.state.MasterKey,

            })

        })
            .then((response) => response.json())
            .then((responseJson) => {

                this.setState({ allrecords: responseJson.items })
                this.setState({ noOfPerson: responseJson.Count[0].No })
                this.setState({ totalBalance: responseJson.totalprice[0].total })
                this.setState({ userTotal: responseJson.userTotal[0].total, isloading: false, days: responseJson.tatalDays });
                this.table.current.setState({ refreshing: false });


            })
            .catch((error) => {
                //  console.error(error);
            });

    }

    setItemName = (e) => { this.setState({ itemName: e }); }
    setItemPrice = (e) => { this.setState({ itemPrice: e }); }

    addItems = async () => {

        if (this.state.itemName == '') { Alert.alert('Please Fill Items') }
        else if (this.state.itemPrice == '') { Alert.alert('Please Fill Price') }
        else {
            fetch(`https://skyably.com/paywithbuddy/Api/insertItems.php`, {
                method: 'post',
                header: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({


                    price: this.state.itemPrice,
                    items: this.state.itemName,
                    name: this.state.customer_name,
                    email: this.state.customer_email,
                    customer_id: this.state.MasterKey,
                    code: this.state.code,


                })


            }).then((response) => response.json())
                .then((responseJson) => {

                    if (responseJson.tokens == null) {

                        this.fetchData();
                        this.addItem.current.setModalVisible(false);
                        this.setState({ isloading: false, price: '', items: '' });

                    }


                    else if (responseJson.Result == 'Yes') {
                        responseJson.tokens.map(function (respons, i) {

                            fetch('https://exp.host/--/api/v2/push/send', {
                                body: JSON.stringify({
                                    to: respons.mobileToken,
                                    title: "Item Added ",
                                    body: "Hey " + respons.name + "! " + respons.uname + " Added " + respons.items + " With Price " + respons.price,
                                    sound: 'default',
                                    badge: 3,
                                }),
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                method: 'POST',
                            })

                        })

                        this.fetchData();
                        this.addItem.current.setModalVisible(false);
                        this.setState({ isloading: false, price: '', items: '' });

                    }
                    else {
                        this.setState({ isloading: false })
                        Alert.alert('Network Error')
                    }

                })
                .catch((error) => {
                    console.error(error);

                });
        }

    }

    openDrawers = () => this.drawerss.current.openDrawer();

    render() {
        if (this.state.isloading) {
            return (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
                    <ActivityIndicator size={30} color="#0000ff" />
                </View>
            )
        } else {
            const statusMoney = ((this.state.userTotal) - (Math.round(this.state.totalBalance / this.state.noOfPerson)));
            const current = Math.round(this.state.totalBalance / this.state.noOfPerson);
            return (
                <View style={styles.container}>
                    <StatusBar barStyle="light-content" backgroundColor="#0b37d9" />
                    <View style={styles.header}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 10 }}>
                            <Ionicons name="arrow-back" size={30} style={{ color: "#fff", fontWeight: "300" }} onPress={() => this.props.navigation.navigate("First")} />
                            <Text style={{ color: "#fff", fontSize: 20 }}>Pay With Buddy</Text>
                            <AntDesign name="user" size={30} style={{ color: "#fff" }} onPress={() => this.props.navigation.navigate("Profile")} />
                        </View>
                        <View style={{ padding: 20, paddingTop: 33 }}>
                            <Dashboard code={this.state.code}
                                status={statusMoney}
                                yourTotal={this.state.userTotal}
                                grandTotal={this.state.totalBalance}
                                currentBallance={current}
                                days={this.state.days} />
                        </View>
                    </View>
                    <View style={styles.rest}>
                        <View>
                            <Table records={this.state.allrecords} functionRecord={this.fetchData} ref={this.table} />
                        </View>
                    </View>
                    <AddItemModel ref={this.addItem} additem={this.addItems} itemName={this.setItemName} itemPrice={this.setItemPrice} />
                </View>
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
        backgroundColor: '#0b37d9',
    },
    header: {
        flex: 2,
        width: "100%",
    },
    rest: {
        flex: 5,
        backgroundColor: "white",
        width: "100%",
        height: 50,
    },
    navigationContainer: {
        backgroundColor: "#fff"
    },
});
