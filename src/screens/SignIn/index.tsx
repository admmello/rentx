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

import { Button } from '../../components/Button'
import { Input } from '../../components/Input'
import { PasswordInput } from '../../components/PasswordInput'

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

    async function handleSignIn() {
        try {
            const schema = Yup.object().shape({
                email: Yup.string()
                    .required('Email obrigatório')
                    .email('Digite um email válido'),
                password: Yup.string()
                    .required('Senha é obrigatória')
            })

            schema.validate({ email, password })
            Alert.alert('Tudo certo')

            //Fazer login
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
                            secureTextEntry
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
                            onPress={() => { }}
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