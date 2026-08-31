import Head from 'next/head'
import Chakra from '../components/chakra'

function MyApp({ Component, pageProps }) {
  return (
    <Chakra>
      <Head>
        <title>Young Sun Choi - AI Researcher</title>
        <meta name="description" content="Young Sun Choi - Ph.D. student at Yonsei University, 3D computer vision." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon-32.png" />
      </Head>
      <Component {...pageProps} />
    </Chakra>
  )
}

export default MyApp
