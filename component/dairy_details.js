import React from 'react';
import { Component } from 'react';
import {
    StyleSheet, StatusBar, Text, View, ScrollView,
    TouchableNativeFeedback, Image, TouchableHighlight,
    RefreshControl, ActivityIndicator, Dimensions
} from 'react-native';
import { Ionicons, AntDesign, Entypo, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    PieChart,
} from "react-native-chart-kit";
import Dash from 'react-native-dash';
import { Avatar } from 'react-native-elements';
import { ListItem } from 'native-base';


export default class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {
            code: '',
            name: 'Dairy Name:',
            drawerPosition: "left",
            allRecord: [],
            users: [],
            customer_id: null,
            customer_name: null,
            customer_email: null,
            isLoading: true,
            refreshing: false,
            rippleColor: "rgba(0, 0, 0, .2)",
            rippleOverflow: false,
            card_view: 1,
            card_view2: 1,
            userTotal: 0,
            noOfPerson: 0,
            userStatus: 0,
            totalBalance: 0,
            month_total: 0,
            today_total: 0,
            quotes: [],
            random: Math.floor(Math.random() * 1642) + 1
        }

        this.add_to_dairy = React.createRef();

    }

    async componentDidMount() {

        this.setState({
            isloading: true,
            code: await this.props.navigation.state.params.code,
            name: await this.props.navigation.state.params.name,
            customer_id: await AsyncStorage.getItem("user_id"),
            customer_name: await AsyncStorage.getItem("user_name"),
            customer_email: await AsyncStorage.getItem("email")
        });

        this.showDairy();

        this.fetchData();

        this.getQuote();

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
                masterkey: this.state.customer_id,

            })

        })
            .then((response) => response.json())
            .then((responseJson) => {

                console.log(responseJson.users);

                this.setState({ month_total: responseJson.get_month_total, today_total: responseJson.get_today_total });
                this.setState({ noOfPerson: responseJson.Count[0].No, users: responseJson.users });
                this.setState({ totalBalance: responseJson.totalprice[0].total });
                this.setState({ userTotal: responseJson.userTotal[0].total, isloading: false, refreshing: false });
                if (responseJson.Count[0].No > 1) {
                    this.setState({ userStatus: (responseJson.userTotal[0].total) - (Math.round(responseJson.totalprice[0].total / responseJson.Count[0].No)) });
                } else {
                    this.setState({ userStatus: responseJson.totalprice[0].total });
                }
                this.table.current.setState({ refreshing: false });


            })
            .catch((error) => {
                //  console.error(error);
            });

    }

    showDairy = () => {
        fetch('http://skyably.com/paywithbuddy/Api/fetch_dairy_data.php', {
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

                let myData = [];

                let opacity = 1;

                responseJson.forEach((item, i) => {

                    myData.push({
                        name: item.name,
                        price: Number(item.s_price),
                        color: `rgba(0, 0, 255, ${opacity})`,
                        legendFontColor: "#7F7F7F",
                        legendFontSize: 12
                    });
                    opacity = opacity - 0.2;
                });

                this.setState({
                    allRecord: myData,
                    isLoading: false,
                    refreshing: false
                })

            })
            .catch((error) => {
                //  console.error(error);
            });
    }

    getQuote = () => {
        fetch("https://type.fit/api/quotes", {

        })
            .then((response) => response.json())
            .then(async (responseJson) => {

                this.setState({
                    quotes: await responseJson,
                    isloading: false,
                    refreshing: false
                })

            })
            .catch((error) => {
                //  console.error(error);
            });
    }

    _onRefresh() {
        this.setState({ refreshing: true });
        this.showDairy();
        this.fetchData();
    }


    render() {

        const chartConfig1 = {
            backgroundGradientFrom: "#1E2923",
            backgroundGradientFromOpacity: 0,
            backgroundGradientTo: "#08130D",
            backgroundGradientToOpacity: 0.5,
            color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
            strokeWidth: 2, // optional, default 3
            barPercentage: 0.5,
            useShadowColorFromDataset: false // optional
        };

        if (this.state.isLoading) {
            return (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator size={30} color="#0000ff" />
                </View>
            )
        } else {

            let card_view;
            if (this.state.card_view === 1) {
                card_view = <View style={{ padding: 20, backgroundColor: "#4147e2", height: 160, borderRadius: 32, width: "40%", shadowColor: "#000", shadowOffset: { width: 0, height: 3, }, shadowOpacity: 0.27, shadowRadius: 4.65, elevation: 3, }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", }}>
                        <Text style={{ color: "#fff" }}>Status</Text>
                        <MaterialIcons name="filter-list-alt" size={16} color="#fff" />
                    </View>
                    <View style={{ flexDirection: "column", marginTop: "auto", marginBottom: "auto", marginLeft: "auto", marginRight: "auto" }}>
                        <Entypo name="line-graph" size={32} color="#fff" />
                    </View>
                    <View style={{ flexDirection: "column" }}>
                        <Text style={{ color: "#fff", fontSize: 20, fontWeight: "700" }}>₹ {this.state.userStatus}</Text>
                        <Text style={{ color: "#fff", fontSize: 10 }}>Your Status</Text>
                    </View>
                </View>;
            } else if (this.state.card_view === 2) {
                card_view = <View style={{ padding: 20, backgroundColor: "#4147e2", height: 160, borderRadius: 32, width: "40%", shadowColor: "#000", shadowOffset: { width: 0, height: 3, }, shadowOpacity: 0.27, shadowRadius: 4.65, elevation: 3, }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", }}>
                        <Text style={{ color: "#fff" }}>Current</Text>
                        <MaterialIcons name="filter-list-alt" size={16} color="#fff" />
                    </View>
                    <View style={{ flexDirection: "column", marginTop: "auto", marginBottom: "auto", marginLeft: "auto", marginRight: "auto" }}>
                        <Entypo name="line-graph" size={32} color="#fff" />
                    </View>
                    <View style={{ flexDirection: "column" }}>
                        <Text style={{ color: "#fff", fontSize: 20, fontWeight: "700" }}>₹ {this.state.userTotal}</Text>
                        <Text style={{ color: "#fff", fontSize: 10 }}>Your Total Ballance</Text>
                    </View>
                </View>;
            } else if (this.state.card_view === 3) {
                card_view = <View style={{ padding: 20, backgroundColor: "#4147e2", height: 160, borderRadius: 32, width: "40%", shadowColor: "#000", shadowOffset: { width: 0, height: 3, }, shadowOpacity: 0.27, shadowRadius: 4.65, elevation: 3, }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", }}>
                        <Text style={{ color: "#fff" }}>Total</Text>
                        <MaterialIcons name="filter-list-alt" size={16} color="#fff" />
                    </View>
                    <View style={{ flexDirection: "column", marginTop: "auto", marginBottom: "auto", marginLeft: "auto", marginRight: "auto" }}>
                        <Entypo name="line-graph" size={32} color="#fff" />
                    </View>
                    <View style={{ flexDirection: "column" }}>
                        <Text style={{ color: "#fff", fontSize: 20, fontWeight: "700" }}>₹ {this.state.totalBalance}</Text>
                        <Text style={{ color: "#fff", fontSize: 10 }}>Total Ballance</Text>
                    </View>
                </View>;
            }

            let details_now;

            if (this.state.card_view2 === 1) {
                details_now = <View style={{ padding: 20, backgroundColor: "#fff", height: 160, borderRadius: 32, width: "40%", shadowColor: "#000", shadowOffset: { width: 0, height: 3, }, shadowOpacity: 0.27, shadowRadius: 4.65, elevation: 3, }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <Text style={{ color: "#000" }}>Today</Text>
                        <AntDesign name="calendar" size={14} color="#000" />
                    </View>
                    <View style={{ flexDirection: "column", marginTop: "auto", marginBottom: "auto", marginLeft: "auto", marginRight: "auto" }}>
                        <Entypo name="area-graph" size={30} color="#0b37d9" />
                    </View>
                    <View style={{ flexDirection: "column" }}>
                        <Text style={{ color: "#000", fontSize: 30 }}>
                            ₹ {this.state.today_total == null ? (0) : (this.state.today_total)}
                        </Text>
                    </View>
                </View>;
            } else if (this.state.card_view2 === 2) {
                details_now = <View style={{ padding: 20, backgroundColor: "#fff", height: 160, borderRadius: 32, width: "40%", shadowColor: "#000", shadowOffset: { width: 0, height: 3, }, shadowOpacity: 0.27, shadowRadius: 4.65, elevation: 3, }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <Text style={{ color: "#000" }}>This Month</Text>
                        <AntDesign name="calendar" size={14} color="#000" />
                    </View>
                    <View style={{ flexDirection: "column", marginTop: "auto", marginBottom: "auto", marginLeft: "auto", marginRight: "auto" }}>
                        <SimpleLineIcons name="graph" size={30} color="#0b37d9" />
                    </View>
                    <View style={{ flexDirection: "column" }}>
                        <Text style={{ color: "#000", fontSize: 30 }}>
                            ₹ {this.state.month_total}
                        </Text>
                    </View>
                </View>;
            }

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
                        <ScrollView style={{ padding: 5, width: "100%", flexWrap: "wrap" }}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.refreshing}
                                    onRefresh={this._onRefresh.bind(this)}
                                />
                            }>
                            {this.state.isLoading ? (
                                <ActivityIndicator size={24} />
                            ) : (
                                    <View>
                                        <View style={{ width: "auto", flexDirection: "column", margin: 10, borderRadius: 10, elevation: 2, backgroundColor: "#fff" }}>
                                            <View>
                                                <View style={{ flexDirection: "row" }}>
                                                    <View style={{ width: "50%", paddingTop: 10, paddingLeft: 15, flexDirection: "column" }}>
                                                        <Text style={{ fontSize: 12, color: "#333333" }}>Overview</Text>
                                                        <Text style={{ fontSize: 20, fontWeight: "700", paddingTop: 5 }}>₹ {this.state.userTotal} <Text style={{ fontSize: 10, color: "#c4c4c4" }}> Your Total</Text></Text>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', marginLeft: "auto", marginRight: 20, alignItems: "center" }}>
                                                        <MaterialIcons name="compare-arrows" size={24} color="grey" />
                                                    </View>
                                                </View>
                                                <Dash style={{ width: "85%", height: 1, marginLeft: "auto", marginRight: "auto", marginTop: 10 }} dashThickness={1} dashColor="#ebebeb" dashLength={10} />
                                                <PieChart
                                                    data={this.state.allRecord}
                                                    width={(Dimensions.get("window").width) - (0.07 * Dimensions.get("window").width)}
                                                    height={220}
                                                    chartConfig={chartConfig1}
                                                    accessor={"price"}
                                                    backgroundColor={"transparent"}
                                                    paddingLeft={"15"}
                                                    center={[10, 50]}
                                                    hasLegend={true}
                                                    center={[0, 0]}
                                                    absolute
                                                />
                                            </View>
                                        </View>

                                        <View style={{ flexDirection: "row", width: "auto", justifyContent: "space-around", paddingVertical: 20 }}>
                                            <TouchableNativeFeedback
                                                onPress={() => this.setState({ card_view: this.state.card_view === 3 ? (1) : (this.state.card_view + 1) })}
                                                background={TouchableNativeFeedback.Ripple(this.state.rippleColor, this.state.rippleOverflow, 100)}
                                            >
                                                {card_view}
                                            </TouchableNativeFeedback>
                                            <TouchableNativeFeedback
                                                background={TouchableNativeFeedback.Ripple("rgba(0, 0, 0, .1)", this.state.rippleOverflow, 100)}
                                            >
                                                <View style={{ padding: 20, backgroundColor: "#fff", height: 160, borderRadius: 32, width: "40%", shadowColor: "#000", shadowOffset: { width: 0, height: 3, }, shadowOpacity: 0.27, shadowRadius: 4.65, elevation: 3, }}>
                                                    <View style={{ flexDirection: "row", marginBottom: "auto", justifyContent: "space-between", alignItems: "center" }}>
                                                        <Text style={{ color: "#000" }}>People</Text>
                                                        <AntDesign name="user" size={14} color="#000" />
                                                    </View>
                                                    <View style={{ flexDirection: "column", marginTop: "auto", marginBottom: "auto", marginLeft: "auto", marginRight: "auto" }}>
                                                        <Text style={{ fontSize: 35 }}>{this.state.noOfPerson}</Text>
                                                    </View>
                                                    <View style={{ flexDirection: "row", marginTop: "auto", marginBottom: "auto", flexWrap: "wrap" }}>
                                                        {this.state.users.map((item, i) => {
                                                            return (
                                                                item.image !== null ? (
                                                                    <Avatar
                                                                        size={24}
                                                                        rounded
                                                                        source={{
                                                                            uri:
                                                                                'https://skyably.com/paywithbuddy/Api/UserProfile/' + item.image,
                                                                        }}
                                                                    />
                                                                ) : (
                                                                        <Avatar
                                                                            size={24}
                                                                            rounded
                                                                            source={{
                                                                                uri:
                                                                                    'https://www.xovi.com/wp-content/plugins/all-in-one-seo-pack/images/default-user-image.png',
                                                                            }}
                                                                        />
                                                                    )
                                                            )
                                                        })}
                                                    </View>
                                                </View>
                                            </TouchableNativeFeedback>
                                        </View>

                                        <View style={{ flexDirection: "row", width: "auto", justifyContent: "space-around", paddingVertical: 10 }}>
                                            <View style={{ padding: 20, backgroundColor: "#fff", height: 160, borderRadius: 32, width: "40%", shadowColor: "#000", shadowOffset: { width: 0, height: 3, }, shadowOpacity: 0.27, shadowRadius: 4.65, elevation: 3, }}>

                                                <View style={{ flexDirection: "column", marginTop: "auto", marginBottom: "auto", marginLeft: "auto", marginRight: "auto" }}>
                                                    <ScrollView>
                                                        <Text style={{ fontSize: 12, marginBottom: 10 }}> {this.state.quotes.length ? (this.state.quotes[this.state.random].text) : (<ActivityIndicator size={15} />)} </Text>
                                                    </ScrollView>
                                                    <Text style={{ fontSize: 10, fontWeight: "700", textAlign: "right" }}> By - {this.state.quotes.length ? (this.state.quotes[this.state.random].author) : (null)} </Text>
                                                </View>
                                                {/* <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                                    <Fontisto name="day-cloudy" size={20} color="rgba(0, 0, 255, 1)" />
                                                    <Text style={{ position: "absolute", top: 18 }}>Comming Soon!!</Text>
                                                </View> */}
                                            </View>
                                            <TouchableNativeFeedback
                                                onPress={() => this.setState({ card_view2: this.state.card_view2 === 2 ? (1) : (this.state.card_view2 + 1) })}
                                                background={TouchableNativeFeedback.Ripple("rgba(0, 0, 0, .1)", this.state.rippleOverflow, 100)}
                                            >
                                                {details_now}
                                            </TouchableNativeFeedback>
                                        </View>
                                        <View style={{ marginVertical: 20 }}>
                                            <Text style={{ fontSize: 10, textAlign: "center", color: "#b5b5b5" }}>This page show you the details of selected dairy</Text>
                                            <Text style={{ fontSize: 10, textAlign: "center", color: "#b5b5b5" }}>© {(new Date().getFullYear())} Navneet Pal All Rights Reserved</Text>
                                        </View>
                                    </View>
                                )}
                        </ScrollView>
                    </View>
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
        backgroundColor: '#fff',
    },
    header: {
        flex: 1,
        width: "100%",
        borderBottomWidth: 1,
        borderColor: "#f2f2f2"
    },
    rest: {
        flex: 15,
        backgroundColor: "#f7f8fa",
        width: "100%",
    },
    navigationContainer: {
        backgroundColor: "#fff"
    },
});
