import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import ProductScreen from '../../components/Product/ProductScreen'

export default function product() {
  return (
    <View style={{ backgroundColor: "white", height: "100%" }}>
      <ScrollView>
        <ProductScreen/>
      </ScrollView>
    </View>
  )
}