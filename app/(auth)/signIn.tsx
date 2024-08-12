import { View, Text, ScrollView } from 'react-native';
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import TextField from '../../components/textField';
import Button from '../../components/customButton';
import { Link } from 'expo-router';



const signIn = () => {
  const [signForm,setSignForm]=useState({
    email:'',
    password:''
  })
  return (
    <SafeAreaView className='h-full items-center bg-primary'>
      <Text className='text-secondary text-2xl mb-[50]'>LOGIN TO SMEZ</Text>
        <View className='h-full w-full items-center justify-start'>
          <TextField label="EMAIL" value={signForm.email} handlechange={(e)=>setSignForm({...signForm,email:e})}placeholder="john.doe@something.com" keyboardtype="email-address"/>
          <TextField label="PASSWORD" value={signForm.password} handlechange={(e)=>setSignForm({...signForm,password:e})} keyboardtype="default" placeholder="Password"/>
          <Button title='Sign In' containerStyle='w-[60%] min-h-[40px] mt-6'/>
          <View className='mt-5 h-[5%] items-center justify-center flex-row'>
            <Text className='text-white mr-2'>Don't have an account</Text>
            <Link href="/signup" className='text-secondary text-md'>Sign Up</Link>
          </View>
        </View>
      
    </SafeAreaView>
    
  )
}

export default signIn