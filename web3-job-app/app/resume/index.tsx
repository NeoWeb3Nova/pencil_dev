import React, { useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ResumeView from '@/components/resume/ResumeView';
import { getMyResume, deleteResume } from '@/lib/api';
import { Resume } from '@/types';
import { router } from 'expo-router';

export default function ResumeScreen() {
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadResume = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMyResume();
      if (response.success && response.data) {
        setResume(response.data);
      } else {
        setError(response.error || 'Failed to load resume');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadResume();
    }, [])
  );

  const handleEdit = () => {
    router.push('/resume/edit');
  };

  const handleCreate = () => {
    router.push('/resume/edit');
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Resume',
      'Are you sure you want to delete your resume? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await deleteResume();
              if (response.success) {
                setResume(null);
                Alert.alert('Success', 'Resume deleted successfully');
              } else {
                Alert.alert('Error', response.error || 'Failed to delete resume');
              }
            } catch (err) {
              Alert.alert('Error', 'Failed to delete resume');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-gray-600 dark:text-gray-400">Loading resume...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900 px-4">
        <Text className="text-lg font-semibold text-red-500 mb-2">Error</Text>
        <Text className="text-gray-600 dark:text-gray-400 text-center mb-6">{error}</Text>
        <TouchableOpacity
          className="bg-blue-500 px-6 py-3 rounded-lg"
          onPress={loadResume}
        >
          <Text className="text-white font-semibold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!resume) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900 px-4">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          No Resume Yet
        </Text>
        <Text className="text-gray-600 dark:text-gray-400 text-center mb-8">
          Create your professional resume to share with potential employers
        </Text>
        <TouchableOpacity
          className="bg-blue-500 px-8 py-4 rounded-lg"
          onPress={handleCreate}
        >
          <Text className="text-white font-semibold text-lg">Create Resume</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <Text className="text-xl font-bold text-gray-900 dark:text-white">
          My Resume
        </Text>
        <View className="flex-row space-x-2">
          <TouchableOpacity
            onPress={handleEdit}
            className="px-4 py-2 bg-blue-500 rounded-lg"
          >
            <Text className="text-white font-medium">Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDelete}
            className="px-4 py-2 bg-red-500 rounded-lg"
          >
            <Text className="text-white font-medium">Delete</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Resume Content */}
      <ResumeView resume={resume} />

      {/* Status Badge */}
      <View className="px-4 py-3 border-t border-gray-200 dark:border-gray-800">
        <View
          className={`px-3 py-1.5 rounded-full self-start ${
            resume.isPublic
              ? 'bg-green-100 dark:bg-green-900'
              : 'bg-gray-100 dark:bg-gray-800'
          }`}
        >
          <Text
            className={`text-sm font-medium ${
              resume.isPublic
                ? 'text-green-700 dark:text-green-300'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            {resume.isPublic ? 'Public - Visible to others' : 'Private - Only you can view'}
          </Text>
        </View>
      </View>
    </View>
  );
}
