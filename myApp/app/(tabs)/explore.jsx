import React, { useContext, useEffect, useState } from "react";
import { Box, Button, useToast } from "native-base";
import { View, Text, TextInput, ScrollView, SafeAreaView, StyleSheet, RefreshControl } from "react-native";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axios from "axios";
import { AppContext } from "../../context/AppContext";

const API_BASE_URL = "http://10.24.28.9:8080/api/v1";
let stompClient = null;

export default function Explore() {
  const { setselectedOrder, selectedOrder, selectedOrderCode, setselectedOrderCode } = useContext(AppContext);
  const [listOrderDetail, setlistOrderDetail] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!selectedOrderCode) return;
    onGetOrderByCode();
  }, [selectedOrderCode]);

  useEffect(() => {
    initializeWebSocket();
    return () => stompClient && stompClient.disconnect(); // Cleanup WebSocket on unmount
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const onGetOrderByCode = async () => {
    if (!selectedOrderCode) {
      console.log("Vui lòng nhập mã đơn hàng.");
      return;
    }

    try {
      setlistOrderDetail([]);

      const response = await axios.get(
        `${API_BASE_URL}/orders/by-code/${selectedOrderCode}`
      )
      if (response.status === 200) {
        setselectedOrder(response.data)
        setlistOrderDetail(response.data.orderDetailResponseDTOS || []);
      }
    } catch (error) {
      console.error("Không tìm thấy đơn hàng.", error);

    }
  };

  const initializeWebSocket = () => {
    const urlSocket = `${API_BASE_URL}/ws-notifications`;
    stompClient = Stomp.over(() => new SockJS(urlSocket));
    stompClient.reconnect_delay = 5000;

    stompClient.connect(
      {},
      () => {
        console.log("WebSocket connected!");
        stompClient.subscribe("/has-change/messages", (message) => {
          console.log("Received WebSocket message 1:", message.body);
          onGetOrderByCode();
        });
        stompClient.subscribe("/has-change-order-in-store-coder/messages", (message) => {
          console.log("Received WebSocket message 2:", message.body);
          setselectedOrderCode(message.body);
        });
      },
      (error) => {
        console.error("WebSocket connection error:", error);
      }
    );
  };

  const updateQuantity = async (itemId, newQuantity) => {
    try {
      await axios.get(
        `${API_BASE_URL}/order-details/quantity/update/${itemId}?quantity=${newQuantity}`
      );
      onGetOrderByCode();
    } catch (error) {
      console.error("Failed to update quantity", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View style={styles.header}>
          <Text style={styles.title}>Hóa đơn #{selectedOrderCode}</Text>
          {/* <TextInput
            style={styles.input}
            placeholder="Nhập mã đơn hàng"
            onChangeText={(value) => setselectedOrderCode(value)}
          />
          <Button title="Get Order Data" onPress={onGetOrderByCode} /> */}
        </View>

        <View>
          {listOrderDetail.map((item, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.text}>Sản phẩm: {item.productDetailResponseDTO.code}</Text>
              <Text style={styles.text}>Số lượng: {item.quantity}</Text>
              <View style={styles.buttonGroup}>
                <Button onPress={() => updateQuantity(item.id, item.quantity + 1)} colorScheme={"orange"}>+</Button>
                <Button onPress={() => updateQuantity(item.id, item.quantity - 1)} colorScheme={"orange"}>-</Button>
              </View>
            </View>
          ))}
        </View>
        {/* <View style={{
          position: "absolute", 
          bottom: 20,
          left: 0,
          right: 0,
          padding: 10,
        }}>
          <Text>Cần thanh toán: {selectedOrder?.total || 0}</Text>
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  text: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});
