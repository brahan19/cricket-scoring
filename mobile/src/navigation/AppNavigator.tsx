import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { HomeScreen } from '../screens/HomeScreen';
import { MatchDetailsScreen } from '../screens/MatchDetailsScreen';
import { LiveScoringScreen } from '../screens/LiveScoringScreen';
import { NewMatchScreen } from '../screens/NewMatchScreen';
import { TeamsScreen } from '../screens/TeamsScreen';
import { TeamDetailsScreen } from '../screens/TeamDetailsScreen';
import { NewTeamScreen } from '../screens/NewTeamScreen';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#2196F3',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            >
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{ title: 'Cricket Scoring' }}
                />
                <Stack.Screen
                    name="MatchDetails"
                    component={MatchDetailsScreen}
                    options={{ title: 'Match Details' }}
                />
                <Stack.Screen
                    name="LiveScoring"
                    component={LiveScoringScreen}
                    options={{ title: 'Live Scoring' }}
                />
                <Stack.Screen
                    name="NewMatch"
                    component={NewMatchScreen}
                    options={{ title: 'New Match' }}
                />
                <Stack.Screen
                    name="Teams"
                    component={TeamsScreen}
                    options={{ title: 'Teams' }}
                />
                <Stack.Screen
                    name="TeamDetails"
                    component={TeamDetailsScreen}
                    options={{ title: 'Team Details' }}
                />
                <Stack.Screen
                    name="NewTeam"
                    component={NewTeamScreen}
                    options={{ title: 'New Team' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}; 