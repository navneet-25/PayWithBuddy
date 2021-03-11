import React, { createRef } from 'react';
import { Component } from 'react';
import { View, Text, Image, TouchableHighlight, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';
import { Icon, Avatar, ListItem } from 'react-native-elements';
import { Divider } from 'react-native-paper';

export default class Custom_drawer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            customer_id: null,
            customer_name: null,
            customer_email: null,
            image: null,
            isLoading: true,
            refreshing: false
        }

        this.add_to_dairy = React.createRef();
    }

    componentDidMount = async () => {
        this.setState({
            customer_id: await AsyncStorage.getItem("user_id"),
            customer_name: await AsyncStorage.getItem("user_name"),
            customer_email: await AsyncStorage.getItem("email")
        });

        fetch('https://skyably.com/paywithbuddy/Api/fetchuser.php', {
            method: 'post',
            header: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({

                email: this.state.customer_email,

            })

        })
            .then((response) => response.json())
            .then((responseJson) => {

                this.setState({ image: responseJson.user_data[0].image })

            })
    }

    render() {
        return (
            <View style={[styles.container, styles.navigationContainer]}>
                <View>
                    <Image
                        style={{ width: "100%", height: 150 }}
                        resizeMode="cover"
                        source={{ uri: 'https://media.istockphoto.com/vectors/paper-layer-blue-abstract-background-use-for-banner-cover-poster-vector-id1189542390?k=6&m=1189542390&s=170667a&w=0&h=6J10umbrZvGWfFud6InjlelYzsjV_hixqIB0RYfvB-8=' }}
                    />
                    {this.state.image !== null ? (
                        <Avatar
                            containerStyle={{ position: "absolute", top: "10%", left: "6%", borderColor: "#fff", borderWidth: 1 }}
                            size={65}
                            renderPlaceholderContent={<ActivityIndicator />}
                            source={{
                                uri: 'https://skyably.com/paywithbuddy/Api/UserProfile/' + this.state.image,
                            }}
                            rounded
                        >
                        </Avatar>
                    ) : (
                            <Avatar
                                containerStyle={{ position: "absolute", top: "10%", left: "6%", borderColor: "#fff", borderWidth: 1 }}
                                size={65}
                                source={{
                                    uri: 'https://www.xovi.com/wp-content/plugins/all-in-one-seo-pack/images/default-user-image.png',
                                }}
                                rounded
                            >
                            </Avatar>
                        )}
                    <Text style={{ position: "absolute", top: "62%", left: "6%", color: "#fff", fontSize: 16 }}>{this.state.customer_name}</Text>

                    <Text style={{ position: "absolute", top: "80%", left: "6%", color: "#fff", fontSize: 12 }}>{this.state.customer_email}</Text>
                </View>

                <View>
                    <TouchableHighlight
                        activeOpacity={0.6}
                        underlayColor="#DDDDDD"
                        onPress={() => this.props.navigation.navigate('First')}>
                        <Text style={{ paddingVertical: 20, paddingLeft: 21 }}> <AntDesign name="home" size={20} />  Home </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        activeOpacity={0.6}
                        underlayColor="#DDDDDD"
                        onPress={() => this.props.navigation.navigate('DetailPage')}>
                        <Text style={{ paddingVertical: 20, paddingLeft: 21 }}> <AntDesign name="barschart" size={20} />  Analytics </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        activeOpacity={0.6}
                        underlayColor="#DDDDDD"
                        onPress={() => this.props.navigation.navigate('Profile')}>
                        <Text style={{ paddingVertical: 20, paddingLeft: 21 }}> <AntDesign name="user" size={20} />  Profile </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        activeOpacity={0.6}
                        underlayColor="#DDDDDD"
                        onPress={() => this.props.navigation.navigate('Log')} >
                        <Text style={{ paddingVertical: 20, paddingLeft: 21 }}> <AntDesign name="clockcircleo" size={18} />  Logs </Text>
                    </TouchableHighlight>
                    <Divider style={{ width: "80%", marginLeft: "auto", marginRight: "auto" }} />
                    <TouchableHighlight
                        activeOpacity={0.6}
                        underlayColor="#DDDDDD"
                        onPress={() => alert('Pressed!')}>
                        <Text style={{ paddingVertical: 20, paddingLeft: 21 }}> <AntDesign name="setting" size={20} />  Settings </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        activeOpacity={0.6}
                        underlayColor="#DDDDDD"
                        onPress={() => alert('Pressed!')}>
                        <Text style={{ paddingVertical: 20, paddingLeft: 21 }}> <AntDesign name="questioncircle" size={18} />  Help </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        activeOpacity={0.6}
                        underlayColor="#DDDDDD"
                        onPress={() => this.logOut()}>
                        <Text style={{ paddingVertical: 20, paddingLeft: 21 }}> <AntDesign name="poweroff" size={15} />  Log Out </Text>
                    </TouchableHighlight>
                </View>

                <View style={{ position: "absolute", bottom: 15, width: "100%" }}>
                    <Divider style={{ marginBottom: 8, width: "80%", marginLeft: "auto", marginRight: "auto" }} />
                    <Text style={{ fontSize: 12, textAlign: "center", color: "#b5b5b5" }}>Creater: Er. Vijay Singh Rajput</Text>
                    <Text style={{ fontSize: 12, textAlign: "center", color: "#b5b5b5", marginTop: 5 }}>Design & Developed by Navneet Pal</Text>
                </View>
            </View>
        )
    }

    logOut = () => {
        AsyncStorage.clear().then(this.props.navigation.navigate("Auth"));
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
