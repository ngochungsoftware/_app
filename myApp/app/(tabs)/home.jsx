import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import Header from '../../components/Home/Header'
import Slider from '../../components/Home/Slider'
import PopularBusiness from '../../components/Home/PopularBusiness'
import Category from '../../components/Home/Category'
import ProductScreen from '../../components/Product/ProductScreen'

export default function home() {
  return (
    <ScrollView>
      <Header/>
      <Slider/>
      <PopularBusiness/>
      <View style={{ height:50}}>
      </View>
    </ScrollView>
  )
}