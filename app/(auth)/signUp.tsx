import { View, Text, ScrollView,Image  } from 'react-native';
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
  address:string,
  password: string,
};


const Signup = () => {
  function getNumber(phone: string) {
    return phone.replace('0', '+61');
  }
  
  async function handlesignUp(
    { firstname, lastname, email, phone,address, password }: signupParameters,
    router: any // Use appropriate type for navigation
  ) {
    try {
      const {isSignUpComplete,userId,nextStep} = await signUp({
        username: email,
        password,
        options:{
          userAttributes: {
              email,
              phone_number: getNumber(phone),
              given_name: firstname,
              family_name: lastname,
              address,
            },
            
            autoSignIn: { enabled: true },
        }
      });
      console.log(isSignUpComplete,userId,nextStep);
      if( !isSignUpComplete && nextStep.signUpStep === "CONFIRM_SIGN_UP" ){
        router.replace(`/confirmEmail?email=${encodeURIComponent(email)}&user=${encodeURIComponent(userId)}`)
      }
      
    } catch (error) {
      console.log('error signing up:', error);
    }
  }
  
  const logo=require("../../assets/images/logo.png")
  const router = useRouter();
  const [form, setForm] = useState({
    email: '',
    firstname: '',
    lastname: '',
    password: '',
    phno: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    firstname: '',
    lastname: '',
    password: '',
    phno: '',
  });

  const validateForm = () => {
    let valid = true;
    let newErrors = {
      email: '',
      firstname: '',
      lastname: '',
      password: '',
      phno: '',
    };

    if (!form.email) {
      newErrors.email = 'Email is required';
      valid = false;
    }

    if (!form.firstname) {
      newErrors.firstname = 'First name is required';
      valid = false;
    }

    if (!form.lastname) {
      newErrors.lastname = 'Last name is required';
      valid = false;
    }

    if (!form.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (form.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      valid = false;
    }

    if (!form.phno) {
      newErrors.phno = 'Phone number is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const onSubmit = () => {
    if (validateForm()) {
      handlesignUp({
        firstname: form.firstname,
        lastname: form.lastname,
        email: form.email,
        phone: form.phno,
        address:"something",
        password: form.password,
      }, router);
      
    }
  };

  return (
    <SafeAreaView className='flex-1 items-center bg-primary px-5'>
      <View className='flex-row items-center gap-3 mb-4'>
        <Image source={logo} className='w-10 h-10' resizeMode='contain'/>
        <Text className='text-gray-200 text-2xl font-bold'>SPLITSAVVY</Text>
      </View>
      
        <ScrollView className=""  showsVerticalScrollIndicator={false}>
          {/* <View className="flex-1"> */}
              <View className='flex items-start'>
                <Text className="text-secondary text-xl">REGISTER</Text>
              </View>
                <View className="px-4 my-2 items-center justify-between">
                  <View className="items-center">
                    <TextField
                      label="Email"
                      value={form.email}
                      handlechange={(e) => setForm({ ...form, email: e })}
                      placeholder="john.doe@something.com"
                      keyboardtype="email-address"
                      error={errors.email}
                    />
                    <TextField
                      label="First Name"
                      value={form.firstname}
                      handlechange={(e) => setForm({ ...form, firstname: e })}
                      placeholder="John"
                      keyboardtype="default"
                      error={errors.firstname}
                    />
                    <TextField
                      label="Last Name"
                      value={form.lastname}
                      handlechange={(e) => setForm({ ...form, lastname: e })}
                      placeholder="Doe"
                      keyboardtype="default"
                      error={errors.lastname}
                    />
                    <TextField
                      label="Phone Number"
                      value={form.phno}
                      handlechange={(e) => setForm({ ...form, phno: e })}
                      keyboardtype="number-pad"
                      placeholder="04.."
                      error={errors.phno}
                    />
                    <TextField
                      label="Password"
                      value={form.password}
                      handlechange={(e) => setForm({ ...form, password: e })}
                      keyboardtype="default"
                      placeholder="Password"
                      error={errors.password}
                    />
                    <Button title='Sign Up' containerStyle='mt-6 px-10 py-2' onPress={onSubmit} />
                    <View className='w-[80%] mt-5 pt-3 flex-row gap-2'>
  <MaterialIcons name='check' color="green" size={16}/>
  <Text className='text-gray-200 text-xs'>By signing up you agree to our terms and conditions</Text>
</View>
                  </View>

                  <View className="w-full mt-6">
                    <View className="flex-row items-center justify-between">
                      <View className="border-b border-gray-300 flex-1" />
                      <Text className="text-white text-xl mx-2">OR</Text>
                      <View className="border-b border-gray-300 flex-1" />
                    </View>
                    <View className='flex mt-5 items-center justify-center'>
                      <Text className='text-white mr-2'>Have an account already?</Text>
                      <Link href="/signIn" className='text-secondary text-xl'>Sign In</Link>
                    </View>
                  </View>
            </View>
        </ScrollView>
      
    </SafeAreaView>
  );
}

export default Signup;
