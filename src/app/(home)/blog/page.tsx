import type { Category, Post } from '@/app/types/sanity'
import CategoryButtons from '@/components/category-buttons'
import { Header } from '@/components/header'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { client } from '@/lib/sanity'
import { cn, slugify } from '@/lib/utils'
import { CategoryQuery, PostQuery } from '@/utils/querys'
import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'Blog',
  description: 'Here my last posts about web development, mobile development, ui/ux design, devops etc ',
}


const getPostsByCategory = async (category: string) => {
  const posts = await client.fetch(PostQuery)
  if (!category) return posts

  return posts.filter((post: Post) =>
    post.categories.some((c: Category) => slugify(c.title) === category),
  )
}

const BlogPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) => {
  const blogCategories = await client.fetch(CategoryQuery)
  const blogPost = await getPostsByCategory(searchParams.category as string)
  const [posts, categories] = await Promise.all([blogPost, blogCategories])
  return (
    <>
      <Header
        title='Blog'
        description='Here my last posts about web development, mobile development, ui/ux design and devops'
        className='my-10'
      />

      <div className='md:grid grid-rows-1 grid-flow-col gap-5 flex flex-col justify-start '>
        <div className='row-span-1 flex gap-2 md:flex-col flex-row flex-wrap md:justify-start  md:pr-5 md:border-p-2 pr-0 border-none'>
          <CategoryButtons categories={categories} />
        </div>
        <div className='flex flex-col gap-5'>
          <h2 className='text-2xl font-bold capitalize'>
            {searchParams.category ? (
              <>{searchParams.category}</>
            ) : (
              <> All posts</>
            )}
          </h2>
          <div className=' flex flex-col max-w-xl'>
            {posts.length > 0 ? (
              posts.map((post: Post) => (
                <Card key={post._id}>
                  <div className='md:mt-2 mt-0'>
                    <h2 className='text-xl font-bold'>{post.title}</h2>

                    <div className='flex gap-4'>
                      <span>
                        {new Date(post._createdAt).getMonth()} months ago
                      </span>
                      <div className='flex gap-3'>
                        {post.categories.map((category) => (
                          <Badge
                            className={cn(
                              'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
                            )}
                            key={category.title}
                          >
                            {category.title}
                          </Badge>
                        ))}
                        {post.author.name}
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <h2>No posts found</h2>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
export default BlogPage
