import { useNavigation, useRouter } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View, ImageSourcePropType } from 'react-native';
import { Drawer } from 'react-native-drawer-layout';
 
type SidebarProps = {
    children: React.ReactNode;
    username?: string;
    photoURL?: string;
    currentStreak?: number;
    gems?: number;
}


export const Sidebar: React.FC<SidebarProps> = ({ children, currentStreak, gems, username, photoURL }) => {
    const router = useRouter();
    const navigation = useNavigation();
    const [open, setOpen] = React.useState(false); 

    const openSidebar = () => setOpen(true);
    const closeSidebar = () => setOpen(false);
    const defaultpfp = require('../figma-icons/blank-pfp.png');
    const pfpSource = photoURL ? { uri: photoURL } : defaultpfp;

    //Manages sidebar content
    const renderDrawerContent = () => (

    <View className="flex-1 bg-pink">

        {/* Close sidebar button */}
        <TouchableOpacity onPress={() => setOpen(false)} >
            <Image
                source={require('../figma-icons/arrow-right-circle.png')}
                className="absolute top-20 right-10 w-12 h-12"
            />
        </TouchableOpacity>

        {/* Profile picture & username display */}
        <View className="absolute top-32 right-28">
            <Image source={pfpSource} className="w-40 h-40 rounded-full"/>
            <Text className="mt-4 text-xl text-brown text-center">{username ? '@'+username : '@Username'}</Text>
        </View>

        {/* currentStreak display */}
        <View>
            <Text className="absolute top-[315px] left-32 text-center text-xl text-brown">{currentStreak ? currentStreak : 0}</Text>
            <Text className="absolute top-[345px] left-24 text-xl text-brown">streak</Text>
        </View>

        
        {/* Gem display */}
        <View>
            <Image source={require('../figma-icons/diamond.png')} className="absolute top-[315px] right-36 w-7 h-7" resizeMode="contain"/>
            <Text className="absolute top-[315px] right-24 text-xl text-brown">{gems ? gems : 0}</Text>
            <Text className="absolute top-[345px] right-24 text-xl text-brown">gems</Text>
        </View>

        


        <View className="absolute top-[385px] inset-8 w-80 h-[2px] bg-peach/50"/>

        {/* Sidebar menu items */}
        <View className="p-4 gap-4 absolute">
            
            {/* Profile */}
            <TouchableOpacity className="top-[390px] flex-row items-center" onPress={() => router.replace('/')} >
                <Image 
                    source={require('../figma-icons/profile.png')}
                    className="w-12 h-12"
                />
                <Text className="left-5 font-bold text-2xl text-brown">Profile</Text>
            </TouchableOpacity>
            {/* Settings */}
            <TouchableOpacity className="top-[390px] flex-row items-center" onPress={() => router.replace('/settings')} >
                <Image 
                    source={require('../figma-icons/settings.png')}
                    className="w-12 h-12"
                />
                <Text className="left-4 font-bold text-2xl text-brown">Settings</Text>
            </TouchableOpacity>

            {/* Friends */}
            <TouchableOpacity className="top-[390px] left-2 flex-row items-center" onPress={() => router.replace('/friends')} >
                <Image 
                    source={require('../figma-icons/group_add.png')}
                    className="w-12 h-12"
                />
                <Text className="left-3 font-bold text-2xl text-brown">Friends</Text>
            </TouchableOpacity>  

            {/* Leaderboard */}
            <TouchableOpacity className="top-[390px] flex-row items-center" onPress={() => router.replace('./leaderboard')} >
                <Image 
                    source={require('../figma-icons/leaderboard.png')}
                    className="w-12 h-12"
                />
                <Text className="left-5 font-bold text-2xl text-brown">Leaderboard</Text>
            </TouchableOpacity>

            {/* Notifications */}
            <TouchableOpacity className="top-[390px] flex-row items-center" onPress={() => router.replace('/')} >
                <Image 
                    source={require('../figma-icons/notifications.png')}
                    className="w-12 h-12"
                />
                <Text className="left-5 font-bold text-2xl text-brown">Notifications</Text>
            </TouchableOpacity>
        </View>
    </View>
  );

    return (
    <Drawer
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      renderDrawerContent={renderDrawerContent}
      drawerType="front" 
      drawerPosition="right"
    >
        
        {/* Manages how to access sidebar from external screen */}
        <View className="flex-1 overflow-visible">

            <View className="absolute inset-0">
                {children}
            </View>
            
            <TouchableOpacity onPress={() => setOpen(true)} >
                <Image
                    source={require('../figma-icons/sidebar.png')}
                    className="absolute top-20 right-8 z-50 w-6 h-6"
                />
            </TouchableOpacity>
            
        </View>
    </Drawer>
    );
};

export default Sidebar;

// // const Drawer = createDrawerNavigator<drawerType>();
// // const DrawerScreens = () => {
// //     return (
// //         <Drawer.Navigator initialRouteName='DeskScreen'>
// //             <Drawer.Screen name="DeskScreen" component={DeskScreen}/>
// //             <Drawer.Screen name="Bulletin" component={Bulletin}/>
// //         </Drawer.Navigator>
// //     )
// // }

// // export default DrawerScreens