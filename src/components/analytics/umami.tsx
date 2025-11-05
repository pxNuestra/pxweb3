import Script from 'next/script'

import config from '@/data/config'

const { analytics } = config


const UmamiScript = () => {
  return (
    <>
      <Script
        async
        defer
        data-website-id={analytics.umami.websiteId}
        src={analytics.umami.url} // Replace with your umami instance
      />
    </>
  )
}

export default UmamiScript
