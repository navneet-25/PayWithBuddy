import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, StyleSheet, View, Text } from 'react-native';
import { NavigationEvents } from 'react-navigation';

class Auth extends Component {

    constructor(props) {
        super(props);
        this.state = {
            auth: '',
            email: ''
        }
    }

    componentDidMount() {

        const value = AsyncStorage.getItem('Auth')
            .then(value => {

                if (value === "logged") {
                    this.props.navigation.navigate('First')
                    // Dashboard 
                }
                else {
                    this.props.navigation.navigate('LogIn')
                }
            })

            .catch(error => {
                if (error !== "") {
                    this.props.navigation.navigate('LogIn')
                }

            });

    }

    render() {

        return (
            <View style={styles.container}>
                <ActivityIndicator size={50} color="#0000ff" />
            </View>
        );
    }
}
export default Auth;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});