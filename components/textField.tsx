import { View, Text, TextInput, Keyboard, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';

const TextField = ({ label,placeholder,value,onChangeText,keyboardtype,error, }) => {
  
  const [showpassword,setShowPassword]=useState(false);

  return (
    <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
      <View className='space-y-2 mb-3'>
        {label && <Text className='text-white mb-2'>{label}</Text>}
      <View className={`border border-fieldfill flex-row w-[300px] h-[50px] px-2 bg-fieldfill rounded-lg justify-between focus:border-secondary `}>
       
        
        <TextInput
          className={`text-white ${label=== "Password" ? 'w-[85%]':'w-full'}` }
          onChangeText={onChangeText}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="gray"
          secureTextEntry={label==='Password' && !showpassword}
          keyboardType={keyboardtype}
        />
        {
          label === 'Password' && (
            <TouchableOpacity className="py-3" onPress={()=>{setShowPassword(!showpassword)}}>
              <MaterialIcons name="visibility" color="gray" size={24}/>
            </TouchableOpacity>
          )
        }
        </View>
        {error && <Text className="text-red-500 mt-1">{error}</Text>}
      </View>
    </TouchableWithoutFeedback>
  );
};



export default TextField;
