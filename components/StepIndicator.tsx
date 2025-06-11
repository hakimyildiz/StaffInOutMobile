import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Check, User, Lock, Clock } from 'lucide-react-native';

interface StepIndicatorProps {
  currentStep: number;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps = [
    { number: 1, title: 'Select Staff', icon: User },
    { number: 2, title: 'Enter PIN', icon: Lock },
    { number: 3, title: 'Choose Action', icon: Clock },
  ];

  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const isCompleted = currentStep > step.number;
        const isActive = currentStep === step.number;
        const IconComponent = step.icon;

        return (
          <React.Fragment key={step.number}>
            <View style={styles.stepWrapper}>
              <View
                style={[
                  styles.stepCircle,
                  isCompleted && styles.completedCircle,
                  isActive && styles.activeCircle,
                ]}
              >
                {isCompleted ? (
                  <Check size={16} color="#ffffff" strokeWidth={3} />
                ) : (
                  <IconComponent
                    size={16}
                    color={isActive ? '#ffffff' : '#94a3b8'}
                    strokeWidth={2}
                  />
                )}
              </View>
              <Text
                style={[
                  styles.stepTitle,
                  isCompleted && styles.completedTitle,
                  isActive && styles.activeTitle,
                ]}
              >
                {step.title}
              </Text>
            </View>
            {index < steps.length - 1 && (
              <View
                style={[
                  styles.connector,
                  isCompleted && styles.completedConnector,
                ]}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  stepWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  activeCircle: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  completedCircle: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  stepTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#94a3b8',
    textAlign: 'center',
  },
  activeTitle: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  completedTitle: {
    color: '#10b981',
    fontWeight: '600',
  },
  connector: {
    height: 2,
    backgroundColor: '#e2e8f0',
    flex: 1,
    marginHorizontal: 8,
    marginBottom: 24,
  },
  completedConnector: {
    backgroundColor: '#10b981',
  },
});