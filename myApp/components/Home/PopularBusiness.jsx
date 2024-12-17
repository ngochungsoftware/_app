import { View, Text, FlatList, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';

import { collection, getDocs, limit, query } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig';
import PopularBusinessCard from './PopularBusinessCard';
import { Colors } from '../../constants/Color';
import NewProduct from '../Product/NewProduct';

export default function PopularBusiness() {
  const [businessList, setBusinessList] = useState([]);

  useEffect(() => {
    GetBusinessList();
  }, []);

  const GetBusinessList = async () => {
    setBusinessList([]);
    const q = query(collection(db, 'BusinessList'), limit(10));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      setBusinessList((prev) => [...prev, { id: doc.id, ...doc.data() }]);
    });
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Product</Text>
        <Text style={styles.headerLink}>View All</Text>
      </View>

      {/* Business List */}
      <NewProduct/>
      <FlatList
        horizontal
        data={businessList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PopularBusinessCard business={item} />
        )}
        contentContainerStyle={styles.flatListContainer}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'outfit-bold',
    color: '#333',
  },
  headerLink: {
    fontFamily: 'outfit-medium',
    color: Colors.PRIMARY,
    fontSize: 14,
  },
  flatListContainer: {
    paddingLeft: 20,
  },
});
