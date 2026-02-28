import React, { useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ResumeForm from '@/components/resume/ResumeForm';
import { getMyResume } from '@/lib/api';
import { Resume } from '@/types';
import { router } from 'expo-router';

export default function ResumeEditScreen() {
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);

  const loadResume = async () => {
    setLoading(true);
    try {
      const response = await getMyResume();
      if (response.success && response.data) {
        setResume(response.data);
      }
    } catch (err) {
      console.error('Failed to load resume:', err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadResume();
    }, [])
  );

  const handleSuccess = () => {
    router.back();
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-gray-600 dark:text-gray-400">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <Text className="text-xl font-bold text-gray-900 dark:text-white flex-1 text-center">
          {resume ? 'Edit Resume' : 'Create Resume'}
        </Text>
      </View>

      {/* Form */}
      <ResumeForm initialData={resume} onSuccess={handleSuccess} />
    </View>
  );
}
