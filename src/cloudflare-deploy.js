import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { nanoid } from 'nanoid'

import sanityClient from 'part:@sanity/base/client'
import AnchorButton from 'part:@sanity/components/buttons/anchor'
import FormField from 'part:@sanity/components/formfields/default'
import WarningIcon from 'part:@sanity/base/warning-icon'
import {
  studioTheme,
  ThemeProvider,
  ToastProvider,
  useToast,
  Dialog,
  Grid,
  Flex,
  Box,
  Card,
  Stack,
  Spinner,
  Button,
  Text,
  Inline,
  Heading,
  TextInput,
} from '@sanity/ui'

import styles from './cloudflare-deploy.css'
import DeployItem from './deploy-item'

const initialDeploy = {
  title: '',
  project: '',
  apiUrl: '',
  email: '',
  apiKey: '',
}

const CloudflareDeploy = () => {
  const WEBHOOK_TYPE = 'webhook_deploy'
  const WEBHOOK_QUERY = `*[_type == "${WEBHOOK_TYPE}"] | order(_createdAt)`
  const client = sanityClient.withConfig({ apiVersion: '2021-03-25' })

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [deploys, setDeploys] = useState([])
  const [pendingDeploy, setpendingDeploy] = useState(initialDeploy)
  const toast = useToast()

  const onSubmit = async () => {
    setIsSubmitting(true)

    let accountId = null

    // first fetch Cloudflare account id to the according email and api key
    try {
      const fetchAccountId = await axios.get(
        `${pendingDeploy.apiUrl}/client/v4/accounts?page=1&per_page=1&direction=desc`,
        {
          headers: {
            'X-Auth-Email': pendingDeploy.email,
            'X-Auth-Key': pendingDeploy.apiKey,
            'Content-Type': 'application/json',
          },
        }
      )

      if (!fetchAccountId?.data?.success) {
        throw new Error('Can not fetch Cloudflare account id')
      }

      accountId = fetchAccountId.data.result[0].id
    } catch (error) {
      console.error(error)
      setIsSubmitting(false)

      toast.push({
        status: 'error',
        title: 'Cloudflare API Error',
        closable: true,
        description:
          'Error accessing Cloudflare API or fetching Cloudflare account id',
      })

      return
    }

    client
      .create({
        // Explicitly define an _id inside the cloudflare-deploy path to make sure it's not publicly accessible
        // This will protect users' tokens & project info. Read more: https://www.sanity.io/docs/ids
        _id: `cloudflare-pages-deploy.${nanoid()}`,
        _type: WEBHOOK_TYPE,
        name: pendingDeploy.title,
        cloudflareApiEndpointUrl: `${pendingDeploy.apiUrl}/client/v4/accounts/${accountId}/pages/projects/${pendingDeploy.project}/deployments`,
        cloudflareAccountId: accountId,
        cloudflareProject: pendingDeploy.project,
        cloudflareEmail: pendingDeploy.email,
        cloudflareApiKey: pendingDeploy.apiKey,
      })
      .then(() => {
        toast.push({
          status: 'success',
          title: 'Success!',
          description: `Created Deployment: ${pendingDeploy.title}`,
        })
        setIsFormOpen(false)
        setIsSubmitting(false)
        setpendingDeploy(initialDeploy) // Reset the pending webhook state
      })
  }

  // Fetch all existing webhooks and listen for newly created
  useEffect(() => {
    let webhookSubscription

    client.fetch(WEBHOOK_QUERY).then((w) => {
      setDeploys(w)
      setIsLoading(false)

      webhookSubscription = client
        .listen(WEBHOOK_QUERY, {}, { includeResult: true })
        .subscribe((res) => {
          const wasCreated = res.mutations.some((item) =>
            Object.prototype.hasOwnProperty.call(item, 'create')
          )
          const wasDeleted = res.mutations.some((item) =>
            Object.prototype.hasOwnProperty.call(item, 'delete')
          )
          if (wasCreated) {
            setDeploys((prevState) => {
              return [...prevState, res.result]
            })
          }
          if (wasDeleted) {
            setDeploys((prevState) =>
              prevState.filter((w) => w._id !== res.documentId)
            )
          }
        })
    })

    return () => {
      webhookSubscription && webhookSubscription.unsubscribe()
    }
  }, [])

  return (
    <ThemeProvider theme={studioTheme}>
      <ToastProvider>
        <div className={styles.appContainer}>
          <div className={styles.container}>
            <div className={styles.header}>
              <h2 className={styles.title}>
                <svg
                  fill="currentColor"
                  viewBox="0 0 32 32"
                  height="64"
                  width="64"
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles.titleIcon}
                >
                  <path
                    d="M8.16 23h21.177v-5.86l-4.023-2.307-.694-.3-16.46.113z"
                    fill="#fff"
                  />
                  <path
                    d="M22.012 22.222c.197-.675.122-1.294-.206-1.754-.3-.422-.807-.666-1.416-.694l-11.545-.15c-.075 0-.14-.038-.178-.094s-.047-.13-.028-.206c.038-.113.15-.197.272-.206l11.648-.15c1.38-.066 2.88-1.182 3.404-2.55l.666-1.735a.38.38 0 0 0 .02-.225c-.75-3.395-3.78-5.927-7.4-5.927-3.34 0-6.17 2.157-7.184 5.15-.657-.488-1.5-.75-2.392-.666-1.604.16-2.9 1.444-3.048 3.048a3.58 3.58 0 0 0 .084 1.191A4.84 4.84 0 0 0 0 22.1c0 .234.02.47.047.703.02.113.113.197.225.197H21.58a.29.29 0 0 0 .272-.206l.16-.572z"
                    fill="#f38020"
                  />
                  <path
                    d="M25.688 14.803l-.32.01c-.075 0-.14.056-.17.13l-.45 1.566c-.197.675-.122 1.294.206 1.754.3.422.807.666 1.416.694l2.457.15c.075 0 .14.038.178.094s.047.14.028.206c-.038.113-.15.197-.272.206l-2.56.15c-1.388.066-2.88 1.182-3.404 2.55l-.188.478c-.038.094.028.188.13.188h8.797a.23.23 0 0 0 .225-.169A6.41 6.41 0 0 0 32 21.106a6.32 6.32 0 0 0-6.312-6.302"
                    fill="#faae40"
                  />
                </svg>{' '}
                Cloudflare Deployments
              </h2>
            </div>
            <div className={styles.list}>
              {isLoading ? (
                <div className={styles.loader}>
                  <Flex direction="column" align="center" justify="center">
                    <Spinner size={4} />
                    <Box padding={4}>
                      <Text size={2}>loading deployments...</Text>
                    </Box>
                  </Flex>
                </div>
              ) : deploys.length ? (
                deploys.map((deploy) => (
                  <DeployItem
                    key={deploy._id}
                    name={deploy.name}
                    id={deploy._id}
                    cloudflareApiEndpointUrl={deploy.cloudflareApiEndpointUrl}
                    cloudflareAccountId={deploy.cloudflareAccountId}
                    cloudflareProject={deploy.cloudflareProject}
                    cloudflareEmail={deploy.cloudflareEmail}
                    cloudflareAPIKey={deploy.cloudflareApiKey}
                  />
                ))
              ) : (
                <EmptyState />
              )}
            </div>

            <div className={styles.footer}>
              <AnchorButton
                onClick={() => setIsFormOpen(true)}
                bleed
                color="primary"
                kind="simple"
              >
                Create New
              </AnchorButton>
            </div>
          </div>
        </div>

        {isFormOpen && (
          <Dialog
            header="New Deployment"
            id="create-webhook"
            width={1}
            onClickOutside={() => setIsFormOpen(false)}
            onClose={() => setIsFormOpen(false)}
            footer={
              <Box padding={3}>
                <Grid columns={2} gap={3}>
                  <Button
                    padding={4}
                    mode="ghost"
                    text="Cancel"
                    onClick={() => setIsFormOpen(false)}
                  />
                  <Button
                    padding={4}
                    text="Publish"
                    tone="primary"
                    loading={isSubmitting}
                    onClick={() => onSubmit()}
                    disabled={
                      isSubmitting ||
                      !pendingDeploy.title ||
                      !pendingDeploy.project ||
                      !pendingDeploy.apiUrl ||
                      !pendingDeploy.email ||
                      !pendingDeploy.apiKey
                    }
                  />
                </Grid>
              </Box>
            }
          >
            <Box padding={4}>
              <Stack space={4}>
                <FormField
                  label="Display Title"
                  description="Give your deploy a name, like 'Production'"
                >
                  <TextInput
                    type="text"
                    value={pendingDeploy.title}
                    onChange={(e) => {
                      e.persist()
                      setpendingDeploy((prevState) => ({
                        ...prevState,
                        ...{ title: e?.target?.value },
                      }))
                    }}
                  />
                </FormField>

                <FormField
                  label="Cloudflare Project Name"
                  description="The exact name of the associated project on Cloudflare"
                >
                  <TextInput
                    type="text"
                    value={pendingDeploy.project}
                    onChange={(e) => {
                      e.persist()
                      setpendingDeploy((prevState) => ({
                        ...prevState,
                        ...{ project: e?.target?.value },
                      }))
                    }}
                  />
                </FormField>

                <FormField
                  label="Cloudflare API Endpoint URL"
                  description="The url without trailing slashes like 'https://myproxyurl.com'"
                >
                  <TextInput
                    type="url"
                    value={pendingDeploy.apiUrl}
                    onChange={(e) => {
                      e.persist()
                      setpendingDeploy((prevState) => ({
                        ...prevState,
                        ...{ apiUrl: e?.target?.value },
                      }))
                    }}
                  />
                </FormField>

                <FormField
                  label="Cloudflare Email"
                  description="Required for API access"
                >
                  <TextInput
                    type="email"
                    value={pendingDeploy.email}
                    onChange={(e) => {
                      e.persist()
                      setpendingDeploy((prevState) => ({
                        ...prevState,
                        ...{ email: e?.target?.value },
                      }))
                    }}
                  />
                </FormField>

                <FormField
                  label="Cloudflare API key"
                  description="The Cloudflare API key from your account settings"
                >
                  <TextInput
                    type="text"
                    value={pendingDeploy.apiKey}
                    onChange={(e) => {
                      e.persist()
                      setpendingDeploy((prevState) => ({
                        ...prevState,
                        ...{ apiKey: e?.target?.value },
                      }))
                    }}
                  />
                </FormField>

                <Card padding={[3, 3, 4]} radius={3} shadow={1} tone="caution">
                  <Box marginBottom={3}>
                    <Inline space={[1]}>
                      <WarningIcon style={{ fontSize: 24 }} />
                      <Heading size={1}>Careful!</Heading>
                    </Inline>
                  </Box>
                  <Text size={[1, 1, 1]}>
                    Once you create this deployment you will not be able to edit
                    it.
                  </Text>
                </Card>
              </Stack>
            </Box>
          </Dialog>
        )}
      </ToastProvider>
    </ThemeProvider>
  )
}

const EmptyState = () => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        width="360"
        viewBox="0 0 64 64"
        className={styles.emptyIcon}
      >
        <g transform="matrix(0.9375,0,0,1,2.00001,-2)">
          <path
            stroke="#DDD"
            strokeWidth="0.5"
            d="M0.544,46L58.674,46L58.674,45.958L63.072,45.958C63.281,45.961 63.467,45.821 63.522,45.62C63.834,44.511 63.995,43.364 64,42.212C63.98,35.298 58.29,29.617 51.376,29.608L51.376,29.606L50.736,29.626C50.69,29.626 50.645,29.637 50.604,29.656L49.315,29.098C49.317,29.037 49.311,28.976 49.298,28.916C47.798,22.126 41.738,17.062 34.498,17.062C27.818,17.062 22.158,21.376 20.13,27.362C18.816,26.386 17.13,25.862 15.346,26.03C12.138,26.35 9.546,28.918 9.25,32.126C9.172,32.924 9.229,33.729 9.418,34.508C4.203,34.649 -0.008,38.983 0,44.2C0,44.668 0.04,45.14 0.094,45.606C0.134,45.832 0.32,46 0.544,46Z"
          />
        </g>
        <g transform="matrix(-1.1776e-16,0.615385,-0.928571,-1.65246e-16,43.7143,16.8462)">
          <path
            stroke="#DDD"
            strokeWidth="0.5"
            d="M20.563,13.45L20.563,18L10,11L20.563,4L20.563,8.55L36,8.55L36,13.45L20.563,13.45Z"
          />
        </g>
      </svg>
      <p className={styles.emptyList}>
        No deploys created yet.{' '}
        <a
          className={styles.emptyHelpLink}
          href="https://github.com/estallio/sanity-plugin-cloudflare-pages-deploy#your-first-vercel-deployment"
          target="_blank"
          rel="noopener noreferrer"
        >
          Need help?
        </a>
      </p>
    </>
  )
}

export default CloudflareDeploy
