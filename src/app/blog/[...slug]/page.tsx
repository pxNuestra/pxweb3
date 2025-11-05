import './prism.css'
import 'katex/dist/katex.css'

import { components } from '@/components/MDXComponents'
import { MDXRender } from '@/lib/MDXRender'
import { sortPosts, coreContent, allCoreContent } from '@/lib/utils'
import PostLayout from './PostLayout'
import { Metadata } from 'next'
import siteMetadata from '@/data/config'
import { notFound } from 'next/navigation'

const dummyPost = {
  slug: 'example-post',
  title: 'Example Post',
  summary: 'This is an example post summary.',
  date: new Date().toISOString(),
  lastmod: new Date().toISOString(),
  authors: ['default'],
  images: ['/images/default-banner.jpg'],
  body: {
    code: '<p>This is a sample post content.</p>',
  },
  toc: [],
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: 'Example Post',
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
  },
}

const dummyAuthor = {
  name: 'Muhammad "Nuestra" Fasya',
  avatar: '/images/MFasya.jpg',
  occupation: 'Website Developer, Bot Developer, Graphic Designer',
  company: '',
  email: 'example@email.com',
  twitter: '',
  linkedin: '',
  github: '',
}

const allBlogs = [dummyPost]
const allAuthors = [dummyAuthor]

// ================================================

export async function generateMetadata({
  params,
}: {
  params: { slug: string[] }
}): Promise<Metadata | undefined> {
  const slug = decodeURI(params.slug.join('/'))
  const post = allBlogs.find((p) => p.slug === slug) || dummyPost
const authorDetails = post.authors.map(() => dummyAuthor)
 
  const publishedAt = new Date(post.date).toISOString()
  const modifiedAt = new Date(post.lastmod || post.date).toISOString()
  const authors = authorDetails.map((author) => author.name)
  const imageList = post.images
    ? typeof post.images === 'string'
      ? [post.images]
      : post.images
    : [siteMetadata.socialBanner]

  const ogImages = imageList.map((img) => ({ url: img }))

  // Buat JSON-LD baru agar tidak error
  const jsonLdWithAuthor = {
    ...post.structuredData,
    author: authorDetails.map((author) => ({
      '@type': 'Person',
      name: author.name,
    })),
  }

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      siteName: siteMetadata.title,
      locale: 'en_US',
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      url: './',
      images: ogImages,
      authors: authors.length > 0 ? authors : [siteMetadata.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: imageList,
    },
  }
}

export const generateStaticParams = async () => {
  return allBlogs.map((p) => ({ slug: p.slug.split('/') }))
}

export default async function Page({ params }: { params: { slug: string[] } }) {
  const slug = decodeURI(params.slug.join('/'))
  const sortedCoreContents = allCoreContent(sortPosts(allBlogs))
  const postIndex = sortedCoreContents.findIndex((p) => p.slug === slug)

  if (postIndex === -1) {
    return notFound()
  }

  const post = allBlogs.find((p) => p.slug === slug) || dummyPost
const authorDetails = post.authors.map(() => dummyAuthor)

  const mainContent = coreContent(post)

  // JSON-LD baru
  const jsonLdWithAuthor = {
    ...post.structuredData,
    author: authorDetails.map((author) => ({
      '@type': 'Person',
      name: author.name,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWithAuthor) }}
      />
      <PostLayout content={mainContent} authorDetails={authorDetails}>
        <MDXRender code={post.body.code} components={components} toc={post.toc} />
      </PostLayout>
    </>
  )
}
