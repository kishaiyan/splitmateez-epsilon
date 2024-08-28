import { View, Text, Image } from 'react-native';
import { Tabs } from 'expo-router';
import React from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


type TabBarProps = {
  Icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
  name: string;
  focused: boolean;
}

const TabIcon: React.FC<TabBarProps> = ({ Icon, color, name, focused }) => {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <MaterialIcons name={Icon} color={color} size={24} />
      <Text style={{ fontWeight: focused ? 'bold' : 'normal', fontSize: 12 ,color:color}}>{name}</Text>
    </View>
  );
}

const TabsLayout = () => {
  return (
    <>
      <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor:"#BD6A33",
        tabBarInactiveTintColor:"#CDCDE0",
        tabBarStyle:{
          backgroundColor:"#000000",
          borderColor:"#676767"
        },
        headerShown:false

      }}>
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                Icon="home"// Use a vector icon component from react-native-vector-icons
                name="Home"
                color={color}
                focused={focused}
              />
            )
          }}
        />
        <Tabs.Screen
          name="add"
          options={{
            title: 'Add',
           
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                Icon="add"// Use a vector icon component from react-native-vector-icons
                name="Add"
                color={color}
                focused={focused}
              />
            )
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            title: 'Account',
            
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                Icon="account-box"// Use a vector icon component from react-native-vector-icons
                name="Account"
                color={color}
                focused={focused}
              />
            )
          }}
        />
      </Tabs>
    </>
  );
}

export default TabsLayout;
