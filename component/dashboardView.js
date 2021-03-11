import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { View, Text } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';

const dashboard = (props) => {
    let statusDisplay = null;
    if (props.status > 0) {
        statusDisplay = <Title style={{ color: "#3BAC0D" }}>₹ {props.status} <AntDesign name="caretup" /></Title>;
    } else {
        statusDisplay = <Title style={{ color: "#e80000" }}>₹ {props.status} <AntDesign name="caretdown" /></Title>;
    }
    return (
        <Card style={{ elevation: 15 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginVertical: 18 }}>
                <Card.Content style={{ borderRightWidth: 1, borderStyle: "dashed", borderColor: "#e0e0e0" }}>
                    {statusDisplay}
                    <Paragraph style={{ fontSize: 13, fontWeight: "700", textAlign: "center" }}>Status</Paragraph>
                </Card.Content>
                <Card.Content>
                    <Title style={{ margin: 0, textAlign: "center" }}>₹ {props.yourTotal > 0 ? (props.yourTotal) : ("0")} </Title>
                    <Paragraph style={{ fontSize: 13, fontWeight: "700", textAlign: "center" }}>Your Total</Paragraph>
                    <Text style={{ fontSize: 8, textAlign: "right" }}>(For/{props.days} Days)</Text>
                </Card.Content>
                <Card.Content>
                    <Title style={{ margin: 0, textAlign: "center" }}>₹ {props.grandTotal > 0 ? (props.grandTotal) : ("0")} </Title>
                    <Paragraph style={{ fontSize: 13, fontWeight: "700", textAlign: "center" }}>Grand Total</Paragraph>
                    <Text style={{ fontSize: 8, textAlign: "right" }}>(For/{props.days} Days)</Text>
                </Card.Content>
            </View>
        </Card>
    )
}

export default dashboard;