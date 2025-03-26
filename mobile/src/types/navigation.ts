import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
    Home: undefined;
    MatchDetails: { matchId: string };
    NewMatch: undefined;
    LiveScoring: { matchId: string };
    Teams: undefined;
    TeamDetails: { teamId: string };
    NewTeam: undefined;
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>; 