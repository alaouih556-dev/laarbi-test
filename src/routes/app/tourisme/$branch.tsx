import { createFileRoute, notFound } from '@tanstack/react-router'
import { Tourism } from '@/features/saas/Tourism'
import { branches, type Branch } from '@/features/saas/tourism-model'
export const Route = createFileRoute('/app/tourisme/$branch')({beforeLoad:({params})=>{if(!Object.hasOwn(branches,params.branch))throw notFound()},component:Page})
function Page(){const {branch}=Route.useParams();return <Tourism branch={branch as Branch}/>}
