import { View, Text, FlatList, Image } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { db } from './../../configs/FirebaseConfig'
import { collection, getDocs, query } from 'firebase/firestore';

export default function Slider() {
    const [sliderList, setSliderList] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);

    useEffect(() => {
        GetSliderList();
    }, []);

    useEffect(() => {
        if (sliderList.length > 0) {
            const intervalId = setInterval(() => {
                setCurrentIndex((prevIndex) => 
                    (prevIndex + 1) % sliderList.length
                );

                if (flatListRef.current) {
                    flatListRef.current.scrollToIndex({
                        index: currentIndex,
                        animated: true
                    });
                }
            }, 5000); 

            return () => clearInterval(intervalId);
        }
    }, [sliderList, currentIndex]);
    
    const GetSliderList = async () => {
        setSliderList([]);
        const q = query(collection(db, 'Slider'));
        const querySnapshot = await getDocs(q);
        
        querySnapshot.forEach((doc) => {
            console.log(doc.data());
            setSliderList(prev => [...prev, doc.data()]);
        })
    }
    
    return (
        <View>
            <Text style={{
                fontFamily: 'outfit-bold',
                fontSize: 20,
                paddingLeft: 20,
                paddingTop: 20,
                marginBottom: 5
            }}>
              
              For Sales</Text>
            
            <FlatList
                ref={flatListRef}
                data={sliderList}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={{
                    paddingLeft: 20,
                }}
                renderItem={({item, index}) => (
                    <Image 
                        source={{uri: item.imageUrl}}
                        style={{
                            width: 250,
                            height: 150,
                            borderRadius: 15,
                            marginRight: 20
                        }}
                    />
                )}
                getItemLayout={(data, index) => ({
                    length: 270,
                    offset: 270 * index,
                    index,
                })}
            />
        </View>
    )
}