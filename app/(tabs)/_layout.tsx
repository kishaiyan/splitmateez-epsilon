import { View, Text } from 'react-native';
import { Tabs } from 'expo-router';
import React from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import TabBar from '../../components/tabBar';


type TabBarProps = {
  Icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
  name: string;
  focused: boolean;
}



const TabsLayout = () => {
  return (
    <>
      <Tabs
      tabBar={(props)=><TabBar {...props}/>}
      screenOptions={{
        
        headerShown:false

      }}>
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            
            
          }}
        />
        <Tabs.Screen
          name="add"
          options={{
            title: 'Add',
           
           
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            title: 'Account',
            
            
            
          }}
        />
      </Tabs>
    </>
  );
}

export default TabsLayout;
