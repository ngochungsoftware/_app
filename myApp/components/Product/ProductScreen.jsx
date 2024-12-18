import React, { Fragment, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions
} from 'react-native';
import { Slider } from '@miblanchard/react-native-slider';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const baseURL = 'http://192.168.1.150:8080/api/v1';

// con gi nưa ko bkhum

export default function ProductScreen() {
  const navigation = useNavigation();
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalElement, setTotalElement] = useState(0);
  const [listProduct, setListProduct] = useState([]);
  const [listColor, setListColor] = useState([]);
  const [listSize, setListSize] = useState([]);
  const [listSizeSelected, setListSizeSelected] = useState([]);
  const [listColorSelected, setListColorSelected] = useState([]);
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 5000000]);
  const [isNewProductSelected, setIsNewProductSelected] = useState(false);
  const [isOnSaleSelected, setIsOnSaleSelected] = useState(false);

  const [param, setParam] = useState({
    sizeCodes: [],
    colorCodes: [],
    minPrice: priceRange[0],
    maxPrice: priceRange[1]
  });

  const initDataProduct = async () => {
    try {
      const response = await axios.get(`${baseURL}/productDetails/abc`, {
        params: {
          colorCodes: param.colorCodes,
          sizeCodes: param.sizeCodes,
          minPrice: param.minPrice,
          maxPrice: param.maxPrice,
          page: currentPage - 1,
          size: pageSize,
        },
      });
      setListProduct(response.data.content);
      setTotalElement(response.data.totalElements);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const initListColor = async () => {
    try {
      const response = await axios.get(`${baseURL}/color/color-list`);
      if (response.data.data && Array.isArray(response.data.data)) {
        setListColor(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching colors:', error);
    }
  };

  const initListSize = async () => {
    try {
      const response = await axios.get(`${baseURL}/size/size-list`);
      if (response.data.data && Array.isArray(response.data.data)) {
        setListSize(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching sizes:', error);
    }
  };

  useEffect(() => {
    initDataProduct();
    initListColor();
    initListSize();
  }, [param, pageSize, currentPage]);

  const handleSelectColor = (color) => {
    setListColorSelected((prev) =>
      prev.find((s) => s.code === color.code)
        ? prev.filter((s) => s.code !== color.code)
        : [...prev, color]
    );
  };

  const handleSelectSize = (size) => {
    setListSizeSelected((prev) =>
      prev.find((s) => s.code === size.code)
        ? prev.filter((s) => s.code !== size.code)
        : [...prev, size]
    );
  };

  const handlePriceChange = (value) => {
    setPriceRange(value);
    setParam((prevParam) => ({
      ...prevParam,
      minPrice: value[0],
      maxPrice: value[1],
    }));
  };



  useEffect(() => {
    setParam((prevParam) => ({
      ...prevParam,
      colorCodes: listColorSelected.map((item) => item.code),
      sizeCodes: listSizeSelected.map((item) => item.code),
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    }));
  }, [listSizeSelected, listColorSelected, priceRange]);

  const renderProductCard = (product) => {
    const hasDiscount = product.listEvent && product.listEvent.length > 0;
    const discountedPrice = hasDiscount
      ? Math.round((product.price * (100 - product.discountPercent)) / 100)
      : product.price;
    return (
      <TouchableOpacity
        key={product.productId}
        style={styles.productCard}
        onPress={() => navigation.navigate('ProductDetail', { productId: product.productId })}
      >
        {hasDiscount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>- {product.discountPercent}%</Text>
          </View>
        )}

        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.image[0] || 'https://placeholder.com/150' }}
            style={styles.productImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.productDetails}>
          <View style={styles.colorSizeInfo}>
            <Text style={styles.colorSizeText}>+ {product.countColor} màu sắc</Text>
            <Text style={styles.colorSizeText}>+ {product.countSize} kích thước</Text>
          </View>

          <Text style={styles.productName} numberOfLines={2}>
            {product.productName}
          </Text>

          <View style={styles.priceContainer}>
            {hasDiscount ? (
              <>
                <Text style={styles.originalPrice}>
                  {Math.round(product.price).toLocaleString('vi')}₫
                </Text>
                <Text style={styles.discountedPrice}>
                  {discountedPrice.toLocaleString('vi')}₫
                </Text>
              </>
            ) : (
              <Text style={styles.discountedPrice}>
                {Math.round(product.price).toLocaleString('vi')}₫
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>Bộ lọc</Text>

          {/* Price Range Slider */}
          <View style={styles.priceRangeContainer}>
            <Text style={styles.filterSubtitle}>Khoảng giá</Text>
            <Slider
              value={priceRange}
              onValueChange={handlePriceChange}
              minimumValue={0}
              maximumValue={10000000}
              step={1000}
            />
            <View style={styles.priceRangeTextContainer}>
              <Text>{priceRange[0].toLocaleString('vi')}₫</Text>
              <Text>{priceRange[1].toLocaleString('vi')}₫</Text>
            </View>
          </View>

          {/* Color Filter */}
          <View style={styles.filterGroup}>
            <Text style={styles.filterSubtitle}>Màu sắc</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.colorScrollContainer}
            >
              {listColor.map((color, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.colorButton,
                    listColorSelected.some(c => c.code === color.code) && styles.selectedColorButton
                  ]}
                  onPress={() => handleSelectColor(color)}
                >
                  <Text style={styles.colorButtonText}>{color.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Size Filter */}
          <View style={styles.filterGroup}>
            <Text style={styles.filterSubtitle}>Size</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.sizeScrollContainer}
            >
              {listSize.map((size, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.sizeButton,
                    listSizeSelected.some(s => s.code === size.code) && styles.selectedSizeButton
                  ]}
                  onPress={() => handleSelectSize(size)}
                >
                  <Text style={styles.sizeButtonText}>{size.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Product List */}
        <View style={styles.productListContainer}>
          <Text style={styles.sectionTitle}>Danh sách sản phẩm</Text>
          <View style={styles.productGrid}>
            {listProduct.map(renderProductCard)}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  filterSection: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  filterSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  priceRangeContainer: {
    marginVertical: 10,
  },
  priceRangeTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  filterGroup: {
    marginVertical: 10,
  },
  filterButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 5,
  },
  selectedFilterButton: {
    backgroundColor: '#f0f0f0',
  },
  colorScrollContainer: {
    flexDirection: 'row',
  },
  colorButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#000',
    marginRight: 10,
  },
  selectedColorButton: {
    backgroundColor: '#000',
  },
  colorButtonText: {
    color: '#000',
  },
  sizeScrollContainer: {
    flexDirection: 'row',
  },
  sizeButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#000',
    marginRight: 10,
  },
  selectedSizeButton: {
    backgroundColor: '#000',
    color: '#fff',
  },
  sizeButtonText: {
    color: '#000',
  },
  productListContainer: {
    paddingHorizontal: 20,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: width / 2 - 30,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 10,
  },
  imageContainer: {
    aspectRatio: 1,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productDetails: {
    marginTop: 10,
  },
  colorSizeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  colorSizeText: {
    color: '#FF0000',
    fontSize: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  discountedPrice: {
    color: '#FF0000',
    fontWeight: 'bold',
  },
  discountBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FF0000',
    zIndex: 10,
    padding: 5,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
  },
});
