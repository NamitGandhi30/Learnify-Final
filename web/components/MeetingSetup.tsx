'use client'

import { DeviceSettings, VideoPreview, useCall } from '@stream-io/video-react-sdk'
import { useEffect, useState } from 'react'
import { Button } from './ui/button'

const MeetingSetup = ({ setIsSetupComplete }: { setIsSetupComplete: (value: boolean) => void }) => {
    const [isMicCamEnabled, setIsMicCamEnabled] = useState(false)

    const call = useCall()

    if (!call) {
        throw new Error('useCall must be used within a StreamCall component')
    }

    useEffect(() => {
        if (isMicCamEnabled) {
            call?.camera.disable();
            call?.microphone.disable();
        } else {
            call?.camera.enable();
            call?.microphone.enable();
        }
    }, [isMicCamEnabled, call?.camera, call?.microphone])

    return (
        <div className='h-screen flex w-full flex-col items-center justify-center gap-3 text-black'>
            <h1 className="text-2xl font-bold">
                Setup
            </h1>
            <VideoPreview />
            <div className='flex h-16 items-center justify-center gap-3'>
                <label className='flex items-center justify-center gap-2 font-medium'>
                    <input
                        type="checkbox"
                        checked={isMicCamEnabled}
                        onChange={(e) => setIsMicCamEnabled(e.target.checked)}
                    />
                    Join with mic and camera off
                </label>
                <DeviceSettings />
            </div>
            <Button
                className='rounded-md bg-green-500 px-4 py-2.5'
                onClick={() => {
                    call.join()
                    setIsSetupComplete(true)
                }}
            >
                Join Meeting
            </Button>
        </div>
    )
}

export default MeetingSetup