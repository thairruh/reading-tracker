import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const Tabs = ({ tabs, onTabPress }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <View style={styles.tabs}>
      {tabs.map((tab, index) => {
        const isActive = index === activeIndex;

        return (
          <Pressable
            key={index}
            onPress={() => {
              setActiveIndex(index);
              onTabPress?.(tab.label);
            }}
            
            style={[
              styles.tab,
              {
                backgroundColor: tab.color,
                marginLeft: index === 0 ? 0 : -15,
                zIndex: isActive ? 100 : tabs.length - index,
                transform: [{ translateY: isActive ? 0 : 5 }],
              },
            ]}
          >
            <Text style={styles.text}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
  },

  tab: {
    width: 80,
    height: 30,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },

  text: {
    textAlign: 'center',
  },
});

export default Tabs;
