'use client'

import { useUser } from "@clerk/nextjs"
import { useStreamVideoClient } from "@stream-io/video-react-sdk"
import { useRouter } from "next/navigation"
import { useGetCallById } from "@/hooks/useGetCallById"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clipboard, Video, User, Link, Hash } from "lucide-react"
import { motion } from "framer-motion"

const TableRow = ({
  title,
  description,
  icon,
}: {
  title: string
  description: string
  icon: React.ReactNode
}) => {
  return (
    <motion.div
      className="flex items-center space-x-4 py-4 px-6 rounded-lg bg-white bg-opacity-10 backdrop-blur-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex-shrink-0 text-blue-300">{icon}</div>
      <div className="flex-grow">
        <h2 className="text-sm font-medium text-blue-200">{title}</h2>
        <p className="text-base font-semibold text-white break-all">{description}</p>
      </div>
    </motion.div>
  )
}

export default function PersonalRoom() {
  const router = useRouter()
  const { user } = useUser()
  const client = useStreamVideoClient()
  const meetingId = user?.id
  const { toast } = useToast()

  const { call } = useGetCallById(meetingId!)

  const startRoom = async () => {
    if (!client || !user) {
      router.push(`/dashboard`)
      return
    }

    const newCall = client.call("default", meetingId!)

    if (!call) {
      await newCall.getOrCreate({
        data: {
          starts_at: new Date().toISOString(),
        },
      })
    }

    router.push(`/meeting/${meetingId}?personal=true`)
  }

  const meetingLink = `${process.env.NEXT_PUBLIC_APP_URL}/meeting/${meetingId}?personal=true`

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gradient-to-br from-blue-900 to-indigo-900 text-white shadow-2xl rounded-2xl overflow-hidden border border-blue-400 border-opacity-30">
      <CardHeader className="border-b border-blue-600 border-opacity-30 pb-6 bg-blue-800 bg-opacity-30 backdrop-blur-md">
        <CardTitle className="text-3xl font-bold flex items-center">
          <User className="w-8 h-8 mr-3 text-blue-300" />
          Personal Meeting Room
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-8 space-y-6 bg-gradient-to-b from-transparent to-blue-900 bg-opacity-30">
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
        >
          <TableRow
            title="Topic"
            description={`${user?.username}'s Meeting Room`}
            icon={<Video className="w-5 h-5" />}
          />
          <TableRow
            title="Meeting ID"
            description={meetingId!}
            icon={<Hash className="w-5 h-5" />}
          />
          <TableRow
            title="Invite Link"
            description={meetingLink}
            icon={<Link className="w-5 h-5" />}
          />
        </motion.div>
        <motion.div
          className="flex flex-col sm:flex-row gap-4 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex-1 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            onClick={startRoom}
          >
            <Video className="w-5 h-5" />
            <span>Start Meeting</span>
          </Button>
          <Button
            variant="outline"
            className="bg-blue-800 bg-opacity-50 hover:bg-opacity-70 text-white border-blue-400 font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex-1 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            onClick={() => {
              navigator.clipboard.writeText(meetingLink)
              toast({
                title: "Link Copied",
                description: "Meeting invitation link has been copied to clipboard.",
              })
            }}
          >
            <Clipboard className="w-5 h-5" />
            <span>Copy Invitation</span>
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  )
}