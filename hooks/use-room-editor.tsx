import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useEffect, useRef, useState } from "react";
import { imageMap } from '../scripts/image-map';
import { auth, db } from "../src/firebase/config";


export const useRoomEditor = (
  initialRoomItems = { wallItems: {} },
  storageKey = 'room_snapshot',
  multiItemKey = 'wallItems',  // 'wallItems' for bedroom, 'deskItem' for desk
  roomType = 'desk'
) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingItems, setEditingItems] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openInventory, setOpenInventory] = useState(false);
  const [roomItems, setRoomItems] = useState(initialRoomItems);
  const viewShotRef = useRef();

  const saveToDB = async (roomType, items) => {
  const user = auth.currentUser;
  if (!user) return;

  // convert images to string keys
  const serialized = JSON.parse(JSON.stringify(items, (key, value) => {
    if (key === 'image') {
      const found = Object.keys(imageMap).find(k => imageMap[k] === value);
      console.log('serializing image:', found, 'from value:', value); // ✅ add this
      return found;
    }
    return value;
  }));

  console.log('saving to DB:', JSON.stringify(serialized, null, 2));
  await setDoc(
    doc(db, "users", user.uid, "rooms", roomType),
    serialized
  );
};



  const loadFromDB = async (roomType) => {
    const user = auth.currentUser;
    if (!user) return null;

    const docRef = doc(db, "users", user.uid, "rooms", roomType);
    const snap = await getDoc(docRef);

    if (!snap.exists()) return null;

    const data = snap.data();

    // convert string → actual image
    const parsed = JSON.parse(JSON.stringify(data, (key, value) => {
      if (key === 'image') {
        return imageMap[value];
      }
      return value;
    }));

    return parsed;
  };



  useEffect(() => {
    const init = async () => {
      const saved = await loadFromDB(roomType);
      if (saved) {
        setRoomItems(saved);
      }
    };
    init();
  }, []);



  const startEditing = () => {
    setEditingItems({ ...roomItems });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setEditingItems(roomItems);
    setIsEditing(false);
    setSelectedItem(null);
  };

  const saveEditing = async () => {
    setRoomItems(editingItems);
    setEditingItems(null);
    setIsEditing(false);
    setSelectedItem(null);
    await saveToDB(roomType, editingItems);
    setTimeout(async () => {
      try {
        const uri = await captureRef(viewShotRef, { format: 'jpg', quality: 0.7 });
        await AsyncStorage.setItem(storageKey, uri);
      } catch (e) {
        console.log('Snapshot failed', e);
      }
    }, 100);
  };

  const rotateItem = () => {
    if (!selectedItem || !editingItems) return;
    
    setEditingItems(prev => {
      // Check if it's in the multi-item group
      if (prev[multiItemKey]?.[selectedItem]) {
        const current = prev[multiItemKey][selectedItem];
        return {
          ...prev,
          [multiItemKey]: {
            ...prev[multiItemKey],
            [selectedItem]: { ...current, scaleX: current.scaleX === -1 ? 1 : -1 }
          }
        };
      }
      const current = prev[selectedItem];
      if (!current) return prev;
      return { ...prev, [selectedItem]: { ...current, scaleX: current.scaleX === -1 ? 1 : -1 } };
    });
  };

  // for getting z values from  multi-item group
  const getAllZValues = (items) => {
  return Object.entries(items).flatMap(([key, value]) => {
    
    if (value && typeof value === 'object' && !('image' in value) && !('z' in value)) {
      return Object.values(value).map(i => i?.z ?? 0);
    }
    return [value?.z ?? 0];
  });
};

const bringForward = () => {
  if (!selectedItem || !editingItems) return;
  const maxZ = Math.max(...getAllZValues(editingItems));

  setEditingItems(prev => {
    if (prev[multiItemKey]?.[selectedItem]) {
      return {
        ...prev,
        [multiItemKey]: {
          ...prev[multiItemKey],
          [selectedItem]: { ...prev[multiItemKey][selectedItem], z: maxZ + 1 }
        }
      };
    }
    return { ...prev, [selectedItem]: { ...prev[selectedItem], z: maxZ + 1 } };
  });
};

const pushBack = () => {
  if (!selectedItem || !editingItems) return;
  const minZ = Math.min(...getAllZValues(editingItems));

  setEditingItems(prev => {
    if (prev[multiItemKey]?.[selectedItem]) {
      return {
        ...prev,
        [multiItemKey]: {
          ...prev[multiItemKey],
          [selectedItem]: { ...prev[multiItemKey][selectedItem], z: minZ - 1 }
        }
      };
    }
    return { ...prev, [selectedItem]: { ...prev[selectedItem], z: minZ - 1 } };
  });
};

  const storeItem = () => {
    if (!selectedItem || !editingItems) return;
    if (editingItems[multiItemKey]?.[selectedItem]) {
      setEditingItems(prev => {
        const updated = { ...prev[multiItemKey] };
        delete updated[selectedItem];
        return { ...prev, [multiItemKey]: updated };
      });
    } else {
      setEditingItems(prev => ({
        ...prev,
        [selectedItem]: { ...prev[selectedItem], image: null }
      }));
      setSelectedItem(null);
    }
  };

  const handlePlaceItem = (newItem) => {
    const tag = newItem.tag.toLowerCase();
    
    // If tag matches multi-item key (e.g. "desk-item" or "wall-item"), add a new instance
    const isMulti = tag === 'wall-item' || tag === 'desk-item';

    if (newItem.tag === "wallpaper") {
    setEditingItems(prev => ({
      ...prev,
      wallpaper: newItem.image
    }));
    return;
  }

    if (isMulti) {
      const id = `${tag}-${Date.now()}`;
      setEditingItems(prev => {
        const maxZ = Math.max(0, ...Object.values(prev[multiItemKey] || {}).map(i => i?.z ?? 0));
        return {
          ...prev,
          [multiItemKey]: {
            ...prev[multiItemKey],
            [id]: {
              id,
              image: newItem.image,
              x: 100, y: 300,
              z: maxZ + 1,
              scaleX: 1,
              width: newItem.width ?? 80,
              height: newItem.height ?? 80,
            }
          }
        };
      });
    } else {
      setEditingItems(prev => ({
        ...prev,
        [tag]: { ...prev[tag], image: newItem.image }
      }));
    }
    setOpenInventory(false);
  };

  const stopDrag = (id, x, y, isMultiItem = false) => {
    if (isMultiItem) {
      setEditingItems(prev => ({
        ...prev,
        [multiItemKey]: {
          ...prev[multiItemKey],
          [id]: { ...prev[multiItemKey][id], x, y }
        }
      }));
    } else {
      setEditingItems(prev => ({ ...prev, [id]: { ...prev[id], x, y } }));
    }
  };

  const displayItems = isEditing && editingItems ? editingItems : roomItems;

  
  return {
    isEditing, editingItems, setEditingItems,
    selectedItem, setSelectedItem,
    openInventory, setOpenInventory,
    roomItems, viewShotRef, displayItems,
    startEditing, cancelEditing, saveEditing,
    rotateItem, bringForward, pushBack,
    storeItem, handlePlaceItem, stopDrag,
  };
};
