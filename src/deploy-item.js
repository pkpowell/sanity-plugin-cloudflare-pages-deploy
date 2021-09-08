import React, { useState, useEffect } from 'react'
import axios from 'axios'
import useSWR from 'swr'
import spacetime from 'spacetime'

import sanityClient from 'part:@sanity/base/client'

import {
  useToast,
  Menu,
  MenuButton,
  MenuItem,
  Badge,
  Box,
  Button,
  Inline,
  Text,
  Tooltip,
  Dialog,
} from '@sanity/ui'
import { EllipsisVerticalIcon, ClockIcon, TrashIcon } from '@sanity/icons'

import styles from './deploy-item.css'
import StatusIndicator from './cloudflare-status'
import DeployHistory from './deploy-history'

const fetcher = (url, email, apiKey) =>
  axios
    .get(url, {
      headers: {
        'X-Auth-Email': email,
        'X-Auth-Key': apiKey,
        'Content-Type': 'application/json',
      },
    })
    .then((res) => res.data)

const deployItem = ({
  name,
  id,
  cloudflareApiEndpointUrl,
  cloudflareProject,
  cloudflareEmail,
  cloudflareAPIKey,
}) => {
  const client = sanityClient.withConfig({ apiVersion: '2021-03-25' })

  const [isLoading, setIsLoading] = useState(true)
  const [isDeploying, setDeploying] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [status, setStatus] = useState('loading')
  const [timestamp, setTimestamp] = useState(null)
  const [buildTime, setBuildTime] = useState(null)

  const toast = useToast()

  const { data: deploymentData } = useSWR(
    [cloudflareApiEndpointUrl, cloudflareEmail, cloudflareAPIKey],
    (url, email, apiKey) => fetcher(url, email, apiKey),
    {
      errorRetryCount: 3,
      refreshInterval: isDeploying ? 5000 : 0,
      onError: (err) => {
        // to not make things too complicated - display just the first error
        const errorMessage = err.response?.data?.errors[0]?.message
        setStatus('unavailable')
        setErrorMessage(errorMessage)
        setIsLoading(false)
      },
    }
  )

  const onDeploy = () => {
    setStatus('initiated')
    setDeploying(true)
    setTimestamp(null)
    setBuildTime(null)

    axios
      .post(
        cloudflareApiEndpointUrl,
        {},
        {
          headers: {
            'X-Auth-Email': cloudflareEmail,
            'X-Auth-Key': cloudflareAPIKey,
            'Content-Type': 'application/json',
          },
        }
      )
      .then((res) => {
        toast.push({
          status: 'success',
          title: 'Success!',
          description: `Triggered Deployment: ${name}`,
        })
      })
      .catch((err) => {
        setDeploying(false)
        toast.push({
          status: 'error',
          title: 'Deploy Failed.',
          description: `${err}`,
        })
      })
  }

  const onCancel = (deploymentId) => {
    setIsLoading(true)

    axios
      .post(`${cloudflareApiEndpointUrl}/${deploymentId}/cancel`, null, {
        headers: {
          'X-Auth-Email': cloudflareEmail,
          'X-Auth-Key': cloudflareAPIKey,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => res.data?.result)
      .then((res) => {
        setStatus('canceled')
        setDeploying(false)
        setIsLoading(false)
        setBuildTime(null)
        setTimestamp(res?.latest_stage?.ended_on)
      })
  }

  // removes the whole deployments-entry in sanity
  const onRemove = () => {
    setIsLoading(true)

    client.delete(id).then((res) => {
      toast.push({
        status: 'success',
        title: `Successfully deleted deployment: ${name}`,
      })
    })
  }

  // set status when new deployment data comes in
  useEffect(() => {
    let isSubscribed = true

    if (deploymentData?.result && isSubscribed) {
      const latestDeployment = deploymentData.result[0]

      setStatus(latestDeployment?.latest_stage?.status || 'idle')

      if (latestDeployment?.created_on) {
        setTimestamp(latestDeployment?.created_on)
      }

      setIsLoading(false)
    }

    return () => (isSubscribed = false)
  }, [deploymentData])

  // update deploy state after status is updated
  useEffect(() => {
    let isSubscribed = true

    if (isSubscribed) {
      if (
        status === 'success' ||
        status === 'idle' ||
        status === 'failure' ||
        status === 'canceled'
      ) {
        setDeploying(false)
      } else if (status === 'active') {
        setDeploying(true)
      }
    }

    return () => (isSubscribed = false)
  }, [status])

  // count build time
  const tick = (timestamp) => {
    if (timestamp) {
      setBuildTime(spacetime.now().since(spacetime(timestamp)).rounded)
    }
  }

  useEffect(() => {
    let isTicking = true
    const timer = setInterval(() => {
      if (isTicking && isDeploying) {
        tick(timestamp)
      }
    }, 1000)

    if (!isDeploying) {
      clearInterval(timer)
    }

    return () => {
      isTicking = false
      clearInterval(timer)
    }
  }, [timestamp, isDeploying])

  return (
    <>
      <div className={styles.hook}>
        <div className={styles.hookDetails}>
          <h4 className={styles.hookTitle}>
            <span>{name}</span>
            <Badge>{cloudflareProject}</Badge>
          </h4>
          <p className={styles.hookURL}>{cloudflareApiEndpointUrl}</p>
        </div>
        <div className={styles.hookActions}>
          {cloudflareEmail && cloudflareAPIKey && cloudflareProject && (
            <div className={styles.hookStatus}>
              <StatusIndicator status={status}>
                {errorMessage && (
                  <Tooltip
                    content={
                      <Box padding={2}>
                        <Text muted size={1}>
                          <span
                            style={{
                              display: 'inline-block',
                              textAlign: 'center',
                            }}
                          >
                            {errorMessage}
                          </span>
                        </Text>
                      </Box>
                    }
                    placement="top"
                  >
                    <span className={styles.hookStatusError}>
                      <Badge mode="outline" tone="critical">
                        ?
                      </Badge>
                    </span>
                  </Tooltip>
                )}
              </StatusIndicator>

              <span className={styles.hookTime}>
                {isDeploying
                  ? buildTime || '--'
                  : timestamp
                  ? spacetime.now().since(spacetime(timestamp)).rounded
                  : '--'}
              </span>
            </div>
          )}
          <Inline space={2}>
            <Button
              type="button"
              tone="positive"
              disabled={isDeploying || isLoading || status === 'unavailable'}
              loading={isDeploying || isLoading}
              onClick={() => onDeploy()}
              text="Deploy"
            />
            {isDeploying && status === 'active' && (
              <Button
                type="button"
                tone="critical"
                onClick={() => onCancel(deploymentData.result[0].id)}
                text="Cancel"
              />
            )}
            <MenuButton
              button={
                <Button
                  mode="bleed"
                  icon={EllipsisVerticalIcon}
                  disabled={isDeploying || isLoading}
                />
              }
              portal
              menu={
                <Menu>
                  <MenuItem
                    text="History"
                    icon={ClockIcon}
                    onClick={() => setIsHistoryOpen(true)}
                    disabled={!deploymentData?.result?.length}
                  />
                  <MenuItem
                    text="Delete"
                    icon={TrashIcon}
                    tone="critical"
                    onClick={() => onRemove()}
                  />
                </Menu>
              }
              placement="bottom"
            />
          </Inline>
        </div>
      </div>

      {isHistoryOpen && (
        <Dialog
          header={`Deployment History: ${name} (${cloudflareProject})`}
          onClickOutside={() => setIsHistoryOpen(false)}
          onClose={() => setIsHistoryOpen(false)}
          width={2}
        >
          <Box padding={4}>
            <DeployHistory
              cloudflareApiEndpointUrl={cloudflareApiEndpointUrl}
              cloudflareProject={cloudflareProject}
              cloudflareEmail={cloudflareEmail}
              cloudflareAPIKey={cloudflareAPIKey}
            />
          </Box>
        </Dialog>
      )}
    </>
  )
}

export default deployItem
