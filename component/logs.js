import React from 'react';
import { Component } from 'react';
import {
    StyleSheet, StatusBar, Text, View, ScrollView,
    DrawerLayoutAndroid, Image, TouchableHighlight,
    RefreshControl, ActivityIndicator
} from 'react-native';
import { Entypo, AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationEvents } from 'react-navigation';


export default class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {
            logs: [],
            customer_id: null,
            isLoading: true,
            refreshing: true,
            confirm_loading: 0
        }

        this.add_to_dairy = React.createRef();

    }

    async componentDidMount() {

        this.setState({
            customer_id: await AsyncStorage.getItem("user_id"),
        });

        this.fetchLogs();

    }

    fetchLogs = () => {
        fetch('http://skyably.com/paywithbuddy/Api/logs.php', {
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

                this.setState({ logs: responseJson, isLoading: false, refreshing: false });

            })
            .catch((error) => {
                //  console.error(error);
            });
    }

    _onRefresh() {
        this.setState({ refreshing: true });
        this.fetchLogs();
    }


    render() {
        return (
            <View style={styles.container}>
                <NavigationEvents
                    onWillFocus={() => {
                        this.fetchLogs();
                    }}
                />
                <StatusBar barStyle="dark-content" backgroundColor="#fff" />
                <View style={styles.header}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 10 }}>
                        <AntDesign name="arrowleft" size={26} style={{ color: "#000", fontWeight: "400" }} onPress={() => this.props.navigation.goBack()} />
                        <Text style={{ color: "#000", fontSize: 20 }}>Dairy Logs</Text>
                        <AntDesign name="question" size={24} style={{ color: "#000" }} onPress={() => null} />
                    </View>
                </View>
                <View style={styles.rest}>
                    {this.state.isLoading ? (
                        <View style={styles.loading}>
                            <ActivityIndicator size={30} color="#0b37d9" />
                        </View>
                    ) : (
                            this.state.logs == null ? (
                                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                    <Image
                                        style={{ width: "90%", height: 300, marginBottom: "40%" }}
                                        source={{ uri: 'https://cdn.dribbble.com/users/283708/screenshots/7084440/artboard___14_4x.png' }}
                                    />
                                </View>
                            ) : (
                                    <ScrollView style={{ flexWrap: "wrap" }} refreshControl={
                                        <RefreshControl
                                            refreshing={this.state.refreshing}
                                            onRefresh={this._onRefresh.bind(this)}
                                        />
                                    }>
                                        <View style={{ flex: 1, paddingVertical: 8, paddingHorizontal: 20 }}>
                                            <View style={{ marginVertical: 2 }} >
                                                {this.state.logs.map((item, i) => {
                                                    return (
                                                        <TouchableHighlight
                                                            key={i}
                                                            activeOpacity={0.6}
                                                            style={{ width: "auto", margin: 5, borderRadius: 10, elevation: 5, backgroundColor: "#fff" }}
                                                            underlayColor="#DDDDDD"
                                                            onPress={() => this.props.navigation.navigate("LogDetailPage", { code: item.dairy_code, name: item.dairy_name })} >
                                                            <View style={{ width: "100%", minHeight: 70, paddingHorizontal: 8, paddingVertical: 10, flexDirection: "row", alignItems: "center", borderRadius: 10, backgroundColor: "rgba(11, 55, 217, 0.1)" }}>
                                                                <View style={{ flexDirection: "column", width: "100%" }}>
                                                                    <Text style={{ fontSize: 16, color: "#000", fontWeight: "700", marginLeft: 10 }}>{item.dairy_name}</Text>
                                                                </View>
                                                                <View style={{ flexDirection: "row", marginLeft: "auto" }}>
                                                                    <Text style={{ fontSize: 14, color: "#696969" }}>Total Wrap: </Text>
                                                                    <Text style={{ fontSize: 14, textAlign: "center", fontWeight: "700", width: 20 }}>{item.wrap_count}</Text>
                                                                    <AntDesign name="right" size={14} style={{ marginHorizontal: 10, marginTop: 2 }} color="#000" />
                                                                </View>
                                                            </View>
                                                        </TouchableHighlight>
                                                    )
                                                })}
                                            </View>
                                        </View>
                                    </ScrollView>
                                ))}
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
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
