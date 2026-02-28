import React from 'react';
import { View, Text, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { Resume } from '@/types';

interface ResumeViewProps {
  resume: Resume;
  onEdit?: () => void;
}

export default function ResumeView({ resume, onEdit }: ResumeViewProps) {
  const openUrl = (url: string | null | undefined) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  const callPhone = (phone: string | null | undefined) => {
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    }
  };

  const sendEmail = (email: string | null | undefined) => {
    if (email) {
      Linking.openURL(`mailto:${email}`);
    }
  };

  return (
    <ScrollView className="flex-1 px-4 py-6">
      {/* Header */}
      <View className="mb-6">
        <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {resume.fullName}
        </Text>
        {resume.title && (
          <Text className="text-lg text-gray-600 dark:text-gray-400 mb-4">
            {resume.title}
          </Text>
        )}
        {resume.summary && (
          <Text className="text-gray-700 dark:text-gray-300">
            {resume.summary}
          </Text>
        )}
      </View>

      {/* Contact Section */}
      <View className="mb-6">
        <Text className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          Contact
        </Text>
        <View className="space-y-2">
          {/* Email */}
          <TouchableOpacity
            onPress={() => sendEmail(resume.email)}
            className="flex-row items-center py-2"
          >
            <Text className="text-gray-600 dark:text-gray-400 w-24">Email</Text>
            <Text className="text-blue-500 flex-1">{resume.email}</Text>
          </TouchableOpacity>

          {/* Phone */}
          {resume.phone && (
            <TouchableOpacity
              onPress={() => callPhone(resume.phone)}
              className="flex-row items-center py-2"
            >
              <Text className="text-gray-600 dark:text-gray-400 w-24">Phone</Text>
              <Text className="text-blue-500 flex-1">{resume.phone}</Text>
            </TouchableOpacity>
          )}

          {/* Location */}
          {resume.location && (
            <View className="flex-row items-center py-2">
              <Text className="text-gray-600 dark:text-gray-400 w-24">Location</Text>
              <Text className="text-gray-700 dark:text-gray-300 flex-1">
                {resume.location}
              </Text>
            </View>
          )}

          {/* Website */}
          {resume.website && (
            <TouchableOpacity
              onPress={() => openUrl(resume.website)}
              className="flex-row items-center py-2"
            >
              <Text className="text-gray-600 dark:text-gray-400 w-24">Website</Text>
              <Text className="text-blue-500 flex-1">{resume.website}</Text>
            </TouchableOpacity>
          )}

          {/* LinkedIn */}
          {resume.linkedinUrl && (
            <TouchableOpacity
              onPress={() => openUrl(resume.linkedinUrl)}
              className="flex-row items-center py-2"
            >
              <Text className="text-gray-600 dark:text-gray-400 w-24">LinkedIn</Text>
              <Text className="text-blue-500 flex-1" numberOfLines={1}>
                {resume.linkedinUrl}
              </Text>
            </TouchableOpacity>
          )}

          {/* GitHub */}
          {resume.githubUrl && (
            <TouchableOpacity
              onPress={() => openUrl(resume.githubUrl)}
              className="flex-row items-center py-2"
            >
              <Text className="text-gray-600 dark:text-gray-400 w-24">GitHub</Text>
              <Text className="text-blue-500 flex-1" numberOfLines={1}>
                {resume.githubUrl}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Skills Section */}
      {resume.skills && resume.skills.length > 0 && (
        <View className="mb-6">
          <Text className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Skills
          </Text>
          <View className="flex-row flex-wrap">
            {resume.skills.map((skill, index) => (
              <View
                key={index}
                className="bg-blue-100 dark:bg-blue-900 px-3 py-1.5 rounded-full mr-2 mb-2"
              >
                <Text className="text-blue-700 dark:text-blue-300 text-sm">
                  {skill}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Experience Section */}
      {resume.experiences && resume.experiences.length > 0 && (
        <View className="mb-6">
          <Text className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Experience
          </Text>
          {resume.experiences.map((exp, index) => (
            <View
              key={index}
              className="border-l-2 border-blue-500 pl-4 mb-4"
            >
              <Text className="text-lg font-medium text-gray-900 dark:text-white">
                {exp.position}
              </Text>
              <Text className="text-gray-600 dark:text-gray-400">
                {exp.company}
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-500">
                {exp.startDate} - {exp.current ? 'Present' : exp.endDate || 'Present'}
              </Text>
              {exp.description && (
                <Text className="text-gray-700 dark:text-gray-300 mt-2">
                  {exp.description}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Education Section */}
      {resume.education && resume.education.length > 0 && (
        <View className="mb-6">
          <Text className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Education
          </Text>
          {resume.education.map((edu, index) => (
            <View
              key={index}
              className="border-l-2 border-green-500 pl-4 mb-4"
            >
              <Text className="text-lg font-medium text-gray-900 dark:text-white">
                {edu.school}
              </Text>
              {edu.degree && (
                <Text className="text-gray-600 dark:text-gray-400">
                  {edu.degree} {edu.field && `in ${edu.field}`}
                </Text>
              )}
              <Text className="text-sm text-gray-500 dark:text-gray-500">
                {edu.startDate} - {edu.endDate || 'Present'}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Projects Section */}
      {resume.projects && resume.projects.length > 0 && (
        <View className="mb-6">
          <Text className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Projects
          </Text>
          {resume.projects.map((project, index) => (
            <View
              key={index}
              className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-3"
            >
              <Text className="text-lg font-medium text-gray-900 dark:text-white">
                {project.name}
              </Text>
              <Text className="text-gray-700 dark:text-gray-300 mt-1">
                {project.description}
              </Text>
              {project.technologies && project.technologies.length > 0 && (
                <View className="flex-row flex-wrap mt-2">
                  {project.technologies.map((tech, techIndex) => (
                    <View
                      key={techIndex}
                      className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded mr-2 mt-1"
                    >
                      <Text className="text-xs text-gray-700 dark:text-gray-300">
                        {tech}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
              {project.url && (
                <TouchableOpacity
                  onPress={() => openUrl(project.url)}
                  className="mt-2"
                >
                  <Text className="text-blue-500 text-sm">View Project →</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Certifications Section */}
      {resume.certifications && resume.certifications.length > 0 && (
        <View className="mb-6">
          <Text className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Certifications
          </Text>
          {resume.certifications.map((cert, index) => (
            <View
              key={index}
              className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-3"
            >
              <Text className="text-lg font-medium text-gray-900 dark:text-white">
                {cert.name}
              </Text>
              <Text className="text-gray-600 dark:text-gray-400">
                {cert.issuer}
              </Text>
              {cert.issueDate && (
                <Text className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                  Issued: {cert.issueDate}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Languages Section */}
      {resume.languages && resume.languages.length > 0 && (
        <View className="mb-6">
          <Text className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Languages
          </Text>
          {resume.languages.map((lang, index) => (
            <View
              key={index}
              className="flex-row justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700"
            >
              <Text className="text-gray-700 dark:text-gray-300">
                {lang.language}
              </Text>
              <Text className="text-gray-500 dark:text-gray-500">
                {lang.proficiency}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Edit Button */}
      {onEdit && (
        <TouchableOpacity
          className="bg-blue-500 py-4 rounded-lg mb-8"
          onPress={onEdit}
        >
          <Text className="text-center text-white font-semibold text-lg">
            Edit Resume
          </Text>
        </TouchableOpacity>
      )}

      <View className="h-8" />
    </ScrollView>
  );
}
