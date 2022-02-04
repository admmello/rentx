import React, { useEffect, useState } from 'react'
import { useNavigation, useIsFocused } from '@react-navigation/native'
import { StatusBar, FlatList } from 'react-native'
import { useTheme } from 'styled-components'
import { AntDesign } from '@expo/vector-icons'
import { format, parseISO } from 'date-fns'

import { Car } from '../../components/Car'
import { Car as ModelCar } from '../../database/model/Car'
import { LoadAnimation } from '../../components/LoadAnimation'
import { BackButton } from '../../components/BackButton'
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

interface DataProps {
    id: string
    car: ModelCar
    start_date: string
    end_date: string
}


export function MyCars() {
    const [cars, setCars] = useState<DataProps[]>([])
    const [loading, setLoading] = useState(true)
    const theme = useTheme()
    const screenIsFocus = useIsFocused()

    const navigation = useNavigation()

    function handleBack() {
        navigation.goBack()
    }

    useEffect(() => {
        async function fetchCars() {
            try {
                const response = await api.get('/rentals')
                const dataFormatted = response.data.map((data: DataProps) => {
                    return {
                        id: data.id,
                        car: data.car,
                        start_date: format(parseISO(data.start_date), 'dd/MM/yyyy'),
                        end_date: format(parseISO(data.end_date), 'dd/MM/yyyy'),
                    }
                })
                setCars(dataFormatted)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }

        fetchCars()
    }, [screenIsFocus])

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
                                        <CarFotterDate>{item.start_date}</CarFotterDate>

                                        <AntDesign
                                            name='arrowright'
                                            size={20}
                                            color={theme.colors.title}
                                            style={{ marginHorizontal: 10 }}
                                        />

                                        <CarFotterDate>{item.end_date}</CarFotterDate>
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