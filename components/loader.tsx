import React, { createContext, useContext, useState } from 'react';
import { ActivityIndicator, Modal, StyleSheet, View } from 'react-native';

type LoaderContextType = {
  showLoader: () => void;
  hideLoader: () => void;
};

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export const useLoader = () => {
  const context = useContext(LoaderContext);
  if (!context) throw new Error("useLoader must be used inside a LoaderProvider");
  return context;
};

export const LoaderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false);

  const showLoader = () => setVisible(true);
  const hideLoader = () => setVisible(false);

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader }}>
      {children}
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      </Modal>
    </LoaderContext.Provider>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});