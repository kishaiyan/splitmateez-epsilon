import { View, Text } from 'react-native'
import React from 'react'
import Button from '../../components/customButton'
import { handleSignOut } from '../../lib/aws-amplify'
import { router } from 'expo-router'
import { useGlobalContext } from '../../context/GlobalProvider'

const Account = () => {
  const {user}=useGlobalContext()
  const signOut=()=>{
    try{
      handleSignOut()
      router.replace('/signIn')
    }
    catch(error){
      console.log(error)
    }
  
  }
  return (
    <View className='items-center justify-center bg-primary h-full'>
      <Text className='text-white'>Account</Text>
      <Text className='text-white'>{user}</Text>
      <Button title='Sign Out' containerStyle='w-[60%] min-h-[45px] mt-6' onPress={signOut}/>
    </View>
  )
}

export default Account