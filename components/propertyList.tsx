import { View, Text, FlatList } from 'react-native';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';// Import the NativeWind styles
import Button from './customButton';

const PropertyList = () => {
  return (
    <FlatList 
      data={[
        {
          id: 1,
          image: "PropertyImage",
          address: "123, abc street, abcd-1234",
          maximum: 4,
          occupants: 3,
        },
        {
          id: 2,
          image: "PropertyImage",
          address: "123, abc street, abcd-1234",
          maximum: 3,
          occupants: 3,
        },
        {
          id: 3,
          image: "PropertyImage",
          address: "123, abc street, abcd-1234",
          maximum: 5,
          occupants: 2,
        },
        {
          id: 4,
          image: "PropertyImage",
          address: "123, abc street, abcd-1234",
          maximum: 2,
          occupants: 2,
        }
      ]}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View className="w-40 h-[80%] bg-black mx-2 border border-secondary rounded-md overflow-hidden items-center justify-evenly">
          <View className="p-2">
            <Text className="text-white text-lg">
              {item.image}
            </Text>
            <Text className="text-white text-sm mt-1">
              {item.address}
            </Text>
            <View className="flex-row justify-between mt-2">
              <View className="items-center">
                <MaterialIcons name="person" size={30} color="#ffffff" />
                <Text className="text-white text-base">
                  {item.maximum}
                </Text>
              </View>
              <View className="items-center">
                <MaterialIcons name="input" size={30} color="#ffffff" />
                <Text className="text-white text-base">
                  {item.occupants}
                </Text>
              </View>
            </View>
            <Button title='Look through'/>
          </View>
        </View>
      )}
      horizontal
      contentContainerStyle={{ paddingHorizontal: 8 }} // This adjusts the space around the list
    />
  );
};

export default PropertyList;
