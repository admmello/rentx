import React, { useState } from 'react'
import {
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    Alert,
} from 'react-native'
import * as Yup from 'yup'

import { useNavigation } from '@react-navigation/native'
import { BackButton } from '../../../components/BackButton'

import { Input } from '../../../components/Input'
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


export function SignUpFirstStep() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [driveLicense, setDriveLicense] = useState('')

    const navigation = useNavigation<any>()

    function handleBack() {
        navigation.goBack()
    }

    async function handleNextStep() {
        try {
            const schema = Yup.object().shape({
                driveLicense: Yup.string()
                    .required('CNH é obrigatória'),
                email: Yup.string()
                    .email('E-mail inválido')
                    .required('E-mail é obrigatório'),
                name: Yup.string()
                    .required('Nome é obrigatório'),
            })

            const data = { name, email, driveLicense }
            await schema.validate(data)

            navigation.navigate('SignUpSecondStep', { user: data })
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                Alert.alert('Opa', error.message)
            }
        }
    }

    return (
        <KeyboardAvoidingView behavior='position' enabled>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Container>
                    <Header>
                        <BackButton onPress={handleBack} />
                        <Steps>
                            <Bullet active />
                            <Bullet />
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
                        <FormTitle>1. Dados</FormTitle>

                        <Input
                            iconName='user'
                            placeholder='Nome'
                            onChangeText={setName}
                            value={name}
                        />
                        <Input
                            iconName='mail'
                            placeholder='E-mail'
                            keyboardType='email-address'
                            autoCapitalize='none'
                            onChangeText={setEmail}
                            value={email}
                        />
                        <Input
                            iconName='credit-card'
                            placeholder='CNH'
                            keyboardType='numeric'
                            onChangeText={setDriveLicense}
                            // onChangeText={value => setDriveLicense(Number(value))} //pode usar esta forma quando o campo é inteiro
                            value={driveLicense}
                        />
                    </Form>

                    <Button
                        title='Próximo'
                        onPress={handleNextStep}
                    />
                </Container>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}