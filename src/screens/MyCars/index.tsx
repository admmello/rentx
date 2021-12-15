import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { StatusBar, FlatList } from 'react-native'
import { useTheme } from 'styled-components'
import { AntDesign } from '@expo/vector-icons'

import { Car } from '../../components/Car'
import { LoadAnimation } from '../../components/LoadAnimation'
import { BackButton } from '../../components/BackButton'
import { CarDTO } from '../../dtos/CarDTO'
import api from '../../services/api'

import {
    Container,
    Header,
    Title,
    SubTitle,
    Content,
    Appointments,
    AppointmentsTitle,
    AppointmentsQuantity,
    CarWrapper,
    CarFooter,
    CarFooterTitle,
    CarFooterPeriod,
    CarFotterDate,
} from './styles'

interface CarProps {
    id: string
    user_id: string
    car: CarDTO,
    startDate: string
    endDate: string
}


export function MyCars() {
    const [cars, setCars] = useState<CarProps[]>([])
    const [loading, setLoading] = useState(true)
    const theme = useTheme()

    const navigation = useNavigation()

    function handleBack() {
        navigation.goBack()
    }

    useEffect(() => {
        async function fetchCars() {
            try {
                const response = await api.get('/schedules_byuser?user_id=1')
                setCars(response.data)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }

        fetchCars()
    }, [])

    return (
        <Container>
            <Header>
                <StatusBar
                    barStyle='light-content'
                    translucent
                    backgroundColor='transparent'
                />
                <BackButton
                    onPress={handleBack}
                    color={theme.colors.shape}
                />

                <Title>
                    Seus Agendamentos, {'\n'}
                    estão aqui.
                </Title>

                <SubTitle>
                    Conforto, segurança e praticidade
                </SubTitle>
            </Header>

            {loading
                ? <LoadAnimation />
                : <Content>
                    <Appointments>
                        <AppointmentsTitle>Agendamentos feitos</AppointmentsTitle>
                        <AppointmentsQuantity>{cars.length}</AppointmentsQuantity>
                    </Appointments>

                    <FlatList
                        data={cars}
                        keyExtractor={item => item.id}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <CarWrapper>
                                <Car data={item.car} />
                                <CarFooter>
                                    <CarFooterTitle>Período</CarFooterTitle>
                                    <CarFooterPeriod>
                                        <CarFotterDate>{item.startDate}</CarFotterDate>

                                        <AntDesign
                                            name='arrowright'
                                            size={20}
                                            color={theme.colors.title}
                                            style={{ marginHorizontal: 10 }}
                                        />

                                        <CarFotterDate>{item.endDate}</CarFotterDate>
                                    </CarFooterPeriod>
                                </CarFooter>
                            </CarWrapper>
                        )}
                    />
                </Content>
            }
        </Container>
    )
}