import { View, Text, Image, TextInput } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/Color';
export default function Header() {

  return (
    <View style={{
        padding:20,
        paddingTop:40,
        backgroundColor:Colors.PRIMARY,
        borderBottomLeftRadius:20,
        borderBottomRightRadius:20
    }}>
      <View style={{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        gap:10
      }}>
        <View>
            <Text style={{
                color:'#fff'
            }}>Welcome</Text>
        </View>
      </View>
      <View style={{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        gap:10,
        backgroundColor:'#fff',
        padding:10,
        marginHorizontal:10,
        marginTop : 15,
        borderRadius:8
      }}>
        <Ionicons name="search" size={24} color={Colors.PRIMARY} />
        <TextInput placeholder='search...'
        style={{
            fontFamily:'outfit',
            fontSize:16
        }} />
      </View>
    </View>
  )
}