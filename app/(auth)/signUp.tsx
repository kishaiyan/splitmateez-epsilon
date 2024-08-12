import { View, Text, ScrollView, KeyboardAvoidingView } from 'react-native';
import React, { useState } from 'react';
import TextField from '../../components/textField';
import { signUp } from 'aws-amplify/auth';
import Button from '../../components/customButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

type signupParameters = {
  firstname: string,
  lastname: string,
  email: string,
  phone: string,
  address: string,
  password: string,
}
function getNumber(phone:string){
  return phone.replace('0','+61')
}

async function handlesignUp({ firstname, lastname, email, phone, address, password }: signupParameters) {
  try {
    const { isSignUpComplete, userId, nextStep } = await signUp({
      username: email, // Username typically uses email
      password,
      options:{
        userAttributes:{
          email, 
        phone_number: getNumber(phone), // 'phone_number' should be in E.164 format
        given_name: firstname,
        family_name: lastname,
        address,
        },
        autoSignIn: { enabled: true },
      }
     
       // Enable auto sign-in after sign-up
    });

    console.log(userId);
  } catch (error) {
    console.log('error signing up:', error);
  }
}

const Signup = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    email: '',
    firstname: '',
    lastname: '',
    address: '',
    password: '',
    phno: '',
  });

  const onSubmit = () => {
    handlesignUp({
      firstname: form.firstname,
      lastname: form.lastname,
      email: form.email,
      phone: form.phno,
      address: form.address,
      password: form.password,
    });
  };

  return (
    <SafeAreaView className='h-full justify-evenly items-center'>
      <View className='flex-row w-full'>
        <MaterialIcons name='chevron-left' size={32} color="#BD6A33" onPress={router.back} />
        <Text className='text-white text-2xl ml-7'>SIGN UP</Text>
      </View>
      <KeyboardAvoidingView behavior='padding' className='flex-1'>
        <ScrollView>
          <View className='w-full min-h-[60vh] px-4 my-6 items-center'>
            <TextField label="EMAIL" value={form.email} handlechange={(e) => setForm({ ...form, email: e })} placeholder="john.doe@something.com" keyboardtype="email-address" />
            <TextField label="FIRST NAME" value={form.firstname} handlechange={(e) => setForm({ ...form, firstname: e })} placeholder="John" keyboardtype="default" />
            <TextField label="LAST NAME" value={form.lastname} handlechange={(e) => setForm({ ...form, lastname: e })} placeholder="Doe" keyboardtype="default" />
            <TextField label="ADDRESS" value={form.address} handlechange={(e) => setForm({ ...form, address: e })} keyboardtype="default" placeholder="Full address" />
            <TextField label="PHONE NUMBER" value={form.phno} handlechange={(e) => setForm({ ...form, phno: e })} keyboardtype="number-pad" placeholder="04.." />
            <TextField label="PASSWORD" value={form.password} handlechange={(e) => setForm({ ...form, password: e })} keyboardtype="default" placeholder="Password" />
            <Button title='Sign Up' containerStyle='w-[60%] min-h-[40px]' onPress={onSubmit} />
          </View>
          <View className="flex-row items-center justify-between">
            <View className="border-b border-gray-500 w-[40%]" />
            <Text className="text-white text-xl mx-2">OR</Text>
            <View className="border-b border-gray-500 w-[40%]" />
          </View>
          <View className='mt-5 h-[5%] items-center justify-center flex-row'>
            <Text className='text-white mr-2'>Have an account already?</Text>
            <Link href="/signIn" className='text-secondary underline text-md'>Sign In</Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default Signup;
