import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';

interface CustomPickerProps {
  label?: string;
  selectedValue?: string;
  onValueChange: (value: string) => void;
  items: string[];
  placeholder?: string;
  testID?: string;
  errorMessage?: string;
}

export const CustomPicker: React.FC<CustomPickerProps> = ({
  label,
  selectedValue,
  onValueChange,
  items = [],
  placeholder = 'Select an option',
  testID,
  errorMessage,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const displayLabel = selectedValue && selectedValue !== '' ? selectedValue : placeholder;
  const isSelected = selectedValue && selectedValue !== '' && selectedValue !== placeholder;

  // Danh sách có lựa chọn đầu tiên là placeholder (vd: "Choose genre", "Choose status")
  const fullItems = [placeholder, ...items.filter((i) => i !== placeholder)];

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TouchableOpacity
        testID={testID}
        style={[styles.pickerButton, errorMessage ? styles.borderError : null]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.pickerText, !isSelected && styles.placeholderText]}>
          {displayLabel}
        </Text>
        <Text style={styles.arrowIcon}>▼</Text>
      </TouchableOpacity>

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label || 'Select'}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={fullItems}
              keyExtractor={(item, index) => `${item}-${index}`}
              renderItem={({ item }) => {
                const isPlaceholderItem = item === placeholder;
                const isItemCurrent = (!selectedValue && isPlaceholderItem) || selectedValue === item;
                return (
                  <TouchableOpacity
                    style={[styles.optionItem, isItemCurrent && styles.selectedOptionItem]}
                    onPress={() => {
                      onValueChange(isPlaceholderItem ? '' : item);
                      setModalVisible(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isPlaceholderItem && styles.placeholderOptionText,
                        isItemCurrent && styles.selectedOptionText,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  borderError: {
    borderColor: '#EF4444',
  },
  pickerText: {
    fontSize: 15,
    color: '#111827',
  },
  placeholderText: {
    color: '#9CA3AF',
  },
  arrowIcon: {
    fontSize: 12,
    color: '#6B7280',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    maxHeight: '60%',
    paddingVertical: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  closeButton: {
    fontSize: 18,
    color: '#6B7280',
    padding: 4,
  },
  optionItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F3F4F6',
  },
  selectedOptionItem: {
    backgroundColor: '#EEF2FF',
  },
  optionText: {
    fontSize: 15,
    color: '#374151',
  },
  placeholderOptionText: {
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  selectedOptionText: {
    color: '#4F46E5',
    fontWeight: '600',
  },
});

