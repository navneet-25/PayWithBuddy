import React from 'react';
import { Component } from 'react';
import {
    StyleSheet, StatusBar, Text, View, ScrollView,
    DrawerLayoutAndroid, Image, TouchableHighlight,
    RefreshControl, ActivityIndicator
} from 'react-native';
import { Entypo, AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ContentLoader, {
    FacebookLoader,
    InstagramLoader,
    Bullets
} from "react-native-easy-content-loader";


export default class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {
            notifications: [],
            customer_id: null,
            isLoading: true,
            refreshing: false,
            confirm_loading: 0
        }

        this.add_to_dairy = React.createRef();

    }

    async componentDidMount() {

        this.setState({
            customer_id: await AsyncStorage.getItem("user_id"),
        });

        if (this.state.customer_id === null) {
            this.props.navigation.navigate('LogIn');
        }

        this.fetchNotification();
        this.seenNotification();

    }

    fetchNotification = () => {
        fetch('http://skyably.com/paywithbuddy/Api/notification.php', {
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

                this.setState({ notifications: responseJson, isLoading: false, refreshing: false, confirm_loading: 0 });

            })
            .catch((error) => {
                //  console.error(error);
            });
    }

    wrap_confirm = async (e, f, g) => {
        this.setState({ confirm_loading: e });
        fetch('http://skyably.com/paywithbuddy/Api/wrap_confirm.php', {
            method: 'post',
            header: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({

                customer_id: this.state.customer_id,
                wrap_id: e,
                dairy_code: f,
                dairy_name: g

            })

        })
            .then((response) => response.json())
            .then((responseJson) => {

                console.log(responseJson);

                if (responseJson.confirmed) {
                    this.fetchNotification();
                } else {
                    console.log("are ma chudi pri hai btaye rhe ho");
                }

            })
            .catch((error) => {
                //  console.error(error);
            });
    }

    wrap_reject = (e, f, g) => {
        this.setState({ confirm_loading: e });
        fetch('http://skyably.com/paywithbuddy/Api/wrap_reject.php', {
            method: 'post',
            header: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({

                customer_id: this.state.customer_id,
                wrap_id: e,
                dairy_code: f,
                dairy_name: g

            })

        })
            .then((response) => response.json())
            .then((responseJson) => {

                console.log(responseJson);

                if (responseJson.confirmed) {
                    this.fetchNotification();
                } else {
                    console.log("are ma chudi pri hai btaye rhe ho");
                }

            })
            .catch((error) => {
                //  console.error(error);
            });
    }

    seenNotification = () => {
        fetch('http://skyably.com/paywithbuddy/Api/seen_notification.php', {
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
        return (
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#fff" />
                <View style={styles.header}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 10 }}>
                        <AntDesign name="arrowleft" size={26} style={{ color: "#000", fontWeight: "400" }} onPress={() => this.props.navigation.goBack()} />
                        <Text style={{ color: "#000", fontSize: 20 }}>Notifications</Text>
                        <Text>   </Text>
                    </View>
                </View>
                <View style={styles.rest}>
                    {this.state.isLoading ? (
                        <View style={{ marginLeft: "auto", width: "95%", marginRight: "auto", marginTop: 8 }}>
                            <ContentLoader
                                active
                                pRows={0}
                                tHeight={60}
                                tWidth={"100%"}
                            />
                            <ContentLoader
                                active
                                pRows={0}
                                tHeight={60}
                                tWidth={"100%"}
                            />
                            <ContentLoader
                                active
                                pRows={0}
                                tHeight={60}
                                tWidth={"100%"}
                            />
                            <ContentLoader
                                active
                                pRows={0}
                                tHeight={60}
                                tWidth={"100%"}
                            />
                            <ContentLoader
                                active
                                pRows={0}
                                tHeight={60}
                                tWidth={"100%"}
                            />
                            <ContentLoader
                                active
                                pRows={0}
                                tHeight={60}
                                tWidth={"100%"}
                            />
                        </View>
                    ) : (
                            this.state.notifications !== null ? (
                                <ScrollView style={{ flexWrap: "wrap", paddingHorizontal: 10 }}>
                                    <View style={{ marginVertical: 2 }}>

                                        {this.state.notifications.map((item, i) => {
                                            return (
                                                <TouchableHighlight
                                                    key={i}
                                                    activeOpacity={0.6}
                                                    style={{ width: "auto", margin: 5, borderRadius: 10, elevation: 2, backgroundColor: "#fff", borderBottomColor: "#cecece", borderBottomWidth: 2 }}
                                                    underlayColor="#DDDDDD"
                                                    onPress={() => null}>
                                                    <View style={{ width: "100%", minHeight: 70, paddingHorizontal: 8, paddingVertical: 10, flexDirection: "row", alignItems: "center", borderRadius: 10, backgroundColor: "#fff" }}>
                                                        <View style={{ marginHorizontal: 10, padding: 5 }}>
                                                            <MaterialIcons name="delete" size={20} color="black" />
                                                        </View>
                                                        <View style={{ flexDirection: "column", width: "100%" }}>
                                                            <Text style={{ fontSize: 12, color: "#5c5c5c" }}>Dairy Name: <Text style={{ fontWeight: "700", color: "#000" }}>{item.dairy_name}</Text></Text>
                                                            <Text style={{ fontSize: 12, color: "#5c5c5c" }}>Aproved By: <Text style={{ fontWeight: "700" }}>{item.aproved_by}/{item.total_person}</Text></Text>
                                                        </View>
                                                        <View style={{ flexDirection: "row", marginLeft: "auto", marginRight: 10 }}>

                                                            {this.state.confirm_loading == item.id ? (
                                                                <ActivityIndicator size={14} color="#545454" />
                                                            ) : (
                                                                    item.did_aproved == 1 ? (
                                                                        <Text style={{ color: "#545454", fontSize: 14, borderRadius: 50, padding: 5 }} >Confirmed</Text>
                                                                    ) : item.did_aproved == 2 ? (
                                                                        <Text style={{ color: "red", fontSize: 14, borderRadius: 50, padding: 5 }} >Rejected By {item.did_not_name}</Text>
                                                                    ) : (
                                                                                <View style={{ flexDirection: "row" }}>
                                                                                    <Text onPress={() => this.wrap_confirm(item.id, item.dairy_code, item.dairy_name)} style={{ color: "#32cd32", fontSize: 14, borderRadius: 50, padding: 5 }} >Confirm</Text>
                                                                                    <Text onPress={() => this.wrap_reject(item.id, item.dairy_code, item.dairy_name)} style={{ color: "#ff4500", fontSize: 14, borderRadius: 50, padding: 5 }} >Reject</Text>
                                                                                </View>
                                                                            )
                                                                )
                                                            }

                                                        </View>
                                                    </View>
                                                </TouchableHighlight>
                                            )
                                        })

                                        }

                                    </View>
                                </ScrollView>
                            ) : (
                                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                        <Image
                                            style={{ width: "90%", height: 300 }}
                                            source={{ uri: 'http://skyably.com/paywithbuddy/Api/image/notification.PNG' }}
                                        />
                                        <Text style={{ marginBottom: "40%" }}>No Notification Found</Text>
                                    </View>
                                )
                        )}

                </View>
            </View>
        );

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
