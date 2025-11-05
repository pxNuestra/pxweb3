import ListLayout from '../../ListLayout'
import { allCoreContent, sortPosts } from '@/lib/utils'

const POSTS_PER_PAGE = 5

export const generateStaticParams = async () => {
  // Tidak ada post, jadi totalPages = 0
  return []
}

export default function Page({ params }: { params: { page: string } }) {
  const posts: any[] = []  // Kosongkan posts
  const initialDisplayPosts: any[] = []  // Kosongkan tampilan awal
  const pagination = {
    currentPage: 1,
    totalPages: 0,
  }

  return (
    <ListLayout
      title="All Posts"
    />
  )
}
