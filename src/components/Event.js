import React from 'react';
import { Box, Flex, Text } from '@codeday/topo/Atom';
import InfoBox from './InfoBox';
import { Image } from '@chakra-ui/react';

export default function Event({ event, ...props }) {
    return (
        <InfoBox
            heading={
                <>
                    {event.name} - {event.eventGroup?.name}
                </>
            }
            id={event.id}
            as="a"
            href={`/events/${event.id}`}
            {...props}
        >
            <Flex>
                <Box w="60px" h="60px" mr={4} mb={1} ml={1}>
                    <Image
                        src={
                            event.region?.skylinePhoto?.url
                                ? event.region.skylinePhoto.url
                                : '/codeday-logo-skyline-substitute.png'
                        }
                        alt=""
                        rounded={3}
                    />
                </Box>
                <Box>
                    <Text mb={0}>{event.displayDate}</Text>
                    <Text mb={0}>
                        {event.soldTickets +
                            (event.soldTickets == 1
                                ? ' ticket'
                                : ' tickets')}{' '}
                        sold
                    </Text>
                    {event.soldTickets > 0 && (
                        <Text mb={0}>
                            ({event.students} students{' '}
                            {event.soldTickets - event.students} staff)
                        </Text>
                    )}
                </Box>
            </Flex>
        </InfoBox>
    );
}
