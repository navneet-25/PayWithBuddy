import React from 'react';
import { Component } from 'react';
import {
    StyleSheet, StatusBar, Text, View, ScrollView,
    TouchableNativeFeedback, Image, TouchableHighlight,
    RefreshControl, ActivityIndicator, Dimensions
} from 'react-native';
import { Ionicons, AntDesign, Entypo, MaterialIcons, Fontisto } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Dash from 'react-native-dash';


export default class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {
            code: '',
            name: 'Dairy Name:',
            wraps: [],
            users: [],
            customer_id: null,
            isLoading: true,
            refreshing: false,
        }

        this.add_to_dairy = React.createRef();

    }

    async componentDidMount() {

        this.setState({
            isloading: true,
            code: await this.props.navigation.state.params.code,
            name: await this.props.navigation.state.params.name,
            customer_id: await AsyncStorage.getItem("user_id"),
        });

        this.fetchData();

    }

    fetchData = () => {

        fetch('https://skyably.com/paywithbuddy/Api/fetch_logs.php', {
            method: 'post',
            header: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({

                code: this.state.code,

            })

        })
            .then((response) => response.json())
            .then((responseJson) => {

                this.setState({ wraps: responseJson, isLoading: false });

            })
            .catch((error) => {
                //  console.error(error);
            });

    }

    _onRefresh() {
        this.setState({ refreshing: true });
        this.fetchData();
    }


    render() {

        return (
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#fff" />
                <View style={styles.header}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 10 }}>
                        <AntDesign name="arrowleft" size={26} style={{ color: "#000", fontWeight: "400" }} onPress={() => this.props.navigation.goBack()} />
                        <Text style={{ color: "#000", fontSize: 20 }}>{this.state.name}</Text>
                        <AntDesign name="question" size={24} style={{ color: "#000" }} onPress={() => this.props.navigation.navigate('Profile')} />
                    </View>
                </View>
                <View style={styles.rest}>
                    {this.state.isLoading ? (
                        <View style={styles.loading}>
                            <ActivityIndicator size={30} color="#0b37d9" />
                        </View>
                    ) : (
                            <ScrollView style={{ flexWrap: "wrap" }} refreshControl={
                                <RefreshControl
                                    refreshing={this.state.refreshing}
                                    onRefresh={this._onRefresh.bind(this)}
                                />
                            }>
                                <View style={{ flex: 1, marginVertical: 8, marginHorizontal: 20 }}>
                                    <View style={{ marginVertical: 2 }} >
                                        {this.state.wraps.map((item, i) => {
                                            return (
                                                <TouchableHighlight
                                                    key={i}
                                                    activeOpacity={0.6}
                                                    style={{ width: "100%", marginLeft: "auto", marginRight: "auto", marginBottom: 10, borderRadius: 10, elevation: 2, backgroundColor: "#fff" }}
                                                    underlayColor="#DDDDDD"
                                                    onPress={() => null} >
                                                    <View style={{ width: "auto", paddingHorizontal: 8, paddingVertical: 10, borderRadius: 10, backgroundColor: "#fff" }}>
                                                        <View style={{ width: "100%", flexDirection: "row", alignItems: "center" }}>
                                                            <Text style={{ fontSize: 14, color: "#cecece", fontWeight: "700", }}>From - To </Text>
                                                            <Text style={{ fontWeight: "500", width: "65%", fontSize: 12, color: "#000" }}>{item.duratation}</Text>
                                                            <AntDesign name="clockcircle" size={15} style={{ marginLeft: "auto", }} color="#0b37d9" />
                                                        </View>
                                                        <Dash style={{ width: "100%", height: 1, marginLeft: "auto", marginRight: "auto", marginTop: 10 }} dashThickness={1} dashColor="#ebebeb" dashLength={10} />
                                                        <View style={{ flexDirection: "row", width: "100%" }}>
                                                            <View style={{ flexDirection: "row", justifyContent: "center", paddingVertical: 20, width: "40%", marginLeft: "auto", marginRight: "auto" }}>
                                                                <Text style={{ color: "#cecece", fontWeight: "700", width: "60%" }}>Grand Total</Text>
                                                                <Text>₹ {item.total}</Text>
                                                            </View>
                                                            <View style={{ flexDirection: "row", justifyContent: "center", paddingVertical: 20, width: "40%", marginLeft: "auto", marginRight: "auto" }}>
                                                                <Text style={{ color: "#cecece", fontWeight: "700", width: "60%" }}>Per Each</Text>
                                                                <Text>₹ {item.per_person}</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </TouchableHighlight>
                                            )
                                        })}
                                    </View>
                                </View>
                            </ScrollView>
                        )}
                </View>
            </View>
        );
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
        backgroundColor: "#fff",
        width: "100%",
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
