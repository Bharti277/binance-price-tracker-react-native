import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

const BINANCE_WS_URL = "wss://stream.binance.com:9443/ws/btcusdt@trade";

export default function Index() {
  type PriceItem = {
    id: string;
    price: number;
    timestamp: string;
    date: string;
    change: number;
  };
  const [prices, setPrices] = useState<PriceItem[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);
  const idCounter = useRef(0);

  useEffect(() => {
    const connectWebSocket = () => {
      console.log("Attempting to connect to WebSocket...");
      ws.current = new WebSocket(BINANCE_WS_URL);

      ws.current.onopen = () => {
        console.log("WebSocket Connected");
        setIsConnected(true);
      };

      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.e === "trade") {
          const newPrice = parseFloat(data.p);
          const timestamp = parseInt(data.E);
          const tradeId = parseInt(data.t);

          setPrices((prevPrices) => {
            let priceChange = 0;
            if (prevPrices.length > 0) {
              const lastPrice = prevPrices[0].price;
              if (newPrice > lastPrice) {
                priceChange = 1;
              } else if (newPrice < lastPrice) {
                priceChange = -1;
              }
            }
            idCounter.current += 1;
            return [
              {
                id: idCounter.current.toString(),
                price: newPrice,
                timestamp: new Date(timestamp).toLocaleTimeString(),
                date: new Date(timestamp).toLocaleDateString(),
                change: priceChange,
              },
              ...prevPrices.slice(0, 49),
            ];
          });
        }
      };

      ws.current.onerror = (error) => {
        console.error("WebSocket Error:", error.message);
        setIsConnected(false);
        Alert.alert(
          "Connection Error",
          "Failed to connect to Binance. Please check your internet connection and try again."
        );
      };

      ws.current.onclose = (event) => {
        console.log("WebSocket Disconnected:", event.code, event.reason);
        setIsConnected(false);
        if (!event.wasClean) {
          console.log("Attempting to reconnect in 5 seconds...");
          setTimeout(connectWebSocket, 5000);
        }
      };
    };

    connectWebSocket();

    return () => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        console.log("Closing WebSocket connection...");
        ws.current.close();
      }
    };
  }, []);

  const renderPriceItem = ({ item }) => {
    const priceColor =
      item.change === 1 ? "green" : item.change === -1 ? "red" : "black";

    return (
      <View style={styles.priceCard}>
        <Text style={styles.timestampText}>
          {item.date} {item.timestamp}
        </Text>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
        >
          <Text style={[styles.priceText, { color: priceColor }]}>
            BTC/USDT: ${item.price.toFixed(2)}
          </Text>
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f0f0" />
      <View style={styles.header}>
        <Text style={styles.headerText}>Binance BTC/USDT Price Tracker</Text>
        <Text
          style={[styles.statusText, { color: isConnected ? "green" : "red" }]}
        >
          Status: {isConnected ? "Connected" : "Disconnected"}
        </Text>
      </View>

      {!isConnected && prices.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Connecting to WebSocket...</Text>
        </View>
      ) : (
        <FlatList
          data={prices}
          renderItem={renderPriceItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.flatListContent}
          inverted={true} // Display newest items at the top
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    padding: 15,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
  flatListContent: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  priceCard: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5, // For Android shadow
  },
  timestampText: {
    fontSize: 14,
    color: "#888",
    marginBottom: 5,
  },
  priceText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
