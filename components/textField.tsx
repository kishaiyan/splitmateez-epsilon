import { View, Text, TextInput, Keyboard, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';

const TextField = ({ label,placeholder,value,handlechange,keyboardtype }) => {
  
  const [showpassword,setShowPassword]=useState(false);

  return (
    <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
      <View className='space-y-2 mb-3'>
      {label && <Text className='text-white mb-2'>{label}</Text>}
      <View className="border flex-row w-[300px] h-[50px] px-2 bg-fieldfill rounded-lg justify-between focus:border-secondary">
        <TextInput
          className={`text-white ${label=== "PASSWORD" ? 'w-[85%]':'w-full' }`}
          onChangeText={handlechange}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="gray"
          secureTextEntry={label==='PASSWORD' && !showpassword}
          keyboardType={keyboardtype}
        />
        {
          label === 'PASSWORD' && (
            <TouchableOpacity className="py-3" onPress={()=>{setShowPassword(!showpassword)}}>
              <MaterialIcons name="visibility" color="gray" size={24}/>
            </TouchableOpacity>
          )
        }
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};



export default TextField;
