import React, { useState } from 'react';
import { View, Image, Pressable, ScrollView, ImageSourcePropType } from 'react-native';
import sticker1 from '../assets/stickers/first-entry.png';
import sticker2 from '../assets/stickers/first-friend.png';



type StickerProps = {
    user: any,
    onAdd: (sticker: any) => void;
    variant?: 'normal' | 'mini';
    //selectedSticker?: number;
}
interface StickerData {
    id: number;
    image: ImageSourcePropType;
    top: number;
    left: number;
}
export const AddSticker = ({ user, onAdd, variant='normal' }: StickerProps) => {
    // const [user, setUser] = useState({ 
    //     stickers: [
    //         { id: 1, image: sticker1 },
    //         { id: 2, image: sticker2 },
    //     ],
    // });
    
    const [sticker, setSticker] = useState<StickerData[]>([]);
    const size = variant === 'mini' ? 32 : 60;
    return (
        <ScrollView horizontal={true}>
                       
            {user.stickers.map((sticker: any) => (
                //const isSelected = selectedSticker === sticker.id
                            
                <View key={sticker.id}>
                    <Pressable
                        onPress={() => onAdd(sticker.image)}
                    >
                    <Image
                        //key={sticker.id}
                        source={sticker.image}
                        style={{
                        width: size,
                        height: size,
                        marginLeft: 20,
                        marginTop: 20,
                        zIndex: 10,
                    }}/>
                    </Pressable>
                </View>
            ))}
                            
        </ScrollView>

    );
};

export default AddSticker;