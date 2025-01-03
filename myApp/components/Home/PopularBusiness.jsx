import { View, Text, FlatList, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'

import { collection, getDoc, getDocs, limit, query } from 'firebase/firestore'
import { db } from '../../configs/FirebaseConfig'
import PopularBusinessCard from './PopularBusinessCard'
import { Colors } from '../../constants/Color'

export default function PopularBusiness() {
  const [businessList,setBusinessList] = useState([]);
    useEffect(()=>{
        GetBusinessList();
        },[])
    const GetBusinessList = async ()=>{
      setBusinessList([]);
        const q= query(collection(db,'BusinessList'),limit(10));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc)=>{
            console.log(doc.data());
            setBusinessList(prev=>[...prev,{id:doc.id,...doc.data()}]);
        })
        
    }

  const [productList, setProductList] = useState([])
  useEffect(() => {
    GetAllProductList();
  }, [])

  const GetAllProductList = async () => {
    setProductList
  };


  return (
    <View>
      <View style={{
            paddingLeft:20,
            marginBottom:10,
            display:'flex',
            flexDirection:'row',
            justifyContent:'space-between',
            marginTop:20
        }}>
      <Text style ={{
        marginTop:5, 
        fontSize:20,
        fontFamily:'outfit-bold'
      }}>My Product
      </Text>
      <Text style={{
      fontFamily:'outfit-medium',
        color:Colors.PRIMARY,
      }}>View All</Text>
      </View>
      <FlatList
      horizontal={true}
      data={businessList}
      renderItem={({item,index})=>(
        <PopularBusinessCard
        key={index}
        business={item}
        />
      )}
      
      />
    </View>
  )
}