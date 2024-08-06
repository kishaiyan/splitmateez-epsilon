import { View, Text,Image } from 'react-native'
import React from 'react'
import TextField from '../../components/textField';
import { MaterialIcons } from '@expo/vector-icons';
import Button from '../../components/customButton';

const signUp = () => {
  return (
    <View className='items-center justify-center'>
      <Text className='text-white mb-2'>SIGN UP</Text>
      <View className="relative w-1/4 h-1/4">
            <Image 
              source={{ uri: 'https://picsum.photos/100/' }} 
              className="w-full h-[85%] rounded-xl"
              
            />
            <MaterialIcons 
              name="edit" 
              size={18} 
              color="#FFFFFF" 
              style={{position:'absolute',bottom:0,right:4}}
              
            />
    </View>
      <TextField label="EMAIL" secureTextEntry={false}/>
      <TextField label="NAME" secureTextEntry={false}/>
      <TextField label="PASSWORD" secureTextEntry={true}/>
      <TextField label="ADDRESS" secureTextEntry={false}/>
      <Button title='Sign Up' containerStyle='w-[60%] min-h-[40px]'/>
    </View>
  )
}

export default signUp