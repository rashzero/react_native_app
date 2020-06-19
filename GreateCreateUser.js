import React from 'react';
import { Text, View, Image, ListView } from 'react-native';

export default function GreateCreateUser(props) {
  return (
    <View style={{ alignItems: "center", flex: 1, justifyContent: 'center', flexDirection: 'column', }}>
      <Image
        source={{ uri: "https://reactnative.dev/docs/assets/p_cat1.png" }}
        style={{ width: 200, height: 200 }}
      />
      <View>
        <Text style={{ color: "green" }}>{props.message}</Text>
      </View>
    </View>
  )
}
