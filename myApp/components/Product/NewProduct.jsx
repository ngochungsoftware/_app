import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    StyleSheet,
    Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import {API_BASE_URL} from "../../constants/API"

export default function NewProduct() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoveredProductId, setHoveredProductId] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(10);
    const [totalElement, setTotalElement] = useState(0);

    const router = useRouter();

    const windowWidth = Dimensions.get('window').width;
    const cardWidth = (windowWidth - 30) / 2;

    const formatToVND = (priceInUSD) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(priceInUSD);
    };

    const navigateToProductDetail = (productid) => {
        router.push(`/productdetail/${productid}`);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(
                    `${API_BASE_URL}/productDetails/event?page=${currentPage}&size=${pageSize}`
                );
                const data = await response.json();
                setProducts(data.content || []);
                setTotalElement(data.totalElements || 0);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching products:', error);
                setLoading(false);
            }
        };

        fetchProducts();
    }, [currentPage, pageSize]);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.list}>
                <View style={styles.row}>
                    {products.map((item) => (
                        <View
                            key={item.productId}
                            style={[styles.card, { width: cardWidth }]}
                        >
                            <TouchableOpacity
                                style={styles.imageContainer}
                                onPressIn={() => setHoveredProductId(item.productId)}
                                onPressOut={() => setHoveredProductId(null)}
                            >
                                <Image
                                    source={{
                                        uri:
                                            hoveredProductId === item.productId && item.image?.length > 1
                                                ? item.image[1]
                                                : item.image?.[0] || '',
                                    }}
                                    style={styles.image}
                                />
                            </TouchableOpacity>
                            <View style={styles.info}>
                                <Text
                                    style={styles.productName}
                                    numberOfLines={2}
                                    ellipsizeMode="tail"
                                >
                                    {item.productName}
                                </Text>
                                <Text style={styles.productCode}>{item.productCode}</Text>
                                <Text style={styles.price}>
                                    {item.listEvent?.length > 0 ? (
                                        <View style={styles.priceContainer}>
                                            <Text style={styles.salePrice}>
                                                {formatToVND(item.price * (1 - (item.discountPercent || 0) / 100))}
                                            </Text>
                                            <Text style={styles.originalPrice}>
                                                {formatToVND(item.price)}
                                            </Text>
                                        </View>
                                    ) : (
                                        <Text>{formatToVND(item.price)}</Text>
                                    )}
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={styles.addToCartButton}
                                activeOpacity={0.7}
                                onPress={() => navigateToProductDetail(item.productId)}
                            >
                                <Text style={styles.addToCartText}>Add to Cart</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    list: {
        padding: 10,
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 15,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    imageContainer: {
        marginBottom: 10,
        borderRadius: 8,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 180,
        resizeMode: 'cover',
    },
    info: {
        marginBottom: 12,
    },
    productName: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
        color: '#333',
        height: 40, // Fixed height for 2 lines
    },
    productCode: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },

    priceContainer: {
        flexDirection: 'row', // Hiển thị hai giá tiền theo chiều ngang
        alignItems: 'center', // Căn giữa các thành phần theo chiều dọc
    },
    salePrice: {
        color: '#e41e31',
        fontWeight: 'bold',
        marginRight: 8, // Thêm khoảng cách giữa giá khuyến mãi và giá gốc
    },
    originalPrice: {
        color: '#666',
        textDecorationLine: 'line-through',
        fontSize: 12,
    },
    addToCartButton: {
        backgroundColor: '#007AFF',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    addToCartText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
});