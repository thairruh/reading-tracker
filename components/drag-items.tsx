import React, { useEffect, useRef } from 'react';
import { Animated, PanResponder, Pressable } from 'react-native';

type DragItemProps = {
  item: { id: string; x: number; y: number; z?: number; scaleX?: number };
  draggable: boolean;
  selected?: boolean;
  onPress?: () => void;
  stopDrag: (id: string, newX: number, newY: number) => void;
  children: React.ReactNode;
};

export const DragItem = ({
  item,
  draggable,
  selected,
  onPress,
  stopDrag,
  children,
}: DragItemProps) => {
  // Initialize once with the item's real position
  const pan = useRef(new Animated.ValueXY()).current;

  const stopDragRef = useRef(stopDrag);

  // Keep stopDrag ref fresh to avoid stale closures in panResponder
  useEffect(() => {
    stopDragRef.current = stopDrag;
  }, [stopDrag]);

    // Sync position when changed externally (save/cancel)
  useEffect(() => {
    pan.setValue({ x: item.x ?? 50, y: item.y ?? 50 });
  }, [item.x, item.y]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        // Merge current animated value into the offset,
        // then zero the value so deltas start clean
        if (onPress) onPress(); 

        pan.setOffset({ 
            x: (pan.x as any)._value, 
            y: (pan.y as any)._value 
        });
        pan.setValue({ x: 0, y: 0 });
      },

      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),

      onPanResponderRelease: () => {
        // adds offset to base value
        pan.flattenOffset();

        // Read the final position from the animated value
        const newX = (pan.x as any)._value;
        const newY = (pan.y as any)._value;

        stopDragRef.current(item.id, newX, newY);
      },
    })
  ).current;

  return (
    <Animated.View
      style={[
      {
        position: 'absolute',
        transform: [{ translateX: pan.x }, { translateY: pan.y }, { scaleX: item.scaleX ?? 1 }],
        zIndex: item.z ?? 0,
      },
      selected && {
        shadowColor: '#ffe894',
        shadowOpacity: 1,
        shadowRadius: 4,
      },
    ]}
      {...(draggable ? panResponder.panHandlers : {})}
    >
      <Pressable onPress={onPress}>
        {children}
      </Pressable>
    </Animated.View>
  );
};