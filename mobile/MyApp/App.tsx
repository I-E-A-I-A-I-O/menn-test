/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Linking,
  ViewStyle,
  Button,
  ScrollView,
  StyleProp,
  TextStyle
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import dynamicLinks, { FirebaseDynamicLinksTypes } from '@react-native-firebase/dynamic-links';
import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';

const linking: LinkingOptions<ReactNavigation.RootParamList> = {
  prefixes: [
    "https://menntest.page.link"
  ],

  async getInitialURL(): Promise<string> {
    const url = await Linking.getInitialURL();
    const dynamicLinkUrl = await dynamicLinks().getInitialLink();

    if(dynamicLinkUrl) {
      return dynamicLinkUrl.url;
    }

    if (url != null) {
      return url;
    }

    return 'https://menntest.page.link/nothing';
  },

  subscribe(listener: (deeplink: string) => void) {
    const onReceiveURL = ({url}: {url: string}) => listener(url);
    const sub = Linking.addEventListener('url', onReceiveURL);

    const handleDynamicLink = (
      dynamicLink: FirebaseDynamicLinksTypes.DynamicLink,
      ) => {
      listener(dynamicLink.url);
    };
    const unsubscribeToDynamicLinks = dynamicLinks().onLink(handleDynamicLink);

    return () => {
      unsubscribeToDynamicLinks();
      sub.remove();
    };
  },

  config: {
    screens: {
      Home: "names/:id",
      Nothing: "nothing"
    }
  },
};

type RootStackParamList = {
  Home: { id: string };
  Nothing: undefined;
};

type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

const Home = ({ route }: HomeProps) => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle: ViewStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <ScrollView style={{flex: 1}}>
        <View style={backgroundStyle}>
          <Text style={{...styles.sectionTitle, color: isDarkMode ? Colors.lighter : Colors.darker}}>
            This page is for {route.params.id}!
          </Text>
          <View style={{maxWidth: '50%', flex: 1, marginLeft: '25%', marginTop: 40}}>
            <Button title='Send Notification'  />  
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const Nothing = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle: ViewStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <ScrollView style={{flex: 1}}>
        <View style={backgroundStyle}>
          <Text style={{...styles.sectionTitle, color: isDarkMode ? Colors.lighter : Colors.darker}}>
            Nothing to see here...
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const StackNavigator = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle: StyleProp<{backgroundColor?: string | undefined}> = {
    backgroundColor: isDarkMode ? Colors.dark : Colors.light
  };

  const titleStyle: StyleProp<Pick<TextStyle, "fontSize" | "fontWeight" | "fontFamily"> & {
    color?: string | undefined;
  }> = {
    color: isDarkMode ? Colors.light : Colors.dark
  }

  return (
    <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
      <StackNavigator.Navigator initialRouteName='Nothing'>
        <StackNavigator.Screen 
          name='Home' 
          component={Home} 
          initialParams={{id: "INITIAL"}} 
          options={{title: 'Name page', headerStyle: backgroundStyle, headerTitleStyle: titleStyle}}
        />
        <StackNavigator.Screen
          name='Nothing'
          component={Nothing}
          options={{title: 'Empty', headerStyle: backgroundStyle, headerTitleStyle: titleStyle}}
        />
      </StackNavigator.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: '600',
    alignSelf: 'center',
    marginTop: 90
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  button: {
    maxWidth: '60%'
  }
});

export default App;
