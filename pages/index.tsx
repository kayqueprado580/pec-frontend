import type { NextPage } from 'next'
import Login from './components/loginComponent'
import Footer from './components/footerComponent'
import Logo from './components/logoComponent'

const Home: NextPage = () => {
  return (
    <div className="bg-header-img h-screen">
      <div className="mb-10">
        <Logo />
      </div>
      <Login />
      <Footer />
    </div>
  )
}

export default Home