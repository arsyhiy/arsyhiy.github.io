import './App.css'
import Panel from './panel.jsx'

function App() {
  return (
    <>
      <div className="box">
        <Panel />

        <div class="container">
          <div class="photo">
            <img
              src={`${import.meta.env.BASE_URL}portrait_photography.jpg`}
              alt="Моя фотография"
            />
          </div>

          <div className="contact_info">
            <h1>Arseniy Popandopulo</h1>

            <div className="contacts">
              <p className="contacts-label">CONTACT</p>
              <a href="mailto:arseniypopan@gmail.com">
                arseniypopan@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
