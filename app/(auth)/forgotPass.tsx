import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AppBar from '../../components/appBar'

const forgotPass = () => {
  return (
    <SafeAreaView className='bg-primary flex-1 px-5'>
      <AppBar />
      <View>
        <Text className='text-secondary text-xl'>Password Recovery</Text>
      </View>
    </SafeAreaView>
  )
}

export default forgotPass