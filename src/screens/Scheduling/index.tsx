import React, { useState } from 'react'
import { StatusBar, Alert } from 'react-native'
import { format } from 'date-fns'

import { useNavigation, useRoute } from '@react-navigation/native'
import { useTheme } from 'styled-components'

import { BackButton } from '../../components/BackButton'
import { Button } from '../../components/Button'
import { Calendar, DayProps, generateInterval, MarkedDatePros } from '../../components/Calendar'
import { getPlataformDate } from '../../utils/getPlataformDate'
import { CarDTO } from '../../dtos/CarDTO'

import ArrowSvg from '../../assets/arrow.svg'

import {
    Container,
    Header,
    Title,
    RentalPeriod,
    DateInfo,
    DateTitle,
    DateValue,
    Content,
    Footer,
} from './styles'

interface RentalPeriod {
    startFormatted: string
    endFormatted: string
}

interface Params {
    car: CarDTO
}


export function Scheduling() {
    const [lastSelectedDate, setLastSelectedDate] = useState<DayProps>({} as DayProps)
    const [markedDate, setMarkedDate] = useState<MarkedDatePros>({} as MarkedDatePros)
    const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod>({} as RentalPeriod)
    const route = useRoute()
    const { car } = route.params as Params

    const navigation = useNavigation<any>()
    const theme = useTheme()

    function handleConfirmRental() {
        navigation.navigate('SchedulingDetails', {
            car,
            dates: Object.keys(markedDate)
        })
    }

    function handleBack() {
        navigation.goBack()
    }

    function handleChangeDate(date: DayProps) {
        let start = !lastSelectedDate.timestamp ? date : lastSelectedDate
        let end = date

        // valida que a menor data seja sempre start
        if (start.timestamp > end.timestamp) {
            start = end
            end = start
        }

        setLastSelectedDate(end)
        const interval = generateInterval(start, end)
        setMarkedDate(interval)

        const startDate = Object.keys(interval)[0]
        const endDate = Object.keys(interval)[Object.keys(interval).length - 1]

        setRentalPeriod({
            startFormatted: format(getPlataformDate(new Date(startDate)), 'dd/MM/yyyy'),
            endFormatted: format(getPlataformDate(new Date(endDate)), 'dd/MM/yyyy'),
        })
    }

    return (
        <Container>
            <StatusBar
                barStyle='light-content'
                translucent
                backgroundColor='transparent'
            />
            <Header>
                <BackButton
                    onPress={handleBack}
                    color={theme.colors.shape}
                />

                <Title>
                    Escolha uma {'\n'}
                    data de inicio e {'\n'}
                    fim do  aluguel
                </Title>

                <RentalPeriod>
                    <DateInfo>
                        <DateTitle>DE</DateTitle>
                        <DateValue selected={!!rentalPeriod.startFormatted}>{rentalPeriod.startFormatted}</DateValue>
                    </DateInfo>

                    <ArrowSvg />

                    <DateInfo>
                        <DateTitle>ATÉ</DateTitle>
                        <DateValue selected={!!rentalPeriod.endFormatted}>{rentalPeriod.endFormatted}</DateValue>
                    </DateInfo>
                </RentalPeriod>
            </Header>

            <Content>
                <Calendar
                    markedDates={markedDate}
                    onDayPress={handleChangeDate}
                />
            </Content>

            <Footer>
                <Button
                    title='Confirmar'
                    onPress={handleConfirmRental}
                    enabled={!!rentalPeriod.startFormatted}
                />
            </Footer>
        </Container >
    )
}