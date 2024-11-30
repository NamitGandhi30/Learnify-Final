import React from 'react'
import StreamVideoProvider from '@/providers/StreamClientProvider'
const layout = ({children}:{
    children: React.ReactNode;
}) => {
  return (
   <>
        <StreamVideoProvider>
            {children}
        </StreamVideoProvider>
   </>
  )
}

export default layout