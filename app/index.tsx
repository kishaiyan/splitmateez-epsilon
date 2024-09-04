import Button from "../components/customButton";
import React from 'react';
import { View,Image} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, Redirect } from "expo-router";
import { Amplify } from "aws-amplify";
import awsconfig from "../aws-exports";

import { useGlobalContext } from "../context/GlobalProvider";
import AppBar from "../components/appBar";
Amplify.configure(awsconfig);


export default function app(){
  const icon=require('../assets/images/splash_screen.jpg')
  
  const {isLoading,isLoggedIn}=useGlobalContext();
 
  if(!isLoading && isLoggedIn) {return <Redirect href="/home" />}
  // else{return <Redirect href="/forgotPass" />}
  
  return(
  
  <SafeAreaView className="flex-1 items-center bg-primary">
   
   <AppBar/>
    <View className="realtive mt-8 h-full w-full">
      <Image
        source={icon} 
        className="w-screen h-screen"
      />
      <View className="absolute bg-black/80  items-center justify-evenly w-full h-[50%] bottom-[5%] " style={{borderTopLeftRadius:15,borderTopRightRadius:15,}} >
        
        
        <Button 
        title="Get Started !"
        handlePress={()=>router.push('/signIn')}
        containerStyle="w-[70%] min-h-[62px]"
        textStyle="text-white"
        />
        <View className=" h-[10%]"></View>

      
      </View>
    </View>
  </SafeAreaView>
    
  )
}

