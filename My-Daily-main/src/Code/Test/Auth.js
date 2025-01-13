import {View, Text, TextInput, Button} from 'react-native';
import React, {useState} from 'react';
import {
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  updateProfile,
} from 'firebase/auth/react-native';
import TouchID from 'react-native-touch-id';
import {auth} from '../../Firebase/Firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Auth = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const onPress = async () => {
    await signInWithEmailAndPassword(auth, userName, password)
      .then(userCredential => {
        const user = userCredential.user;
        console.log(user);
      })
      .catch(error => {
        console.log(error);
      });
  };
  const updateP = e => {
    e.preventDefault();
    console.log('Update ....');
    const auth = getAuth();
    updateProfile(auth.currentUser, {
      displayName: 'Tấn Khang',
      photoURL:
        'https://i.pinimg.com/originals/0e/50/39/0e503918829c61bd24803ce064546cee.jpg',
    })
      .then(() => console.log('Update Success'))
      .catch(e => console.log(e));
  };
  const resetPassword = () => {
    const auth = getAuth();
    sendPasswordResetEmail(auth, userName)
      .then(() => {
        console.log('Password Reset');
      })
      .catch(error => console.log(error));
  };
  const verificationEmail = () => {
    const auth = getAuth();
    sendEmailVerification(auth.currentUser).then(() => {
      console.log('Verification');
    });
  };

  const changePassword = () => {
    const auth = getAuth();
    updatePassword(auth.currentUser, newPassword).then(() => {
      console.log('Change password');
    });
  };
  const logOut = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log('Sign out success');
      })
      .catch(error => {
        // An error happened.
      });
  };
  const optionalConfigObject = {
    title: 'Authentication Required', // Android
    imageColor: 'hsl(221,100%,64%)', // Android
    imageErrorColor: '#ff0000', // Android
    sensorDescription: 'Touch sensor', // Android
    sensorErrorDescription: 'Failed', // Android
    cancelText: 'Cancel', // Android
    fallbackLabel: 'Show Passcode', // iOS (if empty, then label is hidden)
    unifiedErrors: false, // use unified error messages (default false)
    passcodeFallback: false, // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
  };
  const touchID = async () => {
    await TouchID.authenticate(
      'The finger you use in your phone',
      optionalConfigObject,
    )
      .then(success => getDataUser())
      .catch(error => console.log(error));
  };
  const createNewUser = async () => {
    const auth = getAuth();
    await createUserWithEmailAndPassword(auth, userName, password)
      .then(userCredential => {
        // Signed in
        const user = userCredential.user;
        // ...
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  };
  const storingDataUser = async () => {
    try {
      await AsyncStorage.setItem('UserID', '9HZ6N1jjGbn7veJFPCZx');
    } catch (error) {
      console.log(error);
    }
  };
  const getDataUser = async () => {
    try {
      const value = JSON.parse(await AsyncStorage.getItem('UserID'));
      await signInWithEmailAndPassword(auth, value.email, value.password)
        .then(userCredential => {
          const user = userCredential.user;
          console.log(user);
        })
        .catch(error => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };
  const deleteAccount = () => {
    const auth = getAuth();
    const user = auth.currentUser;

    deleteUser(user)
      .then(() => {
        // User deleted.
        console.log('delete success');
      })
      .catch(error => {
        // An error ocurred
        // ...
        console.log('delete success');
      });
  };
  const applyTouchID = () => {
    storingDataUser();
  };
  return (
    <View
      style={{
        flex: 1,

        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <TextInput
        defaultValue={userName}
        onChangeText={setUserName}
        placeholder="User name"
        style={{
          borderWidth: 1,
          width: '90%',
          height: 40,
          color: 'black',
          marginVertical: 10,
        }}
      />
      <TextInput
        defaultValue={password}
        onChangeText={setPassword}
        placeholder="Password"
        style={{
          borderWidth: 1,
          width: '90%',
          height: 40,
          color: 'black',
          marginVertical: 10,
        }}
      />
      <TextInput
        defaultValue={newPassword}
        onChangeText={setNewPassword}
        placeholder="Set Password"
        style={{
          borderWidth: 1,
          width: '90%',
          height: 40,
          color: 'black',
          marginVertical: 10,
        }}
        placeholderTextColor="green"
      />
      <Button title="Sign in" onPress={onPress} />
      <Button title="Update profile" onPress={updateP} />
      <Button title="Reset Password" onPress={resetPassword} />
      <Button title="Verification Email" onPress={verificationEmail} />
      <Button title="Change Password" onPress={changePassword} />
      <Button title="Logout" onPress={logOut} />
      <Button title="Touch ID" onPress={touchID} />
      <Button title="Apply touch ID" onPress={applyTouchID} />
      <Button title="Create new user" onPress={createNewUser} />
      <Button title="Delete Account" onPress={deleteAccount} />
      <Button title="Storing Account" onPress={storingDataUser} />
    </View>
  );
};

export default Auth;
