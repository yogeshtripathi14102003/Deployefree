import React from 'react'
import FrontNavbar from '../component/FrontNabar'
import FirstHomeComp from '../WebsiteComponent/FirstHomeComp'
import ServicesPage from '../WebsiteComponent/ServicesPage'
import HeroSection from '../WebsiteComponent/HeroSection'

const Home = () => {
  return (
  
    <div>
        <FrontNavbar />
        <FirstHomeComp />
        <ServicesPage />
        <HeroSection /> 
    </div>
  )
}

export default Home
