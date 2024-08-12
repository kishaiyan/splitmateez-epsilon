import Button from "../components/customButton";
import React from 'react';
import { Text,View,Image} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Link } from "expo-router";
import { Amplify } from "aws-amplify";
import awsconfig from "./aws-exports";

Amplify.configure(awsconfig);


export default function app(){
  const icon=require('../assets/images/splash_screen.jpg')
  return(
  <SafeAreaView className="flex-1 items-center justify-start bg-black">
   
    <View >
      <Text className="text-white text-3xl pt-2">SPLIT MATEZ</Text>
      <Link href="/home" className="text-white">Go to Home</Link>
    </View>
    <View className="realtive mt-8 h-full w-full bg-white">
      <Image
        source={icon} 
        className="w-screen h-screen"
      />
      <View className="absolute bg-black/80  items-center justify-center" style={{width:'100%', height:'30%',bottom:"7%",borderTopLeftRadius:15,borderTopRightRadius:15}} >
        <Button 
        title="Get Started !"
        handlePress={()=>router.push('/signup')}
        containerStyle="w-[70%] min-h-[62px]"
        textStyle="text-white"
        />
      
      </View>
    </View>
  </SafeAreaView>
    
  )
}

