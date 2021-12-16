import React, { useState } from 'react'
import { TextInputProps } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { BorderlessButton } from 'react-native-gesture-handler'

import { useTheme } from 'styled-components'

import {
    Container,
    IconContainer,
    InputText,
} from './styles'

interface InputProps extends TextInputProps {
    iconName: React.ComponentProps<typeof Feather>['name']
    value?: string
}

export function PasswordInput({ iconName, value, ...rest }: InputProps) {
    const [isFocused, setIsFocused] = useState(false)
    const [isFilled, setIsFilled] = useState(false)

    const theme = useTheme()
    const [isPasswordVisible, setIsPasswordVisible] = useState(true)

    function handlePassWordVisibilitycahnge() {
        setIsPasswordVisible(prevState => !prevState)
    }

    function handleInputFocused() {
        setIsFocused(true)
    }

    function handleInputBlur() {
        setIsFocused(false)
        setIsFilled(!!value)
    }

    return (
        <Container>
            <IconContainer isFocused={isFocused}>
                <Feather
                    name={iconName}
                    size={24}
                    color={(isFocused || isFilled) ? theme.colors.main : theme.colors.text_detail}
                />
            </IconContainer>

            <InputText
                onFocus={handleInputFocused}
                onBlur={handleInputBlur}
                secureTextEntry={isPasswordVisible}
                isFocused={isFocused}
                {...rest} />

            <BorderlessButton onPress={handlePassWordVisibilitycahnge}>
                <IconContainer isFocused={isFocused}>
                    <Feather
                        name={isPasswordVisible ? 'eye' : 'eye-off'}
                        size={24}
                        color={theme.colors.text_detail}
                    />
                </IconContainer>
            </BorderlessButton>
        </Container>
    )
}