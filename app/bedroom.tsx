import Inventory from "@/components/inventory";
import LowerNav from "@/components/lowerNav";
import RedecorateBar from "@/components/redecorate-bar";
import TransformBar from "@/components/transform-toolbar";
import { useRoomEditor } from "@/hooks/use-room-editor";
import { auth, db } from "@/src/firebase/config";
import { refreshCurrentUserStreak } from "@/src/firebase/users";
import { Image as ExpoImage } from "expo-image";
import { Link, useRouter } from "expo-router";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  Image as RNImage,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ViewShot from "react-native-view-shot";
import bookshelf from "../assets/images/bedroom/BR-bookshelf-plain.png";
import floor from "../assets/images/bedroom/BR-floor-wood-light.png";
import plainBed from "../assets/images/bedroom/Br-plain-bed.png";
import info from "../assets/images/info.png";
import { NavButton } from "../components/buttons/navButtons";
import { DragItem } from "../components/drag-items";
import { Sidebar } from "./Sidebar";

const Bedroom = ({ onSnapshotUpdate }) => {
  const router = useRouter();
  const [gems, setGems] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);

  const {
    isEditing,
    editingItems,
    setEditingItems,
    selectedItem,
    setSelectedItem,
    openInventory,
    setOpenInventory,
    displayItems,
    viewShotRef,
    startEditing,
    cancelEditing,
    saveEditing,
    isLoading,
    rotateItem,
    bringForward,
    pushBack,
    storeItem,
    handlePlaceItem,
    stopDrag,
  } = useRoomEditor(
    {
      bed: { image: plainBed, x: 0, y: 500, z: 2, scaleX: 1 },
      bookshelf: { image: bookshelf, x: 150, y: 350, z: 1, scaleX: 1 },
      rug: { image: null, x: 150, y: 450, z: 1, scaleX: 1 },
      table: { image: null, x: 250, y: 450, z: 1, scaleX: 1 },
      wallpaper: "null",
      floor: floor,
      wallItems: {},
    },
    "bedroom_snapshot",
    "wallItems",
    "bedroom",
  );

  useEffect(() => {
    refreshCurrentUserStreak().catch((error) => {
      console.error("Failed to refresh streak:", error);
    });
  }, []);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const ref = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(ref, (snap) => {
      const data = snap.data();
      setGems(data?.gems ?? 0);
      setCurrentStreak(data?.currentStreak ?? 0);
    });

    return unsubscribe;
  }, []);

  if (isLoading || !displayItems) {
    return null;
  }

  return (
    // Wrap the Screen in ViewShot so that the Where to Next screen can
    //capture images of the players actual bedroom whenever they redecorate it
    <ViewShot
      ref={viewShotRef}
      style={{ flex: 1 }}
      options={{ format: "jpg", quality: 0.9 }}
    >
      <Sidebar gems={gems}>
        <View style={styles.container}>
          {!isEditing && (
            <>
              <RNImage
                source={require("../figma-icons/header-lg.png")}
                style={{
                  position: "absolute",
                  top: -40,
                  left: 0,
                  right: 0,
                  width: "100%",
                  height: 200,
                  zIndex: 10,
                }}
                resizeMode="contain"
              />

              <View className="absolute top-14 left-48" style={{ zIndex: 30 }}>
                <RNImage
                  source={require("../figma-icons/star_Box.png")}
                  style={{ width: 80, height: 80 }}
                  resizeMode="contain"
                />
                <View className="absolute inset-y-0 right-3 items-center justify-center">
                  <Text className="text-[12px] text-black -mt-1.5">
                    {currentStreak}
                  </Text>
                </View>
              </View>

              <View
                className="absolute top-[45px] right-20"
                style={{ zIndex: 30 }}
              >
                <RNImage
                  source={require("../figma-icons/gem_Box.png")}
                  style={{ width: 82, height: 82 }}
                  resizeMode="contain"
                />
                <View className="absolute inset-y-0 right-2 items-center justify-center">
                  <Text className="text-[12px] text-black">{gems}</Text>
                </View>
              </View>

              <View
                className="absolute top-6 left-[85px] w-24 h-24 items-center justify-center"
                style={{ zIndex: 30 }}
              >
                <NavButton
                  text="Profile"
                  screenName="/profile"
                  btnStyle="bg-peach w-24 h-24 rounded-full"
                  textStyle="ml-6 text-sm text-center"
                  innerCircle="absolute bg-light-pink w-20 h-20"
                />
              </View>

              <View
                className="absolute top-6 -left-12 items-start"
                style={{ zIndex: 30 }}
              >
                <NavButton
                  text="Change Area"
                  screenName="/change-room"
                  btnStyle="bg-peach w-48 h-48 rounded-full"
                  textStyle="ml-6 text-lg w-20"
                  innerCircle="absolute bg-light-pink w-44 h-44"
                />
              </View>
            </>
          )}

          {/* REDECORATE INSTRUCTIONS BOX */}
          {isEditing && (
            <View
              className="absolute w-[75%] h-[60px] bg-[#EED8D3] opacity-90 left-1/2 -translate-x-1/2 border-dashed border-2"
              style={{ top: 120, zIndex: 20 }}
            >
              <View className="flex-row items-center mt-[10px] ml-3">
                <ExpoImage
                  source={info}
                  style={{ width: 24, height: 24, marginRight: 5 }}
                />
                <Text className="">
                  {
                    "Drag an item to move it.\nUse the inventory to add or change items."
                  }
                </Text>
              </View>
            </View>
          )}

          {/* WALLPAPER / DEFAULT WALL */}
          <View
            style={[StyleSheet.absoluteFill, { zIndex: -1 }]}
            pointerEvents="none"
          >
            {displayItems.wallpaper === null ? (
              <ExpoImage
                source={displayItems.wallpaper}
                style={{
                  width: "100%",
                  height: "100%",
                }}
                contentFit="cover"
              />
            ) : (
              <View style={styles.wall}>
                <View style={styles.wallOverlay} />
              </View>
            )}
          </View>

          {/* FLOOR */}
          <Pressable disabled={!isEditing} pointerEvents="box-none">
            <ExpoImage
              source={displayItems.floor}
              style={styles.floor}
              contentFit="contain"
            />
          </Pressable>

          {/* BED */}
          <DragItem
            item={{
              id: "bed",
              x: displayItems.bed.x,
              y: displayItems.bed.y,
              z: displayItems.bed.z,
              scaleX: displayItems.bed.scaleX ?? 1,
            }}
            draggable={isEditing}
            selected={isEditing && selectedItem === "bed"}
            onPress={() => setSelectedItem("bed")}
            stopDrag={(id, x, y) => {
              if (isEditing) {
                setEditingItems((prev) => ({
                  ...prev,
                  [id]: { ...prev[id], x, y },
                }));
              }
            }}
          >
            <ExpoImage
              source={displayItems.bed.image}
              style={styles.bed}
              contentFit="contain"
            />
          </DragItem>

          {/*           LiBRARY SHELF
          (not clickable in redecorate mode) */}

          <DragItem
            item={{
              id: "bookshelf",
              x: displayItems.bookshelf.x,
              y: displayItems.bookshelf.y,
              z: displayItems.bookshelf.z,
              scaleX: displayItems.bookshelf.scaleX ?? 1,
            }}
            draggable={isEditing}
            selected={isEditing && selectedItem === "bookshelf"}
            onPress={() => setSelectedItem("bookshelf")}
            stopDrag={(id, x, y) => {
              if (isEditing) {
                setEditingItems((prev) => ({
                  ...prev,
                  [id]: { ...prev[id], x, y },
                }));
              }
            }}
          >
            <View>
              <Link href="./library" asChild>
                <Pressable disabled={isEditing}>
                  <ExpoImage
                    source={displayItems.bookshelf.image}
                    style={styles.bookshelf}
                  />
                </Pressable>
              </Link>
            </View>
          </DragItem>

          {/* RUG */}
          {displayItems.rug.image && (
            <DragItem
              item={{
                id: "rug",
                x: displayItems.rug.x,
                y: displayItems.rug.y,
                z: displayItems.rug.z,
                scaleX: displayItems.rug.scaleX ?? 1,
              }}
              draggable={isEditing}
              selected={isEditing && selectedItem === "rug"}
              onPress={() => setSelectedItem("rug")}
              stopDrag={(id, x, y) => {
                if (isEditing) {
                  setEditingItems((prev) => ({
                    ...prev,
                    [id]: { ...prev[id], x, y },
                  }));
                }
              }}
            >
              <ExpoImage
                source={displayItems.rug.image}
                style={{ width: 300, height: 300 }}
                contentFit="contain"
              />
            </DragItem>
          )}

          {/* TABLE */}
          {displayItems.table.image && (
            <DragItem
              item={{
                id: "table",
                x: displayItems.table.x,
                y: displayItems.table.y,
                z: displayItems.table.z,
                scaleX: displayItems.table.scaleX ?? 1,
              }}
              draggable={isEditing}
              selected={isEditing && selectedItem === "table"}
              onPress={() => setSelectedItem("table")}
              stopDrag={(id, x, y) => {
                if (isEditing) {
                  setEditingItems((prev) => ({
                    ...prev,
                    [id]: { ...prev[id], x, y },
                  }));
                }
              }}
            >
              <ExpoImage
                source={displayItems.table.image}
                style={{ width: 300, height: 200 }}
                contentFit="contain"
              />
            </DragItem>
          )}
          {/* This maps the items that can have multiple of that type placed */}
          {displayItems.wallItems &&
            Object.values(displayItems.wallItems).map((item) => (
              <DragItem
                key={item.id}
                item={item}
                draggable={isEditing}
                selected={selectedItem === item.id}
                onPress={() => setSelectedItem(item.id)}
                stopDrag={(id, x, y) => {
                  setEditingItems((prev) => ({
                    ...prev,
                    wallItems: {
                      ...prev.wallItems,
                      [id]: {
                        ...prev.wallItems[id],
                        x,
                        y,
                      },
                    },
                  }));
                }}
              >
                <ExpoImage
                  source={item.image}
                  style={{ width: 80, height: 80 }}
                />
              </DragItem>
            ))}

          {/* INVENTORY OVERLAY */}
          {isEditing && openInventory && (
            <Inventory
              setOpenInventory={setOpenInventory}
              onPlaceItem={handlePlaceItem}
              currentRoom="Bedroom"
              refreshKey={openInventory ? "open" : "closed"}
            />
          )}

          {isEditing && selectedItem && (
            <TransformBar
              rotateItem={rotateItem}
              bringForward={bringForward}
              pushBack={pushBack}
              storeItem={storeItem}
              selectedItem={selectedItem}
            />
          )}

          {isEditing ? (
            <RedecorateBar
              setOpenInventory={setOpenInventory}
              bringForward={bringForward}
              pushBack={pushBack}
              setStoreItem={storeItem}
              saveEditing={saveEditing}
              cancelEditing={cancelEditing}
            />
          ) : (
            <LowerNav startEditing={startEditing} />
          )}
        </View>
      </Sidebar>
    </ViewShot>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wall: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#d0d6c6",
  },
  wallOverlay: {
    width: 205,
    height: 700,
    position: "absolute",
    right: 0,
    backgroundColor: "#929292",
    opacity: 0.3,
  },
  floor: {
    position: "absolute",
    top: 430,
    width: "100%",
    height: 620,
  },
  bed: {
    width: 300,
    height: 300,
  },
  bookshelf: {
    width: 137,
    height: 252,
  },
  editOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "black",
    opacity: 0.2,
    borderWidth: 2,
    borderColor: "#aaa",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Bedroom;
