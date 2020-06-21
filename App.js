import React from 'react';
import { Text, View, Button, Vibration, ScrollView, Image, TextInput } from 'react-native';
import { Notifications } from 'expo';
import * as firebase from 'firebase';
import GreateCreateUser from "./GreateCreateUser";
import { firebaseInitialize, registerForPushNotificationsAsync } from "./firebaseUtils";
import Spinner from 'react-native-loading-spinner-overlay';

firebaseInitialize();

export default class App extends React.Component {
  expoPushToken = '';

  state = {
    email: '',
    password: '',
    errorMessage: '',
    spinner: false,
  };

  componentDidMount() {
    this.prepareFirebase();
  }

  prepareFirebase = async () => {
    let errorMessage = '';

    try {
      const { error = '', token } = await registerForPushNotificationsAsync();
      errorMessage = error;
      this.expoPushToken = token;
      this._notificationSubscription = Notifications.addListener(this.handleNotification);
    } catch ({ message }) {
      errorMessage = message;
    }

    this.setState({ errorMessage });
  };

  handleNotification = () => {
    Vibration.vibrate();
  };

  postNotification() {
    const message = {
      to: this.expoPushToken,
      sound: 'default',
      title: 'Notification',
      body: 'New user has been registered',
      data: { data: 'New user has been registered' },
      _displayInForeground: true,
    };

    return fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      })
      .then(resp => resp.json());
  }

  authAndPostNotification = async () => {
    this.setState({ spinner: true });
    let errorMessage = '';
    let isRegistered = false;
    try {
      await firebase.auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password);
      const { errors, data } = await this.postNotification();
      if (errors) {
        errorMessage = errors[0].message;
      } else {
        isRegistered = true;
      }
    } catch ({ message }) {
      errorMessage = message;
    }
    await this.setState({
      errorMessage,
      isRegistered,
      spinner: false
    })
  };

  render() {
    if (this.state.isRegistered) {
      return <GreateCreateUser message="The user has been created successfully" />
    }
    return (
      <ScrollView style={{marginTop: 50}}>
        <View style={styles.image_content}>
          <Text>Registration</Text>
          <Image 
            source={{uri: "https://reactnative.dev/docs/assets/p_cat2.png"}}
            style={styles.imageStyle}
          />
          <Text style={{ color: "red" }}>{this.state.errorMessage}</Text>
          <View style={styles.container}>
            <Spinner
              visible={this.state.spinner}
              textContent={'Loading...'}
              textStyle={styles.spinnerTextStyle}
            />
          </View>
        </View>
        <TextInput
          style={styles.inputStyle}
          placeholder="Email"
          value={this.state.email}
          onChangeText={text => this.setState({ email: text })}
        />
        <TextInput
          style={styles.inputStyle}
          placeholder="Password"
          secureTextEntry
          value={this.state.password}
          onChangeText={text => this.setState({ password: text })}
        />
        <Button
          style={styles.buttonStyle}
          title="Sign Up"
          onPress={this.authAndPostNotification}
        />
      </ScrollView>
    );
  };
}

const styles = {
  inputStyle: {
    height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      margin: 15,
      padding: 5,
      borderRadius: 10,
  },

  image_content: {
    alignItems: "center",
  },

  imageStyle: {
    width: 200,
    height: 200
  },

  buttonStyle: {
    width: 150,
    borderRadius: 15,
  },

  spinnerTextStyle: {
    color: '#FFF'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
};