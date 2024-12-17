import React, { useEffect, useState } from "react";
import { Button, Title, Subheading } from "react-native-paper";
import Swiper from "react-swiper-component";
import clientApi from "../api/clientApi";
import CartProductSelling from "../component/CartProductSelling";
import CartProductNew from "../component/CartProductNew";
import Skeleton from "../layout/Skeleton";

export default function HomeScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [sellingProducts, setSellingProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const images = [
    "https://storage.pixteller.com/designs/designs-images/2020-12-21/05/sneakers-sport-gym-sale-banner-1-5fe0c474a5fdf.png",
    "https://storage.pixteller.com/designs/designs-images/2020-12-21/05/sport-shoes-sale-banner-1-5fe0c471dbecb.png",
    "https://storage.pixteller.com/designs/designs-images/2020-12-21/05/gym-shoes-sale-banner-1-5fe0c46cc78bc.png",
  ];

  useEffect(() => {
    fetchData();
  }, [refreshing]);

  async function fetchData() {
    setLoading(true);
    try {
      const dataProduct = await clientApi.getProductHome();
      const dataProductSelling = await clientApi.getSellingProduct();
      
      setProducts(
        dataProduct.data.data.map((e) => ({
          ...e,
          image: e.image.split(","),
        }))
      );
      
      setSellingProducts(
        dataProductSelling.data.data.map((e) => ({
          ...e,
          image: e.image.split(","),
        }))
      );
      
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
      setRefreshing(false);
    }
  }

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  return (
    <div 
      style={{ 
        backgroundColor: "white", 
        overflowY: "auto", 
        maxHeight: "100vh" 
      }}
    >
      <Swiper 
        style={{ height: 250 }}
        loop={true}
        autoplay={true}
        showsPagination={false}
      >
        {images.map((image, index) => (
          <img
            key={`imagehome-${index}`}
            src={image}
            alt="banner"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
          />
        ))}
      </Swiper>

      <h1 
        style={{
          textAlign: "center",
          marginVertical: "10px",
          fontSize: "50px",
          lineHeight: "80px",
        }}
      >
        RUN YOUR RUN
      </h1>

      <p 
        style={{ 
          textAlign: "center", 
          marginHorizontal: "20px" 
        }}
      >
        Follow the feeling that keeps you running your best in the city
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginVertical: "10px",
        }}
      >
        <Button 
          variant="contained"
          style={{ 
            backgroundColor: "black", 
            marginRight: "-60px" 
          }}
        >
          Shop Apparel
        </Button>
        <Button 
          variant="contained"
          style={{ 
            backgroundColor: "black", 
            marginLeft: "-60px" 
          }}
        >
          Shop Apparel
        </Button>
      </div>

      <Title 
        style={{ 
          marginVertical: "10px", 
          fontWeight: "bold", 
          marginLeft: "5px" 
        }}
      >
        Trending
      </Title>

      <img 
        src="/assets/image/nike-just-do-it.jpg"
        style={{ 
          width: "100%", 
          height: "200px" 
        }}
        alt="Nike Just Do It"
      />

      <div
        style={{
          marginLeft: "10px",
          marginRight: "10px",
          marginTop: "25px",
          marginBottom: "5px",
          alignItems: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "black",
            padding: "5px",
            width: "50%",
            borderTopRightRadius: "10px",
            borderTopLeftRadius: "10px",
          }}
        >
          <p
            style={{
              fontSize: "25px",
              textAlign: "center",
              fontWeight: "900",
              color: "white",
            }}
          >
            Sản phẩm mới
          </p>
        </div>
        <div
          style={{
            marginTop: "-3px",
            backgroundColor: "black",
            width: "100%",
            height: "3px",
          }}
        />
      </div>

      <div style={{ alignItems: "center", paddingVertical: "10px" }}>
        {loading ? (
          <Skeleton />
        ) : (
          <CartProductNew
            setLoading={setLoading}
            products={products}
            navigation={navigation}
          />
        )}
      </div>

      <div
        style={{
          marginLeft: "10px",
          marginRight: "10px",
          marginTop: "25px",
          marginBottom: "5px",
          alignItems: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "black",
            padding: "5px",
            width: "65%",
            borderTopRightRadius: "10px",
            borderTopLeftRadius: "10px",
          }}
        >
          <p
            style={{
              fontSize: "25px",
              textAlign: "center",
              fontWeight: "900",
              color: "white",
            }}
          >
            Sản phẩm bán chạy
          </p>
        </div>
        <div
          style={{
            marginTop: "-3px",
            backgroundColor: "black",
            width: "100%",
            height: "3px",
          }}
        />
      </div>

      <div style={{ alignItems: "center", paddingVertical: "10px" }}>
        {loading ? (
          <Skeleton />
        ) : (
          <CartProductSelling
            setLoading={setLoading}
            products={sellingProducts}
            navigation={navigation}
          />
        )}
      </div>
    </div>
  );
}