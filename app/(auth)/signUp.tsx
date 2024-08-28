import { View, Text, ScrollView,  } from 'react-native';
import React, { useState } from 'react';
import TextField from '../../components/textField';
import { signUp } from 'aws-amplify/auth';
import Button from '../../components/customButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
type signupParameters = {
  firstname: string,
  lastname: string,
  email: string,
  phone: string,
  address: string,
  password: string,
};

function getNumber(phone: string) {
  return phone.replace('0', '+61');
}

async function handlesignUp(
  { firstname, lastname, email, phone, address, password }: signupParameters,
  router: any // Use appropriate type for navigation
) {
  try {
    const { isSignUpComplete, nextStep, userId } = await signUp({
      username: email,
      password,
      options: {
        userAttributes: {
          email,
          phone_number: getNumber(phone),
          given_name: firstname,
          family_name: lastname,
          address,
        },
        autoSignIn: { enabled: true },
      },
    });
    Toast.show({
      type:"success",
      text1:"Signed Up Successfully",
      text2:"Confirm Email to continue",
      autoHide:true,
      visibilityTime: 2000,
    })
    if (!isSignUpComplete && nextStep.signUpStep === "CONFIRM_SIGN_UP") {
       router.push(`/confirmEmail?email=${encodeURIComponent(email)}&username=${encodeURIComponent(userId)}`);
    }
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

  const [errors, setErrors] = useState({
    email: '',
    firstname: '',
    lastname: '',
    address: '',
    password: '',
    phno: '',
  });

  const validateForm = () => {
    let valid = true;
    let newErrors = {
      email: '',
      firstname: '',
      lastname: '',
      address: '',
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

    if (!form.address) {
      newErrors.address = 'Address is required';
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
        address: form.address,
        password: form.password,
      }, router);
    }
  };

  return (
    <SafeAreaView className='h-full justify-evenly items-center bg-primary'>
      <View className='w-full items-center h-[10%]'>
        <Text className='text-white text-2xl'>SIGN UP</Text>
      </View>
      
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <View className="flex-1">
            <View className="flex-1 px-4 my-6 items-center justify-between">
              <View className="w-full items-center">
                <TextField
                  label="EMAIL"
                  value={form.email}
                  handlechange={(e) => setForm({ ...form, email: e })}
                  placeholder="john.doe@something.com"
                  keyboardtype="email-address"
                  error={errors.email}
                />
                <TextField
                  label="FIRST NAME"
                  value={form.firstname}
                  handlechange={(e) => setForm({ ...form, firstname: e })}
                  placeholder="John"
                  keyboardtype="default"
                  error={errors.firstname}
                />
                <TextField
                  label="LAST NAME"
                  value={form.lastname}
                  handlechange={(e) => setForm({ ...form, lastname: e })}
                  placeholder="Doe"
                  keyboardtype="default"
                  error={errors.lastname}
                />
                <TextField
                  label="ADDRESS"
                  value={form.address}
                  handlechange={(e) => setForm({ ...form, address: e })}
                  keyboardtype="default"
                  placeholder="Full address"
                  error={errors.address}
                />
                <TextField
                  label="PHONE NUMBER"
                  value={form.phno}
                  handlechange={(e) => setForm({ ...form, phno: e })}
                  keyboardtype="number-pad"
                  placeholder="04.."
                  error={errors.phno}
                />
                <TextField
                  label="PASSWORD"
                  value={form.password}
                  handlechange={(e) => setForm({ ...form, password: e })}
                  keyboardtype="default"
                  placeholder="Password"
                  error={errors.password}
                />
                <Button title='Sign Up' containerStyle='w-[80%] min-h-[40px] mt-4' onPress={onSubmit} />
              </View>

              <View className="w-full mt-6">
                <View className="flex-row items-center justify-between">
                  <View className="border-b border-gray-500 flex-1" />
                  <Text className="text-white text-xl mx-2">OR</Text>
                  <View className="border-b border-gray-500 flex-1" />
                </View>
                <View className='mt-5 items-center justify-center flex-row'>
                  <Text className='text-white mr-2'>Have an account already?</Text>
                  <Link href="/signin" className='text-secondary text-md'>Sign In</Link>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      
    </SafeAreaView>
  );
}

export default Signup;
