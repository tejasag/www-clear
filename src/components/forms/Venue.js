import React, { useState } from 'react';
import Form from '@rjsf/chakra-ui';
import {
  Box, Button, Heading, Text,
} from '@codeday/topo/Atom';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import * as Icon from '@codeday/topocons/Icon';
import { useToasts } from '@codeday/topo/utils';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useColorModeValue } from '@codeday/topo/Theme';
import { CreateVenueMutation, DeleteVenueMutation, UpdateVenueMutation } from './Venue.gql';
import { useFetcher } from '../../fetch';
import { InfoAlert } from '../Alert';

const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: 'Name',
    },
    capacity: {
      type: 'integer',
      title: 'Capacity',
    },
    addressLine1: {
      type: 'string',
      title: 'Address Line 1',
    },
    addressLine2: {
      type: 'string',
      title: 'Address Line 2',
    },
    addressLine3: {
      type: 'string',
      title: 'Address Line 3',
    },
    city: {
      type: 'string',
      title: 'City',
    },
    state: {
      type: 'string',
      title: 'State',
    },
    stateAbbreviation: {
      type: 'string',
      title: 'State Abbreviation',
    },
    zipCode: {
      type: 'string',
      title: 'ZIP code',
    },
    country: {
      type: 'string',
      title: 'Country',
    },
    countryAbbreviation: {
      type: 'string',
      title: 'Country Abbreviation',
    },
    mapLink: {
      type: 'string',
      title: 'Map link',
    },
    contactName: {
      type: 'string',
      title: 'Contact Name',
    },
    contactEmail: {
      type: 'string',
      title: 'Contact Email',
    },
    contactPhone: {
      type: 'string',
      title: 'Contact Phone',
    },
  },
};

export function CreateVenueModal({ event, children, ...props }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState();
  const { data: session } = useSession();
  const fetch = useFetcher(session);
  const [loading, setLoading] = useState(false);
  const { success, error } = useToasts();
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);
  const router = useRouter();

  return (
    <Box {...props}>
      <Button h={6} onClick={onOpenModal}>{children || <><Icon.UiAdd />Add Venue</>}</Button>
      <Modal open={open} onClose={onCloseModal} center styles={{ modal: { background: useColorModeValue('white', 'var(--chakra-colors-gray-1100)') } }}>
        <Heading>Create Venue</Heading>
        <InfoAlert>You can leave anything you aren't sure of yet blank and edit later!</InfoAlert>
        <Form
          schema={schema}
          formData={formData}
          onChange={(data) => setFormData(data.formData)}
        >
          <Button
            isLoading={loading}
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              try {
                const venueResp = await fetch(CreateVenueMutation, {
                  data: {
                    ...formData,
                    events: {
                      connect: [{ id: event.id }],
                    },
                  },
                });
                await router.replace(router.asPath);
                success('Venue Created');
                onCloseModal();
              } catch (ex) {
                error(ex.toString());
              }
              setLoading(false);
            }}
          >Submit
          </Button>
        </Form>
      </Modal>
    </Box>
  );
}

export function UpdateVenueModal({ venue, children, ...props }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(venue);
  const { data: session } = useSession();
  const fetch = useFetcher(session);
  const [loading, setLoading] = useState(false);
  const { success, error } = useToasts();
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);
  const router = useRouter();

  function formDataToUpdateInput(formData) {
    const ret = {};
    Object.keys(schema.properties).map((key) => {
      if (formData[key] !== venue[key]) ret[key] = { set: formData[key] };
    });
    return ret;
  }

  return (
    <Box d="inline" {...props}>
      <Button h={6} d="inline" onClick={onOpenModal}>{children || <Icon.UiEdit />}</Button>
      <Modal open={open} onClose={onCloseModal} center styles={{ modal: { background: useColorModeValue('white', 'var(--chakra-colors-gray-1100)') } }}>
        <Form
          schema={schema}
          formData={formData}
          onChange={(data) => setFormData(data.formData)}
        >
          <Button
            isLoading={loading}
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              try {
                const venueResp = await fetch(UpdateVenueMutation, {
                  where: { id: venue.id },
                  data: formDataToUpdateInput(formData),
                });
                await router.replace(router.asPath);
                success('Venue Updated');
                onCloseModal();
              } catch (ex) {
                error(ex.toString());
              }
              setLoading(false);
            }}
          >Submit
          </Button>
        </Form>
      </Modal>
    </Box>
  );
}

export function DeleteVenueModal({ venue, children, ...props }) {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const fetch = useFetcher(session);
  const [loading, setLoading] = useState(false);
  const { success, error } = useToasts();
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);
  const router = useRouter();

  return (
    <Box d="inline">
      <Button h={6} d="inline" onClick={onOpenModal}>{children || <Icon.UiTrash />}</Button>
      <Modal open={open} onClose={onCloseModal} center styles={{ modal: { background: useColorModeValue('white', 'var(--chakra-colors-gray-1100)') } }}>
        <Heading>Remove Venue</Heading>
        <Text>Are you sure you want to delete this venue?
          <br />
          There's no turning back!
        </Text>
        <Button
          colorScheme="red"
          disabled={loading}
          isLoading={loading}
          onClick={async () => {
            setLoading(true);
            try {
              await fetch(DeleteVenueMutation, { where: { id: venue.id } });
              await router.replace(router.asPath);
              success('Venue Deleted');
              onCloseModal();
            } catch (ex) {
              error(ex.toString());
            }
            setLoading(false);
          }}
        ><Icon.UiTrash /><b>Delete Venue</b>
        </Button>
        <Button onClick={onCloseModal}><Icon.UiX />Cancel</Button>
      </Modal>
    </Box>
  );
}
