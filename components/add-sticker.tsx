import React, { useState } from 'react';
import { View, Image, Pressable, ScrollView } from 'react-native';
import sticker1 from '../assets/stickers/first-entry.png';
import sticker2 from '../assets/stickers/first-friend.png';



type AddStickerProps = {
    onAdd: (sticker: any) => void;
}

export const AddSticker = ({ onAdd }: AddStickerProps) => {
    const [user, setUser] = useState({ 
        stickers: [
            { id: 1, image: sticker1 },
            { id: 2, image: sticker2 },
        ],
    });
    return (
        <ScrollView horizontal={true}>
            {user.stickers.map((sticker) => (
                    
                <View 
                key={sticker.id}
                style={{ flexDirection:'row'}}                
                >
                    <Pressable
                        onPress={onAdd}
                        >
                        <Image
                            key={sticker.id}
                            source={sticker.image}
                            style={{
                             //position: 'absolute',
                            width: 60,
                            height: 60,
                            marginLeft: 20,
                            marginTop: 20
                        }}/>
                    </Pressable>
                 </View>
            ))}            
        </ScrollView>

    );
};

export default AddSticker;