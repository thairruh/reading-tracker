import React, { useEffect, useRef } from 'react';
import { Animated, PanResponder, Pressable } from 'react-native';

type DragNoteItem = {
    id: string;
    top?: number;
    left?: number;
    text?: string;
    color?: string;
};

type DragNoteProps = {
    note: DragNoteItem;
    isSelected: boolean;
    onPress: () => void;
    stopDrag: (id: string, newTop: number, newLeft: number) => Promise<void> | void;
    children: React.ReactNode;
};

export const DragNote = ({
    note,
    isSelected,
    onPress,
    stopDrag,
    children,
    }: DragNoteProps) => {
    const position = useRef(
        new Animated.ValueXY({
        x: note.left ?? 50,
        y: note.top ?? 50,
        })
    ).current;

    const isDragging = useRef(false);

  // only sync from firestore/props when NOT actively dragging
    useEffect(() => {
        if (!isDragging.current) {
        position.setValue({
            x: note.left ?? 50,
            y: note.top ?? 50,
        });
        }
    }, [note.left, note.top, position]);

    const panResponder = useRef(
        PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_, gestureState) => {
            return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
        },

        onPanResponderGrant: () => {
        isDragging.current = true;

        position.extractOffset();
        position.setValue({ x: 0, y: 0 });
        },

        onPanResponderMove: Animated.event(
            [null, { dx: position.x, dy: position.y }],
            { useNativeDriver: false }
        ),

        onPanResponderRelease: () => {
            isDragging.current = false;

            position.flattenOffset();

            const newLeft = (position.x as any)._value;
            const newTop = (position.y as any)._value;

            stopDrag(note.id, newTop, newLeft);
        },

        onPanResponderTerminate: () => {
            isDragging.current = false;
            position.flattenOffset();
        },
        })
    ).current;

    return (
        <Animated.View
        style={{
            position: 'absolute',
            transform: [
            { translateX: position.x },
            { translateY: position.y },
            ],
            zIndex: isSelected ? 10 : 1,
        }}
        {...panResponder.panHandlers}
        >
        <Pressable onPress={onPress}>
            {children}
        </Pressable>
        </Animated.View>
    );
};