import { View, Text, FlatList } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { currentSess,currentSession } from '../../lib/aws-amplify';

const Home = () => {
  useEffect(()=>{
    currentSess()
    
  },[])
  return (
    <SafeAreaView className='h-full bg-primary px-4'>
      <FlatList 
      data={[{id:"1"},{id:"2"},{id:"3"},{id:"4"}]}
      keyExtractor={(item) => item.id}
      renderItem={({item}) => (
        <View>
          <Text className='text-white text-2xl'>
            {item.id}
          </Text>
        </View>
       )}
       ListHeaderComponent={()=>(
        <View className='my-6 px-4 space-y-6'>
           <View className='justify-between items-start flex=row mb-6'>
              <View>
                <Text className='font-medium text-gray-400 text-lg'>Welcome Back</Text>
                <Text className='font-semibold text-secondary text-4xl'>Kishaiyan</Text>
              </View>
           </View>
    

        </View>
       )}
      />
    </SafeAreaView>
  )
}

export default Home