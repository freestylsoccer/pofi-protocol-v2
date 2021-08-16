import { SRLWrapper, useLightbox } from 'simple-react-lightbox'

const elements = [
  {
    src: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=967&q=80',
    caption: 'Lorem ipsum dolor sit amet',
    height: 'auto',
  },
  {
    src: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
    caption: 'Lorem ipsum dolor sit amet',
    height: 'auto',
  },
  {
    src: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1053&q=80',
    caption: 'Lorem ipsum dolor sit amet',
    height: 'auto',
  },
  {
    src: 'https://images.unsplash.com/photo-1501183638710-841dd1904471?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
    caption: 'Lorem ipsum dolor sit amet',
    height: 'auto',
  },
]
function MyComponent() {
  const { openLightbox } = useLightbox()
  return (
    <div className="MyComponent">
      <button className="btn btn-primary" onClick={() => openLightbox()}>
        view photos
      </button>
      <SRLWrapper elements={elements} />
    </div>
  )
}
export default MyComponent
