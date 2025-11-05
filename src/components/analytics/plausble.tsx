import Script from 'next/script'

import config from '@/data/config'

const { analytics } = config


const PlausibleScript = () => {
  return (
    <>
      <Script
        defer
        data-domain={analytics.plausible.domain}
        src={analytics.plausible.url} // Replace with your umami instance
      />
    </>
  )
}

export default PlausibleScript
