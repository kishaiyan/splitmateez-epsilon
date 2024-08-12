import { View, Text, TextInput } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/customButton';
import { useRouter,useLocalSearchParams, router } from 'expo-router';
import { confirmSignUp, type ConfirmSignUpInput } from 'aws-amplify/auth';



const ConfirmEmail = () => {
  
  const { email,username } = useLocalSearchParams();
  const [code, setCode] = useState('');

  const handleSignUpConfirmation = async ({ username, confirmationCode }: ConfirmSignUpInput) => {
    try {
      const { isSignUpComplete, nextStep } = await confirmSignUp({ username, confirmationCode });
      router.push("/signin")
    } catch (error) {
      console.log('Error confirming sign up:', error);
    }
  };

  const onSubmit = () => {
    
    handleSignUpConfirmation({ username:username, confirmationCode: code });
  };

  return (
    <SafeAreaView>
      <View className='h-full bg-primary w-full items-center'>
        <View className='border w-full h-[5%] my-5'>
          <Text className='text-white text-center text-2xl font-sans'>Confirm your Email</Text>
        </View>
        <View className='border w-full h-[15%] justify-evenly'>
          <Text className='text-white text-xl font-sans'>Please enter the verification to confirm your email address</Text>
          <Text className='text-white text-sm'>Email has been sent to {email}</Text>
        </View>
        <View className='h-[250px] items-center justify-center'>
          <TextInput
            keyboardType='number-pad'
            value={code}
            onChangeText={(text) => setCode(text)}
            className='border items-center p-5 text-white border-gray-400 w-full h-[100px] text-3xl text-center'
            placeholder='******'
            style={{ letterSpacing: 26, width: 300 }}
            maxLength={6}
          />
        </View>
        <Button title='Confirm Email' containerStyle='w-[60%] min-h-[40px]' onPress={onSubmit} />
      </View>
    </SafeAreaView>
  );
};

export default ConfirmEmail;
