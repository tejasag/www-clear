import React from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { Heading, Grid } from '@codeday/topo/Atom';
import { getSession } from 'next-auth/react';
import Breadcrumbs from '../../../components/Breadcrumbs';
import { EventRestrictionPreview } from '../../../components/EventRestriction';
import Page from '../../../components/Page';
import { getFetcher } from '../../../fetch';
import { GetEventRestrictionsQuery } from './eventRestrictions.gql';
import LinkEventRestrictionsModal from '../../../components/LinkEventRestrictionsModal';
import InfoBox from '../../../components/InfoBox';

export default function EventRestrictions({ event, restrictions }) {
    if (!event) return <Page />;
    return (
        <Page title={event.name}>
            <Breadcrumbs event={event} />
            <Heading d="inline">{event.name} ~ Event Restrictions</Heading>
            <LinkEventRestrictionsModal
                event={event}
                restrictions={restrictions}
            />

            <Grid
                templateColumns={{
                    base: '1fr',
                    md: 'repeat(2, 1fr)',
                    lg: 'repeat(3, 1fr)',
                }}
                gap={3}
            >
                {event.eventRestrictions.map((r) => (
                    <InfoBox heading={r.name}>
                        <EventRestrictionPreview eventRestriction={r} />
                    </InfoBox>
                ))}
            </Grid>
        </Page>
    );
}

export async function getServerSideProps({
    req,
    res,
    query: { event: eventId },
}) {
    const session = await getSession({ req });
    const fetch = getFetcher(session);
    if (!session) return { props: {} };
    const eventResults = await fetch(GetEventRestrictionsQuery, {
        data: { id: eventId },
    });
    return {
        props: {
            event: eventResults.clear.event,
            restrictions: eventResults.clear.eventRestrictions,
        },
    };
}
