import React from 'react'
import { Feather } from '@expo/vector-icons'
import { RFValue } from 'react-native-responsive-fontsize'

import { useNavigation } from '@react-navigation/native'
import { useTheme } from 'styled-components'

import { BackButton } from '../../components/BackButton'
import { ImageSlider } from '../../components/ImageSlider'
import { Accessory } from '../../components/Accessory'
import { Button } from '../../components/Button'

import SpeedSvg from '../../assets/speed.svg'
import AccelerationSvg from '../../assets/acceleration.svg'
import ForceSvg from '../../assets/force.svg'
import GasolineSvg from '../../assets/gasoline.svg'
import ExchangeSvg from '../../assets/exchange.svg'
import PeopleSvg from '../../assets/people.svg'

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


export function SchedulingDetails() {
    const navigation = useNavigation<any>()
    const theme = useTheme()

    function handleConfirmRental() {
        navigation.navigate('SchedulingComplete')
    }

    function handleBack() {
        navigation.goBack()
    }

    return (
        <Container>
            <Header>
                <BackButton onPress={handleBack} />
            </Header>

            <CarImages>
                <ImageSlider imagesUrl={['https://cdn.picpng.com/audi/shape-audi-28631.png']} />
            </CarImages>

            <Content>
                <Details>
                    <Description>
                        <Brand>Audi</Brand>
                        <Name>RS 5 Couplé</Name>
                    </Description>

                    <Rent>
                        <Period>Ao dia</Period>
                        <Price>R$ 200</Price>
                    </Rent>
                </Details>

                <Accessories>
                    <Accessory name='380km/h' icon={SpeedSvg} />
                    <Accessory name='3.2s' icon={AccelerationSvg} />
                    <Accessory name='800HP' icon={ForceSvg} />
                    <Accessory name='Gasoline' icon={GasolineSvg} />
                    <Accessory name='Auto' icon={ExchangeSvg} />
                    <Accessory name='2 pessoas' icon={PeopleSvg} />
                </Accessories>

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
                        <DateValue>07/12/2021</DateValue>
                    </DateInfo>

                    <Feather
                        name='chevron-right'
                        size={RFValue(24)}
                        color={theme.colors.shape}
                    />

                    <DateInfo>
                        <DateTitle>DE</DateTitle>
                        <DateValue>07/12/2021</DateValue>
                    </DateInfo>
                </RentalPeriod>

                <RentalPrice>
                    <RentalPriceLabel>Total</RentalPriceLabel>
                    <RentalPriceDetails>
                        <RentalPriceQuota>R$ 200 x 3 diárias</RentalPriceQuota>
                        <RentalPriceTotal>R$ 600</RentalPriceTotal>
                    </RentalPriceDetails>
                </RentalPrice>
            </Content>

            <Footer>
                <Button title='Alugar agora' color={theme.colors.success} onPress={handleConfirmRental} />
            </Footer>
        </Container>
    )
}