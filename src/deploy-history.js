import React, { useEffect, useState } from 'react'
import axios from 'axios'
import spacetime from 'spacetime'

import { Avatar, Box, Card, Flex, Spinner, Text, Tooltip } from '@sanity/ui'

import styles from './deploy-history.css'
import StatusIndicator from './cloudflare-status'

const DeployHistory = ({
  cloudflareApiEndpointUrl,
  cloudflareProject,
  cloudflareEmail,
  cloudflareAPIKey,
}) => {
  const [state, setState] = useState({})

  useEffect(() => {
    if (!cloudflareProject) {
      return
    }
    setState({ loading: true })

    axios
      .get(cloudflareApiEndpointUrl, {
        headers: {
          'X-Auth-Email': cloudflareEmail,
          'X-Auth-Key': cloudflareAPIKey,
          'Content-Type': 'application/json',
        },
      })
      .then(({ data }) => {
        setState({
          deployments: data.result,
          loading: false,
          error: false,
        })
      })
      .catch((e) => {
        setState({
          error: true,
          loading: false,
        })
        console.warn(e)
      })
  }, [cloudflareProject])

  if (state.loading) {
    return (
      <Flex align="center" justify="center">
        <Spinner muted />
      </Flex>
    )
  }

  if (state.error) {
    return (
      <Card padding={[3, 3, 4]} radius={2} shadow={1} tone="critical">
        <Text size={[2, 2, 3]}>
          Could not load deployments for {cloudflareProject}
        </Text>
      </Card>
    )
  }

  return (
    <Box as="table" className={styles.table}>
      <Box as="thead" style={{ display: 'table-header-group' }}>
        <tr>
          <th>Deployment</th>
          <th>State</th>
          <th>Commit</th>
          <th>Time</th>
        </tr>
      </Box>
      <Box as="tbody" style={{ display: 'table-row-group' }}>
        {state.deployments?.map((deployment) => (
          <tr as="tr" key={deployment.id}>
            <td>
              <a href={deployment.url} target="_blank">
                {deployment.url}
              </a>
            </td>
            <td>
              <StatusIndicator status={deployment.latest_stage?.status} />
            </td>
            <td>
              <div>{deployment.deployment_trigger?.metadata?.commit_hash}</div>
              <small className={styles.commit}>
                {deployment.deployment_trigger?.metadata?.commit_message}
              </small>
            </td>
            <td>
              {spacetime.now().since(spacetime(deployment.created_on)).rounded}
            </td>
          </tr>
        ))}
      </Box>
    </Box>
  )
}

export default DeployHistory
