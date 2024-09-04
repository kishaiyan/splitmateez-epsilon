import { Text,View,Image} from "react-native";

const AppBar = ()=>{
  const logo=require("../assets/images/logo.png")

      return(
    <View className='flex-row items-center justify-center gap-3 mb-6'>
        <Image source={logo} className='w-10 h-10' resizeMode='contain'/>
        <Text className='text-gray-200 text-2xl font-extrabold'>SPLITSAVVY</Text>
    </View>
      )
    }

    export default AppBar