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
import moment from 'moment-timezone';
import { useSession } from 'next-auth/react';
import { useColorModeValue } from '@codeday/topo/Theme';
import { CreateEventGroupMutation, DeleteEventGroupMutation, UpdateEventGroupMutation } from './EventGroup.gql';
import { useFetcher } from '../../fetch';

const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      name: 'Name',
    },
    startDate: {
      type: 'string',
      format: 'date',
      title: 'Start',
    },
    endDate: {
      type: 'string',
      format: 'date',
      title: 'End',
    },
    ticketPrice: {
      type: 'number',
      multipleOf: 0.01,
      title: 'Ticket Price',
    },
    earlyBirdPrice: {
      type: 'number',
      multipleOf: 0.01,
      title: 'Early Bird Price',
    },
    earlyBirdCutoff: {
      type: 'string',
      format: 'date',
      title: 'Early Bird Cutoff',
    },
    registrationCutoff: {
      type: 'string',
      format: 'date',
      title: 'Registration Cutoff',
    },
    showcaseId: {
      type: 'string',
      title: 'Showcase ID',
    },
  },
  required: ['name', 'startDate', 'endDate', 'ticketPrice', 'earlyBirdPrice', 'earlyBirdCutoff', 'registrationCutoff'],
};

const uiSchema = {
  /* optional ui schema */
};

export function CreateEventGroupModal({ children, ...props }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    ticketPrice: 20.00,
    earlyBirdPrice: 15.00,
  });
  const { data: session } = useSession();
  const fetch = useFetcher(session);
  const [loading, setLoading] = useState(false);
  const { success, error } = useToasts();
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);
  const router = useRouter();

  return (
    <Box {...props}>
      <Button onClick={onOpenModal}>{children || <><Icon.UiAdd />Add Event Group</>}</Button>
      <Modal open={open} onClose={onCloseModal} center styles={{ modal: { background: useColorModeValue('white', 'var(--chakra-colors-gray-1100)') } }}>
        <Heading>Create Event Group</Heading>
        <Form
          uiSchema={uiSchema}
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
                await fetch(CreateEventGroupMutation, {
                  data: {
                    ...formData,
                  },
                  /* need to connect the new object
                                    to a parent object? do so here */
                });
                await router.replace(router.asPath);
                success('Event Group Created');
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

export function UpdateEventGroupModal({ eventgroup, children, ...props }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    ...eventgroup,
    startDate: moment(eventgroup.startDate).utc().format('YYYY-MM-DD'),
    endDate: moment(eventgroup.endDate).utc().format('YYYY-MM-DD'),
    earlyBirdCutoff: moment(eventgroup.earlyBirdCutoff).utc().format('YYYY-MM-DD'),
    registrationCutoff: moment(eventgroup.registrationCutoff).utc().format('YYYY-MM-DD'),
  });
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
      if (formData[key] !== eventgroup[key]) ret[key] = { set: formData[key] };
    });
    return ret;
  }

  return (
    <Box d="inline" {...props}>
      <Button d="inline" onClick={onOpenModal}>{children || <Icon.UiEdit />}</Button>
      <Modal open={open} onClose={onCloseModal} center styles={{ modal: { background: useColorModeValue('white', 'var(--chakra-colors-gray-1100)') } }}>
        <Form
          uiSchema={uiSchema}
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
                await fetch(UpdateEventGroupMutation, {
                  where: { id: eventgroup.id },
                  data: formDataToUpdateInput(formData),
                });
                await router.replace(router.asPath);
                success('Event Group Updated');
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

export function DeleteEventGroupModal({ eventgroup, children, ...props }) {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const fetch = useFetcher(session);
  const [loading, setLoading] = useState(false);
  const { success, error } = useToasts();
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);
  const router = useRouter();

  return (
    <Box d="inline" {...props}>
      <Button d="inline" onClick={onOpenModal}>{children || <Icon.UiTrash />}</Button>
      <Modal open={open} onClose={onCloseModal} center styles={{ modal: { background: useColorModeValue('white', 'var(--chakra-colors-gray-1100)') } }}>
        <Heading>Remove Event Group</Heading>
        <Text>Are you sure you want to delete this Event Group?
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
              await fetch(DeleteEventGroupMutation, { where: { id: eventgroup.id } });
              await router.replace(router.asPath);
              success('Event Group Deleted');
              onCloseModal();
            } catch (ex) {
              error(ex.toString());
            }
            setLoading(false);
          }}
        ><Icon.UiTrash /><b>Delete Event Group</b>
        </Button>
        <Button onClick={onCloseModal}><Icon.UiX />Cancel</Button>
      </Modal>
    </Box>
  );
}
