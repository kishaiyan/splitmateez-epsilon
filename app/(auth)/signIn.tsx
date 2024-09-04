import { View, Text, Alert,Image } from 'react-native';
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import TextField from '../../components/textField';
import Button from '../../components/customButton';
import { Link, useRouter } from 'expo-router';
import { handleSignIn,currentSess, handleSignOut } from '../../lib/aws-amplify';
import AppBar from '../../components/appBar';
import { useGlobalContext } from '../../context/GlobalProvider';



const signin = () => {
  const logo=require("../../assets/images/logo.png")
  const {isLoading,setIsLoading}=useGlobalContext()
  const router=useRouter();
  const [signForm,setSignForm]=useState({
    email:'',
    password:''
  })
  
  const onsubmit=async()=>{
  try{ 
    setIsLoading(true)
     const response=await handleSignIn(
      {
        username:signForm.email,
        password:signForm.password,
      }
      )
      console.log(response)
   setIsLoading(false)
    if(response && response.isSignedIn)
      {
        console.log("Logged in Successfully: ",response.isSignedIn);
        router.replace('/home');      
      }
      else
      {
        Alert.alert("Wrong Credentials","Please check your credentials it doesnt match with our records",[
          {text:"Try again",
            onPress:()=>{} 
          },
          {
            text:"Sign Up",
            onPress:()=>{router.push('/signUp')}
          }
      ])
  }
   
}
   catch(error){
    console.log(error) 
   }
  }
  

  return (
    <SafeAreaView className='flex-1 items-center bg-primary px-5'>
      {/* // appBar */}
      <AppBar/>
      {/* // Rest of the page */}
        <View className='flex-1'>
          <View className='flex items-start mb-4'>
            <Text className="text-secondary text-xl">SIGN IN</Text>
          </View>
          <View className='items-center justify-start px-4'>
                <TextField label="Email" value={signForm.email} handlechange={(e)=>setSignForm({...signForm,email:e})}placeholder="john.doe@something.com" keyboardtype="email-address" error=""/>

                <TextField label="Password" value={signForm.password} handlechange={(e)=>setSignForm({...signForm,password:e})} keyboardtype="default" placeholder="Password" error=""/>

                <Button title='Sign In' containerStyle='mt-5 mb-3 px-10 py-3' isLoading={false} onPress={onsubmit}/>
                <Link href={'/forgotPass'} className='text-gray-400 text-xs'>Forgot your password?</Link>
            </View>

            <View className='flex items-center mt-10'>
              <Text className='text-white text-md'>Don't have an account?</Text>
              <Link href={'/signUp'} className='text-secondary text-xl'> Sign Up</Link>
        </View>
            
        </View>
        
    </SafeAreaView>
    
  )
}

export default signin