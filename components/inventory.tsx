import React, { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import x from "../assets/images/x.png";
import CustomHeader from "./banner";
import { getCurrentUserInventory, getShopItems } from "@/src/firebase/shop";
import { imageMap } from "../scripts/imageMap";

type InventoryProps = {
  setOpenInventory: (open: boolean) => void;
  onPlaceItem: (item: any) => void;
  currentRoom: string;
  refreshKey?: string;
};

const tagMap: Record<string, string> = {
  wall: "wallItem",
  wallitem: "wallItem",
  "wall-item": "wallItem",
  deskitem: "deskItem",
  "desk-item": "deskItem",
  "knick-knacks": "deskItem",
  "knick-knack": "deskItem",
};

export default function Inventory({
  setOpenInventory,
  onPlaceItem,
  currentRoom,
  refreshKey,
}: InventoryProps) {
  const [ownedItems, setOwnedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInventory = async () => {
      try {
        const [inventoryDocs, shopItems] = await Promise.all([
          getCurrentUserInventory(),
          getShopItems(),
        ]);

        const ownedIds = new Set(
          inventoryDocs.map((item: any) => item.itemId || item.id),
        );

        const filtered = shopItems
          .filter((item: any) => ownedIds.has(item.id))
          .filter((item: any) => item.category === currentRoom)
          .map((item: any) => ({
            ...item,
            image: imageMap[item.image],
            tag: tagMap[item.tag?.toLowerCase()] ?? item.tag,
          }))
          .filter((item: any) => item.image); // avoid crashing if image path is missing

        setOwnedItems(filtered);
      } catch (error) {
        console.error("Failed to load inventory:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInventory();
  }, [currentRoom, refreshKey]);

  return (
    <View style={styles.container}>
      <View className="absolute w-full h-full bg-black/30" />

      <View className="w-full top-[20px] left-[20px] z-50">
        <Pressable onPress={() => setOpenInventory(false)}>
          <Image source={x} className="w-[36px] h-[36px]" />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        style={styles.bgBox}
      >
        <View className="items-center">
          <CustomHeader
            title={
              currentRoom === "Bedroom" ? "Bedroom Inventory" : "Desk Inventory"
            }
            showGems={false}
            showBackArrow={false}
          />
        </View>

        {loading ? (
          <Text style={styles.emptyText}>Loading...</Text>
        ) : ownedItems.length === 0 ? (
          <Text style={styles.emptyText}>No owned items yet.</Text>
        ) : (
          <View className="flex-row flex-wrap ml-3 mt-5">
            {ownedItems.map((item) => (
              <View key={item.id} className="items-center">
                <TouchableOpacity
                  onPress={() => onPlaceItem(item)}
                  style={styles.itemCard}
                >
                  <Image
                    source={item.image}
                    className="w-[100px] h-[100px]"
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <Text style={styles.itemText}>{item.name}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  scrollContainer: {
    justifyContent: "center",
  },

  bgBox: {
    width: "90%",
    height: "70%",
    backgroundColor: "#f9efef",
    flexGrow: 0,

    borderWidth: 1.5,
    borderColor: "#5F382B",
    borderRadius: 7,
    zIndex: 20,
  },

  itemCard: {
    width: 100,
    height: 120,
    backgroundColor: "#fff9fc",

    paddingTop: 15,
    margin: 10,
    marginBottom: 5,
    alignItems: "center",

    borderWidth: 2,
    borderColor: "#472c23",
    borderStyle: "dashed",
    borderRadius: 15,

    shadowColor: "#5F382B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  itemText: {
    fontSize: 14,
    marginTop: 3,
    marginBottom: 5,
    color: "#5F382B",
  },

  emptyText: {
    textAlign: "center",
    marginTop: 24,
    fontSize: 16,
    color: "#5F382B",
  },
});
