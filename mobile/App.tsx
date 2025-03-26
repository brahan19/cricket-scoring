/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { AppNavigator } from './src/navigation/AppNavigator';

const App: React.FC = () => {
    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="#1976D2" />
            <AppNavigator />
        </>
    );
};

export default App;
