import { Types } from "mongoose"

export interface IfundRaise {
  charityId: Types.ObjectId,
  crownFounderId:Types.ObjectId,
  title: string
  type: "simple" | "event" | "memorial" | "celebration"
  targetAmount: number
  image?: string
  memoryOf?: string         
  celebrationFor?: string     
  celebrationDate?: Date      
}
