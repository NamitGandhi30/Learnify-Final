'use client'

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";

import { useGetCallById } from "@/hooks/useGetCallById";
import Loader from "@/components/Loader";
import MeetingRoom from "@/components/MeetingRoom";
import MeetingSetup from "@/components/MeetingSetup";
import { Card, CardContent } from "@/components/ui/card";

const Meeting = ({ params: { id } }: { params: { id: string } }) => {
    const { user, isLoaded } = useUser();
    const { call, isCallLoading } = useGetCallById(id);
    const [isSetupComplete, setIsSetupComplete] = useState(false);

    if (!isLoaded || isCallLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-blue-50">
                <Loader />
            </div>
        );
    }

    return (
        <main className="h-screen w-full bg-gradient-to-br from-blue-100 to-blue-200">
            <Card className="h-full w-full overflow-hidden rounded-none border-none bg-transparent shadow-none">
                <CardContent className="h-full p-0">
                    <StreamCall call={call}>
                        <StreamTheme>
                            {!isSetupComplete ? (
                                <div className="flex h-full items-center justify-center">
                                    <Card className="w-full max-w-md bg-white p-6 shadow-xl">
                                        <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
                                    </Card>
                                </div>
                            ) : (
                                <div className="h-full rounded-lg bg-blue-900 shadow-2xl">
                                    <MeetingRoom />
                                </div>
                            )}
                        </StreamTheme>
                    </StreamCall>
                </CardContent>
            </Card>
        </main>
    );
};

export default Meeting;