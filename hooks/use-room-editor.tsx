import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { imageMap } from '../scripts/image-map';
import { auth, db } from '../src/firebase/config';

const serializeRoomItems = (value: any): any => {
  if (Array.isArray(value)) {
    return value.map(serializeRoomItems);
  }

  if (value && typeof value === 'object') {
    const result: any = {};

    for (const [key, v] of Object.entries(value)) {
      if (key === 'image') continue; // skip runtime image module
      result[key] = serializeRoomItems(v);
    }

    if ('imageKey' in value && typeof value.imageKey === 'string') {
      result.image = value.imageKey;
    }

    return result;
  }

  return value;
};

const hydrateRoomItems = (value: any): any => {
  if (Array.isArray(value)) {
    return value.map(hydrateRoomItems);
  }

  if (value && typeof value === 'object') {
    const result: any = {};

    for (const [key, v] of Object.entries(value)) {
      result[key] = hydrateRoomItems(v);
    }

    if (typeof value.image === 'string') {
      result.imageKey = value.image;
      result.image = imageMap[value.image];
    }

    return result;
  }

  return value;
};

export const useRoomEditor = (
  initialRoomItems = { wallItems: {} },
  storageKey = 'room_snapshot',
  multiItemKey = 'wallItems', // 'wallItems' for bedroom, 'deskItem' for desk
  roomType = 'desk'
) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingItems, setEditingItems] = useState<any>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [openInventory, setOpenInventory] = useState(false);
  const [roomItems, setRoomItems] = useState<any>(initialRoomItems);
  const [isLoading, setIsLoading] = useState(true);
  const viewShotRef = useRef<any>(null);

  const saveToDB = async (roomType: string, items: any) => {
    const user = auth.currentUser;
    if (!user || !items) return;

    const serialized = serializeRoomItems(items);

    await setDoc(
      doc(db, 'users', user.uid, 'rooms', roomType),
      serialized
    );
  };

  const loadFromDB = async (roomType: string) => {
    const user = auth.currentUser;
    if (!user) return null;

    const docRef = doc(db, 'users', user.uid, 'rooms', roomType);
    const snap = await getDoc(docRef);

    if (!snap.exists()) return null;

    const data = snap.data();
    return hydrateRoomItems(data);
  };

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);

      const saved = await loadFromDB(roomType);

      if (saved) {
        setRoomItems(saved);
      } else {
        setRoomItems(initialRoomItems);
      }

      setIsLoading(false);
    };

    init();
  }, [roomType]);

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
    if (!editingItems) return;

    setRoomItems(editingItems);
    setEditingItems(null);
    setIsEditing(false);
    setSelectedItem(null);

    await saveToDB(roomType, editingItems);

    setTimeout(async () => {
      try {
        const uri = await viewShotRef.current?.capture();
        if (uri) {
          await AsyncStorage.setItem(storageKey, uri);
        }
      } catch (e) {
        console.log('Snapshot failed', e);
      }
    }, 300);
  };

  const rotateItem = () => {
    if (!selectedItem || !editingItems) return;

    setEditingItems((prev: any) => {
      if (prev[multiItemKey]?.[selectedItem]) {
        const current = prev[multiItemKey][selectedItem];
        return {
          ...prev,
          [multiItemKey]: {
            ...prev[multiItemKey],
            [selectedItem]: {
              ...current,
              scaleX: current.scaleX === -1 ? 1 : -1,
            },
          },
        };
      }

      const current = prev[selectedItem];
      if (!current || typeof current !== 'object') return prev;

      return {
        ...prev,
        [selectedItem]: {
          ...current,
          scaleX: current.scaleX === -1 ? 1 : -1,
        },
      };
    });
  };

  const getAllZValues = (items: any) => {
    return Object.entries(items).flatMap(([, value]: [string, any]) => {
      if (value && typeof value === 'object' && !('image' in value) && !('z' in value)) {
        return Object.values(value).map((i: any) => i?.z ?? 0);
      }
      return [value?.z ?? 0];
    });
  };

  const bringForward = () => {
    if (!selectedItem || !editingItems) return;
    const maxZ = Math.max(...getAllZValues(editingItems));

    setEditingItems((prev: any) => {
      if (prev[multiItemKey]?.[selectedItem]) {
        return {
          ...prev,
          [multiItemKey]: {
            ...prev[multiItemKey],
            [selectedItem]: {
              ...prev[multiItemKey][selectedItem],
              z: maxZ + 1,
            },
          },
        };
      }

      return {
        ...prev,
        [selectedItem]: {
          ...prev[selectedItem],
          z: maxZ + 1,
        },
      };
    });
  };

  const pushBack = () => {
    if (!selectedItem || !editingItems) return;
    const minZ = Math.min(...getAllZValues(editingItems));

    setEditingItems((prev: any) => {
      if (prev[multiItemKey]?.[selectedItem]) {
        return {
          ...prev,
          [multiItemKey]: {
            ...prev[multiItemKey],
            [selectedItem]: {
              ...prev[multiItemKey][selectedItem],
              z: minZ - 1,
            },
          },
        };
      }

      return {
        ...prev,
        [selectedItem]: {
          ...prev[selectedItem],
          z: minZ - 1,
        },
      };
    });
  };

  const storeItem = () => {
    if (!selectedItem || !editingItems) return;

    if (editingItems[multiItemKey]?.[selectedItem]) {
      setEditingItems((prev: any) => {
        const updated = { ...prev[multiItemKey] };
        delete updated[selectedItem];
        return { ...prev, [multiItemKey]: updated };
      });
    } else if (selectedItem === 'floor') {
      setEditingItems((prev: any) => ({
        ...prev,
        floor: null,
        floorKey: null,
      }));
      setSelectedItem(null);
    } else if (selectedItem === 'wallpaper') {
      setEditingItems((prev: any) => ({
        ...prev,
        wallpaper: 'null',
        wallpaperKey: null,
      }));
      setSelectedItem(null);
    } else {
      setEditingItems((prev: any) => ({
        ...prev,
        [selectedItem]: {
          ...prev[selectedItem],
          image: null,
          imageKey: null,
        },
      }));
      setSelectedItem(null);
    }
  };

  const handlePlaceItem = (newItem: any) => {
    const rawTag = String(newItem.tag ?? '');
    const lowerTag = rawTag.toLowerCase();

    const tag =
      lowerTag === 'wall' || lowerTag === 'wall-item' || lowerTag === 'wallitem'
        ? 'wallItem'
        : lowerTag === 'desk-item' ||
          lowerTag === 'deskitem' ||
          lowerTag === 'knick-knacks' ||
          lowerTag === 'knick-knack'
        ? 'deskItem'
        : lowerTag;

    if (!editingItems) return;

    if (tag === 'wallpaper') {
      setEditingItems((prev: any) => ({
        ...prev,
        wallpaper: newItem.image,
        wallpaperKey: newItem.imageKey,
      }));
      setOpenInventory(false);
      return;
    }

    if (tag === 'floor') {
      setEditingItems((prev: any) => ({
        ...prev,
        floor: newItem.image,
        floorKey: newItem.imageKey,
      }));
      setOpenInventory(false);
      return;
    }

    const isMulti =
      (tag === 'wallItem' && multiItemKey === 'wallItems') ||
      (tag === 'deskItem' && multiItemKey === 'deskItem');

    if (isMulti) {
      const id = `${tag}-${Date.now()}`;

      setEditingItems((prev: any) => {
        const maxZ = Math.max(
          0,
          ...Object.values(prev[multiItemKey] || {}).map((i: any) => i?.z ?? 0)
        );

        return {
          ...prev,
          [multiItemKey]: {
            ...prev[multiItemKey],
            [id]: {
              id,
              image: newItem.image,
              imageKey: newItem.imageKey,
              x: 100,
              y: 300,
              z: maxZ + 1,
              scaleX: 1,
              width: newItem.width ?? 80,
              height: newItem.height ?? 80,
            },
          },
        };
      });
    } else {
      setEditingItems((prev: any) => ({
        ...prev,
        [tag]: {
          ...prev[tag],
          image: newItem.image,
          imageKey: newItem.imageKey,
        },
      }));
    }

    setOpenInventory(false);
  };

  const stopDrag = (id: string, x: number, y: number, isMultiItem = false) => {
    if (!editingItems) return;

    if (isMultiItem) {
      setEditingItems((prev: any) => ({
        ...prev,
        [multiItemKey]: {
          ...prev[multiItemKey],
          [id]: {
            ...prev[multiItemKey][id],
            x,
            y,
          },
        },
      }));
    } else {
      setEditingItems((prev: any) => ({
        ...prev,
        [id]: {
          ...prev[id],
          x,
          y,
        },
      }));
    }
  };

  const displayItems = isEditing && editingItems ? editingItems : roomItems;

  return {
    isEditing,
    editingItems,
    setEditingItems,
    selectedItem,
    setSelectedItem,
    openInventory,
    setOpenInventory,
    roomItems,
    viewShotRef,
    displayItems,
    isLoading,
    startEditing,
    cancelEditing,
    saveEditing,
    rotateItem,
    bringForward,
    pushBack,
    storeItem,
    handlePlaceItem,
    stopDrag,
  };
};