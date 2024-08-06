import { View, Text, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';
import React, { useState } from 'react';

const TextField = ({ label, secureTextEntry }) => {
  const [inputText, setInputText] = useState('');

  return (
    <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
      <View className='p-4'>
      {label && <Text className='text-white mb-2'>{label}</Text>}
        <TextInput
          className="w-[300px] h-[50px] px-2 text-white bg-fieldfill rounded-lg"
  
          onChangeText={setInputText}
          value={inputText}
          placeholder="Enter text here"
          placeholderTextColor="gray"
          secureTextEntry={secureTextEntry}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};



export default TextField;
