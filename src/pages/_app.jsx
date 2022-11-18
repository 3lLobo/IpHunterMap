import { useEffect, useRef } from 'react'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { wrapper } from '@/api/store'

import '@/styles/tailwind.css'
import 'focus-visible'
import { Provider } from 'react-redux'

function usePrevious(value) {
  let ref = useRef()

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

function App({ Component, router, ...rest }) {
  let previousPathname = usePrevious(router.pathname)
  const { store, props } = wrapper.useWrappedStore(rest)

  return (
    <Provider store={store}>
      <div className="fixed inset-0 flex justify-center sm:px-8">
        <div className="flex w-full max-w-7xl lg:px-8">
          <div className="w-full bg-white ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-300/20" />
        </div>
      </div>
      <div className="relative">
        <Header />
        <main>
          <Component previousPathname={previousPathname} {...props.pageProps} />
        </main>
        <Footer />
      </div>
    </Provider>
  )
}

export default App
