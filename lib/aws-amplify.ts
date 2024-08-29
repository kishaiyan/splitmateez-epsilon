import { AuthError,signIn, type SignInInput, fetchAuthSession ,getCurrentUser,signOut,AuthSession} from 'aws-amplify/auth';

export async function currentSess(){
  try{
    const {credentials} =await fetchAuthSession();
    return credentials.sessionToken;
  }
  catch(error){
    return(error)
  }
  
}


export  async function currentSession() {
  try {
    const { accessToken, idToken } = (await fetchAuthSession()).tokens ?? {};
    console.log(accessToken,idToken)
  } catch (err) {
    console.log(err);
  }
}
export  async function handleSignOut() {
  try {
    const response=await signOut();
    console.log("Signed Out")
  } catch (error) {
    console.log('error signing out: ', error);
  }
}
export  async function getcurrentUser(){
  try{
    const { userId } = await getCurrentUser();
    return userId;
  }
  catch(error){
    console.log(error);
  }
}
export async function handleSignIn({ username, password }: SignInInput) {
  try {
    const response = await signIn({ username, password });
    
    return response
  } catch (error) {
   
    error instanceof AuthError && console.log(error.underlyingError,error.name, error.message, error.recoverySuggestion)
  }
}

