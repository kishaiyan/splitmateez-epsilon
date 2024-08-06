import { Text,TouchableOpacity, TouchableOpacityProps} from "react-native";
import React from 'react'
import { StatusBar } from "expo-status-bar";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  handlePress?: () => void;
  containerStyle?: string;
  textStyle?: string;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  handlePress,
  containerStyle = '',
  textStyle = '',
  isLoading = false,
  ...props
}) => {
  return (
    <TouchableOpacity
    activeOpacity={0.7}
      className={`bg-orange-400 rounded-md items-center justify-center ${containerStyle} ${isLoading ? 'opacity-50':''}`}
      onPress={handlePress}
      disabled={isLoading}
      {...props}
    >
      <Text className={`text-center font-bold text-lg text-white ${textStyle}`}>{title}</Text>
      </TouchableOpacity>
  );
};

export default Button