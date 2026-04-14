import React, { useEffect, useRef } from 'react';
import { Animated, View, PanResponder, Pressable } from 'react-native';

type DragNoteProps = {
    note: any,
    isSelected: boolean,
    onPress: () => void;
    stopDrag: (id: number, newTop: number, newLeft: number) => void;
    children: React.ReactNode,
}

export const DragNote = ({ note, isSelected, onPress, stopDrag, children }: DragNoteProps) => {

    const pan = useRef(new Animated.ValueXY({ x: note.left ?? 50, y: note.top ?? 50 })).current;
    const stopDragRef = useRef(stopDrag);

    useEffect(() => {
        stopDragRef.current = stopDrag;
    }, [stopDrag]);

    //sync positons of notes to keep same x and y when switching screens
    useEffect(() => {
        pan.setValue({ x: note.x ?? 50, y: note.y ?? 50 });
    }, [note.x, note.y]);
           
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
                stopDragRef.current?.(note.id, pan.x._value, pan.y._value);
            },
        })
    ).current;
    return (
        <Animated.View
            style={{
            position: 'absolute',
            top: note.top,
            left: note.left,
            zIndex: isSelected ? 10 : 1, //move selected note to the front
            transform: [{ translateX: pan.x}, { translateY: pan.y } ],
            }}
            {...panResponder.panHandlers}>

            <Pressable onPress={onPress}>
                { children }
            </Pressable>
        </Animated.View>
    );
}