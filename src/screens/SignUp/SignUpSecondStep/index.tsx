import React, { useState } from 'react'
import {
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    Alert,
} from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useTheme } from 'styled-components'

import api from '../../../services/api'
import { BackButton } from '../../../components/BackButton'
import { PasswordInput } from '../../../components/PasswordInput'
import { Bullet } from '../../../components/Bullet'
import { Button } from '../../../components/Button'

import {
    Container,
    Header,
    Steps,
    Title,
    Subtitle,
    Form,
    FormTitle,
} from './styles'

interface Params {
    user: {
        name: string
        email: string
        driveLicense: string
    }
}


export function SignUpSecondStep() {
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')

    const navigation = useNavigation<any>()
    const route = useRoute()
    const { user } = route.params as Params

    const theme = useTheme()

    async function handleRegister() {
        if (!password || !passwordConfirm) {
            Alert.alert('Informe a senha e a confirmação')
        } else if (password != passwordConfirm) {
            Alert.alert('As senhas não conferem')
        }

        //enviar para a api e cadastrar
        await api.post('/users', {
            name: user.name,
            email: user.email,
            driver_license: user.driveLicense,
            password
        })
            .then(() => {
                navigation.navigate('Confirmation', {
                    nextScreenRoute: 'SignIn',
                    title: 'Conta criada!',
                    message: `Agora é só fazer login \ne aproveitar.`
                })
            })
            .catch(() => {
                Alert.alert('Opa', 'Não foi possível cadastrar')
            })
    }

    function handleBack() {
        navigation.goBack()
    }

    return (
        <KeyboardAvoidingView behavior='position' enabled>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Container>
                    <Header>
                        <BackButton onPress={handleBack} />
                        <Steps>
                            <Bullet />
                            <Bullet active />
                        </Steps>
                    </Header>

                    <Title>
                        Crie sua {'\n'}conta
                    </Title>
                    <Subtitle>
                        Faça seu cadastro de {'\n'}
                        forma rápida e fácil
                    </Subtitle>

                    <Form>
                        <FormTitle>2. Senha</FormTitle>

                        <PasswordInput
                            iconName='lock'
                            placeholder='Senha'
                            onChangeText={setPassword}
                            value={password}
                        />
                        <PasswordInput
                            iconName='lock'
                            placeholder='Repetir senha'
                            onChangeText={setPasswordConfirm}
                            value={passwordConfirm}
                        />
                    </Form>

                    <Button
                        title='Cadastrar'
                        color={theme.colors.success}
                        onPress={handleRegister}
                    />
                </Container>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}