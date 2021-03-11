import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { Avatar, ListItem } from 'react-native-elements';
import { MaterialCommunityIcons, Ionicons, Entypo, FontAwesome, AntDesign } from '@expo/vector-icons';
import { Snackbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

export default class Profile extends Component {

    constructor(props) {
        super(props);

        this.state = {
            snackbarVisible: false,
            snackbarMessage: '',
            snackbarCount: 0,
            name: null,
            phone: null,
            email: null,
            masterkey: null,
            lodingImageTaken: false,
            image: null,
            isLoading: false,
            takenImage: null
        }
    }

    async componentDidMount() {

        this.setState({
            name: await AsyncStorage.getItem("user_name"),
            phone: await AsyncStorage.getItem("user_phone"),
            email: await AsyncStorage.getItem("email"),
            masterkey: await AsyncStorage.getItem("user_id")
        })

        fetch('https://skyably.com/paywithbuddy/Api/fetchuser.php', {
            method: 'post',
            header: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({

                email: this.state.email,

            })

        })
            .then((response) => response.json())
            .then((responseJson) => {

                this.setState({ image: responseJson.user_data[0].image })

            })

    }

    async UploadPic() {

        this.setState({ isLoading: true });

        let uploadData = new FormData();

        uploadData.append('file', { uri: this.state.takenImage, name: 'uploadimagetmp.jpg', filename: 'imageName.png', type: 'image/jpg' });
        uploadData.append('email', this.state.email);
        uploadData.append('masterkey', this.state.masterkey);

        await fetch('https://skyably.com/paywithbuddy/Api/uploadimage.php', {
            method: 'post',
            header: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: uploadData
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                if (responseJson == 'yes') {

                    this.setState({ isLoading: false, lodingImageTaken: false, takenImage: null });
                    this.componentDidMount();
                }

                else { Alert.alert("Profile Update Failed"); }

            })
            .catch((error) => {
                console.error(error);
            });

    }

    getPermissionAsync = async () => {

        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        if (status !== 'granted') {
            Alert.alert('Sorry, we need camera roll permissions to make this work!');
        }

    }

    _pickImage = async () => {
        await this.getPermissionAsync();
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 4],
        });
        if (!result.cancelled) {
            this.setState({ takenImage: result.uri, lodingImageTaken: true });
            // console.log('image data', result)

        }
    }

    render() {
        const image = { uri: "https://i.pinimg.com/736x/ac/0f/b5/ac0fb52181d73c9989406b9b8042bb2a.jpg" };
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor="#0b37d9" />
                <View style={styles.header}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 10 }}>
                        <Ionicons name="arrow-back" size={30} style={{ color: "#fff", fontWeight: "300" }} onPress={() => this.props.navigation.goBack()} />
                        <Entypo name="dots-three-vertical" size={25} style={{ color: "#fff", fontWeight: "300" }} onPress={() => { this.state.snackbarCount === 0 ? this.setState({ snackbarVisible: true, snackbarMessage: "Abhi ispe kaam chl rha hai!", snackbarCount: 1 }) : this.setState({ snackbarVisible: true, snackbarMessage: "Kh rhe kaam chl rha hai madherchod" }) }} />
                    </View>
                </View>
                <View style={styles.rest}>
                    <View style={{ width: "100%", flex: 1, justifyContent: "center", flexDirection: "row", position: "relative", top: -50 }}>

                        {this.state.takenImage !== null ? (
                            <Avatar
                                containerStyle={{ elevation: 5, borderWidth: 2, borderColor: "#fff" }}
                                size={100}
                                source={{
                                    uri: this.state.takenImage,
                                }}
                                rounded
                            >
                                {this.state.isLoading ? (
                                    <View style={{ position: "absolute", bottom: 0, right: 0 }}>
                                        <ActivityIndicator size={20} color="#0b37d9" />
                                    </View>
                                ) : (
                                        <Entypo name="upload" size={14} color="#fff"
                                            onPress={() => this.UploadPic()}
                                            style={{
                                                backgroundColor: "#919191",
                                                borderRadius: 50,
                                                position: "absolute",
                                                bottom: 0,
                                                right: 0,
                                                padding: 3
                                            }} />
                                    )}

                            </Avatar>
                        ) : (
                                this.state.image !== null ? (
                                    <Avatar
                                        containerStyle={{ elevation: 5, borderWidth: 2, borderColor: "#fff" }}
                                        size={100}
                                        renderPlaceholderContent={<ActivityIndicator />}
                                        source={{
                                            uri: 'https://skyably.com/paywithbuddy/Api/UserProfile/' + this.state.image,
                                        }}
                                        rounded
                                    >
                                        <Avatar.Accessory size={20} onPress={() => this._pickImage()} />
                                    </Avatar>
                                ) : (
                                        <Avatar
                                            containerStyle={{ elevation: 5, borderWidth: 2, borderColor: "#fff" }}
                                            size={100}
                                            source={{
                                                uri: 'https://www.xovi.com/wp-content/plugins/all-in-one-seo-pack/images/default-user-image.png',
                                            }}
                                            rounded
                                        >
                                            <Avatar.Accessory size={20} onPress={() => this._pickImage()} />
                                        </Avatar>
                                    )

                            )}

                    </View>

                    <View style={{ flex: 1, width: "100%", marginTop: 10 }}>
                        <Text style={{ fontSize: 22, fontWeight: "700", textAlign: "center" }}>{this.state.name}</Text>
                        <Text style={{ fontSize: 13, paddingTop: 5, textAlign: "center", color: "#bbbbbb" }}>{this.state.email}</Text>
                    </View>

                    <View style={{ flex: 10, marginTop: 10, width: "100%", justifyContent: "center" }}>
                        <View style={{ flex: 1, padding: 20 }}>
                            <View style={{ flex: 1, borderRadius: 5, elevation: 2, backgroundColor: "#fff" }}>
                                <View style={{ paddingVertical: 20, paddingHorizontal: 20, fontSize: 12, backgroundColor: "#edf1f7", flexDirection: "row" }}>
                                    <Text style={{ color: "#3fa600", fontSize: 12 }}>Personal Details:</Text>
                                    <Text style={{ color: "#9f9f9f", fontSize: 12, marginLeft: "auto" }} onPress={() => { this.state.snackbarCount === 0 ? this.setState({ snackbarVisible: true, snackbarMessage: "Abhi ispe kaam chl rha hai!", snackbarCount: 1 }) : this.setState({ snackbarVisible: true, snackbarMessage: "Kh rhe kaam chl rha hai madherchod" }) }}> Edit <FontAwesome name="pencil" /></Text>
                                </View>
                                <View style={{ flex: 1, }}>
                                    <ListItem>
                                        <ListItem.Content>
                                            <ListItem.Subtitle style={{ paddingVertical: 10 }}>Name: <ListItem.Title style={{ fontSize: 13 }}> {this.state.name} </ListItem.Title></ListItem.Subtitle>
                                            <ListItem.Subtitle style={{ paddingVertical: 10 }}>Email: <ListItem.Title style={{ fontSize: 13 }}> {this.state.email} </ListItem.Title></ListItem.Subtitle>
                                            <ListItem.Subtitle style={{ paddingVertical: 10 }}>Phone: <ListItem.Title style={{ fontSize: 13 }}> {this.state.phone}</ListItem.Title></ListItem.Subtitle>
                                            <ListItem.Subtitle style={{ paddingVertical: 10 }}>Referral Code: <ListItem.Title style={{ fontSize: 13 }}> WORKING0%ONIT</ListItem.Title></ListItem.Subtitle>
                                        </ListItem.Content>
                                    </ListItem>
                                </View>
                            </View>
                            <View style={{ flex: 1, borderRadius: 5, elevation: 2, backgroundColor: "#fff", marginTop: 10, justifyContent: "center", alignItems: "center" }}>
                                <Text>Working On it!!</Text>
                            </View>
                        </View>
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
        backgroundColor: "#0b37d9"
    },
    header: {
        flex: 2,
    },
    rest: {
        flex: 12,
        width: "auto",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
    },
});