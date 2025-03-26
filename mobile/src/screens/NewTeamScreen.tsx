import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { teamApi } from '../services/api';
import { ITeamMember } from '../interfaces';
import { NavigationProp } from '../types/navigation';

export const NewTeamScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const [teamName, setTeamName] = useState('');
    const [members, setMembers] = useState<ITeamMember[]>([]);
    const [newMemberName, setNewMemberName] = useState('');
    const [newMemberRole, setNewMemberRole] = useState<ITeamMember['role']>('all-rounder');

    const handleAddMember = () => {
        if (!newMemberName.trim()) {
            Alert.alert('Error', 'Please enter a name');
            return;
        }

        setMembers([
            ...members,
            {
                name: newMemberName.trim(),
                role: newMemberRole,
            },
        ]);
        setNewMemberName('');
    };

    const handleRemoveMember = (index: number) => {
        setMembers(members.filter((_, i) => i !== index));
    };

    const handleCreateTeam = async () => {
        if (!teamName.trim()) {
            Alert.alert('Error', 'Please enter a team name');
            return;
        }

        if (members.length === 0) {
            Alert.alert('Error', 'Please add at least one team member');
            return;
        }

        try {
            const response = await teamApi.create({
                name: teamName.trim(),
                members,
            });
            navigation.navigate('TeamDetails', { teamId: response.data._id });
        } catch (error) {
            console.error('Error creating team:', error);
            Alert.alert('Error', 'Failed to create team');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>New Team</Text>
            </View>

            <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Team Name</Text>
                    <TextInput
                        style={styles.input}
                        value={teamName}
                        onChangeText={setTeamName}
                        placeholder="Enter team name"
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Team Members</Text>
                    {members.map((member, index) => (
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

                <TouchableOpacity
                    style={styles.createButton}
                    onPress={handleCreateTeam}
                >
                    <Text style={styles.createButtonText}>Create Team</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    formContainer: {
        padding: 16,
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    section: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
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
    createButton: {
        backgroundColor: '#4CAF50',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    createButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
}); 