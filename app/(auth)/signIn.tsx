import { View, Text } from 'react-native';
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import TextField from '../../components/textField';
import Button from '../../components/customButton';
import { Link, useRouter } from 'expo-router';
import { AuthError,signIn, type SignInInput } from 'aws-amplify/auth';
import { signOut } from 'aws-amplify/auth';







const signin = () => {
  const router=useRouter();
  const [signForm,setSignForm]=useState({
    email:'',
    password:''
  })
  async function handleSignOut() {
    try {
      const response=await signOut();
      console.log(response)
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }
  async function handleSignIn({ username, password }: SignInInput) {
    try {
      const { isSignedIn, nextStep } = await signIn({ username, password });
      console.log("signed in")
      router.push('/home')
    } catch (error) {
      error instanceof AuthError && console.log(error.name, error.message, error.recoverySuggestion)
    }
  }
  const onsubmit=()=>{
    handleSignIn({
      username:signForm.email,
      password:signForm.password,
  })
  }
  
  return (
    <SafeAreaView className='h-full items-center bg-primary'>
      <Text className='text-secondary text-2xl mb-[50]'>LOGIN TO SMEZ</Text>
        <View className='h-full w-full items-center justify-start'>
          <TextField label="EMAIL" value={signForm.email} handlechange={(e)=>setSignForm({...signForm,email:e})}placeholder="john.doe@something.com" keyboardtype="email-address"/>

          <TextField label="PASSWORD" value={signForm.password} handlechange={(e)=>setSignForm({...signForm,password:e})} keyboardtype="default" placeholder="Password"/>

          <Button title='Sign In' containerStyle='w-[60%] min-h-[45px] mt-6' onPress={onsubmit}/>
          <Button title='Sign Out' containerStyle='w-[60%] min-h-[45px] mt-6' onPress={handleSignOut}/>

          <View className='mt-5 h-[5%] items-center justify-center flex-row'>
            <Text className='text-white mr-2'>Don't have an account</Text>
            <Link href="/signup" className='text-secondary text-md'>Sign Up</Link>
          </View>

        </View>
      
    </SafeAreaView>
    
  )
}

export default signin