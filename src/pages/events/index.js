import React from 'react';
import { DateTime } from 'luxon';
import { Heading, Grid } from '@codeday/topo/Atom';
import { getSession } from 'next-auth/react';
import Page from '../../components/Page';
import { getFetcher } from '../../fetch';
import Event from '../../components/Event';
import { getEvents } from './index.gql';

export default function Events({ events }) {
  if (!events) return <Page />;
  const now = DateTime.now().minus({ days: 1 });
  const upcomingEvents = events.filter(
    (e) => DateTime.fromISO(e.endDate) >= now,
  );
  const pastEvents = events.filter((e) => DateTime.fromISO(e.endDate) < now);
  return (
    <Page title="Events">
      {upcomingEvents.length > 0 && (
        <>
          <Heading>Upcoming Events</Heading>

          <Grid
            templateColumns={{
              base: '1fr',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
            }}
          >
            {upcomingEvents.map((event) => (
              <Event key={event.id} m={4} event={event} />
            ))}
          </Grid>
        </>
      )}
      {pastEvents.length > 0 && (
        <>
          <Heading>Past Events</Heading>

          <Grid
            templateColumns={{
              base: '1fr',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
            }}
          >
            {pastEvents.map((event) => (
              <Event key={event.id} m={4} event={event} />
            ))}
          </Grid>
        </>
      )}
    </Page>
  );
}

export async function getServerSideProps({ req, res, query }) {
  const session = await getSession({ req });
  const fetch = getFetcher(session);
  if (!session) return { props: {} };
  const eventResults = await fetch(getEvents);
  return {
    props: {
      events: eventResults.clear.events,
    },
  };
}
