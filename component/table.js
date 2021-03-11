import React from 'react';
import { DataTable } from 'react-native-paper';
import { StyleSheet, Text, SafeAreaView, ScrollView, RefreshControl } from 'react-native';
import ShowItemModel from './showItem';
import { View } from 'react-native';


export default class MyComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            refreshing: false,
            item_id: ''
        }

        this.showDataModel = React.createRef();
    }

    componentDidMount() {

    }

    showData = async (e) => {
        this.setState({ item_id: await e });
        this.showDataModel.current.setModalVisible(true);
    }

    _onRefresh() {
        this.setState({ refreshing: true });
        this.props.functionRecord();
    }

    render() {
        return (
            <View>
                <DataTable style={{ flexWrap: "wrap" }}>
                    <DataTable.Header>
                        <DataTable.Title style={{ marginLeft: 30 }} >Name</DataTable.Title>
                        <DataTable.Title style={{ justifyContent: "center" }} numeric>Item</DataTable.Title>
                        <DataTable.Title style={{ marginRight: 20 }} numeric>Price</DataTable.Title>
                    </DataTable.Header>

                    <ScrollView style={{ padding: 10, height: "100%" }} refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh.bind(this)}
                        />
                    } >

                        {this.props.records !== null ? (
                            this.props.records.map((items, i) => {
                                return (
                                    <DataTable.Row key={i} onPress={() => this.showData(items.id)} style={{ padding: 20, marginVertical: 5, borderRadius: 5, backgroundColor: "#f6f8fa", elevation: 1 }}>
                                        <DataTable.Cell style={{ flex: 5, flexDirection: "row", justifyContent: "center" }}>{items.name}</DataTable.Cell>
                                        <DataTable.Cell style={{ flex: 11, marginHorizontal: 5, flexDirection: "row", justifyContent: "center" }}>{items.item}</DataTable.Cell>
                                        <DataTable.Cell style={{ flex: 3, flexDirection: "row", justifyContent: "center" }}>₹ {items.price}</DataTable.Cell>
                                    </DataTable.Row>
                                )
                            })
                        ) : (
                                <View style={{ flex: 1 }}>
                                    <Text style={{ textAlign: "center", marginTop: 120 }}>No Record Yet</Text>
                                </View>
                            )
                        }

                    </ScrollView>

                </DataTable>
                <ShowItemModel ref={this.showDataModel} id={this.state.item_id} />
            </View>
        );
    }
}