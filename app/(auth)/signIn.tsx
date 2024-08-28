import { View, Text, Alert } from 'react-native';
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import TextField from '../../components/textField';
import Button from '../../components/customButton';
import { Link, useRouter } from 'expo-router';
import { handleSignIn,currentSess } from '../../lib/aws-amplify';
import { useGlobalContext } from '../../context/GlobalProvider';



const signin = () => {
  const {isLoading,setIsLoading}=useGlobalContext()
  const router=useRouter();
  const [signForm,setSignForm]=useState({
    email:'',
    password:''
  })
  
  const onsubmit=async()=>{
  try{ 
    setIsLoading(true)
    const response = await handleSignIn(
    {
      username:signForm.email,
      password:signForm.password,
    }
   )
   setIsLoading(false)
   if(response)
      {
        if(response.isSignedIn === true)
          {
            const session= await currentSess()
            router.replace('/home')
          }
      }
      else
      {
        Alert.alert("Wrong Credentials","Please check your credentials it doesnt match with our records",[
          {text:"Try again",
            onPress:()=>{} 
          },
          {
            text:"Sign Up",
            onPress:()=>{router.replace('/signup')}
          }
      ])
  }
   
}
   catch(error){
    console.log(error)
   }
  }
  return (
    <SafeAreaView className='h-full items-center bg-primary'>
      <Text className='text-secondary text-2xl mb-[50]'>LOGIN TO SMEZ</Text>
        <View className='h-full w-full items-center justify-start'>
          <TextField label="EMAIL" value={signForm.email} handlechange={(e)=>setSignForm({...signForm,email:e})}placeholder="john.doe@something.com" keyboardtype="email-address" error=""/>

          <TextField label="PASSWORD" value={signForm.password} handlechange={(e)=>setSignForm({...signForm,password:e})} keyboardtype="default" placeholder="Password" error=""/>

          <Button title='Sign In' containerStyle='w-[60%] min-h-[45px] mt-6 ' isLoading={isLoading} onPress={onsubmit}/>
          
          

          <View className='mt-5 h-[5%] items-center justify-center flex-row'>
            <Text className='text-white mr-2'>Don't have an account</Text>
            <Link href="/signup" className='text-secondary text-md'>Sign Up</Link>
          </View>

        </View>
      
    </SafeAreaView>
    
  )
}

export default signin