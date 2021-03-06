import React, { useEffect, useState } from 'react'
import { Alert } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { RFValue } from 'react-native-responsive-fontsize'
import { format } from 'date-fns'

import { useNavigation, useRoute } from '@react-navigation/native'
import { useTheme } from 'styled-components'
import { useNetInfo } from '@react-native-community/netinfo'
import { useAuth } from '../../hooks/auth'

import api from '../../services/api'
import { getPlataformDate } from '../../utils/getPlataformDate'
import { BackButton } from '../../components/BackButton'
import { ImageSlider } from '../../components/ImageSlider'
import { Accessory } from '../../components/Accessory'
import { Button } from '../../components/Button'
import { CarDTO } from '../../dtos/CarDTO'

import { getAccessoryIcon } from '../../utils/getAccessoryIcon'

import {
    Container,
    Header,
    CarImages,
    Content,
    Details,
    Description,
    Brand,
    Name,
    Rent,
    Period,
    Price,
    Accessories,
    RentalPeriod,
    CalendarIcon,
    DateInfo,
    DateTitle,
    DateValue,
    RentalPrice,
    RentalPriceLabel,
    RentalPriceDetails,
    RentalPriceQuota,
    RentalPriceTotal,
    Footer,
} from './styles'



interface Params {
    car: CarDTO
    dates: string[]
}

interface RentalPeriod {
    start: string
    end: string
}

export function SchedulingDetails() {
    const [carUpdated, setCarUpdated] = useState<CarDTO>({} as CarDTO)
    const [loading, setLoading] = useState(false)
    const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod>({} as RentalPeriod)
    const navigation = useNavigation<any>()
    const theme = useTheme()
    const route = useRoute()
    const { car, dates } = route.params as Params
    const netInfo = useNetInfo()
    const { user } = useAuth()

    const rentalTotal = Number(dates.length * car.price)

    async function handleConfirmRental() {
        setLoading(true)

        await api.post(`rentals`, {
            user_id: user.id,
            car_id: car.id,
            start_date: new Date(dates[0]),
            end_date: new Date(dates[dates.length - 1]),
            total: rentalTotal
        },
            {
                headers: { authorization: `Bearer ${user.token}` }
            },
        )
            .then(() => {
                navigation.navigate('Confirmation', {
                    nextScreenRoute: 'Home',
                    title: 'Carro alugado!',
                    message: `Agora voc?? s?? precisa ir\nat?? a concession??ria da RENTX\npegar seu autom??vel.`
                })
            }) //outra forma de lidar com Promises
            .catch((error) => {
                setLoading(false)
                console.log(error)
                Alert.alert('N??o foi poss??vel confirmar o agendamento')
            })
    }

    function handleBack() {
        navigation.goBack()
    }

    useEffect(() => {
        setRentalPeriod({
            start: format(getPlataformDate(new Date(dates[0])), 'dd/MM/yyyy'),
            end: format(getPlataformDate(new Date(dates[dates.length - 1])), 'dd/MM/yyyy'),
        })
    }, [])

    useEffect(() => {
        async function fetchCarUpdated() {
            const response = await api.get(`/cars/${car.id}`)
            setCarUpdated(response.data)
        }

        if (netInfo.isConnected === true) {
            fetchCarUpdated()
        }
    }, [netInfo.isConnected])

    return (
        <Container>
            <Header>
                <BackButton onPress={handleBack} />
            </Header>

            <CarImages>
                <ImageSlider imagesUrl={
                    !!carUpdated.photos
                        ? carUpdated.photos
                        : [{ id: car.thumbnail, photo: car.thumbnail }]
                } />
            </CarImages>

            <Content>
                <Details>
                    <Description>
                        <Brand>{car.brand}</Brand>
                        <Name>{car.name}</Name>
                    </Description>

                    <Rent>
                        <Period>{car.period}</Period>
                        <Price>R$ {car.price}</Price>
                    </Rent>
                </Details>

                {
                    carUpdated.accessories &&
                    <Accessories>
                        {
                            carUpdated.accessories.map(accessory => (
                                <Accessory
                                    key={accessory.type}
                                    name={accessory.name}
                                    icon={getAccessoryIcon(accessory.type)}
                                />
                            ))
                        }
                    </Accessories>
                }

                <RentalPeriod>
                    <CalendarIcon>
                        <Feather
                            name='calendar'
                            size={RFValue(24)}
                            color={theme.colors.shape}
                        />
                    </CalendarIcon>

                    <DateInfo>
                        <DateTitle>DE</DateTitle>
                        <DateValue>{rentalPeriod.start}</DateValue>
                    </DateInfo>

                    <Feather
                        name='chevron-right'
                        size={RFValue(24)}
                        color={theme.colors.shape}
                    />

                    <DateInfo>
                        <DateTitle>ATE</DateTitle>
                        <DateValue>{rentalPeriod.end}</DateValue>
                    </DateInfo>
                </RentalPeriod>

                <RentalPrice>
                    <RentalPriceLabel>Total</RentalPriceLabel>
                    <RentalPriceDetails>
                        <RentalPriceQuota>R$ {car.price} x {dates.length} di??rias</RentalPriceQuota>
                        <RentalPriceTotal>R$ {rentalTotal}</RentalPriceTotal>
                    </RentalPriceDetails>
                </RentalPrice>
            </Content>

            <Footer>
                <Button
                    title='Alugar agora'
                    color={theme.colors.success}
                    onPress={handleConfirmRental}
                    enabled={!loading}
                    loading={loading}
                />
            </Footer>
        </Container>
    )
}