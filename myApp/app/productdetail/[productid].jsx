import React, { useEffect, useState, useContext } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    ActivityIndicator,
    StyleSheet,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome'; // Adjust the import based on your icon library
import { API_BASE_URL } from "../../constants/API"
import { AppContext } from "../../context/AppContext";

const { width } = Dimensions.get('window');


const defaultImage = 'https://via.placeholder.com/150'; // Define a default image URL

export default function ProductDetailScreen() {
    const { selectedOrder } = useContext(AppContext);
    const { productid } = useLocalSearchParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [listProductDetail, setListProductDetail] = useState([]);
    const [listColor, setListColor] = useState([]);
    const [listSize, setListSize] = useState([]);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedProductDetail, setSelectedProductDetail] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [priceRange, setPriceRange] = useState(null);
    const [salePercent, setSalePercent] = useState(0);

    console.log('Product ID:', productid);

    // useEffect(() => {
    //     const fetchProductDetails = async () => {
    //         try {
    //             if (!productid) {
    //                 console.error('No product ID provided');
    //                 setLoading(false);
    //                 return;
    //             }

    //             const response = await axios.get(
    //                 `http://192.168.1.150:8080/api/v1/productDetails/${productid}`
    //             );

    //             setProduct(response.data);
    //             setLoading(false);
    //         } catch (error) {
    //             console.error('Error fetching product details:', error);
    //             setLoading(false);
    //         }
    //     };

    //     fetchProductDetails();
    // }, [productid]);

    // if (loading) {
    //     return (
    //         <View style={styles.center}>
    //             <ActivityIndicator size="large" color="#0000ff" />
    //         </View>
    //     );
    // }

    // const onHandleAddToCart = async (product_detail_id) => {
    //     const data = {
    //         "orderId": selectedOrder.id,
    //         "quantity": quantity,
    //         "productDetailId": product_detail_id,
    //         // "averageDiscountEventPercent": 8
    //     }
    //     await axios.post(`${API_BASE_URL}/order-details`, data).then(function (response) {
    //         console.log(response)
    //     })
    // }

    useEffect(() => {
        const fetchInitialData = async () => {
            if (!productid) {
                console.error('No product ID provided');
                setLoading(false);
                return;
            }

            try {
                const productDetailResponse = await axios.get(`${API_BASE_URL}/productDetails/product-detail-of-product/${productid}`);
                setListProductDetail(productDetailResponse.data);
                setPriceRange(calculatePriceRange(productDetailResponse.data));

                const productResponse = await axios.get(`${API_BASE_URL}/product/${productid}`);
                setProduct(productResponse.data);
                if (productResponse.data.eventDTOList && productResponse.data.eventDTOList.length > 0) {
                    setSalePercent(productResponse.data.eventDTOList[0].discountPercent);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [productid]);

    useEffect(() => {
        if (listProductDetail.length > 0) {
            const uniqueColors = listProductDetail.reduce((acc, item) => {
                if (!acc.some((color) => color.code === item.color.code)) {
                    acc.push(item.color);
                }
                return acc;
            }, []);

            const uniqueSizes = listProductDetail.reduce((acc, item) => {
                if (!acc.some((size) => size.id === item.size.id)) {
                    acc.push(item.size);
                }
                return acc;
            }, []);

            setListColor(uniqueColors);
            setListSize(uniqueSizes);

            if (uniqueColors.length > 0) {
                setSelectedColor(uniqueColors[0]);
            }
            if (uniqueSizes.length > 0) {
                setSelectedSize(uniqueSizes[0]);
            }
        }
    }, [listProductDetail]);

    useEffect(() => {
        if (selectedColor && selectedSize) {
            const productDetail = listProductDetail.find(
                (item) => item.color.id === selectedColor.id && item.size.id === selectedSize.id
            );
            setSelectedProductDetail(productDetail ?? null);
        }
    }, [selectedColor, selectedSize, listProductDetail]);

    const calculatePriceRange = (details) => {
        if (details.length === 0) return null;
        const prices = details.map(detail => detail.price);
        return {
            min: Math.min(...prices),
            max: Math.max(...prices)
        };
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const handleColorSelect = (color) => {
        setSelectedColor(color);
        setSelectedSize(null);
    };

    const handleSizeSelect = (size) => {
        setSelectedSize(size);
    };

    const handleIncreaseQuantity = () => {
        setQuantity(prev => prev + 1);
    };

    const handleDecreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const handleAddToCart = async() => {
        // Logic to add the selected product to the cart
        console.log('Add to cart functionality not implemented yet.');
        if(selectedOrder?.id){
            const data = {
                "orderId": selectedOrder.id,
                "quantity": quantity,
                "productDetailId": productid,
            }
            await axios.post(`${API_BASE_URL}/order-details`, data).then(function (response) {
                console.log(response)
            })
        }
        else{
            console.log("Chưa có order id")
        }
    
    };

    const renderPriceSection = () => {
        if (selectedProductDetail) {
            return (
                <View style={styles.priceContainer}>
                    {salePercent !== 0 && (
                        <Text style={styles.discountedPrice}>
                            {formatPrice(selectedProductDetail.price / 100 * (100 - salePercent))}
                        </Text>
                    )}
                    <Text style={[styles.originalPrice, salePercent !== 0 && styles.strikethrough]}>
                        {formatPrice(selectedProductDetail.price)}
                    </Text>
                </View>
            );
        }

        if (priceRange) {
            return (
                <Text style={styles.priceRangeText}>
                    {formatPrice(priceRange.min)} - {formatPrice(priceRange.max)}
                </Text>
            );
        }

        return <Text>Đang cập nhật</Text>;
    };

    const renderProductImages = () => {
        const images = selectedProductDetail?.images || [];

        return (
            <View>
                <View style={styles.mainImageContainer}>
                    {salePercent > 0 && (
                        <View style={styles.discountBadge}>
                            <Text style={styles.discountBadgeText}>- {salePercent}%</Text>
                        </View>
                    )}
                    <Image
                        source={{ uri: images[currentImageIndex]?.url || defaultImage }}
                        style={styles.mainImage}
                        resizeMode="cover"
                    />
                </View>

                {images.length > 1 && (
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.thumbnailContainer}
                    >
                        {images.map((image, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => setCurrentImageIndex(index)}
                                style={[
                                    styles.thumbnailWrapper,
                                    currentImageIndex === index && styles.selectedThumbnail
                                ]}
                            >
                                <Image
                                    source={{ uri: image.url }}
                                    style={styles.thumbnailImage}
                                />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (!product) {
        return (
            <View style={styles.center}>
                <Text>No product found</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.productDetailContainer}>
                {renderProductImages()}

                <View style={styles.productInfoContainer}>
                    <Text style={styles.productName}>{product.name}</Text>

                    <View style={styles.productMetaContainer}>
                        <Text>Mã sản phẩm:
                            <Text style={styles.boldText}>
                                {selectedProductDetail?.code}
                            </Text>
                        </Text>
                        <Text>Thương hiệu:
                            <Text style={styles.boldText}>
                                {selectedProductDetail?.brand?.name}
                            </Text>
                        </Text>
                        <Text>Chất liệu:
                            <Text style={styles.boldText}>
                                {selectedProductDetail?.material?.name}
                            </Text>
                        </Text>
                        <Text>Kho:
                            <Text style={styles.boldText}>
                                {selectedProductDetail?.quantity}
                            </Text>
                        </Text>
                        <Text>Tình trạng:
                            <Text style={styles.boldText}>
                                {selectedProductDetail?.quantity > 0 ? 'Còn hàng' : 'Hết hàng'}
                            </Text>
                        </Text>
                    </View>

                    {renderPriceSection()}

                    <View style={styles.selectionContainer}>
                        <Text style={styles.sectionTitle}>Màu sắc</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.colorSelectionContainer}
                        >
                            {listColor.map((color) => (
                                <TouchableOpacity
                                    key={color.id}
                                    style={[
                                        styles.colorButton,
                                        selectedColor?.id === color.id && styles.selectedColorButton
                                    ]}
                                    onPress={() => handleColorSelect(color)}
                                >
                                    <Text style={styles.colorButtonText}>{color.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    <View style={styles.selectionContainer}>
                        <Text style={styles.sectionTitle}>Size</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.sizeSelectionContainer}
                        >
                            {listSize.map((size) => (
                                <TouchableOpacity
                                    key={size.id}
                                    style={[
                                        styles.sizeButton,
                                        selectedSize?.id === size.id && styles.selectedSizeButton
                                    ]}
                                    onPress={() => handleSizeSelect(size)}
                                >
                                    <Text style={styles.sizeButtonText}>{size.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    <View style={styles.quantityContainer}>
                        <Text style={styles.sectionTitle}>Số lượng</Text>
                        <View style={styles.quantityControl}>
                            <TouchableOpacity onPress={handleDecreaseQuantity}>
                                <Icon name="minus-circle" size={30} color="black" />
                            </TouchableOpacity>
                            <Text style={styles.quantityText}>{quantity}</Text>
                            <TouchableOpacity onPress={handleIncreaseQuantity}>
                                <Icon name="plus-circle" size={30} color="black" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.actionButtonContainer}>
                        <TouchableOpacity
                            style={styles.addToCartButton}
                            onPress={( ) => handleAddToCart()}
                        >
                            <Text style={styles.addToCartButtonText}>Thêm vào giỏ hàng</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.buyNowButton}
                            onPress={() => {
                                handleAddToCart();
                                // navigation.navigate('Checkout'); // Ensure navigation is properly set up
                            }}
                        >
                            <Text style={styles.buyNowButtonText}>Mua ngay</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    productDetailContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    mainImageContainer: {
        position: 'relative',
        width: width - 40,
        height: width * 1.25,
    },
    mainImage: {
        width: '100%',
        height: '100%',
    },
    discountBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'red',
        paddingHorizontal: 10,
        paddingVertical: 5,
        zIndex: 10,
    },
    discountBadgeText: {
        color: 'white',
        fontWeight: 'bold',
    },
    thumbnailContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },
    thumbnailWrapper: {
        marginRight: 10,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    selectedThumbnail: {
        borderColor: 'black',
    },
    thumbnailImage: {
        width: 60,
        height: 60,
        resizeMode: 'cover',
    },
    productInfoContainer: {
        marginTop: 20,
    },
    productName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    productMetaContainer: {
        marginBottom: 15,
    },
    boldText: {
        fontWeight: 'bold',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    discountedPrice: {
        color: 'red',
        fontSize: 18,
        marginRight: 10,
    },
    originalPrice: {
        color: 'black',
        fontSize: 16,
    },
    strikethrough: {
        textDecorationLine: 'line-through',
        color: 'gray',
    },
    priceRangeText: {
        color: 'red',
        fontSize: 18,
        fontWeight: 'bold',
    },
    selectionContainer: {
        marginVertical: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    colorSelectionContainer: {
        flexDirection: 'row',
    },
    colorButton: {
        borderWidth: 1,
        borderColor: 'black',
        padding: 10,
        marginRight: 10,
    },
    selectedColorButton: {
        backgroundColor: 'black',
    },
    colorButtonText: {
        color: 'black',
    },
    sizeSelectionContainer: {
        flexDirection: 'row',
    },
    sizeButton: {
        borderWidth: 1,
        borderColor: 'black',
        padding: 10,
        marginRight: 10,
    },
    selectedSizeButton: {
        backgroundColor: 'black',
    },
    sizeButtonText: {
        color: 'black',
    },
    quantityContainer: {
        marginVertical: 10,
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    quantityText: {
        fontSize: 18,
        marginHorizontal: 10,
    },
    actionButtonContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    addToCartButton: {
        flex: 1,
        backgroundColor: 'orange',
        padding: 15,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addToCartButtonText: {
        color: 'white',
        fontSize: 16,
    },
    buyNowButton: {
        flex: 1,
        backgroundColor: 'green',
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buyNowButtonText: {
        color: 'white',
        fontSize: 16,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});