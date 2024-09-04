import { signIn,signOut, getCurrentUser, AuthError, fetchAuthSession  } from "aws-amplify/auth";

export async function currentSess(){
  try{
    const {accessToken,idToken} =(await fetchAuthSession()).tokens??{};
    console.log("Access Token:",accessToken);
    console.log("Id Token:",idToken);
    // return credentials.sessionToken;
  }
  catch(error){
    return(error)
  }
  
}

export  async function handleSignOut() {
  try {
    await signOut();
    console.log("Signed Out")
  } catch (error) {
    console.log('error signing out: ', error);
  }
}
export  async function getcurrentUser(){
  try{
    const response = await getCurrentUser();
    console.log(response)
    return response.userId;
  }
  catch(error){
    console.log("Current User Error",error);
  }
}
export async function handleSignIn({ username, password }) {
  try {
    const response=await signIn({ username, password });
    
    return response;
  } catch (error) {
    console.log(error,error.underlyingError)
  }
}

