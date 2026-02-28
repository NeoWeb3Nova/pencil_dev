import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { createResume, updateResume } from '@/lib/api';
import { Resume, CreateResumeRequest, Experience, Education, Project } from '@/types';

interface ResumeFormProps {
  initialData?: Resume | null;
  onSuccess?: () => void;
}

export default function ResumeForm({ initialData, onSuccess }: ResumeFormProps) {
  const [formData, setFormData] = useState<CreateResumeRequest>({
    fullName: initialData?.fullName || '',
    title: initialData?.title || '',
    summary: initialData?.summary || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    location: initialData?.location || '',
    website: initialData?.website || '',
    linkedinUrl: initialData?.linkedinUrl || '',
    githubUrl: initialData?.githubUrl || '',
    skills: initialData?.skills || [],
    isPublic: initialData?.isPublic || false,
  });

  const [skillsInput, setSkillsInput] = useState(
    initialData?.skills?.join(', ') || ''
  );

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // 验证必填字段
    if (!formData.fullName || !formData.email) {
      Alert.alert('Error', 'Full Name and Email are required');
      return;
    }

    // 处理 skills
    const skills = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const data = {
      ...formData,
      skills,
    };

    setLoading(true);
    try {
      if (initialData) {
        await updateResume(data);
        Alert.alert('Success', 'Resume updated successfully');
      } else {
        await createResume(data);
        Alert.alert('Success', 'Resume created successfully');
      }
      onSuccess?.();
    } catch (error) {
      Alert.alert('Error', 'Failed to save resume');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white';
  const labelClass = 'text-sm font-medium text-gray-700 dark:text-gray-300 mb-2';

  return (
    <ScrollView className="flex-1 px-4 py-4">
      {/* Basic Information */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Basic Information
        </Text>

        <View className={labelClass}>
          <Text>Full Name *</Text>
        </View>
        <TextInput
          className={inputClass}
          value={formData.fullName}
          onChangeText={(text) =>
            setFormData({ ...formData, fullName: text })
          }
          placeholder="John Doe"
        />

        <View className={`${labelClass} mt-4`}>
          <Text>Professional Title</Text>
        </View>
        <TextInput
          className={inputClass}
          value={formData.title}
          onChangeText={(text) =>
            setFormData({ ...formData, title: text })
          }
          placeholder="Senior Developer"
        />

        <View className={`${labelClass} mt-4`}>
          <Text>Summary</Text>
        </View>
        <TextInput
          className={`${inputClass} h-24`}
          value={formData.summary}
          onChangeText={(text) =>
            setFormData({ ...formData, summary: text })
          }
          placeholder="Brief professional summary..."
          multiline
        />
      </View>

      {/* Contact Information */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Contact Information
        </Text>

        <View className={labelClass}>
          <Text>Email *</Text>
        </View>
        <TextInput
          className={inputClass}
          value={formData.email}
          onChangeText={(text) =>
            setFormData({ ...formData, email: text })
          }
          placeholder="john@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View className={`${labelClass} mt-4`}>
          <Text>Phone</Text>
        </View>
        <TextInput
          className={inputClass}
          value={formData.phone}
          onChangeText={(text) =>
            setFormData({ ...formData, phone: text })
          }
          placeholder="+1234567890"
          keyboardType="phone-pad"
        />

        <View className={`${labelClass} mt-4`}>
          <Text>Location</Text>
        </View>
        <TextInput
          className={inputClass}
          value={formData.location}
          onChangeText={(text) =>
            setFormData({ ...formData, location: text })
          }
          placeholder="New York, NY"
        />

        <View className={`${labelClass} mt-4`}>
          <Text>Website</Text>
        </View>
        <TextInput
          className={inputClass}
          value={formData.website}
          onChangeText={(text) =>
            setFormData({ ...formData, website: text })
          }
          placeholder="https://johndoe.com"
          autoCapitalize="none"
        />

        <View className={`${labelClass} mt-4`}>
          <Text>LinkedIn URL</Text>
        </View>
        <TextInput
          className={inputClass}
          value={formData.linkedinUrl}
          onChangeText={(text) =>
            setFormData({ ...formData, linkedinUrl: text })
          }
          placeholder="https://linkedin.com/in/johndoe"
          autoCapitalize="none"
        />

        <View className={`${labelClass} mt-4`}>
          <Text>GitHub URL</Text>
        </View>
        <TextInput
          className={inputClass}
          value={formData.githubUrl}
          onChangeText={(text) =>
            setFormData({ ...formData, githubUrl: text })
          }
          placeholder="https://github.com/johndoe"
          autoCapitalize="none"
        />
      </View>

      {/* Skills */}
      <View className="mb-6">
        <View className={labelClass}>
          <Text>Skills (comma separated)</Text>
        </View>
        <TextInput
          className={inputClass}
          value={skillsInput}
          onChangeText={setSkillsInput}
          placeholder="TypeScript, Node.js, React"
        />
      </View>

      {/* Visibility */}
      <View className="mb-6">
        <TouchableOpacity
          className="flex-row items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg"
          onPress={() =>
            setFormData({ ...formData, isPublic: !formData.isPublic })
          }
        >
          <View>
            <Text className="text-base font-medium text-gray-900 dark:text-white">
              Make Resume Public
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              Allow others to view your resume
            </Text>
          </View>
          <View
            className={`w-12 h-6 rounded-full ${
              formData.isPublic ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          >
            <View
              className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
                formData.isPublic ? 'translate-x-6' : ''
              }`}
            />
          </View>
        </TouchableOpacity>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        className={`py-4 rounded-lg ${
          loading ? 'bg-gray-400' : 'bg-blue-500'
        }`}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text className="text-center text-white font-semibold text-lg">
          {loading ? 'Saving...' : initialData ? 'Update Resume' : 'Create Resume'}
        </Text>
      </TouchableOpacity>

      <View className="h-8" />
    </ScrollView>
  );
}
