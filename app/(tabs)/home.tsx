import { FlatList,View,Text} from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AppBar from '../../components/appBar'
import HomeTile from '../../components/homeTile'
import { AntDesign, MaterialIcons } from '@expo/vector-icons'


const Home = () => {
  const [people,setPeople]=useState([
    {name:"shaun",key:'1'},
    {name:"yoshi",key:'2'},
    {name:"mario",key:'3'},
    {name:"luigi",key:'4'},
    {name:"toad",key:'5'},
    {name:"peach",key:'6'},
  ])
  
  return (
    <SafeAreaView className='flex-1 bg-primary  px-4'>
      <AppBar />
      
      <View className='h-[10%]'>
        <Text className='text-white text-xl'>Welcome back</Text>
        <Text className='text-secondary text-2xl font-extrabold'>Welcome</Text>
      </View>
      <View className='flex-row items-center justify-center gap-2'>
        <MaterialIcons name='swipe' color='#ffffff' size={20}/>
        <Text className='text-gray-200'>Swipe for more properties</Text>
      </View>
      <FlatList  
        data={people}
        renderItem={({item})=>(
          
            <HomeTile name={item.name}/>
         
        )}
        horizontal
       
        
      />
    </SafeAreaView>
  )
}

export default Home