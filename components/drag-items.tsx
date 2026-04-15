import React, { useEffect, useRef } from 'react';
import { Animated, PanResponder, Pressable } from 'react-native';

type DragItemProps = {
    item: any,
    isSelected: boolean,
    onPress: () => void;
    stopDrag: (id: number, newTop: number, newLeft: number) => void;
    children: React.ReactNode,
}

export const DragItem = ({ item, isSelected, onPress, stopDrag, children }: DragItemProps) => {

    const pan = useRef(new Animated.ValueXY({ x: item.left ?? 50, y: item.top ?? 50 })).current;
    const stopDragRef = useRef(stopDrag);

    useEffect(() => {
        stopDragRef.current = stopDrag;
    }, [stopDrag]);

    //sync positons of items to keep same x and y when switching screens
    useEffect(() => {
        pan.setValue({ x: item.x ?? 50, y: item.y ?? 50 });
    }, [item.x, item.y]);
           
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => false,
            //Start drag if user moves more than 5 pixels
            onMoveShouldSetPanResponder: (_, gestureState) => {
            return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
            },
            onPanResponderGrant: () => {
                pan.setOffset({
                    x: pan.x._value,
                    y: pan.y._value,
            });
                pan.setValue({ x: 0, y: 0 });
            },
            onPanResponderMove: Animated.event(
                [null, { dx: pan.x, dy: pan.y }],
                {useNativeDriver: false}
                ),
            onPanResponderRelease: (e, gestureState) => {
                pan.flattenOffset();
                stopDragRef.current?.(item.id, pan.x._value, pan.y._value);
            },
        })
    ).current;
    return (
        <Animated.View
            style={{
            position: 'absolute',
            //zIndex: isSelected ? 10 : 1, //move selected item to the front
            transform: [{ translateX: pan.x}, { translateY: pan.y } ],
            }}
            {...panResponder.panHandlers}>

            <Pressable onPress={onPress}>
                { children }
            </Pressable>
        </Animated.View>
    );
}