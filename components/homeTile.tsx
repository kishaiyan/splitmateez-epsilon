import { View, Text,Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { AntDesign } from '@expo/vector-icons'

const HomeTile = ({name}) => {
  return (
    <TouchableOpacity onPress={()=>console.log("Clicked tile")}>
    <View className='flex-col bg-fieldfill m-1 p-4 h-[64%] w-[250px] rounded-lg'>
    <View className='flex-row justify-evenly mb-2.5  items-center'>
      {/**? left side of the card */}

      <View className='w-[50%]'>
          <Image 
            source={require("../assets/images/splash.png")}
            className=' w-[100%] '
            resizeMode='contain'
            />
      </View>
      {/**? right side of the card */}
      <View className='items-end h-[80%]  justify-between '>
        <AntDesign name='adduser' color={"#f5f6fa"} size={36}/>
            <View className=' p-5'>
              <AntDesign name='upload' color={"#ffffff"}/>
              <Text className='text-white text-center'>4</Text>
            </View>
            <View className=' p-5'>
              <AntDesign name='download' color={"#ffffff"}/>
              <Text className='text-white text-center'>3</Text>
            </View>
      </View>
      </View>
      <Text className='text-gray-200'>Address :</Text>
      <Text className='text-secondary'>{name}</Text>

    </View>
    </TouchableOpacity>
  )
}

export default HomeTile