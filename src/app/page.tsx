import ImageComponent from '@/components/image';

const Homepage = () => {
  return (
      <div className=''>
          <ImageComponent 
              path='default-image.jpg'
              alt='test posts'
              w={600}
              h={600}
          />
      </div>
  )
}

export default Homepage