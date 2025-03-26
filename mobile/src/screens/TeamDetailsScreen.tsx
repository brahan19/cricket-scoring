import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { teamApi } from '../services/api';
import { ITeam, ITeamMember } from '../interfaces';
import { NavigationProp } from '../types/navigation';

export const TeamDetailsScreen: React.FC = () => {
    const route = useRoute();
    const navigation = useNavigation<NavigationProp>();
    const { teamId } = route.params as { teamId: string };
    const [team, setTeam] = useState<ITeam | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [newMemberName, setNewMemberName] = useState('');
    const [newMemberRole, setNewMemberRole] = useState<ITeamMember['role']>('all-rounder');

    useEffect(() => {
        loadTeamDetails();
    }, [teamId]);

    const loadTeamDetails = async () => {
        try {
            const response = await teamApi.getById(teamId);
            setTeam(response.data);
        } catch (error) {
            console.error('Error loading team details:', error);
            Alert.alert('Error', 'Failed to load team details');
        } finally {
            setLoading(false);
        }
    };

    const handleAddMember = async () => {
        if (!newMemberName.trim()) {
            Alert.alert('Error', 'Please enter a name');
            return;
        }

        if (!team) return;

        try {
            const updatedTeam = {
                ...team,
                members: [
                    ...team.members,
                    {
                        name: newMemberName.trim(),
                        role: newMemberRole,
                    },
                ],
            };
            await teamApi.update(teamId, updatedTeam);
            setTeam(updatedTeam);
            setNewMemberName('');
        } catch (error) {
            console.error('Error adding team member:', error);
            Alert.alert('Error', 'Failed to add team member');
        }
    };

    const handleRemoveMember = async (index: number) => {
        if (!team) return;

        Alert.alert(
            'Remove Member',
            'Are you sure you want to remove this team member?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const updatedTeam = {
                                ...team,
                                members: team.members.filter((_, i) => i !== index),
                            };
                            await teamApi.update(teamId, updatedTeam);
                            setTeam(updatedTeam);
                        } catch (error) {
                            console.error('Error removing team member:', error);
                            Alert.alert('Error', 'Failed to remove team member');
                        }
                    },
                },
            ]
        );
    };

    const handleUpdateTeam = async () => {
        if (!team) return;

        try {
            await teamApi.update(teamId, team);
            setEditing(false);
            Alert.alert('Success', 'Team updated successfully');
        } catch (error) {
            console.error('Error updating team:', error);
            Alert.alert('Error', 'Failed to update team');
        }
    };

    if (loading || !team) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Team Details</Text>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => setEditing(!editing)}
                >
                    <Text style={styles.editButtonText}>
                        {editing ? 'Save' : 'Edit'}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Team Name</Text>
                {editing ? (
                    <TextInput
                        style={styles.input}
                        value={team.name}
                        onChangeText={(text) => setTeam({ ...team, name: text })}
                    />
                ) : (
                    <Text style={styles.teamName}>{team.name}</Text>
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Team Members</Text>
                {team.members.map((member, index) => (
                    <View key={index} style={styles.memberItem}>
                        <View style={styles.memberInfo}>
                            <Text style={styles.memberName}>{member.name}</Text>
                            <Text style={styles.memberRole}>{member.role}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.removeButton}
                            onPress={() => handleRemoveMember(index)}
                        >
                            <Text style={styles.removeButtonText}>Remove</Text>
                        </TouchableOpacity>
                    </View>
                ))}

                <View style={styles.addMemberContainer}>
                    <TextInput
                        style={styles.input}
                        value={newMemberName}
                        onChangeText={setNewMemberName}
                        placeholder="Enter member name"
                    />
                    <View style={styles.roleContainer}>
                        {(['batsman', 'bowler', 'all-rounder', 'wicket-keeper'] as const).map(
                            (role) => (
                                <TouchableOpacity
                                    key={role}
                                    style={[
                                        styles.roleButton,
                                        newMemberRole === role && styles.selectedRoleButton,
                                    ]}
                                    onPress={() => setNewMemberRole(role)}
                                >
                                    <Text
                                        style={[
                                            styles.roleButtonText,
                                            newMemberRole === role && styles.selectedRoleButtonText,
                                        ]}
                                    >
                                        {role}
                                    </Text>
                                </TouchableOpacity>
                            )
                        )}
                    </View>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={handleAddMember}
                    >
                        <Text style={styles.addButtonText}>Add Member</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {editing && (
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleUpdateTeam}
                >
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    editButton: {
        backgroundColor: '#2196F3',
        padding: 8,
        borderRadius: 8,
    },
    editButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    section: {
        backgroundColor: '#fff',
        padding: 16,
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#f5f5f5',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    teamName: {
        fontSize: 20,
        fontWeight: '500',
    },
    memberItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        marginBottom: 8,
    },
    memberInfo: {
        flex: 1,
    },
    memberName: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4,
    },
    memberRole: {
        fontSize: 14,
        color: '#757575',
    },
    removeButton: {
        backgroundColor: '#F44336',
        padding: 8,
        borderRadius: 8,
    },
    removeButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    addMemberContainer: {
        marginTop: 16,
    },
    roleContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    roleButton: {
        backgroundColor: '#fff',
        padding: 8,
        borderRadius: 8,
        marginBottom: 8,
        width: '48%',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    selectedRoleButton: {
        backgroundColor: '#2196F3',
        borderColor: '#2196F3',
    },
    roleButtonText: {
        fontSize: 14,
        textAlign: 'center',
    },
    selectedRoleButtonText: {
        color: '#fff',
    },
    addButton: {
        backgroundColor: '#4CAF50',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        margin: 16,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
}); 