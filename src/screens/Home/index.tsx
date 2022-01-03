import React, { useEffect, useState } from 'react'
import { StatusBar, StyleSheet } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import { synchronize } from '@nozbe/watermelondb/sync'
import { useNetInfo } from '@react-native-community/netinfo'
import { Ionicons } from '@expo/vector-icons'
import { RectButton, PanGestureHandler } from 'react-native-gesture-handler'
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    useAnimatedGestureHandler,
    withSpring, //lida com física
} from 'react-native-reanimated'

import { useNavigation } from '@react-navigation/native'
import { useTheme } from 'styled-components'

import { database } from '../../database'
import { Car as ModelCar } from '../../database/model/Car'
import { Car } from '../../components/Car'
import { LoadAnimation } from '../../components/LoadAnimation'
import api from '../../services/api'
import { CarDTO } from '../../dtos/CarDTO'

import Logo from '../../assets/logo.svg'

import {
    Container,
    Header,
    TotalCars,
    HeaderContent,
    CarList,
} from './styles'

// const ButtonAnimated = Animated.createAnimatedComponent(RectButton)

export function Home() {
    const [cars, setCars] = useState<ModelCar[]>([])
    const [loading, setLoading] = useState(true)

    const netInfo = useNetInfo()

    // const positionX = useSharedValue(0)
    // const positionY = useSharedValue(0)

    // const myCarsButtonStyle = useAnimatedStyle(() => {
    //     return {
    //         transform: [
    //             { translateX: positionX.value },
    //             { translateY: positionY.value }
    //         ]
    //     }
    // })

    // const onGestureEvent = useAnimatedGestureHandler({
    //     onStart(_, ctx: any) {
    //         ctx.positionX = positionX.value
    //         ctx.positionY = positionY.value
    //     },
    //     onActive(event, ctx: any) {
    //         positionX.value = ctx.positionX + event.translationX
    //         positionY.value = ctx.positionY + event.translationY
    //     },
    //     onEnd() {
    //         positionX.value = withSpring(0)
    //         positionY.value = withSpring(0)
    //     }
    // })

    const navigation = useNavigation<any>()
    // const theme = useTheme()

    function handleCarDetails(car: CarDTO) {
        navigation.navigate('CarDetails', { car })
    }

    async function offlineSyncronize() {
        await synchronize({
            database,
            pullChanges: async ({ lastPulledAt }) => {
                const response = await api
                    .get(`cars/sync/pull?lastPulledVersion=${lastPulledAt || 0}`)

                const { changes, latestVersion } = response.data
                return { changes, timestamp: latestVersion }
            },
            pushChanges: async ({ changes }) => {
                const user = changes.users
                await api.post('/users/sync', user)
            }
        })
    }

    // function handleOpenMyCars() {
    //     navigation.navigate('MyCars')
    // }

    useEffect(() => {
        let isMounted = true
        async function fetchCars() {
            try {
                const carCollection = database.get<ModelCar>('cars')
                const cars = await carCollection.query().fetch()

                if (isMounted) {
                    setCars(cars)
                }
            } catch (error) {
                console.log(error)
            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }

        fetchCars()
        return () => {
            isMounted = false
        }
    }, [])

    useEffect(() => {
        if (netInfo.isConnected === true) {
            offlineSyncronize()
        }
    }, [netInfo.isConnected])

    return (
        <Container>
            <StatusBar
                barStyle='light-content'
                translucent
                backgroundColor='transparent'
            />
            <Header>
                <HeaderContent>
                    <Logo
                        width={RFValue(108)}
                        height={RFValue(12)}
                    />

                    {
                        !loading &&
                        <TotalCars>
                            Total {cars.length} carros
                        </TotalCars>
                    }
                </HeaderContent>
            </Header>

            {loading ? <LoadAnimation /> :
                <CarList
                    data={cars}
                    keyExtractor={item => String(item.id)}
                    renderItem={({ item }) =>
                        <Car data={item} onPress={() => handleCarDetails(item)} />
                    }
                />
            }

            {/* lidar com o clica e arrasta */}
            {/* <PanGestureHandler onGestureEvent={onGestureEvent}>
                <Animated.View
                    style={[
                        myCarsButtonStyle,
                        {
                            position: 'absolute',
                            bottom: 13,
                            right: 22,
                        }
                    ]}
                >
                    <ButtonAnimated
                        onPress={handleOpenMyCars}
                        style={[styles.button, { backgroundColor: theme.colors.main }]}
                    >
                        <Ionicons
                            name='ios-car-sport'
                            size={32}
                            color={theme.colors.shape}
                        />
                    </ButtonAnimated>
                </Animated.View>
            </PanGestureHandler> */}
        </Container>
    )
}

// const styles = StyleSheet.create({
//     button: {
//         width: 60,
//         height: 60,
//         borderRadius: 30,
//         justifyContent: 'center',
//         alignItems: 'center'
//     }
// })