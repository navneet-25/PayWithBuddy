import React from 'react';
import { Component } from 'react';
import {
    StyleSheet, StatusBar, Text, View, ScrollView,
    DrawerLayoutAndroid, Image, TouchableHighlight,
    RefreshControl, ActivityIndicator, Dimensions
} from 'react-native';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrawerActions } from 'react-navigation-drawer';
import {
    LineChart
} from "react-native-chart-kit";
import { Divider } from 'react-native-paper';
import { NavigationEvents } from 'react-navigation';


export default class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {
            itemName: '',
            itemPrice: '',
            drawerPosition: "left",
            allDairys: [],
            user_expence: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            customer_id: null,
            customer_name: null,
            customer_email: null,
            isLoading: true,
            refreshing: false
        }

        this.add_to_dairy = React.createRef();

    }

    async componentDidMount() {

        this.setState({ customer_id: await AsyncStorage.getItem("user_id"), customer_name: await AsyncStorage.getItem("user_name"), customer_email: await AsyncStorage.getItem("email") });

        if (this.state.customer_id === null) {
            this.props.navigation.navigate('LogIn');
        }

        this.showDairy();

        this.userExpenseData();

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

    userExpenseData = () => {
        fetch('http://skyably.com/paywithbuddy/Api/fetch_user_data.php', {
            method: 'post',
            header: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({

                masterkey: this.state.customer_id,

            })

        })
            .then((response) => response.json())
            .then((responseJson) => {

                let myData = [];
                responseJson.forEach((item) => {
                    myData.push(item.month_count);
                })

                this.setState({
                    user_expence: myData,
                    isLoading: false,
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
        this.userExpenseData();
    }


    render() {

        const chartConfig = {
            backgroundGradientFrom: "#fff",
            backgroundGradientFromOpacity: 0,
            backgroundGradientTo: "#fff",
            backgroundGradientToOpacity: 0.5,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            strokeWidth: 2, // optional, default 3
            barPercentage: 0.5,
            useShadowColorFromDataset: false // optional
        };

        const data = {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [
                {
                    data: this.state.user_expence,
                    color: (opacity = 1) => `#0b37d9`, // optional
                    strokeWidth: 1 // optional
                }
            ],
            legend: ["Your Expenditure Of " + new Date().getFullYear()] // optional
        };

        if (this.state.isLoading) {
            return (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator size={30} color="#0000ff" />
                </View>
            )
        } else {
            return (
                <View style={styles.container}>
                    <StatusBar barStyle="dark-content" backgroundColor="#fff" />
                    <NavigationEvents
                        onWillFocus={() => {
                            this.componentDidMount();
                        }}
                    />
                    <View style={styles.header}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 10 }}>
                            <MaterialCommunityIcons name="text" size={30} style={{ color: "#000" }} onPress={() => this.props.navigation.dispatch(DrawerActions.openDrawer())} />
                            <Text style={{ color: "#000", fontSize: 20 }}>Details</Text>
                            <AntDesign name="user" size={30} style={{ color: "#000" }} onPress={() => this.props.navigation.navigate('Profile')} />
                        </View>
                    </View>
                    <View style={styles.rest}>
                        <ScrollView
                            style={{ flexGrow: 0, flexShrink: 0 }}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.refreshing}
                                    onRefresh={this._onRefresh.bind(this)}
                                />
                            }>
                            <View style={{ width: "auto", flexDirection: "row", margin: 10, borderRadius: 10, paddingHorizontal: 2, elevation: 2, backgroundColor: "#fff" }}>
                                <View>
                                    <LineChart
                                        data={data}
                                        width={(Dimensions.get("window").width) - (0.07 * Dimensions.get("window").width)}
                                        height={256}
                                        verticalLabelRotation={0}

                                        fromZero={true}
                                        yAxisLabel="₹"
                                        withInnerLines={false}
                                        chartConfig={chartConfig}
                                        bezier
                                    />
                                </View>
                            </View>
                        </ScrollView>
                        <Divider />
                        <Text style={{ paddingLeft: 15, paddingTop: 10, paddingBottom: 5, fontSize: 16, fontWeight: "700", color: "#cecece" }}>Dairy Details:</Text>
                        <ScrollView style={{ padding: 5, width: "100%", flexWrap: "wrap" }}>
                            {this.state.allDairys.map((item, i) => {
                                return (
                                    <TouchableHighlight
                                        key={i}
                                        activeOpacity={0.6}
                                        style={{ width: "auto", padding: 20, margin: 5, borderRadius: 10, elevation: 2, backgroundColor: "#fff" }}
                                        underlayColor="#DDDDDD"
                                        onPress={() => this.props.navigation.navigate("Dairy_data", { code: item.dairy_code, name: item.name })}>
                                        <View style={{ flexDirection: "row", }} >
                                            <View style={{ flexDirection: "column", width: "100%", justifyContent: "center" }}>
                                                <Text style={{ fontSize: 14, fontWeight: "700" }}>{item.name}</Text>
                                            </View>
                                            <View style={{ flexDirection: "column", marginLeft: "auto", marginRight: 10 }}>
                                                <AntDesign name="rightcircle" size={24} color="black" />
                                            </View>
                                        </View>
                                    </TouchableHighlight>
                                )
                            })}

                            {/* <View style={{ width: "100%", flexDirection: "row", margin: 10, borderRadius: 10, elevation: 2, backgroundColor: "#fff" }}>
                                <View>
                                    <PieChart
                                        data={dataPie}
                                        width={(Dimensions.get("window").width) - (0.07 * Dimensions.get("window").width)}
                                        height={220}
                                        chartConfig={chartConfig1}
                                        accessor={"population"}
                                        backgroundColor={"transparent"}
                                        paddingLeft={"15"}
                                        center={[10, 50]}
                                        hasLegend={true}
                                        center={[0, 0]}
                                        absolute
                                    />
                                </View>
                            </View> */}

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
    },
    rest: {
        flex: 15,
        backgroundColor: "white",
        width: "100%",
    },
    navigationContainer: {
        backgroundColor: "#fff"
    },
});
