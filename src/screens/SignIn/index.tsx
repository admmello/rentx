import React, { useState } from 'react'
import {
    StatusBar,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    Alert
} from 'react-native'
import * as Yup from 'yup'

import { useTheme } from 'styled-components'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../../hooks/auth'

import { Button } from '../../components/Button'
import { Input } from '../../components/Input'
import { PasswordInput } from '../../components/PasswordInput'

import { database } from '../../database'

import {
    Container,
    Header,
    Title,
    Subtitle,
    Form,
    Footer,
} from './styles'


export function SignIn() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const theme = useTheme()

    const navigation = useNavigation<any>()

    const { signIn } = useAuth()

    async function handleSignIn() {
        try {
            const schema = Yup.object().shape({
                email: Yup.string()
                    .required('Email obrigatório')
                    .email('Digite um email válido'),
                password: Yup.string()
                    .required('Senha é obrigatória')
            })

            await schema.validate({ email, password })

            //Fazer login
            signIn({ email, password })
        } catch (error) {
            console.log(typeof (error))
            if (error instanceof Yup.ValidationError) {
                Alert.alert('Opa', error.message)
            } else {
                Alert.alert(
                    'Erro na autenticação',
                    'Ocorreu um erro ao efetuar o login, por favor verifique as credenciais'
                )
            }
        }
    }

    function handleNewAccount() {
        navigation.navigate('SignUpFirstStep')
    }

    return (
        <KeyboardAvoidingView behavior='position' enabled >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Container>
                    <StatusBar
                        barStyle={'dark-content'}
                        translucent
                        backgroundColor='transparent'
                    />
                    <Header>
                        <Title>
                            Estamos {'\n'}
                            quase lá.
                        </Title>

                        <Subtitle>
                            Faça seu login para começar {'\n'}
                            uma experiência incrível.
                        </Subtitle>
                    </Header>

                    <Form>
                        <Input
                            iconName='mail'
                            placeholder='E-mail'
                            keyboardType='email-address'
                            autoCorrect={false}
                            autoCapitalize='none'
                            onChangeText={setEmail}
                            value={email}
                        />

                        <PasswordInput
                            iconName='lock'
                            placeholder='Senha'
                            onChangeText={setPassword}
                            value={password}
                        />
                    </Form>

                    <Footer>
                        <Button
                            title='Login'
                            onPress={handleSignIn}
                            enabled={true}
                            loading={false}
                        />
                        <Button
                            title='Criar conta gratuíta'
                            onPress={handleNewAccount}
                            enabled={true}
                            loading={false}
                            color={theme.colors.background_secundary}
                            light
                        />
                    </Footer>
                </Container>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}