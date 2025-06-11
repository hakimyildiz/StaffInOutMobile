import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps?: number;
}

export default function StepIndicator({ currentStep, totalSteps = 3 }: StepIndicatorProps) {
  return (
    <View style={styles.container}>
      <View style={styles.stepsContainer}>
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          
          return (
            <React.Fragment key={stepNumber}>
              <View style={[
                styles.step,
                isActive && styles.activeStep,
                isCompleted && styles.completedStep
              ]}>
                <Text style={[
                  styles.stepText,
                  isActive && styles.activeStepText,
                  isCompleted && styles.completedStepText
                ]}>
                  {stepNumber}
                </Text>
              </View>
              {stepNumber < totalSteps && (
                <View style={[
                  styles.connector,
                  isCompleted && styles.completedConnector
                ]} />
              )}
            </React.Fragment>
          );
        })}
      </View>
      <Text style={styles.stepLabel}>
        Step {currentStep} of {totalSteps}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 24,
  },
  stepsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  step: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  activeStep: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  completedStep: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  stepText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  activeStepText: {
    color: '#ffffff',
  },
  completedStepText: {
    color: '#ffffff',
  },
  connector: {
    width: 24,
    height: 2,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 4,
  },
  completedConnector: {
    backgroundColor: '#10b981',
  },
  stepLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
});