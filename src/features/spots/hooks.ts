'use client';

import React, { useState } from 'react';
import { toast } from 'react-toastify';

export type CustomFormValues<T> = {
  [K in keyof T]: T[K];
};

export type CustomFormSetters<T> = {
  [K in keyof T]: React.Dispatch<React.SetStateAction<T[K]>>;
};

export type CustomFormErrors<T> = {
  [K in keyof T]: string;
};

function useCustomForm<T extends object>(
  initialState: T,
  toastErrors = true,
): [
  CustomFormValues<T>,
  CustomFormSetters<T>,
  CustomFormErrors<T>,
  (newErrors: Partial<CustomFormErrors<T>>) => void,
] {
  if (!initialState) {
    throw new Error('Initial state must be provided');
  }

  const [state, setState] = useState(initialState);
  const [errors, setErrors] = useState<CustomFormErrors<T>>(
    {} as CustomFormErrors<T>,
  );

  const setFormValue = (key: keyof T) => (value: T[typeof key]) => {
    setState((prevState) => ({ ...prevState, [key]: value }));
  };

  const setExternalErrors = (newErrors: Partial<CustomFormErrors<T>>) => {
    setErrors((prevErrors) => ({ ...prevErrors, ...newErrors }));
    Object.entries(newErrors).forEach(([key, value]) => {
      value && toastErrors && toast.error(`${key}: ${value}`);
    });
  };

  const formValues = Object.keys(initialState).reduce((acc, key) => {
    const stateKey = key as keyof T;
    acc[stateKey] = state[stateKey];
    return acc;
  }, {} as CustomFormValues<T>);

  const formSetters = Object.keys(initialState).reduce((acc, key) => {
    const stateKey = key as keyof T;
    acc[stateKey] = setFormValue(stateKey);
    return acc;
  }, {} as CustomFormSetters<T>);

  return [formValues, formSetters, errors, setExternalErrors];
}

export default useCustomForm;
