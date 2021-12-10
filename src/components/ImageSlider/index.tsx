import React from 'react'

import {
    Container,
    ImageIndixes,
    ImageIndex,
    CarImageWrapper,
    CarImage,
} from './styles'

interface Props {
    imagesUrl: string[]
}

export function ImageSlider({ imagesUrl }: Props) {
    return (
        <Container>
            <ImageIndixes>
                <ImageIndex active={true} />
                <ImageIndex active={false} />
                <ImageIndex active={false} />
                <ImageIndex active={false} />
            </ImageIndixes>

            <CarImageWrapper>
                <CarImage
                    source={{ uri: imagesUrl[0] }}
                    resizeMode='contain'
                />
            </CarImageWrapper>

        </Container>
    )
}