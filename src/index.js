import React, { Component } from 'react';
import { 
  View,
  Button,
  StyleSheet,
  AsyncStorage,
  Text,
  Alert
} from 'react-native';
import api from './services/api';

export default class src extends Component {
  state = {
    loggedInUser: null,
    errorMessage: null,
    projects: []
  }

  componentDidMount = async () => {
    const token = await AsyncStorage.getItem('@CodeApi:token');
    const user = JSON.parse(await AsyncStorage.getItem('@CodeApi: user'));

    if (token && user) {
      this.setState({ loggedInUser: user })
    }
  }

  signIn = async () => {
    try {
      const response = await api.post('/auth/authenticate', {
        email: 'fmm312@gmail.com',
        senha: '123456'
      });
  
      const { user, token } = response.data;
      
      await AsyncStorage.multiSet([
        ['@CodeApi: token', token],
        ['@CodeApi: user', JSON.stringify(user)]
      ])

      this.setState({ loggedInUser: user })

      Alert.alert('Login com sucesso!')
    } catch (response) {
      this.setState({ errorMessage: response.data.error });
    }
  };

  getProjects = async () => {
    try {
      const response = await api.get('/projects');

      const { projects } = response.data;

      this.setState({ projects });
    } catch (response) {

    }
  }

  render() {
    const { loggedInUser, errorMessage, projects } = this.state;

    return (
      <View style={styles.container}>
        { !!loggedInUser && <Text>{ loggedInUser }</Text> }
        { !!errorMessage && <Text>{ errorMessage }</Text> }

        { loggedInUser
          ? <Button onPress={this.getProjects} title='Carregar' />
          : <Button onPress={this.signIn} title='Entrar' />        
        }

        { projects.map(project => (
          <View key={project.id} style={{ marginTop: 15 }} >
            <Text style={{ fontWeight: 'bold' }}>{project.title}</Text>
            <Text>{project.description}</Text>
          </View>
        )) }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

